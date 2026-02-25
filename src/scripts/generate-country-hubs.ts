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

// ============================================================
// Step 1: Keyword Clustering (Mixtral-8x7b)
// ============================================================

async function generateKeywords(country: CountryEntry): Promise<any> {
    const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{
            role: "user",
            content: `Generate SEO keyword clusters for importing goods to ${country.name}. Return JSON:
{
  "primary_keywords": ["import duty ${country.name}", "customs duty ${country.name}", "import tax ${country.name}", "tariff rates ${country.name}", "import fees ${country.name}", "duties and taxes ${country.name}"],
  "calculator_keywords": ["import duty calculator ${country.name}", "customs duty calculator ${country.name}", "import tax calculator ${country.name}", "landed cost calculator ${country.name}"],
  "vat_keywords": ["import ${country.vatLabel} ${country.name}", "${country.vatLabel} on imports ${country.name}"],
  "rules_keywords": ["de minimis ${country.name}", "duty free allowance ${country.name}", "import threshold ${country.name}", "customs value ${country.name}"],
  "hs_code_keywords": ["HS code lookup ${country.name}", "tariff code lookup ${country.name}", "duty by HS code ${country.name}"],
  "shipping_keywords": ["customs clearance fees ${country.name}", "courier customs charges ${country.name}", "shipping customs fees ${country.name}"],
  "compliance_keywords": ["import requirements ${country.name}", "import restrictions ${country.name}", "prohibited items ${country.name}", "import documents ${country.name}", "customs clearance ${country.name}"],
  "secondary_keywords": []
}
Add 5-8 additional high-intent secondary keywords specific to ${country.name}'s trade landscape. Return ONLY valid JSON.`
        }],
        temperature: 0.3,
        response_format: { type: "json_object" }
    });

    try {
        return JSON.parse(response.choices[0]?.message?.content || "{}");
    } catch {
        console.error(`[Keywords] Failed to parse for ${country.name}`);
        return { primary_keywords: [`import duty ${country.name}`], calculator_keywords: [], secondary_keywords: [] };
    }
}

// ============================================================
// Step 2: Deep Content Writing (Llama-3.3-70b)
// ============================================================

async function generateHubContent(country: CountryEntry, keywords: any): Promise<any> {
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{
            role: "user",
            content: `You are a Senior International Trade Expert writing a comprehensive import guide for ${country.name}.

Write SEO content for a country hub page about importing goods to ${country.name}.
VAT/Tax Label: ${country.vatLabel} at ${country.vatRate}%.
Currency: ${country.currency}.

Return JSON with this exact structure:
{
  "sections": [
    {"id": "overview", "heading": "Import Duty Overview for ${country.name}", "content": "2-3 paragraphs with <strong> tags for key terms. Cover general duty structure, tariff schedules, and trade agreements."},
    {"id": "vat-gst", "heading": "Import ${country.vatLabel} on Imports in ${country.name}", "content": "2 paragraphs covering the ${country.vatLabel} rate (${country.vatRate}%), how it's calculated on imports, and any reduced rates."},
    {"id": "de-minimis", "heading": "Duty Free Threshold and De Minimis in ${country.name}", "content": "2 paragraphs on the de minimis threshold, below which no duty/tax is charged."},
    {"id": "customs-value", "heading": "Customs Value and Calculation Base in ${country.name}", "content": "2 paragraphs on CIF vs FOB valuation methods used."},
    {"id": "hs-codes", "heading": "HS Code and Tariff Classification for ${country.name}", "content": "2 paragraphs on the Harmonized System implementation."},
    {"id": "clearance", "heading": "Customs Clearance Process in ${country.name}", "content": "2 paragraphs on the clearance workflow."},
    {"id": "fees", "heading": "Common Customs Fees in ${country.name}", "content": "2 paragraphs on typical fees beyond duty."},
    {"id": "restrictions", "heading": "Import Restrictions and Prohibited Goods in ${country.name}", "content": "2 paragraphs on common restrictions."},
    {"id": "documents", "heading": "Required Import Documents for ${country.name}", "content": "2 paragraphs listing commonly required paperwork."},
    {"id": "examples", "heading": "Example Landed Cost Calculation Scenarios", "content": "2 paragraphs with practical examples using safe placeholder rates."}
  ],
  "faq": [
    {"question": "What is the import duty rate in ${country.name}?", "answer": "Detailed answer using 'varies by HS code/product category'."},
    {"question": "How is ${country.vatLabel} calculated on imports to ${country.name}?", "answer": "Explain the ${country.vatRate}% rate applied to CIF + duty."},
    {"question": "What is the de minimis threshold for ${country.name}?", "answer": "Explain the duty-free import threshold."},
    {"question": "What documents do I need to import to ${country.name}?", "answer": "List key documents."},
    {"question": "How do I find the HS code for my product?", "answer": "Explain HS code lookup process."}
  ]
}

Use real, accurate data. If unsure about a specific number, say "varies by product category." Include <strong> tags for emphasis. Do NOT hallucinate duty rates. Return ONLY the JSON.`
        }],
        temperature: 0.3,
        response_format: { type: "json_object" }
    });

    try {
        return JSON.parse(response.choices[0]?.message?.content || "{}");
    } catch {
        console.error(`[Hub Content] Failed to parse for ${country.name}`);
        return { sections: [], faq: [] };
    }
}

