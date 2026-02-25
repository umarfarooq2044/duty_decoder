import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import Groq from "groq-sdk";
import crypto from "crypto";

// ============================================================
// Env & Clients
// ============================================================
// Load environment from .env.local if not available
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GROQ_API_KEY = process.env.GROQ_API_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !GROQ_API_KEY) {
    console.error("Missing required environment variables.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const groq = new Groq({ apiKey: GROQ_API_KEY });

// ============================================================
// Data Matrices
// ============================================================

const PRODUCTS = [
    // 10 sample high-volume commodities for demonstration (scale up to 200 in prod)
    "Surgical Tools",
    "Leather Apparel",
    "Lithium-ion Batteries",
    "Industrial Valves",
    "Electric Bicycles",
    "Smartphone Cases",
    "Solar Panels",
    "Stainless Steel Fasteners",
    "Automotive Brake Pads",
    "Cosmetic Packaging"
];

const ORIGINS = ["CN", "PK", "IN", "TR", "US", "DE", "KR"]; // Reduced to 7 for testing
const DESTINATIONS = ["US", "GB", "EU", "PK"];

// ============================================================
// Helpers
// ============================================================

function generateSlug(product: string, origin: string, destination: string): string {
    const base = `import-${product}-from-${origin}-to-${destination}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    return `${base}-${crypto.randomUUID().slice(0, 6)}`;
}

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// AI Inference Functions
// ============================================================

async function generateMarketInsight(product: string, origin: string, destination: string): Promise<string> {
    const prompt = `Write a 150-word 'Market Compliance Insight' for importing ${product} from ${origin} to ${destination}. Focus on specific 2026 customs alerts, required certifications (CE, FDA, etc.), or documentation needs. Be professional and highly specific.`;

    const response = await groq.chat.completions.create({
        model: "meta-llama/llama-4-maverick-17b-128e-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_completion_tokens: 300,
    });

    return response.choices[0]?.message?.content || "";
}

async function generateSeoMetadata(product: string, origin: string, destination: string) {
    const prompt = `Generate a high-click-through SEO Meta Title (max 60 chars) and an SEO Meta Description (max 160 chars) for a landing page about calculating the import duty and landed cost of ${product} from ${origin} to ${destination}. Return JSON format ONLY with keys "title" and "description".`;

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: "You output only valid JSON, no markdown formatting." },
            { role: "user", content: prompt }
        ],
        temperature: 0.5,
        response_format: { type: "json_object" }
    });

    try {
        const result = JSON.parse(response.choices[0]?.message?.content || "{}");
        return {
            title: result.title?.slice(0, 100) || `Import Duty & Landed Cost: ${product} (${origin} to ${destination})`,
            description: result.description?.slice(0, 200) || `Calculate exact 2026 customs duties and landed costs for importing ${product} from ${origin} to ${destination}.`
        };
    } catch (e) {
        return {
            title: `Import Duty & Landed Cost: ${product} (${origin} to ${destination})`,
            description: `Calculate the latest 2026 customs duties, VAT, and shipping costs for importing ${product} from ${origin} to ${destination}.`
        };
    }
}

// ============================================================
// Core Execution Loop
// ============================================================

async function processRoute(product: string, origin: string, dest: string) {
    console.log(`\n⏳ Processing: ${product} | ${origin} -> ${dest}`);

    // Simulate internal standard calculation logic 
    // (In production, you'd call your internal calculateLandedCost function directly here to get real duties)
    const productValue = 5000;
    const shippingCost = 800;
    const insuranceCost = 50;
    const cifValue = productValue + shippingCost + insuranceCost;
    const customsDuty = cifValue * 0.12; // Placeholder 12%
    const vatAmount = (cifValue + customsDuty) * 0.20; // Placeholder 20%
    const totalLandedCost = cifValue + customsDuty + vatAmount;

    // 1. AI Generation
    const [insight, seo] = await Promise.all([
        generateMarketInsight(product, origin, dest),
        generateSeoMetadata(product, origin, dest)
    ]);

    // 2. Build record
    const slug = generateSlug(product, origin, dest);
    const mockCalculationJson = {
        productValue: { label: "Product Value", amount: productValue.toFixed(2), currency: "USD" },
        shippingCost: { label: "Shipping", amount: shippingCost.toFixed(2), currency: "USD" },
        insuranceCost: { label: "Insurance", amount: insuranceCost.toFixed(2), currency: "USD" },
        cifValue: { label: "CIF Value", amount: cifValue.toFixed(2), currency: "USD" },
        customsDuty: { label: "Customs Duty", amount: customsDuty.toFixed(2), currency: "USD", rate: "12%" },
        additionalDuties: [],
        processingFees: [],
        vatGst: { label: "VAT/GST", amount: vatAmount.toFixed(2), currency: "USD", rate: "20%" },
        totalLandedCost: { label: "Total Landed Cost", amount: totalLandedCost.toFixed(2), currency: "USD" },
        deMinimisApplied: false,
        calculatedAt: new Date().toISOString()
    };

    const record = {
        session_id: crypto.randomUUID(), // System pseudo-session
        product_description: product,
        origin_country: origin,
        destination_country: dest,
        product_value: productValue,
        currency: "USD",
        shipping_cost: shippingCost,
        insurance_cost: insuranceCost,
        cif_value: cifValue,
        customs_duty: customsDuty,
        vat_amount: vatAmount,
        total_landed_cost: totalLandedCost,
        calculation_json: mockCalculationJson,
        slug: slug,
        seo_title: seo.title,
        seo_description: seo.description,
        market_insight: insight
    };

    // 3. Upsert to Supabase
    const { error } = await supabase.from("landed_costs").insert(record);
    if (error) {
        console.error(`❌ DB Insert Error for ${slug}:`, error.message);
    } else {
        console.log(`✅ Success: ${slug}`);
    }
}

async function runSeeder() {
    console.log("🚀 Starting Programmatic SEO Seeder...");

    // Create matrix combinations
    const matrix = [];
    for (const prod of PRODUCTS) {
        for (const org of ORIGINS) {
            for (const dst of DESTINATIONS) {
                if (org !== dst) {
                    matrix.push({ prod, org, dst });
                }
            }
        }
    }

    console.log(`📦 Total generated routes in matrix: ${matrix.length}`);

    // For safety and testing, limit to first 5 items
    const BATCH_SIZE = 5;
    const testMatrix = matrix.slice(0, 5); // ONLY 5 for immediate testing

    for (const route of testMatrix) {
        try {
            await processRoute(route.prod, route.org, route.dst);
            // Exponential backoff logic simulation for Groq limits
            await sleep(2000);
        } catch (e: any) {
            console.error(`Error processing route: ${e.message}`);
        }
    }

    console.log("\n✨ Seeding batch complete!");
}

runSeeder();
