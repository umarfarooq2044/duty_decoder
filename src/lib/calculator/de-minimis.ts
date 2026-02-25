import Decimal from "decimal.js";
import { getCachedComplianceRules } from "@/lib/cache";
import { convertCurrency } from "@/lib/currency";
import { DeMinimisRuleSchema } from "@/schemas/compliance";

// ============================================================
// De Minimis Result
// ============================================================

export interface DeMinimisResult {
    dutyExempt: boolean;
    vatExempt: boolean;
    vatStillDue: boolean; // UK: duty exempt but VAT still due
    flatDutyPerItem: number | null; // EU post-Jul 2026: €3/item
    details: string;
}

// ============================================================
// De Minimis Checker — 2026-Specific Transition Logic
// ============================================================

export async function checkDeMinimis(
    productValue: Decimal,
    valueCurrency: string,
    destinationCountry: string,
    quantity: number
): Promise<DeMinimisResult> {
    // ----------------------------------------------------------
    // US: Always full duty (threshold eliminated Aug 29, 2025)
    // ----------------------------------------------------------
    if (destinationCountry === "US") {
        return {
            dutyExempt: false,
            vatExempt: false,
            vatStillDue: false,
            flatDutyPerItem: null,
            details: "US de minimis threshold eliminated Aug 29, 2025. Full duty/tax applies to all commercial shipments.",
        };
    }

    // ----------------------------------------------------------
    // Fetch active de minimis rules from DB
    // ----------------------------------------------------------
    const rules = await getCachedComplianceRules(destinationCountry, "de_minimis");
    const today = new Date().toISOString().split("T")[0] as string;

    // Find the active rule for today
    const activeRule = rules.find((r) => {
        const from = r.effective_from as string;
        const to = r.effective_to as string | null;
        return from <= today && (to === null || to >= today);
    });

    if (!activeRule) {
        // No active rule found — default to full duty
        return {
            dutyExempt: false,
            vatExempt: false,
            vatStillDue: false,
            flatDutyPerItem: null,
            details: `No active de minimis rule found for ${destinationCountry}. Full duty applies.`,
        };
    }

    // Parse rule value
    const parsed = DeMinimisRuleSchema.safeParse(activeRule.rule_value);
    if (!parsed.success) {
        return {
            dutyExempt: false,
            vatExempt: false,
            vatStillDue: false,
            flatDutyPerItem: null,
            details: `Invalid de minimis rule data for ${destinationCountry}. Full duty applies.`,
        };
    }

    const rule = parsed.data;

    // ----------------------------------------------------------
    // Convert product value to threshold currency for comparison
    // ----------------------------------------------------------
    let valueInThresholdCurrency = productValue;
    if (valueCurrency !== rule.threshold_currency) {
        const { converted } = await convertCurrency(
            productValue,
            valueCurrency,
            rule.threshold_currency
        );
        valueInThresholdCurrency = converted;
    }

    const threshold = new Decimal(rule.threshold_value);
    const isUnderThreshold = valueInThresholdCurrency.lte(threshold);

    // ----------------------------------------------------------
    // EU: Handle Jul 2026 transition
    // Post-transition: €3/item flat duty on parcels <€150
    // ----------------------------------------------------------
    if (destinationCountry === "EU") {
        if (rule.flat_duty_per_item !== undefined && rule.flat_duty_per_item > 0) {
            // Post-transition rule is active
            if (isUnderThreshold) {
                return {
                    dutyExempt: false, // Not exempt — flat duty applies
                    vatExempt: false,
                    vatStillDue: false,
                    flatDutyPerItem: rule.flat_duty_per_item,
                    details: `EU post-Jul 2026: €${rule.flat_duty_per_item}/item statistical duty applies (${quantity} items = €${new Decimal(rule.flat_duty_per_item).mul(quantity).toFixed(2)}). Value (${valueInThresholdCurrency.toFixed(2)} ${rule.threshold_currency}) is under €${rule.threshold_value} threshold.`,
                };
            }
            // Over threshold: full standard duty applies
            return {
                dutyExempt: false,
                vatExempt: false,
                vatStillDue: false,
                flatDutyPerItem: null,
                details: `EU: Value (${valueInThresholdCurrency.toFixed(2)} ${rule.threshold_currency}) exceeds €${rule.threshold_value}. Standard duty applies.`,
            };
        }

        // Pre-transition: standard €150 exemption
        if (isUnderThreshold && rule.exempt) {
            return {
                dutyExempt: true,
                vatExempt: false, // EU: VAT always due
                vatStillDue: true,
                flatDutyPerItem: null,
                details: `EU pre-Jul 2026: Duty exempt (${valueInThresholdCurrency.toFixed(2)} ${rule.threshold_currency} ≤ €${rule.threshold_value}). VAT still due.`,
            };
        }
    }

    // ----------------------------------------------------------
    // UK: £135 threshold — duty exempt, VAT collected by seller
    // ----------------------------------------------------------
    if (destinationCountry === "GB") {
        if (isUnderThreshold && rule.exempt) {
            return {
                dutyExempt: true,
                vatExempt: false,
                vatStillDue: true,
                flatDutyPerItem: null,
                details: `UK: Duty exempt (${valueInThresholdCurrency.toFixed(2)} ${rule.threshold_currency} ≤ £${rule.threshold_value}). VAT ${rule.vat_collected_by === "seller" ? "collected by seller at POS" : "due at import"}.`,
            };
        }

        return {
            dutyExempt: false,
            vatExempt: false,
            vatStillDue: false,
            flatDutyPerItem: null,
            details: `UK: Value (${valueInThresholdCurrency.toFixed(2)} ${rule.threshold_currency}) exceeds £${rule.threshold_value}. Full duty + VAT applies.`,
        };
    }

    // ----------------------------------------------------------
    // Pakistan: PKR 1,000 threshold (postal/courier only)
    // ----------------------------------------------------------
    if (destinationCountry === "PK") {
        if (isUnderThreshold && rule.exempt) {
            return {
                dutyExempt: true,
                vatExempt: true,
                vatStillDue: false,
                flatDutyPerItem: null,
                details: `Pakistan: Exempt (${valueInThresholdCurrency.toFixed(2)} ${rule.threshold_currency} ≤ PKR ${rule.threshold_value}). Applies to postal/courier shipments only.`,
            };
        }

        return {
            dutyExempt: false,
            vatExempt: false,
            vatStillDue: false,
            flatDutyPerItem: null,
            details: `Pakistan: Value (${valueInThresholdCurrency.toFixed(2)} ${rule.threshold_currency}) exceeds PKR ${rule.threshold_value}. Full duty + GST applies.`,
        };
    }

    // ----------------------------------------------------------
    // Generic fallback
    // ----------------------------------------------------------
    if (isUnderThreshold && rule.exempt) {
        return {
            dutyExempt: true,
            vatExempt: false,
            vatStillDue: true,
            flatDutyPerItem: null,
            details: `De minimis exempt (${valueInThresholdCurrency.toFixed(2)} ${rule.threshold_currency} ≤ ${rule.threshold_value} ${rule.threshold_currency}).`,
        };
    }

    return {
        dutyExempt: false,
        vatExempt: false,
        vatStillDue: false,
        flatDutyPerItem: null,
        details: `Value exceeds de minimis threshold. Full duty applies.`,
    };
}
