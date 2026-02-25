-- Up: Create global_pillars table to store authority SEO content for main site routes

CREATE TABLE IF NOT EXISTS public.global_pillars (
    slug TEXT PRIMARY KEY,
    title_tag TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    h1 TEXT NOT NULL,
    primary_keywords JSONB NOT NULL DEFAULT '[]',
    secondary_keywords JSONB NOT NULL DEFAULT '[]',
    sections JSONB NOT NULL DEFAULT '[]',
    faq JSONB NOT NULL DEFAULT '[]',
    schema_notes TEXT,
    internal_links JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_global_pillars_mod_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_global_pillars_updated_at ON public.global_pillars;
CREATE TRIGGER trigger_global_pillars_updated_at
    BEFORE UPDATE ON public.global_pillars
    FOR EACH ROW
    EXECUTE FUNCTION update_global_pillars_mod_time();

-- Enable RLS
ALTER TABLE public.global_pillars ENABLE ROW LEVEL SECURITY;

-- Allow public read access to global pillars
CREATE POLICY "Allow public read access to global_pillars" 
ON public.global_pillars FOR SELECT 
USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role all access to global_pillars"
ON public.global_pillars FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Insert the 9 placeholder rows so the script can just UPDATE them (or we can UPSERT)
-- Insert them to ensure the routes are defined
INSERT INTO public.global_pillars (slug, title_tag, meta_description, h1) VALUES
('import-duty', 'Import Duty Guide | Duty Decoder', 'Complete guide to import duties.', 'Import Duty'),
('customs-duty', 'Customs Duty Guide | Duty Decoder', 'Complete guide to customs duties.', 'Customs Duty'),
('import-tax', 'Import Tax Guide | Duty Decoder', 'Complete guide to import taxes and VAT.', 'Import Tax'),
('tariff-rates', 'Tariff Rates Guide | Duty Decoder', 'Complete guide to global tariff rates.', 'Tariff Rates'),
('calculate', 'Landed Cost Calculator | Duty Decoder', 'Calculate exact import landed costs.', 'Landed Cost Calculator'),
('hs-code-lookup', 'HS Code Lookup | Duty Decoder', 'Find the correct HS code for your product.', 'HS Code Lookup'),
('import-documents', 'Required Import Documents | Duty Decoder', 'Checklist of required import documents.', 'Import Documents'),
('import-restrictions', 'Import Restrictions | Duty Decoder', 'Guide to prohibited and restricted imports.', 'Import Restrictions'),
('customs-clearance', 'Customs Clearance Guide | Duty Decoder', 'Step-by-step customs clearance process.', 'Customs Clearance')
ON CONFLICT (slug) DO NOTHING;