async function generateCalculatorContent(country: CountryEntry, keywords: any): Promise<any> {
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{
            role: "user",
            content: `You are a Senior Trade Compliance Expert writing content for a ${country.name} import duty calculator page.
Tax: ${country.vatLabel} at ${country.vatRate}%. Currency: ${country.currency}.

Return JSON:
{
  "sections": [
    {"id": "use-calculator", "heading": "Use the Import Duty Calculator for ${country.name}", "content": "2 paragraphs introducing the calculator with CTA language."},
    {"id": "estimates", "heading": "What the Calculator Estimates for ${country.name}", "content": "2 paragraphs on what duties, taxes, fees are included."},
    {"id": "hs-tips", "heading": "HS Code Accuracy Tips", "content": "2 paragraphs on selecting the right HS code."},
    {"id": "thresholds", "heading": "Threshold and Tax Base Notes for ${country.name}", "content": "2 paragraphs on de minimis and customs valuation."},
    {"id": "incoterms", "heading": "Incoterms Considerations for ${country.name}", "content": "2 paragraphs on CIF, FOB, and their impact."},
    {"id": "accuracy", "heading": "Why Estimates May Differ from Actual Customs Charges", "content": "2 paragraphs on factors causing variance."}
  ],
  "faq": [
    {"question": "How accurate is the ${country.name} import duty calculator?", "answer": "It provides estimates based on HS classification and published tariff rates."},
    {"question": "Do I need to pay ${country.vatLabel} on all imports to ${country.name}?", "answer": "Explain exemptions and thresholds."},
    {"question": "What currency does the calculator use for ${country.name}?", "answer": "Explain ${country.currency} and conversion."}
  ],
  "UI_notes": [
    "Destination country auto-selected to ${country.name} (${country.code})",
    "Allow manual override by user",
    "Currency defaults to ${country.currency}",
    "Origin country freely selectable"
  ]
}

Be accurate. Never hallucinate specific duty rates. Return ONLY valid JSON.`
        }],
        temperature: 0.3,
        response_format: { type: "json_object" }
    });

    try {
        return JSON.parse(response.choices[0]?.message?.content || "{}");
    } catch {
        console.error(`[Calc Content] Failed to parse for ${country.name}`);
        return { sections: [], faq: [], UI_notes: [] };
    }
}

// ============================================================
// Step 3: CTR-Optimized Metadata (Llama-3.1-8b)
// ============================================================

async function generateMetadata(country: CountryEntry, type: "hub" | "calculator"): Promise<any> {
    const context = type === "hub"
        ? `A comprehensive guide on import duties, customs taxes, ${country.vatLabel}, HS codes, and customs clearance for ${country.name}.`
        : `An interactive import duty and landed cost calculator pre-configured for ${country.name} imports.`;

    const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{
            role: "user",
            content: `Generate CTR-optimized SEO metadata for: ${context}
Return JSON:
{
  "title": "55-60 char meta title with primary keyword",
  "meta_description": "140-155 char meta description with CTA",
  "seo_h1": "Compelling H1 headline under 80 chars",
  "breadcrumb": ["Home", "${country.name}"${type === "calculator" ? ', "Import Duty Calculator"' : ""}],
  "canonical": "/${country.slug}${type === "calculator" ? "/import-duty-calculator" : ""}"
}
Return ONLY JSON.`
        }],
        temperature: 0.2,
        response_format: { type: "json_object" }
    });

    try {
        return JSON.parse(response.choices[0]?.message?.content || "{}");
    } catch {
        return {
            title: type === "hub"
                ? `Import Duty & Customs Guide for ${country.name} | 2026`
                : `${country.name} Import Duty Calculator | 2026`,
            meta_description: `Calculate exact import duties, ${country.vatLabel}, and landed costs for ${country.name}.`,
            seo_h1: type === "hub"
                ? `Complete Import Duty Guide for ${country.name}`
                : `${country.name} Import Duty Calculator`,
        };
    }
}

// Step 4 (Gemma normalization) removed — decommissioned by Groq.
// JSON from Llama-70b is already valid and well-structured.

