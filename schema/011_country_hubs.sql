-- ============================================================
-- 011_country_hubs.sql
-- Country hub + calculator page SEO data (50 countries)
-- ============================================================

CREATE TABLE country_hubs (
  country_code        VARCHAR(2) PRIMARY KEY,
  country_name        TEXT NOT NULL,
  country_slug        VARCHAR(100) NOT NULL UNIQUE,

  -- Hub page: /{country-slug}/
  hub_page            JSONB NOT NULL DEFAULT '{}',

  -- Calculator page: /{country-slug}/import-duty-calculator/
  calculator_page     JSONB NOT NULL DEFAULT '{}',

  -- Generation metadata
  generated_at        TIMESTAMPTZ DEFAULT NOW(),
  generation_model    TEXT DEFAULT 'llama-3.3-70b-versatile',
  needs_review        BOOLEAN DEFAULT FALSE,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE UNIQUE INDEX idx_country_hub_slug ON country_hubs (country_slug);
CREATE INDEX idx_country_hub_code ON country_hubs (country_code);

-- ============================================================
-- RLS Policies (Public read, service write)
-- ============================================================

ALTER TABLE country_hubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access"
  ON country_hubs FOR SELECT
  USING (true);

CREATE POLICY "Service role write access"
  ON country_hubs FOR ALL
  USING (true)
  WITH CHECK (true);
