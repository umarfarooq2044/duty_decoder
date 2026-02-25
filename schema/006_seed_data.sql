-- ============================================================
-- 006_seed_data.sql
-- Seed: de minimis rules, sample HTS codes, legal disclaimers
-- ============================================================

-- ============================================================
-- De Minimis Rules (2026)
-- ============================================================

-- US: Threshold eliminated Aug 29, 2025
INSERT INTO compliance_rules (country_code, rule_type, rule_key, rule_value, description, version, effective_from) VALUES
('US', 'de_minimis', 'commercial_threshold', '{
  "threshold_value": 0,
  "threshold_currency": "USD",
  "exempt": false,
  "notes": "De minimis threshold eliminated Aug 29, 2025. All commercial shipments subject to full duty/tax.",
  "postal_methodology": "ad_valorem",
  "postal_methodology_mandatory_from": "2026-02-28"
}', 'US de minimis eliminated — full duty on all commercial goods', 2, '2025-08-29');

-- UK: £135 threshold active through 2026
INSERT INTO compliance_rules (country_code, rule_type, rule_key, rule_value, description, version, effective_from, effective_to) VALUES
('GB', 'de_minimis', 'commercial_threshold', '{
  "threshold_value": 135,
  "threshold_currency": "GBP",
  "exempt": true,
  "vat_still_due": true,
  "vat_collected_by": "seller",
  "notes": "Duty exempt ≤£135. VAT collected by seller at POS. Removal planned by March 2029."
}', 'UK £135 de minimis — duty exempt, VAT due', 1, '2021-01-01', '2026-12-31');

-- EU: €150 threshold transitioning Jul 1, 2026
INSERT INTO compliance_rules (country_code, rule_type, rule_key, rule_value, description, version, effective_from, effective_to) VALUES
('EU', 'de_minimis', 'commercial_threshold_pre_transition', '{
  "threshold_value": 150,
  "threshold_currency": "EUR",
  "exempt": true,
  "notes": "€150 exemption active until Jun 30, 2026."
}', 'EU €150 de minimis — pre-transition', 1, '2020-07-01', '2026-06-30');

INSERT INTO compliance_rules (country_code, rule_type, rule_key, rule_value, description, version, effective_from) VALUES
('EU', 'de_minimis', 'commercial_threshold_post_transition', '{
  "threshold_value": 150,
  "threshold_currency": "EUR",
  "exempt": false,
  "flat_duty_per_item": 3,
  "flat_duty_currency": "EUR",
  "notes": "€3/item flat statistical duty on parcels <€150. Full removal ~2028."
}', 'EU €3/item flat duty — post Jul 2026 transition', 2, '2026-07-01');

-- Pakistan: PKR 1,000 threshold (postal/courier only)
INSERT INTO compliance_rules (country_code, rule_type, rule_key, rule_value, description, version, effective_from) VALUES
('PK', 'de_minimis', 'commercial_threshold', '{
  "threshold_value": 1000,
  "threshold_currency": "PKR",
  "exempt": true,
  "applies_to": ["postal", "courier"],
  "notes": "Reduced from PKR 5,000 via Finance Act 2025. Postal/courier only."
}', 'Pakistan PKR 1,000 de minimis — postal/courier', 2, '2025-07-01');

-- ============================================================
-- EU CBAM Compliance Rule
-- ============================================================

INSERT INTO compliance_rules (country_code, rule_type, rule_key, rule_value, description, version, effective_from) VALUES
('EU', 'cbam', 'carbon_border_adjustment', '{
  "applicable_sectors": ["iron_steel", "cement", "aluminium", "fertilisers", "electricity", "hydrogen"],
  "reporting_required": true,
  "certificates_required_from": "2026-01-01",
  "notes": "CBAM transitional phase active. Full implementation from 2026."
}', 'EU Carbon Border Adjustment Mechanism', 1, '2023-10-01');

-- ============================================================
-- National Handling Fees (2026)
-- ============================================================

INSERT INTO compliance_rules (country_code, rule_type, rule_key, rule_value, description, version, effective_from) VALUES
('IT', 'handling_fee', 'customs_handling', '{
  "fee_value": 5.50,
  "fee_currency": "EUR",
  "fee_type": "per_declaration",
  "notes": "Italy customs handling fee introduced January 2026."
}', 'Italy customs handling fee', 1, '2026-01-01');

INSERT INTO compliance_rules (country_code, rule_type, rule_key, rule_value, description, version, effective_from) VALUES
('RO', 'handling_fee', 'customs_handling', '{
  "fee_value": 4.00,
  "fee_currency": "EUR",
  "fee_type": "per_declaration",
  "notes": "Romania customs handling fee introduced January 2026."
}', 'Romania customs handling fee', 1, '2026-01-01');

