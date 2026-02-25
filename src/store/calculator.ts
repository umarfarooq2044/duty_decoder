import { create } from 'zustand';

interface CalculatorState {
    // Original imported data
    originalValue: number;
    originalShipping: number;
    originalInsurance: number;
    originalTotal: number;
    currency: string;

    // Live User Inputs
    productValue: number;
    shippingCost: number;
    insuranceCost: number;

    // Output State
    liveTotalLandedCost: number;
    liveCustomsDutyAmount: number;
    liveVatAmount: number;
    liveProcessingFees: number;
    liveAdditionalDuties: number;

    // HTS Reference Data (needed for recalculation)
    dutyRatePct: number | null;
    dutyRateSpecific: number | null;
    dutyType: "Ad Valorem" | "Specific" | "Compound" | "Free";
    vatRatePct: number | null;
    nationalHandlingFee: number;
    nationalHandlingCurrency: string;
    additionalDuties: Record<string, { rate_pct?: number; rate_specific?: number; description?: string }>;

    // Destination context (needed for US processing fees)
    destinationCountry: string;

    // Actions
    hydrate: (data: Partial<CalculatorState>) => void;
    updateProductValue: (val: number) => void;
    updateShippingCost: (val: number) => void;
    updateInsuranceCost: (val: number) => void;
    resetToOriginal: () => void;
}

// ============================================================
// US Processing Fees: MPF + HMF
// Mirrors the server-side logic in lib/calculator/landed-cost.ts
// ============================================================

function calculateUSProcessingFees(cifValue: number): { mpf: number; hmf: number; total: number } {
    // Merchandise Processing Fee (MPF): 0.3464% of CIF, min $31.67, max $614.35
    let mpf = cifValue * 0.003464;
    mpf = Math.max(mpf, 31.67);
    mpf = Math.min(mpf, 614.35);
    mpf = Math.round(mpf * 100) / 100;

    // Harbor Maintenance Fee (HMF): 0.125% of CIF
    const hmf = Math.round(cifValue * 0.00125 * 100) / 100;

    return { mpf, hmf, total: mpf + hmf };
}

// ============================================================
// Core Live Recalculation
// ============================================================

const computeLiveCosts = (state: Partial<CalculatorState>) => {
    const value = state.productValue || 0;
    const shipping = state.shippingCost || 0;
    const insurance = state.insuranceCost || 0;

    const cifValue = value + shipping + insurance;

    // 1. Customs Duty (Ad Valorem)
    let dutyAmount = 0;
    if (state.dutyRatePct) {
        dutyAmount = Math.round(cifValue * (state.dutyRatePct / 100) * 100) / 100;
    }

    // 2. Additional Duties (Section 301, AD/CVD, etc.)
    let additionalDutiesTotal = 0;
    if (state.additionalDuties) {
        for (const duty of Object.values(state.additionalDuties)) {
            if (duty.rate_pct !== undefined) {
                additionalDutiesTotal += Math.round(cifValue * (duty.rate_pct / 100) * 100) / 100;
            }
        }
    }

    // 3. US Processing Fees (MPF + HMF)
    let processingFeesTotal = 0;
    if (state.destinationCountry === "US") {
        const usFees = calculateUSProcessingFees(cifValue);
        processingFeesTotal = usFees.total;
    }

    // 4. National Handling Fee
    const handling = state.nationalHandlingFee || 0;

    // 5. VAT/GST — calculated on (CIF + Duty + Additional + Processing + Handling)
    let vatAmount = 0;
    if (state.vatRatePct && state.destinationCountry !== "US") {
        const vatBase = cifValue + dutyAmount + additionalDutiesTotal + processingFeesTotal + handling;
        vatAmount = Math.round(vatBase * (state.vatRatePct / 100) * 100) / 100;
    }

    // 6. Total Landed Cost
    const totalLandedCost = cifValue + dutyAmount + additionalDutiesTotal + processingFeesTotal + handling + vatAmount;

    return {
        liveTotalLandedCost: Math.round(totalLandedCost * 100) / 100,
        liveCustomsDutyAmount: dutyAmount,
        liveVatAmount: vatAmount,
        liveProcessingFees: processingFeesTotal,
        liveAdditionalDuties: additionalDutiesTotal,
    };
};

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
    originalValue: 0,
    originalShipping: 0,
    originalInsurance: 0,
    originalTotal: 0,
    currency: 'USD',

    productValue: 0,
    shippingCost: 0,
    insuranceCost: 0,

    liveTotalLandedCost: 0,
    liveCustomsDutyAmount: 0,
    liveVatAmount: 0,
    liveProcessingFees: 0,
    liveAdditionalDuties: 0,

    dutyRatePct: null,
    dutyRateSpecific: null,
    dutyType: "Free",
    vatRatePct: null,
    nationalHandlingFee: 0,
    nationalHandlingCurrency: 'USD',
    additionalDuties: {},
    destinationCountry: '',

    hydrate: (data) => {
        const hydratedState = {
            ...data,
            productValue: data.originalValue,
            shippingCost: data.originalShipping,
            insuranceCost: data.originalInsurance,
        };
        const liveCosts = computeLiveCosts(hydratedState);
        set({
            ...hydratedState,
            ...liveCosts,
        });
    },

    updateProductValue: (val) => {
        set((state) => {
            const newState = { ...state, productValue: val };
            return { ...newState, ...computeLiveCosts(newState) };
        });
    },

    updateShippingCost: (val) => {
        set((state) => {
            const newState = { ...state, shippingCost: val };
            return { ...newState, ...computeLiveCosts(newState) };
        });
    },

    updateInsuranceCost: (val) => {
        set((state) => {
            const newState = { ...state, insuranceCost: val };
            return { ...newState, ...computeLiveCosts(newState) };
        });
    },

    resetToOriginal: () => {
        set((state) => {
            const newState = {
                ...state,
                productValue: state.originalValue,
                shippingCost: state.originalShipping,
                insuranceCost: state.originalInsurance,
            };
            return { ...newState, ...computeLiveCosts(newState) };
        });
    }
}));
