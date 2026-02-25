-- ============================================================
-- 008_seo_fields.sql
-- Add AI-generated SEO columns to landed_costs table
-- ============================================================

ALTER TABLE landed_costs
ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS market_insight TEXT;

-- Create an index to quickly find fully generated SEO pages
CREATE INDEX IF NOT EXISTS idx_landed_seo_complete 
ON landed_costs (seo_title) 
WHERE seo_title IS NOT NULL;