-- ============================================================
-- Legal Disclaimers
-- ============================================================

INSERT INTO compliance_rules (country_code, rule_type, rule_key, rule_value, description, version, effective_from) VALUES
('US', 'disclaimer', 'calculation_disclaimer', '{
  "text": "This landed cost estimate is for informational purposes only and does not constitute legal, tax, or customs advice. Actual duties, taxes, and fees may vary based on classification decisions by U.S. Customs and Border Protection (CBP). Consult a licensed customs broker for binding rulings.",
  "last_reviewed": "2026-02-01"
}', 'US calculation disclaimer', 1, '2026-01-01'),
('GB', 'disclaimer', 'calculation_disclaimer', '{
  "text": "This estimate is provided for guidance only and does not replace professional customs advice. Actual duties and VAT may differ based on HMRC classification. Consult a customs agent for official determinations.",
  "last_reviewed": "2026-02-01"
}', 'UK calculation disclaimer', 1, '2026-01-01'),
('EU', 'disclaimer', 'calculation_disclaimer', '{
  "text": "This estimate is indicative only. Tariff classifications and duty rates are determined by national customs authorities of EU member states. This tool does not account for all preferential trade agreements. Seek professional advice for binding tariff information.",
  "last_reviewed": "2026-02-01"
}', 'EU calculation disclaimer', 1, '2026-01-01'),
('PK', 'disclaimer', 'calculation_disclaimer', '{
  "text": "This calculation is for reference purposes only. Pakistan Customs (FBR) determines final duty and tax assessments. Regulatory duties and additional charges may apply. Consult a licensed customs agent.",
  "last_reviewed": "2026-02-01"
}', 'Pakistan calculation disclaimer', 1, '2026-01-01');

-- ============================================================
-- Sample HTS Codes (US & UK)
-- ============================================================

-- US: Men''s cotton t-shirt (Chapter 61 — knitted apparel)
INSERT INTO hts_codes (country_code, hts_code, hs6_prefix, chapter, heading, description, duty_type, duty_rate_pct, vat_rate_pct, effective_from, meta_data) VALUES
('US', '6109100012', '610910', 61, 9, 'Men''s or boys'' T-shirts, singlets, tank tops and similar garments, knitted or crocheted, of cotton, men''s', 'ad_valorem', 16.500, 0.00, '2026-01-01', '{"notes": "General rate. May be subject to Section 301 if origin is China."}'),
('US', '6109100040', '610910', 61, 9, 'Men''s or boys'' T-shirts, singlets, tank tops and similar garments, knitted or crocheted, of cotton, boys''', 'ad_valorem', 16.500, 0.00, '2026-01-01', '{}');

-- US: Woven cotton shirt (Chapter 62 — non-knitted apparel)
INSERT INTO hts_codes (country_code, hts_code, hs6_prefix, chapter, heading, description, duty_type, duty_rate_pct, vat_rate_pct, effective_from) VALUES
('US', '6205200020', '620520', 62, 5, 'Men''s or boys'' shirts of cotton, not knitted or crocheted, dress shirts', 'ad_valorem', 19.700, 0.00, '2026-01-01');

-- UK: Men''s cotton t-shirt
INSERT INTO hts_codes (country_code, hts_code, hs6_prefix, chapter, heading, description, duty_type, duty_rate_pct, vat_rate_pct, effective_from) VALUES
('GB', '6109100010', '610910', 61, 9, 'T-shirts, singlets and other vests, of cotton, knitted or crocheted', 'ad_valorem', 12.000, 20.00, '2026-01-01');

-- UK: Woven cotton shirt
INSERT INTO hts_codes (country_code, hts_code, hs6_prefix, chapter, heading, description, duty_type, duty_rate_pct, vat_rate_pct, effective_from) VALUES
('GB', '6205200010', '620520', 62, 5, 'Men''s or boys'' shirts of cotton, not knitted', 'ad_valorem', 12.000, 20.00, '2026-01-01');

-- US: Steel (for Section 232 example)
INSERT INTO hts_codes (country_code, hts_code, hs6_prefix, chapter, heading, description, duty_type, duty_rate_pct, vat_rate_pct, effective_from, additional_duties) VALUES
('US', '7208510030', '720851', 72, 8, 'Flat-rolled products of iron or nonalloy steel, hot-rolled, width ≥600mm, thickness >10mm', 'ad_valorem', 0.000, 0.00, '2026-01-01', '{"section_232": {"rate_pct": 25.0, "description": "Section 232 steel tariff"}}');
