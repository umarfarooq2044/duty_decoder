-- ============================================================
-- 010_seo_blueprint.sql
-- Add Research-Driven SEO Blueprint columns to landed_costs
-- ============================================================

ALTER TABLE "public"."landed_costs"
ADD COLUMN IF NOT EXISTS seo_blueprint JSONB,
ADD COLUMN IF NOT EXISTS seo_h1 TEXT,
ADD COLUMN IF NOT EXISTS seo_h2_intent TEXT,
ADD COLUMN IF NOT EXISTS seo_h3_technical TEXT,
ADD COLUMN IF NOT EXISTS needs_human_review BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN public.landed_costs.seo_blueprint IS 'Raw JSON output from the Llama-4-Maverick Research Agent containing high-intent keywords, LSI terms, search intent questions, and exemption data.';
COMMENT ON COLUMN public.landed_costs.seo_h1 IS 'Keyword-optimized H1 heading generated using the primary high-intent keyword from the SEO Blueprint.';
COMMENT ON COLUMN public.landed_costs.seo_h2_intent IS 'H2 section (250-300 words) answering the primary Search Intent question discovered by the Research Agent.';
COMMENT ON COLUMN public.landed_costs.seo_h3_technical IS 'H3 section with technical compliance breakdown specific to the product category.';
COMMENT ON COLUMN public.landed_costs.needs_human_review IS 'Flag set to TRUE when AI research returned no specific data and generic fallback content was used.';

-- Index for auditing pages that need human review
CREATE INDEX IF NOT EXISTS idx_landed_needs_review
ON landed_costs (needs_human_review)
WHERE needs_human_review = TRUE;
