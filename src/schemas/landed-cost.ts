import { z } from "zod";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";

// ============================================================
// Landed Cost Request Schema
// ============================================================

export const LandedCostRequestSchema = z.object({
    productDescription: z.string().min(3).max(1000),
    htsCodeId: z.string().uuid().optional(), // Optional: if user already selected an HTS code
    originCountry: z.string().length(2),
    destinationCountry: z.enum([
        "US", "GB", "EU", "DE", "FR", "JP", "KR", "TW", "VN", "IN", "PK", "MX", "CA", "BR", "AE", "AU", "SG"
    ], {
        errorMap: () => ({ message: "Invalid destination country selected" }),
    }),
    productValue: z.number().positive("Product value must be positive"),
    currency: z.enum(SUPPORTED_CURRENCIES).default("USD"),
    shippingCost: z.number().min(0).default(0),
    insuranceCost: z.number().min(0).default(0),
    quantity: z.number().int().positive().default(1),
    weight: z.number().positive().optional(), // kg — for specific duties
    sessionId: z.string().uuid().optional(),
});

export type LandedCostRequest = z.infer<typeof LandedCostRequestSchema>;

// ============================================================
// Cost Breakdown Schema (individual line items)
// ============================================================

export const CostLineItemSchema = z.object({
    label: z.string(),
    amount: z.string(), // String representation of Decimal for precision
    currency: z.string(),
    rate: z.string().optional(), // e.g., "16.5%", "$0.05/kg"
    notes: z.string().optional(),
});

export type CostLineItem = z.infer<typeof CostLineItemSchema>;

export const LandedCostBreakdownSchema = z.object({
    productValue: CostLineItemSchema,
    shippingCost: CostLineItemSchema,
    insuranceCost: CostLineItemSchema,
    cifValue: CostLineItemSchema,
    customsDuty: CostLineItemSchema,
    additionalDuties: z.array(CostLineItemSchema).default([]),
    processingFees: z.array(CostLineItemSchema).default([]),
    nationalHandling: CostLineItemSchema.optional(),
    vatGst: CostLineItemSchema,
    totalLandedCost: CostLineItemSchema,
    deMinimisApplied: z.boolean(),
    deMinimisDetails: z.string().optional(),
    exchangeRate: z.string().optional(),
    alternativeHts: z.array(z.object({
        hts_code: z.string(),
        description: z.string(),
        duty_rate_pct: z.number().nullable(),
    })).optional(),
    calculatedAt: z.string().datetime(),
});

export type LandedCostBreakdown = z.infer<typeof LandedCostBreakdownSchema>;

// ============================================================
// Landed Cost Response
// ============================================================

export const LandedCostResponseSchema = z.object({
    id: z.string().uuid(),
    slug: z.string(),
    htsCode: z.object({
        code: z.string(),
        description: z.string(),
        countryCode: z.string(),
    }),
    breakdown: LandedCostBreakdownSchema,
    disclaimer: z.string(),
    timestamp: z.string().datetime(),
});

export type LandedCostResponse = z.infer<typeof LandedCostResponseSchema>;
