-- ============================================================
-- 012_country_support_pages.sql
-- Add 8 new JSONB columns to country_hubs for informational support pages
-- ============================================================

ALTER TABLE country_hubs
ADD COLUMN import_duty_page JSONB NOT NULL DEFAULT '{}',
ADD COLUMN import_tax_page JSONB NOT NULL DEFAULT '{}',
ADD COLUMN hs_code_page JSONB NOT NULL DEFAULT '{}',
ADD COLUMN threshold_page JSONB NOT NULL DEFAULT '{}',
ADD COLUMN clearance_page JSONB NOT NULL DEFAULT '{}',
ADD COLUMN restrictions_page JSONB NOT NULL DEFAULT '{}',
ADD COLUMN documents_page JSONB NOT NULL DEFAULT '{}',
ADD COLUMN shipping_fees_page JSONB NOT NULL DEFAULT '{}';
