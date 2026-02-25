import Decimal from "decimal.js";
import { convertCurrency } from "@/lib/currency";
import { ServerError } from "@/lib/errors";
import type { CostLineItem, LandedCostBreakdown } from "@/schemas/landed-cost";
import { checkDeMinimis, type DeMinimisResult } from "./de-minimis";

// ============================================================
// Types
// ============================================================

export interface LandedCostInput {
    productValue: number;
    currency: string;
    shippingCost: number;
    insuranceCost: number;
    quantity: number;
    weight?: number; // kg, for specific duties

    // HTS code details
    dutyType: "ad_valorem" | "specific" | "compound" | "free";
    dutyRatePct: number | null;
    dutyRateSpecific: number | null;
    dutyUnit: string | null;
    vatRatePct: number | null;
    additionalDuties: Record<string, { rate_pct?: number; rate_specific?: number; description?: string }>;
    metaData: Record<string, unknown>;

    // Route
    originCountry: string;
    destinationCountry: string;

    // National handling (from compliance rules)
    nationalHandlingFee?: number;
    nationalHandlingCurrency?: string;
}

export interface LandedCostResult {
    breakdown: LandedCostBreakdown;
    totals: {
        cifValue: Decimal;
        customsDuty: Decimal;
        additionalDuties: Decimal;
        processingFees: Decimal;
        nationalHandling: Decimal;
        vatAmount: Decimal;
        totalLandedCost: Decimal;
    };
    exchangeRate: Decimal | null;
}

// ============================================================
// Helpers
// ============================================================

function lineItem(
    label: string,
    amount: Decimal,
    currency: string,
    rate?: string,
    notes?: string
): CostLineItem {
    return {
        label,
        amount: amount.toFixed(2),
        currency,
        ...(rate && { rate }),
        ...(notes && { notes }),
    };
}

// ============================================================
// US Processing Fees
// ============================================================

function calculateUSProcessingFees(cifValue: Decimal): CostLineItem[] {
    const fees: CostLineItem[] = [];

    // Merchandise Processing Fee (MPF): 0.3464% of CIF, min $31.67, max $614.35
    const mpfRate = new Decimal("0.003464");
    const mpfMin = new Decimal("31.67");
    const mpfMax = new Decimal("614.35");
    let mpf = cifValue.mul(mpfRate);
    mpf = Decimal.max(mpf, mpfMin);
    mpf = Decimal.min(mpf, mpfMax);
    mpf = mpf.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

    fees.push(lineItem("Merchandise Processing Fee (MPF)", mpf, "USD", "0.3464%", "Min $31.67, Max $614.35"));

    // Harbor Maintenance Fee (HMF): 0.125% of CIF
    const hmfRate = new Decimal("0.00125");
    const hmf = cifValue.mul(hmfRate).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    fees.push(lineItem("Harbor Maintenance Fee (HMF)", hmf, "USD", "0.125%"));

    return fees;
}

// ============================================================
// Core Calculation Engine
// ============================================================

