-- ============================================================
-- 005_rls_policies.sql
-- Row-Level Security policies for data isolation
-- ============================================================

-- ============================================================
-- Enable RLS on all tables
-- ============================================================

ALTER TABLE hts_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE landed_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_rules ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- hts_codes: Public read (active only), service_role write
-- ============================================================

CREATE POLICY hts_select_active ON hts_codes
  FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY hts_service_insert ON hts_codes
  FOR INSERT
  TO service_role
  WITH CHECK (TRUE);

CREATE POLICY hts_service_update ON hts_codes
  FOR UPDATE
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY hts_service_delete ON hts_codes
  FOR DELETE
  TO service_role
  USING (TRUE);

-- ============================================================
-- landed_costs: Users see/create only their own data
-- Authenticated users: match on auth.uid() = user_id
-- Anonymous users: match on session_id claim from JWT
-- ============================================================

CREATE POLICY landed_select_own ON landed_costs
  FOR SELECT
  USING (
    -- Authenticated user: match user_id
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    -- Anonymous: match session_id from JWT claim
    (auth.uid() IS NULL AND session_id = (current_setting('request.jwt.claims', TRUE)::JSONB ->> 'session_id')::UUID)
    OR
    -- Public slug access (for SEO pages)
    (slug IS NOT NULL)
  );

CREATE POLICY landed_insert_own ON landed_costs
  FOR INSERT
  WITH CHECK (
    -- Authenticated: user_id must match
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    -- Anonymous: user_id must be NULL
    (auth.uid() IS NULL AND user_id IS NULL)
  );

-- Service role can do anything (for API routes)
CREATE POLICY landed_service_all ON landed_costs
  FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- ============================================================
-- compliance_rules: Public read, service_role write
-- ============================================================

CREATE POLICY compliance_select_all ON compliance_rules
  FOR SELECT
  USING (TRUE);

CREATE POLICY compliance_service_insert ON compliance_rules
  FOR INSERT
  TO service_role
  WITH CHECK (TRUE);

CREATE POLICY compliance_service_update ON compliance_rules
  FOR UPDATE
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY compliance_service_delete ON compliance_rules
  FOR DELETE
  TO service_role
  USING (TRUE);
