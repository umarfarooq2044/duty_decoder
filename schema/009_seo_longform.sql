-- Add long-form semantic AI generation fields for 600+ word Deep SEO
ALTER TABLE "public"."landed_costs"
ADD COLUMN IF NOT EXISTS semantic_h2_problem TEXT,
ADD COLUMN IF NOT EXISTS semantic_h2_solution TEXT,
ADD COLUMN IF NOT EXISTS faqs_json JSONB;

COMMENT ON COLUMN public.landed_costs.semantic_h2_problem IS 'AI generated 300 word problem awareness text regarding customs classficiation and compliance barriers.';
COMMENT ON COLUMN public.landed_costs.semantic_h2_solution IS 'AI generated 300 word step-by-step solution text providing actionable customs guidance.';
COMMENT ON COLUMN public.landed_costs.faqs_json IS 'AI generated array of 5 High-Intent FAQs answering specific customs questions regarding this product/route mix.';
