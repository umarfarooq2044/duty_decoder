import { createClient } from "@supabase/supabase-js";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GROQ_API_KEY = process.env.GROQ_API_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const groq = new Groq({ apiKey: GROQ_API_KEY });

const FEATURED_SLUGS = [
    "china-to-pakistan-duty",
    "eu-to-us-machinery",
    "japan-to-gb-electronics",
    "mexico-to-canada-automotive",
    "india-to-us-textiles",
    "gb-to-eu-exports"
];

const COUNTRY_NAMES: Record<string, string> = {
    CN: "China", US: "US", GB: "UK", EU: "EU", DE: "Germany",
    JP: "Japan", MX: "Mexico", CA: "Canada", IN: "India",
    VN: "Vietnam", TW: "Taiwan", KR: "South Korea", PK: "Pakistan",
    AE: "UAE", BR: "Brazil", AU: "Australia", SG: "Singapore", SA: "Saudi Arabia"
};

async function processSeoUpdate(row: any) {
    const origin = COUNTRY_NAMES[row.origin_country] || row.origin_country;
    const dest = COUNTRY_NAMES[row.destination_country] || row.destination_country;
    const product = row.product_description;

    try {
        const prompt = `Act as an Enterprise SEO Director with 20+ years of experience specializing in B2B supply chain, customs compliance, and international trade rankings.
I need you to perform deep keyword research and craft the perfect on-page SEO metadata for a software calculator landing page.

Topic: Importing ${product} from ${origin} to ${dest}.
Goal: Capture extremely high-intent, bottom-of-funnel traffic looking to calculate exact 2026 import duties, tariffs, and landed costs for this specific route.

Return ONLY a raw JSON object containing these three optimized keys:
{
    "seo_h1": "The main H1 headline. Must be highly compelling, intent-driven, and include the primary keywords. Under 80 chars.",
    "seo_title": "The exact Meta Title tag. Must be mathematically perfect for Click-Through Rate (CTR). Keep it under 60 characters to avoid Google truncation. Use separators like | or - if needed.",
    "seo_description": "The Meta Description. Must be under 155 characters. It must contain secondary LSI keywords like 'VAT', 'HTS codes', or 'customs clearance' and end with a strong Call to Action (CTA)."
}`;

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        const content = JSON.parse(response.choices[0]?.message?.content || "{}");

        if (!content.seo_h1 || !content.seo_title || !content.seo_description) {
            throw new Error("AI returned malformed JSON");
        }

        const { error: updateError } = await supabase
            .from('landed_costs')
            .update({
                seo_title: content.seo_title.slice(0, 70), // safety bound
                seo_description: content.seo_description.slice(0, 160), // safety bound
                seo_h1: content.seo_h1
            })
            .eq('id', row.id);

        if (updateError) throw updateError;

        console.log(`✅ AI Optimized: ${row.slug}`);
    } catch (err: any) {
        console.error(`❌ Failed: ${row.slug} -> ${err.message}`);
    }
}

async function run() {
    console.log("🚀 Verifying SEO Metadata for Featured Routes...");

    let { data: rows, error: fetchError } = await supabase
        .from('landed_costs')
        .select('id, origin_country, destination_country, product_description, slug, seo_title')
        .in('slug', FEATURED_SLUGS);

    if (fetchError || !rows) {
        console.error("Error fetching rows:", fetchError);
        return;
    }

    console.log(`📦 Found ${rows.length} Featured pages.`);

    for (const row of rows) {
        console.log(`\n⏳ Checking ${row.slug}...`);
        console.log(`Current Title: ${row.seo_title}`);

        // Force an update to ensure the 70B model generated a perfect title for these hero routes
        await processSeoUpdate(row);
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`\n🎉 Featured Routes Guaranteed Optimized!`);
}

run();
