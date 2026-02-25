import { z } from "zod";

// ============================================================
// HTS Code Schemas
// ============================================================

export const HTSCodeSchema = z.object({
    id: z.string().uuid(),
    countryCode: z.string().length(2),
    htsCode: z.string().min(6).max(10),
    hs6Prefix: z.string().length(6),
    chapter: z.number().int().min(1).max(99),
    heading: z.number().int().min(0).max(99),
    description: z.string().min(1),
    dutyType: z.enum(["ad_valorem", "specific", "compound", "free"]),
    dutyRatePct: z.number().min(0).max(100).nullable(),
    dutyRateSpecific: z.number().min(0).nullable(),
    dutyUnit: z.string().nullable(),
    vatRatePct: z.number().min(0).max(100).nullable(),
    additionalDuties: z.record(z.string(), z.unknown()).default({}),
    metaData: z.record(z.string(), z.unknown()).default({}),
    isActive: z.boolean().default(true),
    effectiveFrom: z.string().date(),
    effectiveTo: z.string().date().nullable(),
});

export type HTSCode = z.infer<typeof HTSCodeSchema>;

// ============================================================
// HTS Search Request/Response
// ============================================================

export const HTSSearchRequestSchema = z.object({
    description: z.string().min(3, "Product description must be at least 3 characters").max(1000),
    countryCode: z.string().length(2, "Country code must be exactly 2 characters").toUpperCase(),
    maxResults: z.number().int().min(1).max(20).default(5),
});

export type HTSSearchRequest = z.infer<typeof HTSSearchRequestSchema>;

export const HTSSearchResultSchema = z.object({
    id: z.string().uuid(),
    htsCode: z.string(),
    description: z.string(),
    dutyType: z.string(),
    dutyRatePct: z.number().nullable(),
    dutyRateSpecific: z.number().nullable(),
    dutyUnit: z.string().nullable(),
    vatRatePct: z.number().nullable(),
    confidence: z.number().min(0).max(1),
    matchMethod: z.enum(["vector", "fts", "ai"]),
});

export type HTSSearchResult = z.infer<typeof HTSSearchResultSchema>;

export const HTSSearchResponseSchema = z.object({
    results: z.array(HTSSearchResultSchema),
    query: z.string(),
    countryCode: z.string(),
    timestamp: z.string().datetime(),
});

export type HTSSearchResponse = z.infer<typeof HTSSearchResponseSchema>;
