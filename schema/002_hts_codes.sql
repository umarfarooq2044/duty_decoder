-- ============================================================
-- 002_hts_codes.sql
-- HTS/HS commodity codes with pgvector + full-text search
-- ============================================================

CREATE TABLE hts_codes (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Classification hierarchy
  country_code          VARCHAR(2) NOT NULL,                -- 'US', 'GB', 'EU', 'PK'
  hts_code              VARCHAR(10) NOT NULL,               -- Full 10-digit code
  hs6_prefix            VARCHAR(6) NOT NULL,                -- International HS prefix (digits 1-6)
  chapter               SMALLINT NOT NULL                   -- HS Chapter (digits 1-2)
                          CHECK (chapter >= 1 AND chapter <= 99),
  heading               SMALLINT NOT NULL                   -- HS Heading (digits 3-4)
                          CHECK (heading >= 0 AND heading <= 99),

  -- Description & semantic search
  description           TEXT NOT NULL,
  description_embedding VECTOR(1536),                       -- pgvector: 1536-dim for high-precision embeddings
  search_vector         TSVECTOR GENERATED ALWAYS AS        -- Full-text search backup
                          (to_tsvector('english', description)) STORED,

  -- Metadata & lifecycle
  meta_data             JSONB DEFAULT '{}',                 -- CBAM requirements, environmental levies, AD notes
  is_active             BOOLEAN DEFAULT TRUE,               -- Soft-deactivation flag

  -- Duty structure
  duty_type             VARCHAR(20) NOT NULL DEFAULT 'ad_valorem'
                          CHECK (duty_type IN ('ad_valorem', 'specific', 'compound', 'free')),
  duty_rate_pct         NUMERIC(6,3)                        -- Ad valorem rate (%)
                          CHECK (duty_rate_pct >= 0 AND duty_rate_pct <= 100),
  duty_rate_specific    NUMERIC(12,4),                      -- Specific rate ($/unit)
  duty_unit             VARCHAR(20),                        -- 'kg', 'liter', 'piece', 'dozen'

  -- Tax
  vat_rate_pct          NUMERIC(5,2)                        -- VAT/GST rate (%)
                          CHECK (vat_rate_pct >= 0 AND vat_rate_pct <= 100),
  additional_duties     JSONB DEFAULT '{}',                 -- Section 301/232, AD/CVD as structured JSON

  -- Validity period
  effective_from        DATE NOT NULL,
  effective_to          DATE,

  -- Timestamps
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT uq_hts_country_code_date UNIQUE (country_code, hts_code, effective_from),
  CONSTRAINT ck_hts_effective_range CHECK (effective_to IS NULL OR effective_to > effective_from),
  CONSTRAINT ck_hts_specific_duty CHECK (
    (duty_type = 'specific' AND duty_rate_specific IS NOT NULL AND duty_unit IS NOT NULL)
    OR (duty_type = 'compound' AND duty_rate_pct IS NOT NULL AND duty_rate_specific IS NOT NULL AND duty_unit IS NOT NULL)
    OR (duty_type = 'ad_valorem' AND duty_rate_pct IS NOT NULL)
    OR (duty_type = 'free')
  )
);

-- ============================================================
-- Indexes
-- ============================================================

-- HNSW: faster than IVFFlat for 2026-scale vector similarity
CREATE INDEX idx_hts_embedding_hnsw ON hts_codes
  USING hnsw (description_embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 200);

-- GIN full-text search fallback
CREATE INDEX idx_hts_fts ON hts_codes USING GIN (search_vector);

-- Lookup indexes
CREATE INDEX idx_hts_country      ON hts_codes (country_code);
CREATE INDEX idx_hts_hs6          ON hts_codes (hs6_prefix);
CREATE INDEX idx_hts_active       ON hts_codes (is_active) WHERE is_active = TRUE;
CREATE INDEX idx_hts_chapter      ON hts_codes (country_code, chapter);
CREATE INDEX idx_hts_effective    ON hts_codes (effective_from, effective_to);

-- ============================================================
-- Auto-update timestamp trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_hts_codes_updated_at
  BEFORE UPDATE ON hts_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
