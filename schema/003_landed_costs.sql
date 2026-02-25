-- ============================================================
-- 003_landed_costs.sql
-- Persisted landed cost calculations (session + SEO)
-- ============================================================

CREATE TABLE landed_costs (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Session & ownership
  session_id          UUID NOT NULL,
  user_id             UUID,                                 -- nullable for anonymous users

  -- Input data
  product_description TEXT NOT NULL,
  matched_hts_id      UUID REFERENCES hts_codes(id) ON DELETE SET NULL,
  origin_country      VARCHAR(2) NOT NULL,
  destination_country VARCHAR(2) NOT NULL,

  -- Monetary values (all NUMERIC for zero floating-point errors)
  product_value       NUMERIC(14,2) NOT NULL
                        CHECK (product_value > 0),
  currency            VARCHAR(3) NOT NULL DEFAULT 'USD',
  shipping_cost       NUMERIC(10,2) NOT NULL DEFAULT 0
                        CHECK (shipping_cost >= 0),
  insurance_cost      NUMERIC(10,2) NOT NULL DEFAULT 0
                        CHECK (insurance_cost >= 0),

  -- Calculated breakdown
  cif_value           NUMERIC(14,2) NOT NULL
                        CHECK (cif_value > 0),
  customs_duty        NUMERIC(12,2) NOT NULL
                        CHECK (customs_duty >= 0),
  additional_duties   NUMERIC(12,2) NOT NULL DEFAULT 0
                        CHECK (additional_duties >= 0),
  processing_fees     NUMERIC(10,2) NOT NULL DEFAULT 0      -- MPF/HMF for US
                        CHECK (processing_fees >= 0),
  national_handling   NUMERIC(10,2) NOT NULL DEFAULT 0      -- Italy/Romania 2026 fees
                        CHECK (national_handling >= 0),
  vat_amount          NUMERIC(12,2) NOT NULL
                        CHECK (vat_amount >= 0),
  total_landed_cost   NUMERIC(14,2) NOT NULL
                        CHECK (total_landed_cost > 0),

  -- Exchange rate at time of calculation
  exchange_rate       NUMERIC(12,6),

  -- Full calculation breakdown (JSON for SEO rendering)
  calculation_json    JSONB NOT NULL,

  -- SEO
  slug                VARCHAR(255) UNIQUE,

  -- Timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_landed_session  ON landed_costs (session_id);
CREATE INDEX idx_landed_user     ON landed_costs (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_landed_slug     ON landed_costs (slug) WHERE slug IS NOT NULL;
CREATE INDEX idx_landed_dest     ON landed_costs (destination_country);
CREATE INDEX idx_landed_created  ON landed_costs (created_at DESC);
