import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";
import { COUNTRIES, type CountryEntry } from "../lib/countries";

// ============================================================
// Clients
// ============================================================

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PAGE_TYPES = [
    { id: "import_duty", slug: "import-duty", context: "import duty, customs duty, tariff rates, and duty calculation" },
    { id: "import_tax", slug: "import-tax", context: "import tax, VAT on imports, GST, and sales tax on imported goods" },
    { id: "hs_code", slug: "hs-code-lookup", context: "HS code lookup, tariff classification, and finding the correct duty code" },
    { id: "threshold", slug: "duty-free-threshold", context: "de minimis value, duty-free allowance, and import tax thresholds" },
    { id: "clearance", slug: "customs-clearance", context: "customs clearance process, courier clearance, and customs delays" },
    { id: "restrictions", slug: "import-restrictions", context: "import restrictions, prohibited items, and banned imports" },
    { id: "documents", slug: "import-documents", context: "required import documents, customs paperwork, and commercial invoices" },
    { id: "shipping_fees", slug: "shipping-customs-fees", context: "shipping customs fees, courier handling charges, and brokerage fees" }
];

// ============================================================
// Step 1: Keyword Expansion (Llama-3.1-8b-instant)
// ============================================================

async function generateKeywords(country: CountryEntry, pageType: any): Promise<any> {
    const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{
            role: "user",
            content: `Generate SEO keyword clusters for ${pageType.context} when importing to ${country.name}. 
IMPORTANT: DO NOT include the word "calculator" in any keyword to prevent cannibalization of the main calculator page.

Return JSON:
{
  "primary_keywords": ["3-4 exact match keywords"],
  "secondary_keywords": ["4-5 high-intent long-tail questions/variations"]
}
Return ONLY valid JSON.`
        }],
        temperature: 0.2,
        response_format: { type: "json_object" }
    });

    try {
        return JSON.parse(response.choices[0]?.message?.content || "{}");
    } catch {
        console.error(`[Keywords] Failed parsing for ${country.name} - ${pageType.id}`);
        return { primary_keywords: [], secondary_keywords: [] };
    }
}

// ============================================================
// Step 2: Deep Content Writing (Llama-3.3-70b-versatile)
// ============================================================

async function generateContent(country: CountryEntry, pageType: any): Promise<any> {
    const prompts: Record<string, string> = {
        import_duty: `Write SEO content about Import Duties in ${country.name}. Sections needed: 1. Overview of import duty in ${country.name}. 2. How duty is calculated (ad valorem vs specific). 3. Role of HS codes. 4. Preferential origin impact. 5. Example calculation steps.`,
        import_tax: `Write SEO content about Import VAT/GST in ${country.name}. Tax details: ${country.vatLabel} at ${country.vatRate}%. Sections needed: 1. Difference between duty and tax. 2. How ${country.vatLabel} works on imports. 3. The tax base (CIF + duty). 4. When the tax applies vs exemptions.`,
        hs_code: `Write SEO content about HS Code Lookup for ${country.name}. Sections needed: 1. What is an HS code? 2. How classification works in ${country.name}. 3. Common mistakes importers make. 4. Structure of a 10-digit tariff code.`,
        threshold: `Write SEO content about Duty-Free Thresholds (De Minimis) in ${country.name}. Currency: ${country.currency}. Sections needed: 1. What is the de minimis value? 2. When duty/tax applies. 3. Notable exceptions. 4. Impact on small e-commerce shipments.`,
        clearance: `Write SEO content about Customs Clearance Process in ${country.name}. Sections needed: 1. Step-by-step customs process. 2. Courier vs formal freight clearance. 3. Common causes of delays. 4. Associated processing fees.`,
        restrictions: `Write SEO content about Import Restrictions in ${country.name}. Sections needed: 1. Absolutely prohibited items. 2. Restricted goods requiring licenses. 3. Agency controls (health, agriculture, etc). 4. Penalties for non-compliance.`,
        documents: `Write SEO content about Required Import Documents for ${country.name}. Sections needed: 1. Commercial Invoice requirements. 2. Packing List details. 3. Bill of Lading / Air Waybill. 4. Certificates of Origin and compliance.`,
        shipping_fees: `Write SEO content about Shipping and Customs Courier Fees in ${country.name}. Sections needed: 1. Customs brokerage fees. 2. Airline/Port handling charges. 3. Storage and demurrage. 4. Hidden carrier disbursement fees.`
    };

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{
            role: "user",
            content: `You are a Senior Trade Compliance Expert.
${prompts[pageType.id]}

Return JSON:
{
  "sections": [
    {"id": "section-1-slug", "heading": "First Section Heading", "content": "1-2 comprehensive paragraphs with <strong> tags for key terms..."},
    {"id": "section-2-slug", "heading": "Second Section Heading", "content": "..."},
    {"id": "section-3-slug", "heading": "Third Section Heading", "content": "..."},
    {"id": "section-4-slug", "heading": "Fourth Section Heading", "content": "..."}
  ],
  "faq": [
    {"question": "FAQ Question 1?", "answer": "Detailed answer..."},
    {"question": "FAQ Question 2?", "answer": "Detailed answer..."},
    {"question": "FAQ Question 3?", "answer": "Detailed answer..."}
  ]
}

CRITICAL RULES:
- Never hallucinate specific duty rates; use "varies by product".
- Use ${country.vatLabel} and ${country.vatRate}% exclusively for tax references.
- Use ${country.currency} exclusively for currency.
- Do NOT generate markdown formatting inside the headings.
- Return ONLY valid JSON.`
        }],
        temperature: 0.3,
        response_format: { type: "json_object" }
    });

    try {
        return JSON.parse(response.choices[0]?.message?.content || "{}");
    } catch {
        console.error(`[Content] Failed parsing for ${country.name} - ${pageType.id}`);
        return { sections: [], faq: [] };
    }
}

