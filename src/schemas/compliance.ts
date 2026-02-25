import { z } from "zod";

// ============================================================
// Compliance Rule Schemas
// ============================================================

export const ComplianceRuleSchema = z.object({
    id: z.string().uuid(),
    countryCode: z.string().length(2),
    ruleType: z.enum(["de_minimis", "disclaimer", "restriction", "cbam", "handling_fee"]),
    ruleKey: z.string(),
    ruleValue: z.record(z.string(), z.unknown()),
    description: z.string().nullable(),
    version: z.number().int().positive(),
    effectiveFrom: z.string().date(),
    effectiveTo: z.string().date().nullable(),
});

export type ComplianceRule = z.infer<typeof ComplianceRuleSchema>;

// ============================================================
// De Minimis Rule Schema (parsed from rule_value JSONB)
// ============================================================

export const DeMinimisRuleSchema = z.object({
    threshold_value: z.number().min(0),
    threshold_currency: z.string().length(3),
    exempt: z.boolean(),
    vat_still_due: z.boolean().optional(),
    vat_collected_by: z.string().optional(),
    flat_duty_per_item: z.number().optional(),
    flat_duty_currency: z.string().optional(),
    applies_to: z.array(z.string()).optional(),
    postal_methodology: z.string().optional(),
    postal_methodology_mandatory_from: z.string().optional(),
    notes: z.string().optional(),
});

export type DeMinimisRule = z.infer<typeof DeMinimisRuleSchema>;

// ============================================================
// CBAM Rule Schema
// ============================================================

export const CBAMRuleSchema = z.object({
    applicable_sectors: z.array(z.string()),
    reporting_required: z.boolean(),
    certificates_required_from: z.string().optional(),
    notes: z.string().optional(),
});

export type CBAMRule = z.infer<typeof CBAMRuleSchema>;

// ============================================================
// Handling Fee Rule Schema
// ============================================================

export const HandlingFeeRuleSchema = z.object({
    fee_value: z.number().min(0),
    fee_currency: z.string().length(3),
    fee_type: z.enum(["per_declaration", "per_item", "percentage"]),
    notes: z.string().optional(),
});

export type HandlingFeeRule = z.infer<typeof HandlingFeeRuleSchema>;

// ============================================================
// Compliance Rules Response
// ============================================================

export const ComplianceRulesResponseSchema = z.object({
    countryCode: z.string(),
    rules: z.array(ComplianceRuleSchema),
    deMinimis: DeMinimisRuleSchema.nullable(),
    disclaimer: z.string().nullable(),
    timestamp: z.string().datetime(),
});

export type ComplianceRulesResponse = z.infer<typeof ComplianceRulesResponseSchema>;
