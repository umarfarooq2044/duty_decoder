import { unstable_cache } from "next/cache";
import { getServerSupabase } from "@/lib/supabase/server";

// ============================================================
// Cache utilities for Next.js 16
// ============================================================

/**
 * Cached HTS code lookup by ID.
 * Uses Next.js unstable_cache with 24-hour TTL.
 * Stale-while-revalidate: serves stale data while refreshing in background.
 */
export const getCachedHTSCode = unstable_cache(
    async (htsId: string) => {
        const supabase = getServerSupabase();
        const { data, error } = await supabase
            .from("hts_codes")
            .select("*")
            .eq("id", htsId)
            .eq("is_active", true)
            .single();

        if (error) throw error;
        return data;
    },
    ["hts-code"],
    {
        revalidate: 86400, // 24 hours
        tags: ["hts-codes"],
    }
);

/**
 * Cached HTS codes by country.
 * Refreshes every 24 hours.
 */
export const getCachedHTSCodesByCountry = unstable_cache(
    async (countryCode: string, chapter?: number) => {
        const supabase = getServerSupabase();
        let query = supabase
            .from("hts_codes")
            .select("id, country_code, hts_code, hs6_prefix, chapter, heading, description, duty_type, duty_rate_pct, duty_rate_specific, duty_unit, vat_rate_pct, additional_duties, meta_data")
            .eq("country_code", countryCode)
            .eq("is_active", true)
            .order("hts_code", { ascending: true });

        if (chapter !== undefined) {
            query = query.eq("chapter", chapter);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },
    ["hts-codes-by-country"],
    {
        revalidate: 86400,
        tags: ["hts-codes"],
    }
);

/**
 * Cached compliance rules by country and type.
 * Stale-while-revalidate with 1-hour TTL (rules change less frequently
 * but need to be reasonably fresh around transition dates).
 */
export const getCachedComplianceRules = unstable_cache(
    async (countryCode: string, ruleType?: string) => {
        const supabase = getServerSupabase();
        const now = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        let query = supabase
            .from("compliance_rules")
            .select("*")
            .eq("country_code", countryCode)
            .lte("effective_from", now)
            .or(`effective_to.is.null,effective_to.gte.${now}`);

        if (ruleType) {
            query = query.eq("rule_type", ruleType);
        }

        const { data, error } = await query.order("version", { ascending: false });
        if (error) throw error;
        return data;
    },
    ["compliance-rules"],
    {
        revalidate: 3600, // 1 hour
        tags: ["compliance-rules"],
    }
);

/**
 * Cached landed cost by slug (for SEO pages).
 * Longer TTL since calculations don't change after creation.
 */
export const getCachedLandedCostBySlug = unstable_cache(
    async (slug: string) => {
        const supabase = getServerSupabase();

        // Try with hts_codes join first
        const { data, error } = await supabase
            .from("landed_costs")
            .select("*, hts_codes(*)")
            .eq("slug", slug)
            .maybeSingle();

        // If the join fails (orphaned FK, missing hts_codes row, etc.),
        // fall back to fetching without the join
        if (error) {
            const { data: fallbackData, error: fallbackError } = await supabase
                .from("landed_costs")
                .select("*")
                .eq("slug", slug)
                .maybeSingle();

            if (fallbackError) throw fallbackError;
            return fallbackData;
        }

        return data;
    },
    ["landed-cost-slug"],
    {
        revalidate: 604800, // 7 days
        tags: ["landed-costs"],
    }
);