// ============================================================
// Full Pipeline for One Country
// ============================================================

async function processCountry(country: CountryEntry): Promise<void> {
    try {
        // Check if already exists
        const { data: existing } = await supabase
            .from("country_hubs")
            .select("country_code, hub_page")
            .eq("country_code", country.code)
            .maybeSingle();

        if (existing && (existing.hub_page as any)?.sections?.length > 0) {
            console.log(`⏭️  Skipping ${country.name} — already generated`);
            return;
        }

        console.log(`\n🌍 Processing ${country.name} (${country.code})...`);

        // Step 1: Keywords
        console.log(`   🔑 Step 1/4: Keyword clustering (Mixtral)...`);
        const keywords = await generateKeywords(country);

        // Step 2: Content
        console.log(`   ✍️  Step 2/4: Hub content (Llama-70b)...`);
        const hubContent = await generateHubContent(country, keywords);

        console.log(`   🧮 Step 2b/4: Calculator content (Llama-70b)...`);
        const calcContent = await generateCalculatorContent(country, keywords);

        // Step 3: Metadata
        console.log(`   🏷️  Step 3/4: Metadata (Llama-8b)...`);
        const hubMeta = await generateMetadata(country, "hub");
        const calcMeta = await generateMetadata(country, "calculator");

        // Assemble hub page
        const hubPage = {
            url: `/${country.slug}/`,
            ...hubMeta,
            primary_keywords: keywords.primary_keywords || [],
            secondary_keywords: keywords.secondary_keywords || [],
            vat_keywords: keywords.vat_keywords || [],
            compliance_keywords: keywords.compliance_keywords || [],
            sections: hubContent.sections || [],
            faq: hubContent.faq || [],
            schema_notes: `FAQPage + BreadcrumbList + WebPage schema for ${country.name} import guide`,
            internal_links: [
                { url: `/${country.slug}/import-duty-calculator/`, text: `${country.name} Import Duty Calculator` },
                { url: "/", text: "Global Landed Cost Calculator" }
            ]
        };

        // Assemble calculator page
        const calculatorPage = {
            url: `/${country.slug}/import-duty-calculator/`,
            ...calcMeta,
            primary_keywords: keywords.calculator_keywords || [],
            secondary_keywords: keywords.hs_code_keywords || [],
            calculator_default_country: country.code,
            sections: calcContent.sections || [],
            faq: calcContent.faq || [],
            schema_notes: `SoftwareApplication + FAQPage + BreadcrumbList schema for ${country.name} calculator`,
            UI_notes: calcContent.UI_notes || [],
            internal_links: [
                { url: `/${country.slug}/`, text: `${country.name} Import Duty Guide` },
                { url: "/", text: "Global Landed Cost Calculator" }
            ]
        };

        // Upsert to Supabase (no Gemma normalization — direct save)
        const { error } = await supabase.from("country_hubs").upsert({
            country_code: country.code,
            country_name: country.name,
            country_slug: country.slug,
            hub_page: hubPage,
            calculator_page: calculatorPage,
            generation_model: "multi-model-pipeline",
        }, { onConflict: "country_code" });

        if (error) {
            console.error(`   ❌ DB Error for ${country.name}:`, error.message);
        } else {
            console.log(`   ✅ ${country.name} — Hub + Calculator pages generated!`);
        }
    } catch (err: any) {
        console.error(`   ❌ FATAL for ${country.name}:`, err.message);
    }
}

// ============================================================
// Main Batcher — 25 pages/sec rate limit
// ============================================================

async function main() {
    console.log("🚀 Country Hub Generator — Multi-Model Pipeline");
    console.log(`   📊 Countries: ${COUNTRIES.length}`);
    console.log(`   🤖 Models: Mixtral-8x7b → Llama-70b → Llama-8b → Gemma-9b`);
    console.log(`   ⏱️  Rate: 5 countries/batch with 2s delay\n`);

    const BATCH_SIZE = 5;
    let processed = 0;

    for (let i = 0; i < COUNTRIES.length; i += BATCH_SIZE) {
        const batch = COUNTRIES.slice(i, i + BATCH_SIZE);
        console.log(`\n============== BATCH ${Math.floor(i / BATCH_SIZE) + 1} / ${Math.ceil(COUNTRIES.length / BATCH_SIZE)} ==============`);

        await Promise.all(batch.map(c => processCountry(c)));
        processed += batch.length;

        console.log(`\n   📈 Progress: ${processed}/${COUNTRIES.length} countries`);

        if (i + BATCH_SIZE < COUNTRIES.length) {
            console.log(`   ⏸️  Rate limit pause (2s)...`);
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    console.log(`\n🎉 COMPLETE! Generated ${processed} country hubs.`);
}

main().catch(console.error);
