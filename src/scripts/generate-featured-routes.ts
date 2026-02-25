import { createClient } from "@supabase/supabase-js";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GROQ_API_KEY = process.env.GROQ_API_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const groq = new Groq({ apiKey: GROQ_API_KEY });

const FEATURED_ROUTES = [
    { slug: "china-to-pakistan-duty", product: "General Imports", origin: "CN", dest: "PK", category: "General", kw: "China to Pakistan Import Duty 2026" },
    { slug: "eu-to-us-machinery", product: "Industrial Machinery", origin: "EU", dest: "US", category: "Industrial", kw: "EU to US Machinery Tariffs" },
    { slug: "japan-to-gb-electronics", product: "Consumer Electronics", origin: "JP", dest: "GB", category: "Electronics", kw: "Japan to UK Electronics Post-Brexit" },
    { slug: "mexico-to-canada-automotive", product: "Automotive Parts", origin: "MX", dest: "CA", category: "Automotive", kw: "Mexico to Canada USMCA Routes Automotive" },
    { slug: "india-to-us-textiles", product: "Textiles and Apparel", origin: "IN", dest: "US", category: "Textiles", kw: "India to US Textile Quotas and Duties" },
    { slug: "gb-to-eu-exports", product: "General Exports", origin: "GB", dest: "EU", category: "General", kw: "UK to EU Export Controls and Tariffs" },
];

async function generateFeaturedRoute(route: any) {
    console.log(`\n⏳ Generating Featured Route: /calculate/${route.slug} ...`);

    try {
        // Step 1: Generate Content
        const prompt = `You are a Senior Customs Compliance Expert and Technical SEO Writer.
Write a highly detailed SEO landing page JSON object for the trade route: "${route.product}" from ${route.origin} to ${route.dest}.
Primary Keyword focus: "${route.kw}"

Return ONLY valid JSON with these keys:
{
    "seo_h1": "Compelling H1 title (under 80 chars)",
    "semantic_h2_problem": "250-300 word detailed explanation of the compliance challenges for this specific route and product category.",
    "seo_h2_intent": "250-300 words explaining how to successfully import/export this. Include specific tax/tariff numbers if known, or required certs like USMCA or Brexit rules.",
    "seo_h3_technical": "150-200 words on technical compliance for this product.",
    "semantic_h2_solution": "250-300 word step-by-step guide.",
    "faqs_json": [ 5 highly specific FAQs with { "question": "", "answer": "" } ],
    "seo_title": "Title tag (under 60 chars)",
    "seo_description": "Meta description (under 155 chars)"
}`;

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
            response_format: { type: "json_object" }
        });

        const content = JSON.parse(response.choices[0]?.message?.content || "{}");

        // Set realistic static tax data for these display pages
        const taxData = {
            productValue: { label: "Product Value", amount: "50000.00", currency: "USD" },
            shippingCost: { label: "Shipping", amount: "3500.00", currency: "USD" },
            insuranceCost: { label: "Insurance", amount: "250.00", currency: "USD" },
            cifValue: { label: "CIF Value", amount: "53750.00", currency: "USD" },
            customsDuty: { label: "Customs Duty", amount: "4300.00", currency: "USD", rate: "8.0%" },
            additionalDuties: [],
            processingFees: [],
            nationalHandling: null,
            vatGst: { label: "VAT/GST", amount: "11610.00", currency: "USD", rate: "20.0%" },
            totalLandedCost: { label: "Total Landed Cost", amount: "69660.00", currency: "USD" },
            deMinimisApplied: false,
            calculatedAt: new Date().toISOString(),
            raw: { productValue: 50000, shippingCost: 3500, insuranceCost: 250, cifValue: 53750, customsDuty: 4300, vatAmount: 11610, totalLandedCost: 69660, htsId: null }
        };

        const payload = {
            session_id: crypto.randomUUID(),
            product_description: route.product,
            origin_country: route.origin,
            destination_country: route.dest,
            product_value: taxData.raw.productValue,
            currency: "USD",
            shipping_cost: taxData.raw.shippingCost,
            insurance_cost: taxData.raw.insuranceCost,
            cif_value: taxData.raw.cifValue,
            customs_duty: taxData.raw.customsDuty,
            vat_amount: taxData.raw.vatAmount,
            total_landed_cost: taxData.raw.totalLandedCost,
            calculation_json: taxData,
            slug: route.slug,
            seo_title: content.seo_title,
            seo_description: content.seo_description,
            seo_h1: content.seo_h1,
            semantic_h2_problem: content.semantic_h2_problem,
            semantic_h2_solution: content.semantic_h2_solution,
            seo_h2_intent: content.seo_h2_intent,
            seo_h3_technical: content.seo_h3_technical,
            faqs_json: content.faqs_json,
            needs_human_review: false
        };

        const { error } = await supabase.from('landed_costs').upsert(payload, { onConflict: 'slug' });
        if (error) throw error;

        console.log(`✅ Success: ${route.slug}`);
    } catch (err) {
        console.error(`❌ Failed: ${route.slug}`, err);
    }
}

async function run() {
    console.log("🚀 Initializing Dedicated Featured Route Generator...");
    for (const route of FEATURED_ROUTES) {
        await generateFeaturedRoute(route);
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log("\nDone!");
}

run();
