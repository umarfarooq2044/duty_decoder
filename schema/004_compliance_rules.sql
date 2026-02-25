-- ============================================================
-- 004_compliance_rules.sql
-- Version-controlled compliance rules per country
-- ============================================================

CREATE TABLE compliance_rules (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Scope
  country_code    VARCHAR(2) NOT NULL,
  rule_type       VARCHAR(50) NOT NULL                     -- 'de_minimis', 'disclaimer', 'restriction', 'cbam', 'handling_fee'
                    CHECK (rule_type IN ('de_minimis', 'disclaimer', 'restriction', 'cbam', 'handling_fee')),
  rule_key        VARCHAR(100) NOT NULL,

  -- Rule content
  rule_value      JSONB NOT NULL,
  description     TEXT,

  -- Versioning
  version         INT NOT NULL DEFAULT 1
                    CHECK (version >= 1),

  -- Validity period
  effective_from  DATE NOT NULL,
  effective_to    DATE,

  -- Timestamps
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT uq_compliance_rule UNIQUE (country_code, rule_key, version),
  CONSTRAINT ck_compliance_effective CHECK (effective_to IS NULL OR effective_to > effective_from)
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_compliance_country_type ON compliance_rules (country_code, rule_type);
CREATE INDEX idx_compliance_active ON compliance_rules (effective_from, effective_to);

-- ============================================================
-- Auto-update timestamp trigger
-- ============================================================

CREATE TRIGGER trg_compliance_rules_updated_at
  BEFORE UPDATE ON compliance_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
