import { createClient } from "@supabase/supabase-js";
import Groq from "groq-sdk";
import pLimit from "p-limit";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GROQ_API_KEY = process.env.GROQ_API_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const groq = new Groq({ apiKey: GROQ_API_KEY });
const limit = pLimit(20);

const ORIGINS = [
    { code: "CN", name: "China" },
    { code: "US", name: "US" },
    { code: "GB", name: "UK" },
    { code: "EU", name: "EU" },
    { code: "DE", name: "Germany" },
    { code: "JP", name: "Japan" },
    { code: "MX", name: "Mexico" },
    { code: "CA", name: "Canada" },
    { code: "IN", name: "India" },
    { code: "VN", name: "Vietnam" },
    { code: "TW", name: "Taiwan" },
    { code: "KR", name: "South Korea" },
    { code: "PK", name: "Pakistan" },
    { code: "AE", name: "UAE" },
    { code: "BR", name: "Brazil" },
    { code: "AU", name: "Australia" },
    { code: "SG", name: "Singapore" }
];

const DESTINATIONS = [
    { code: "US", name: "US" },
    { code: "GB", name: "UK" },
    { code: "EU", name: "EU" },
    { code: "DE", name: "Germany" },
    { code: "CA", name: "Canada" },
    { code: "MX", name: "Mexico" },
    { code: "AU", name: "Australia" },
    { code: "JP", name: "Japan" },
    { code: "AE", name: "UAE" },
    { code: "SG", name: "Singapore" },
    { code: "PK", name: "Pakistan" },
    { code: "SA", name: "Saudi Arabia" }
];

const INDUSTRIES = [
    { id: "electronics", category: "Electronics", product: "Consumer Electronics", focus: "Import Duty" },
    { id: "automotive", category: "Automotive", product: "Automotive Parts", focus: "Tariffs" },
    { id: "machinery", category: "Industrial", product: "Industrial Machinery", focus: "Customs" },
    { id: "textiles", category: "Textiles", product: "Textiles and Apparel", focus: "Quotas and Duties" },
    { id: "medical", category: "Medical", product: "Medical Devices", focus: "Import Regulations" },
    { id: "energy", category: "Energy", product: "Renewable Energy Components", focus: "Tariffs" },
    { id: "steel", category: "Industrial", product: "Steel and Aluminum", focus: "Import Duty" }
];

async function generateSemanticRoute(origin: any, dest: any, industry: any) {
    const slugBase = `${origin.name}-to-${dest.name}-${industry.id}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const slug = `${slugBase}-${industry.focus.toLowerCase().split(' ')[0]}`;
    const kw = `${origin.name} to ${dest.name} ${industry.product} ${industry.focus} 2026`;

    // Fast check: skip if it exists
    const { data: existing } = await supabase.from('landed_costs').select('id').eq('slug', slug).maybeSingle();
    if (existing) {
        // console.log(`⏭️ Skipped: ${slug}`);
        return;
    }

    try {
        const prompt = `You are a Senior Customs Compliance Expert and Technical SEO Writer.
Write a highly detailed SEO landing page JSON object for the trade route: "${industry.product}" from ${origin.name} to ${dest.name}.
Primary Keyword focus: "${kw}"

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

        // Set realistic static tax data depending on industry
        let value = 15000;
        if (industry.id === "electronics" || industry.id === "machinery") value = 80000;
        if (industry.id === "automotive") value = 45000;

        const dutyRate = 8.5; // placeholder
        const vatRate = 20.0;
        const customsDuty = value * (dutyRate / 100);
        const vatAmount = (value + customsDuty) * (vatRate / 100);
        const total = value + customsDuty + vatAmount;

        const taxData = {
            productValue: { label: "Product Value", amount: value.toFixed(2), currency: "USD" },
            shippingCost: { label: "Shipping", amount: "1200.00", currency: "USD" },
            insuranceCost: { label: "Insurance", amount: "150.00", currency: "USD" },
            cifValue: { label: "CIF Value", amount: (value + 1350).toFixed(2), currency: "USD" },
            customsDuty: { label: "Customs Duty", amount: customsDuty.toFixed(2), currency: "USD", rate: `${dutyRate}%` },
            additionalDuties: [],
            processingFees: [],
            nationalHandling: null,
            vatGst: { label: "VAT/GST", amount: vatAmount.toFixed(2), currency: "USD", rate: `${vatRate}%` },
            totalLandedCost: { label: "Total Landed Cost", amount: total.toFixed(2), currency: "USD" },
            deMinimisApplied: false,
            calculatedAt: new Date().toISOString(),
            raw: { productValue: value, shippingCost: 1200, insuranceCost: 150, cifValue: value + 1350, customsDuty, vatAmount, totalLandedCost: total, htsId: null }
        };

        const payload = {
            session_id: crypto.randomUUID(),
            product_description: industry.product,
            origin_country: origin.code,
            destination_country: dest.code,
            product_value: value,
            currency: "USD",
            shipping_cost: 1200,
            insurance_cost: 150,
            cif_value: value + 1350,
            customs_duty: customsDuty,
            vat_amount: vatAmount,
            total_landed_cost: total,
            calculation_json: taxData,
            slug: slug,
            seo_title: content.seo_title?.slice(0, 60),
            seo_description: content.seo_description?.slice(0, 155),
            seo_h1: content.seo_h1?.slice(0, 80),
            semantic_h2_problem: content.semantic_h2_problem,
            semantic_h2_solution: content.semantic_h2_solution,
            seo_h2_intent: content.seo_h2_intent,
            seo_h3_technical: content.seo_h3_technical,
            faqs_json: content.faqs_json,
            needs_human_review: false
        };

        const { error } = await supabase.from('landed_costs').upsert(payload, { onConflict: 'slug' });
        if (error) {
            console.error(`❌ DB Error on ${slug}:`, error.message);
        } else {
            console.log(`✅ Success: ${slug}`);
        }
    } catch (err: any) {
        console.error(`❌ Failed: ${slug} -> ${err.message}`);
    }
}

async function run() {
    console.log("🚀 Initializing Semantic SEO Route Generator (1000s of 'Featured' Pages)...");

    const tasks: (() => Promise<void>)[] = [];

    for (const origin of ORIGINS) {
        for (const dest of DESTINATIONS) {
            if (origin.code === dest.code) continue; // Skip domestic
            for (const industry of INDUSTRIES) {
                tasks.push(() => limit(() => generateSemanticRoute(origin, dest, industry)));
            }
        }
    }

    console.log(`📦 Loaded ${tasks.length} combinations into batcher.`);

    const BATCH_SIZE = 20;
    for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
        console.log(`\n============== BATCH ${Math.floor(i / BATCH_SIZE) + 1} (${i}/${tasks.length}) ==============`);
        if (i > 0) {
            console.log(`⏸️ Rate limit: Pausing for 1 second...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        const batch = tasks.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(fn => fn()));
    }

    console.log("\n🚀 Semantic Generation Complete!");
}

run();