// ============================================================
// Step 3: Metadata (Llama-3.1-8b-instant)
// ============================================================

async function generateMetadata(country: CountryEntry, pageType: any): Promise<any> {
    const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{
            role: "user",
            content: `Generate CTR-optimized SEO metadata for a page about "${pageType.context} in ${country.name}".
Important: Do NOT use the word "calculator" in the title or description.

Return JSON:
{
  "title": "55-60 char meta title | DutyDecoder",
  "meta_description": "140-155 char meta description summarizing the page value",
  "seo_h1": "Compelling H1 headline under 80 chars",
  "breadcrumb": ["Home", "${country.name}", "${pageType.context.split(',')[0]}"]
}
Return ONLY valid JSON.`
        }],
        temperature: 0.2,
        response_format: { type: "json_object" }
    });

    try {
        return JSON.parse(response.choices[0]?.message?.content || "{}");
    } catch {
        return {
            title: `${pageType.context.split(',')[0]} in ${country.name} | 2026 Guide`,
            meta_description: `Learn everything you need to know about ${pageType.context} when importing to ${country.name}.`,
            seo_h1: `Complete Guide to ${pageType.context.split(',')[0]} in ${country.name}`
        };
    }
}

// ============================================================
// Pipeline Processing
// ============================================================

async function processCountryPage(country: CountryEntry, pageType: any): Promise<any> {
    console.log(`     [${pageType.id}] keywords...`);
    const keywords = await generateKeywords(country, pageType);

    console.log(`     [${pageType.id}] content...`);
    const content = await generateContent(country, pageType);

    console.log(`     [${pageType.id}] metadata...`);
    const meta = await generateMetadata(country, pageType);

    return {
        url: `/${country.slug}/${pageType.slug}/`,
        ...meta,
        primary_keywords: keywords.primary_keywords || [],
        secondary_keywords: keywords.secondary_keywords || [],
        sections: content.sections || [],
        faq: content.faq || [],
        schema_notes: `FAQPage + BreadcrumbList + Article schema for ${country.name} ${pageType.slug}`,
        internal_links: [
            { url: `/${country.slug}/import-duty-calculator/`, text: `Calculate Landed Cost for ${country.name}` },
            { url: `/${country.slug}/`, text: `${country.name} Import Guide Hub` },
            { url: "/", text: "Global Landed Cost Calculator" }
        ]
    };
}

// Use raw SQL to bypass PostgREST schema cache
async function upsertSupportPages(countryCode: string, results: Record<string, any>): Promise<{ error: any }> {
    const { error } = await supabase.rpc('update_country_support_pages', {
        p_country_code: countryCode,
        p_import_duty_page: results['import_duty'],
        p_import_tax_page: results['import_tax'],
        p_hs_code_page: results['hs_code'],
        p_threshold_page: results['threshold'],
        p_clearance_page: results['clearance'],
        p_restrictions_page: results['restrictions'],
        p_documents_page: results['documents'],
        p_shipping_fees_page: results['shipping_fees'],
    });
    return { error };
}

