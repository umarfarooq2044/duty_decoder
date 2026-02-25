-- ============================================================
-- 007_vector_search_rpc.sql
-- Supabase RPC function for pgvector similarity search
-- ============================================================

CREATE OR REPLACE FUNCTION match_hts_codes(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 5,
  target_country VARCHAR(2) DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  hts_code VARCHAR(10),
  description TEXT,
  duty_type VARCHAR(20),
  duty_rate_pct NUMERIC(6,3),
  duty_rate_specific NUMERIC(12,4),
  duty_unit VARCHAR(20),
  vat_rate_pct NUMERIC(5,2),
  additional_duties JSONB,
  meta_data JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    h.id,
    h.hts_code,
    h.description,
    h.duty_type,
    h.duty_rate_pct,
    h.duty_rate_specific,
    h.duty_unit,
    h.vat_rate_pct,
    h.additional_duties,
    h.meta_data,
    1 - (h.description_embedding <=> query_embedding) AS similarity
  FROM hts_codes h
  WHERE
    h.is_active = TRUE
    AND h.description_embedding IS NOT NULL
    AND (target_country IS NULL OR h.country_code = target_country)
    AND 1 - (h.description_embedding <=> query_embedding) > match_threshold
  ORDER BY h.description_embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
