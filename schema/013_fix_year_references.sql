-- Fix all "2024" year references to "2026" across all JSONB content columns in country_hubs
-- This covers hub_page, calculator_page, and all 8 support page columns.

-- Hub page content
UPDATE country_hubs
SET hub_page = REPLACE(hub_page::text, '2024', '2026')::jsonb
WHERE hub_page::text LIKE '%2024%';

-- Calculator page content
UPDATE country_hubs
SET calculator_page = REPLACE(calculator_page::text, '2024', '2026')::jsonb
WHERE calculator_page::text LIKE '%2024%';

-- Support pages
UPDATE country_hubs
SET import_duty_page = REPLACE(import_duty_page::text, '2024', '2026')::jsonb
WHERE import_duty_page::text LIKE '%2024%';

UPDATE country_hubs
SET import_tax_page = REPLACE(import_tax_page::text, '2024', '2026')::jsonb
WHERE import_tax_page::text LIKE '%2024%';

UPDATE country_hubs
SET hs_code_page = REPLACE(hs_code_page::text, '2024', '2026')::jsonb
WHERE hs_code_page::text LIKE '%2024%';

UPDATE country_hubs
SET threshold_page = REPLACE(threshold_page::text, '2024', '2026')::jsonb
WHERE threshold_page::text LIKE '%2024%';

UPDATE country_hubs
SET clearance_page = REPLACE(clearance_page::text, '2024', '2026')::jsonb
WHERE clearance_page::text LIKE '%2024%';

UPDATE country_hubs
SET restrictions_page = REPLACE(restrictions_page::text, '2024', '2026')::jsonb
WHERE restrictions_page::text LIKE '%2024%';

UPDATE country_hubs
SET documents_page = REPLACE(documents_page::text, '2024', '2026')::jsonb
WHERE documents_page::text LIKE '%2024%';

UPDATE country_hubs
SET shipping_fees_page = REPLACE(shipping_fees_page::text, '2024', '2026')::jsonb
WHERE shipping_fees_page::text LIKE '%2024%';

-- Also fix any "2025" references that should be "2026" (except factual dates)
-- Only fix in titles and meta descriptions, not in body content where dates may be factual
UPDATE country_hubs
SET hub_page = jsonb_set(hub_page, '{title}', to_jsonb(REPLACE(hub_page->>'title', '2025', '2026')))
WHERE hub_page->>'title' LIKE '%2025%';

UPDATE country_hubs
SET calculator_page = jsonb_set(calculator_page, '{title}', to_jsonb(REPLACE(calculator_page->>'title', '2025', '2026')))
WHERE calculator_page->>'title' LIKE '%2025%';