export async function calculateLandedCost(input: LandedCostInput): Promise<LandedCostResult> {
    const destCurrency =
        input.destinationCountry === "US" ? "USD" :
            input.destinationCountry === "GB" ? "GBP" :
                input.destinationCountry === "PK" ? "PKR" :
                    "EUR"; // EU default

    // 1. Convert all values to destination currency
    let productValue = new Decimal(input.productValue);
    let shippingCost = new Decimal(input.shippingCost);
    let insuranceCost = new Decimal(input.insuranceCost);
    let exchangeRate: Decimal | null = null;

    if (input.currency !== destCurrency) {
        const { converted: convProduct, rate } = await convertCurrency(productValue, input.currency, destCurrency);
        const { converted: convShipping } = await convertCurrency(shippingCost, input.currency, destCurrency);
        const { converted: convInsurance } = await convertCurrency(insuranceCost, input.currency, destCurrency);
        productValue = convProduct;
        shippingCost = convShipping;
        insuranceCost = convInsurance;
        exchangeRate = rate;
    }

    // 2. CIF Value = Product + Shipping + Insurance
    const cifValue = productValue.plus(shippingCost).plus(insuranceCost);

    // 3. Check de minimis
    const deMinimisResult: DeMinimisResult = await checkDeMinimis(
        productValue,
        destCurrency,
        input.destinationCountry,
        input.quantity
    );

    // 4. Calculate customs duty
    let customsDuty = new Decimal(0);
    let dutyRateLabel = "";

    if (!deMinimisResult.dutyExempt) {
        switch (input.dutyType) {
            case "ad_valorem": {
                if (input.dutyRatePct === null) throw new ServerError("Missing duty_rate_pct for ad_valorem duty");
                const rate = new Decimal(input.dutyRatePct).div(100);
                customsDuty = cifValue.mul(rate).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
                dutyRateLabel = `${input.dutyRatePct}%`;
                break;
            }
            case "specific": {
                if (input.dutyRateSpecific === null) throw new ServerError("Missing duty_rate_specific for specific duty");
                if (!input.weight && !input.quantity) throw new ServerError("Weight or quantity required for specific duty");
                const specificRate = new Decimal(input.dutyRateSpecific);
                const units = input.weight ? new Decimal(input.weight) : new Decimal(input.quantity);
                customsDuty = specificRate.mul(units).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
                dutyRateLabel = `${input.dutyRateSpecific}/${input.dutyUnit ?? "unit"}`;
                break;
            }
            case "compound": {
                if (input.dutyRatePct === null || input.dutyRateSpecific === null) {
                    throw new ServerError("Missing rates for compound duty");
                }
                const adValPart = cifValue.mul(new Decimal(input.dutyRatePct).div(100));
                const specificRate = new Decimal(input.dutyRateSpecific);
                const units = input.weight ? new Decimal(input.weight) : new Decimal(input.quantity);
                const specificPart = specificRate.mul(units);
                customsDuty = adValPart.plus(specificPart).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
                dutyRateLabel = `${input.dutyRatePct}% + ${input.dutyRateSpecific}/${input.dutyUnit ?? "unit"}`;
                break;
            }
            case "free":
                customsDuty = new Decimal(0);
                dutyRateLabel = "Free";
                break;
        }
    }

    // Handle EU flat duty (€3/item post-transition)
    if (deMinimisResult.flatDutyPerItem) {
        customsDuty = new Decimal(deMinimisResult.flatDutyPerItem).mul(input.quantity);
        dutyRateLabel = `€${deMinimisResult.flatDutyPerItem}/item (statistical duty)`;
    }

    // 5. Additional duties (Section 301/232, AD/CVD, CBAM)
    let totalAdditionalDuties = new Decimal(0);
    const additionalDutyItems: CostLineItem[] = [];

    for (const [key, duty] of Object.entries(input.additionalDuties)) {
        let dutyAmount = new Decimal(0);
        let rateStr = "";

        if (duty.rate_pct !== undefined) {
            dutyAmount = cifValue.mul(new Decimal(duty.rate_pct).div(100)).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
            rateStr = `${duty.rate_pct}%`;
        } else if (duty.rate_specific !== undefined) {
            const units = input.weight ? new Decimal(input.weight) : new Decimal(input.quantity);
            dutyAmount = new Decimal(duty.rate_specific).mul(units).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
            rateStr = `${duty.rate_specific}/unit`;
        }

        totalAdditionalDuties = totalAdditionalDuties.plus(dutyAmount);
        additionalDutyItems.push(
            lineItem(duty.description ?? key, dutyAmount, destCurrency, rateStr)
        );
    }

    // 6. Processing fees (US only)
    let totalProcessingFees = new Decimal(0);
    let processingFeeItems: CostLineItem[] = [];

    if (input.destinationCountry === "US") {
        processingFeeItems = calculateUSProcessingFees(cifValue);
        totalProcessingFees = processingFeeItems.reduce(
            (sum, item) => sum.plus(new Decimal(item.amount)),
            new Decimal(0)
        );
    }

    // 7. National handling fees (Italy/Romania 2026)
    let nationalHandling = new Decimal(0);
    let nationalHandlingItem: CostLineItem | undefined;

    if (input.nationalHandlingFee !== undefined && input.nationalHandlingFee > 0) {
        let fee = new Decimal(input.nationalHandlingFee);

        // Convert if needed
        if (input.nationalHandlingCurrency && input.nationalHandlingCurrency !== destCurrency) {
            const { converted } = await convertCurrency(fee, input.nationalHandlingCurrency, destCurrency);
            fee = converted;
        }

        nationalHandling = fee;
        nationalHandlingItem = lineItem(
            "National Handling Fee",
            fee,
            destCurrency,
            undefined,
            `Customs handling fee (${input.destinationCountry})`
        );
    }

    // 8. VAT/GST calculation
    // VAT base = CIF + Duty + Additional Duties + Processing Fees + Handling
    const vatBase = cifValue
        .plus(customsDuty)
        .plus(totalAdditionalDuties)
        .plus(totalProcessingFees)
        .plus(nationalHandling);

    let vatAmount = new Decimal(0);
    let vatRateLabel = "N/A";

    if (input.vatRatePct !== null && input.vatRatePct > 0) {
        // If de minimis applies and VAT is still due (UK), calculate VAT on product value only
        if (deMinimisResult.dutyExempt && deMinimisResult.vatStillDue) {
            vatAmount = productValue.mul(new Decimal(input.vatRatePct).div(100)).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
            vatRateLabel = `${input.vatRatePct}% (on product value, duty exempt)`;
        } else if (!deMinimisResult.vatExempt) {
            vatAmount = vatBase.mul(new Decimal(input.vatRatePct).div(100)).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
            vatRateLabel = `${input.vatRatePct}%`;
        }
    }

    // US: No VAT (state sales tax varies, not calculated here)
    if (input.destinationCountry === "US") {
        vatAmount = new Decimal(0);
        vatRateLabel = "N/A (state sales tax varies)";
    }

    // 9. Total Landed Cost
    const totalLandedCost = cifValue
        .plus(customsDuty)
        .plus(totalAdditionalDuties)
        .plus(totalProcessingFees)
        .plus(nationalHandling)
        .plus(vatAmount);

    // Build breakdown
    const breakdown: LandedCostBreakdown = {
        productValue: lineItem("Product Value", productValue, destCurrency),
        shippingCost: lineItem("Shipping", shippingCost, destCurrency),
        insuranceCost: lineItem("Insurance", insuranceCost, destCurrency),
        cifValue: lineItem("CIF Value", cifValue, destCurrency),
        customsDuty: lineItem("Customs Duty", customsDuty, destCurrency, dutyRateLabel),
        additionalDuties: additionalDutyItems,
        processingFees: processingFeeItems,
        ...(nationalHandlingItem && { nationalHandling: nationalHandlingItem }),
        vatGst: lineItem("VAT/GST", vatAmount, destCurrency, vatRateLabel),
        totalLandedCost: lineItem("Total Landed Cost", totalLandedCost, destCurrency),
        deMinimisApplied: deMinimisResult.dutyExempt,
        ...(deMinimisResult.details && { deMinimisDetails: deMinimisResult.details }),
        ...(exchangeRate && { exchangeRate: exchangeRate.toFixed(6) }),
        calculatedAt: new Date().toISOString(),
    };

    return {
        breakdown,
        totals: {
            cifValue,
            customsDuty,
            additionalDuties: totalAdditionalDuties,
            processingFees: totalProcessingFees,
            nationalHandling,
            vatAmount,
            totalLandedCost,
        },
        exchangeRate,
    };
}