async function ensureRpcFunction(): Promise<void> {
    // Create a SQL function that bypasses PostgREST schema cache
    const { error } = await supabase.rpc('update_country_support_pages', {
        p_country_code: '__test__',
        p_import_duty_page: {},
        p_import_tax_page: {},
        p_hs_code_page: {},
        p_threshold_page: {},
        p_clearance_page: {},
        p_restrictions_page: {},
        p_documents_page: {},
        p_shipping_fees_page: {},
    });

    if (error && error.message.includes('function') && error.message.includes('does not exist')) {
        console.log("⚙️  RPC function missing — creating it now...");
        // We can't create functions via PostgREST. Ask user.
        console.error(`
╔═══════════════════════════════════════════════════════════════╗
║  Please run this SQL in Supabase SQL Editor first:           ║
╠═══════════════════════════════════════════════════════════════╣

CREATE OR REPLACE FUNCTION update_country_support_pages(
  p_country_code TEXT,
  p_import_duty_page JSONB,
  p_import_tax_page JSONB,
  p_hs_code_page JSONB,
  p_threshold_page JSONB,
  p_clearance_page JSONB,
  p_restrictions_page JSONB,
  p_documents_page JSONB,
  p_shipping_fees_page JSONB
) RETURNS void AS $$
BEGIN
  UPDATE country_hubs SET
    import_duty_page = p_import_duty_page,
    import_tax_page = p_import_tax_page,
    hs_code_page = p_hs_code_page,
    threshold_page = p_threshold_page,
    clearance_page = p_clearance_page,
    restrictions_page = p_restrictions_page,
    documents_page = p_documents_page,
    shipping_fees_page = p_shipping_fees_page
  WHERE country_code = p_country_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

╚═══════════════════════════════════════════════════════════════╝
`);
        process.exit(1);
    } else {
        console.log("✅ RPC function exists — proceeding...");
    }
}

async function processCountry(country: CountryEntry): Promise<void> {
    try {
        // Skip check: try to read via raw select (these columns work in select even if update cache is stale)
        const { data: existing } = await supabase
            .from("country_hubs")
            .select("hub_page")
            .eq("country_slug", country.slug)
            .maybeSingle();

        if (!existing) {
            console.log(`   ⚠️ No hub row found for ${country.name} — skipping`);
            return;
        }

        console.log(`\n🌍 Processing ${country.name} (${country.code})...`);
        const results: Record<string, any> = {};

        // Generate all 8 pages sequentially to avoid Groq rate limits
        for (const pt of PAGE_TYPES) {
            results[pt.id] = await processCountryPage(country, pt);
        }

        const { error } = await upsertSupportPages(country.code, results);

        if (error) {
            console.error(`   ❌ DB Error for ${country.name}:`, error.message);
        } else {
            console.log(`   ✅ ${country.name} — All 8 support pages saved!`);
        }

    } catch (err: any) {
        console.error(`   ❌ FATAL for ${country.name}:`, err.message);
    }
}

async function main() {
    console.log("🚀 Support Pages Generator (400 Pages)");
    console.log(`   📊 Countries: ${COUNTRIES.length}`);
    console.log(`   ⏱️  Rate: Batch limit 3 countries, sequential pages to respect Groq limit\n`);

    // Pre-check: ensure the RPC function exists
    await ensureRpcFunction();

    const BATCH_SIZE = 3; // Reduced batch size due to 8 heavy pages per country
    let processed = 0;

    for (let i = 0; i < COUNTRIES.length; i += BATCH_SIZE) {
        const batch = COUNTRIES.slice(i, i + BATCH_SIZE);
        console.log(`\n============== BATCH ${Math.floor(i / BATCH_SIZE) + 1} / ${Math.ceil(COUNTRIES.length / BATCH_SIZE)} ==============`);

        await Promise.all(batch.map(c => processCountry(c)));
        processed += batch.length;

        console.log(`\n   📈 Progress: ${processed}/${COUNTRIES.length} countries`);

        if (i + BATCH_SIZE < COUNTRIES.length) {
            console.log(`   ⏸️  Rate limit pause (5s)...`);
            await new Promise(r => setTimeout(r, 5000));
        }
    }

    console.log(`\n🎉 COMPLETE! Generated 400 total support pages.`);
}

main().catch(console.error);
