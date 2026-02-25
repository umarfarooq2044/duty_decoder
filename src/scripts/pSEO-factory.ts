import { createClient } from "@supabase/supabase-js";
import Groq from "groq-sdk";
import pLimit from "p-limit";
import crypto from "crypto";
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
const limit = pLimit(20);

// ============================================================
// 1. Data Matrix (200 Products)
// ============================================================
const CATEGORIZED_PRODUCTS = {
    MEDICAL: [
        "Surgical Scissors", "Dental Implants", "MRI Components", "Ultrasound Scanners", "Dialysis Consumables",
        "Endoscopic Cameras", "Lab Centrifuges", "Ophthalmic Lasers", "Cardiac Stents", "Infusion Pumps",
        "Surgical Masks", "Medical Ventilators", "Blood Glucose Meters", "Patient Monitors", "Defibrillators",
        "Syringes", "Catheters", "Wheelchairs", "Medical Gloves", "Orthopedic Braces",
        "Hearing Aids", "CPAP Machines", "Anesthesia Machines", "EKG Machines", "Surgical Sutures",
        "Bone Grafts", "Pulse Oximeters", "Dialysis Machines", "Pacemakers", "Cochlear Implants",
        "Blood Pressure Monitors", "Oxygen Concentrators", "Surgical Microscopes", "Medical Turbines", "Hernia Meshes",
        "Prosthetic Limbs", "Endoscopes", "Mammography Machines", "Fluoroscopy Systems", "Dental Chairs"
    ],
    INDUSTRIAL: [
        "CNC Milling", "3D Printers", "Hydraulic Pumps", "Laser Cutters", "Air Compressors",
        "Forklift Parts", "Injection Molding", "Transformers", "Boilers", "Welding Robots",
        "Packaging Machines", "Conveyor Belts", "Industrial Mixers", "Heat Exchangers", "Cranes",
        "Excavators", "Lathes", "Industrial Valves", "Centrifugal Pumps", "Bulldozers",
        "Tractors", "Industrial Fans", "Ball Bearings", "Steel Pipes", "Electric Motors",
        "Gearboxes", "Chainsaws", "Cement Mixers", "Scaffolding", "Safety Harnesses",
        "Hard Hats", "Industrial Goggles", "Water Treatment Filters", "Air Scrubbers", "Industrial Generators",
        "Pallet Jacks", "Hoists", "Grinding Machines", "Industrial Shredders", "Press Brakes"
    ],
    ENERGY: [
        "Solar Panels", "Lithium Batteries", "Solar Inverters", "Wind Turbine Blades", "EV Chargers",
        "Hydrogen Fuel Cells", "Portable Power Stations", "Smart Grid Meters", "Geothermal Heat Pumps", "Biofuel Generators",
        "Nuclear Reactor Coolants", "Tidal Turbines", "Hydroelectric Generators", "Capacitor Banks", "High Voltage Cables",
        "Gas Turbines", "Steam Turbines", "Electrical Relays", "Photovoltaic Arrays", "Solar Trackers",
        "Battery Energy Storage Systems", "EV Charging Cables", "Smart Inverters", "Anemometers", "Pelton Wheels",
        "Biogas Digesters", "Coal Centrifuges", "Thermal Energy Storage", "Fuel Cell Membranes", "Wind Turbine Gearboxes",
        "Substation Transformers", "Surge Protectors", "Power Conditioners", "Solar Water Heaters", "Pyranometers",
        "Charge Controllers", "Off-Grid Inverters", "Wind Vanes", "Current Transformers", "Voltage Regulators"
    ],
    ELECTRONICS: [
        "GPUs", "AI Servers", "Network Switches", "Thermal Cameras", "Oscilloscopes",
        "Cinema Cameras", "Fiber Optics", "PLC Controllers", "SSD Storage", "POS Terminals",
        "Smartphones", "Laptops", "Tablets", "Smartwatches", "VR Headsets",
        "Drones", "Digital Cameras", "Microphones", "Headphones", "Bluetooth Speakers",
        "Computer Monitors", "Keyboards", "Microcontrollers", "Transistors", "Diodes",
        "PCB Boards", "Resistors", "Capacitors", "Inductors", "RF Amplifiers",
        "Wi-Fi Routers", "Modems", "GPS Receivers", "Security Cameras", "Smart Thermostats",
        "E-readers", "Projectors", "Webcams", "Motherboards", "RAM Modules"
    ],
    TEXTILES_LEATHER: [
        "Leather Jackets", "Silk Carpets", "Cashmere Sweaters", "Surgical Scrubs", "Fire Retardant Workwear",
        "Terry Towels", "Denim Jeans", "Tactical Boots", "Cotton T-Shirts", "Wool Coats",
        "Leather Belts", "Silk Scarves", "Polyester Blankets", "Nylon Tents", "Spandex Leggings",
        "Linen Shirts", "Velvet Dresses", "Canvas Bags", "Leather Wallets", "Suede Shoes",
        "Merino Wool Socks", "Chiffon Blouses", "Rayon Skirts", "Flannel Shirts", "Satin Sheets",
        "Hemp Rope", "Neoprene Wetsuits", "Kevlar Vests", "Fleece Jackets", "Corduroy Pants",
        "Modal Underwear", "Lace Curtains", "Viscose Rugs", "Leather Sofas", "Microfiber Cloths",
        "GORE-TEX Jackets", "Jute Bags", "Tweed Suits", "Angora Sweaters", "Mohair Blankets"
    ]
};

const ORIGINS = ["CN", "PK", "VN", "TR", "IN", "DE", "JP", "US", "AE", "BR"];
const DESTINATIONS = ["US", "GB", "DE", "FR", "AE", "SA", "PK", "AU", "CA", "SG"];

// ============================================================
// Helpers
// ============================================================

function generateSlug(category: string, product: string, origin: string, destination: string): string {
    const base = `${category}-${product}-from-${origin}-to-${destination}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    return base;
}

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

// ============================================================
// Internal Real-time Calculation Logics
// ============================================================

async function fetchInternalTaxData(product: string, dest: string, origin: string) {
    const { data: htsData } = await supabase
        .from("hts_codes")
        .select("*")
        .eq("country_code", dest)
        .eq("is_active", true)
        .textSearch("search_vector", product.split(/\s+/).filter(t => t.length > 2).join(" & "), { type: "plain" })
        .limit(1)
        .single();

    let nationalHandling = 0;
    let nationalHandlingCurrency = "USD";
    if (["DE", "FR"].includes(dest)) {
        nationalHandling = 25.50;
        nationalHandlingCurrency = "EUR";
    }

    const productValue = 5000;
    const shippingCost = 800;
    const insuranceCost = 50;
    const cifValue = productValue + shippingCost + insuranceCost;

    const dutyRatePct = htsData?.duty_rate_pct ?? 10.5;
    const vatRatePct = htsData?.vat_rate_pct ?? 20.0;

    const customsDuty = cifValue * (dutyRatePct / 100);
    const vatAmount = (cifValue + customsDuty + nationalHandling) * (vatRatePct / 100);
    const totalLandedCost = cifValue + customsDuty + vatAmount + nationalHandling;

    return {
        productValue: { label: "Product Value", amount: productValue.toFixed(2), currency: "USD" },
        shippingCost: { label: "Shipping", amount: shippingCost.toFixed(2), currency: "USD" },
        insuranceCost: { label: "Insurance", amount: insuranceCost.toFixed(2), currency: "USD" },
        cifValue: { label: "CIF Value", amount: cifValue.toFixed(2), currency: "USD" },
        customsDuty: { label: "Customs Duty", amount: customsDuty.toFixed(2), currency: "USD", rate: `${dutyRatePct}%` },
        additionalDuties: [],
        processingFees: [],
        nationalHandling: nationalHandling > 0 ? { label: "Handling Fee", amount: nationalHandling.toFixed(2), currency: nationalHandlingCurrency } : null,
        vatGst: { label: "VAT/GST", amount: vatAmount.toFixed(2), currency: "USD", rate: `${vatRatePct}%` },
        totalLandedCost: { label: "Total Landed Cost", amount: totalLandedCost.toFixed(2), currency: "USD" },
        deMinimisApplied: false,
        cbamNotes: ["DE", "FR"].includes(dest) && ["Industrial Valves", "CNC Milling"].includes(product)
            ? "CBAM Registration required for EU importation of steel/aluminum products."
            : undefined,
        calculatedAt: new Date().toISOString(),
        raw: {
            productValue, shippingCost, insuranceCost, cifValue, customsDuty, vatAmount, totalLandedCost, htsId: htsData?.id || null
        }
    };
}

// ============================================================
// STEP A: Research Agent (Llama-4-Maverick)
// Discovers keywords, LSI terms, search intent, and exemptions
// ============================================================

interface SEOBlueprint {
    high_intent_keywords: string[];
    lsi_terms: string[];
    search_intent_questions: string[];
    tax_exemptions: string[];
    primary_keyword: string;
}

async function runResearchAgent(product: string, category: string, origin: string, dest: string): Promise<SEOBlueprint | null> {
    const researchPrompt = `Act as an SEO Data Scientist specializing in international trade compliance.

For the trade route: "${product}" (Category: ${category}) shipping from ${origin} to ${dest} in 2026.

Analyze the search landscape and return a JSON "SEO_Blueprint" with these exact keys:
{
    "primary_keyword": "The single most valuable keyword phrase for this page (e.g., 'import duty on solar panels to US 2026')",
    "high_intent_keywords": ["5 high-intent, long-tail keywords that importers/exporters would search for regarding this specific product and route"],
    "lsi_terms": ["3 Latent Semantic Indexing terms that Google associates with this product's trade compliance context"],
    "search_intent_questions": ["2 common questions that users ask when researching importing this product into ${dest}"],
    "tax_exemptions": ["Any known tax exemptions, Free Trade Agreements (FTAs), de minimis thresholds, or special duty programs applicable to ${product} on the ${origin}->${dest} corridor. Return empty array if none are known."]
}

Be specific to the product and route. Do NOT use generic placeholders.`;

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are an expert SEO data scientist. Output only valid JSON. No markdown." },
                { role: "user", content: researchPrompt }
            ],
            temperature: 0.4,
            max_completion_tokens: 1000,
            response_format: { type: "json_object" }
        });

        const parsed = JSON.parse(response.choices[0]?.message?.content || "{}");

        // Validate structure
        if (!parsed.primary_keyword || !parsed.high_intent_keywords?.length) {
            console.warn(`⚠️ Research Agent returned incomplete blueprint for ${product} (${origin}->${dest})`);
            return null;
        }

        return parsed as SEOBlueprint;
    } catch (error) {
        console.warn(`⚠️ Research Agent failed for ${product} (${origin}->${dest}). Will use fallback.`);
        return null;
    }
}

// ============================================================
// STEP B: Content Writer (Llama-3.3-70b-Versatile)
// Uses the SEO Blueprint context to generate rich content
// ============================================================

interface ContentOutput {
    seo_h1: string;
    semantic_h2_problem: string;
    seo_h2_intent: string;
    seo_h3_technical: string;
    semantic_h2_solution: string;
    faqs_json: { question: string; answer: string }[];
    seo_title: string;
    seo_description: string;
}

async function runContentWriter(
    product: string, category: string, origin: string, dest: string,
    blueprint: SEOBlueprint, taxData: any
): Promise<ContentOutput> {
    const contentPrompt = `You are a Senior Customs Compliance Expert and Technical SEO Writer.

You have been given an SEO Research Blueprint from a data scientist. Use this research to write premium, expert-level content for a trade compliance calculator page.

=== SEO RESEARCH BLUEPRINT ===
Primary Keyword: "${blueprint.primary_keyword}"
High-Intent Keywords: ${JSON.stringify(blueprint.high_intent_keywords)}
LSI Terms: ${JSON.stringify(blueprint.lsi_terms)}
Search Intent Questions: ${JSON.stringify(blueprint.search_intent_questions)}
Tax Exemptions/Special Programs: ${JSON.stringify(blueprint.tax_exemptions)}
=== END BLUEPRINT ===

Product: ${product} (${category})
Route: ${origin} → ${dest}
Duty Rate: ${taxData.customsDuty.rate}
VAT Rate: ${taxData.vatGst.rate}
Total Landed Cost: ${taxData.totalLandedCost.amount} ${taxData.totalLandedCost.currency}

Generate a JSON object with ALL of the following keys. EVERY text field must naturally weave in the 5 high-intent keywords and 3 LSI terms from the blueprint. Content must sound expert-written, NOT robotic.

{
    "seo_h1": "A compelling H1 heading that includes the primary keyword '${blueprint.primary_keyword}'. Must be under 80 characters.",
    "semantic_h2_problem": "250-300 word detailed explanation of WHY classifying ${product} correctly is difficult and what the risks are. Address the first Search Intent question: '${blueprint.search_intent_questions[0] || 'What are the compliance challenges?'}'. Weave in 3+ keywords from the blueprint naturally.",
    "seo_h2_intent": "250-300 word section that directly answers the second Search Intent question: '${blueprint.search_intent_questions[1] || 'How to import this product?'}'. Include specific regulatory bodies (FDA, CE, REACH, etc.) as applicable. Weave in 2+ LSI terms.",
    "seo_h3_technical": "150-200 word technical compliance breakdown specific to the ${category} category. Include tariff schedule references, required certifications, and any special handling requirements.",
    "semantic_h2_solution": "250-300 word step-by-step guide on how to successfully import ${product} into ${dest}. Include specific documents needed. Reference any tax exemptions from the blueprint if applicable.",
    "faqs_json": [
        {"question": "FAQ derived from blueprint search intent question 1", "answer": "Expert answer (40-60 words) weaving in a keyword"},
        {"question": "FAQ derived from blueprint search intent question 2", "answer": "Expert answer (40-60 words) weaving in a keyword"},
        {"question": "FAQ about the specific duty rate for ${product}", "answer": "Expert answer with actual rate data"},
        {"question": "FAQ about required documents for ${origin} to ${dest}", "answer": "Expert answer listing specific documents"},
        {"question": "FAQ about exemptions or special programs", "answer": "Expert answer referencing blueprint tax_exemptions data"}
    ],
    "seo_title": "Compelling Title Tag with primary keyword (STRICTLY UNDER 60 CHARACTERS)",
    "seo_description": "Actionable Meta Description with keyword (STRICTLY UNDER 155 CHARACTERS)"
}`;

    const fallback: ContentOutput = {
        seo_h1: `${blueprint.primary_keyword.charAt(0).toUpperCase() + blueprint.primary_keyword.slice(1)}`,
        semantic_h2_problem: `Understanding the customs classification for ${product} is critical for avoiding border delays and penalties. Importers shipping from ${origin} to ${dest} must navigate complex tariff schedules.`,
        seo_h2_intent: `When importing ${product} into ${dest}, traders must consider the applicable HTS classification, duty rates, and required documentation to ensure smooth customs clearance.`,
        seo_h3_technical: `The ${category} sector is subject to specific regulatory oversight. Products in this category require precise tariff classification under the Harmonized System.`,
        semantic_h2_solution: `To successfully import ${product} from ${origin} to ${dest}, ensure you have a commercial invoice, packing list, bill of lading, and certificates of origin.`,
        faqs_json: blueprint.search_intent_questions.map(q => ({ question: q, answer: `This depends on the specific HTS classification and current ${dest} trade regulations for ${product}.` })),
        seo_title: `Import Duty on ${product} | ${origin} to ${dest} 2026`,
        seo_description: `Calculate 2026 landed cost for ${product} from ${origin} to ${dest}.`
    };

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are an expert customs compliance writer. Output only valid JSON. No markdown formatting." },
                { role: "user", content: contentPrompt }
            ],
            temperature: 0.6,
            max_completion_tokens: 3500,
            response_format: { type: "json_object" }
        });

        const parsed = JSON.parse(response.choices[0]?.message?.content || "{}");
        return {
            seo_h1: parsed.seo_h1 || fallback.seo_h1,
            semantic_h2_problem: parsed.semantic_h2_problem || fallback.semantic_h2_problem,
            seo_h2_intent: parsed.seo_h2_intent || fallback.seo_h2_intent,
            seo_h3_technical: parsed.seo_h3_technical || fallback.seo_h3_technical,
            semantic_h2_solution: parsed.semantic_h2_solution || fallback.semantic_h2_solution,
            faqs_json: parsed.faqs_json?.length ? parsed.faqs_json : fallback.faqs_json,
            seo_title: parsed.seo_title || fallback.seo_title,
            seo_description: parsed.seo_description || fallback.seo_description,
        };
    } catch (error) {
        console.warn(`⚠️ Content Writer failed for ${product}. Using fallbacks.`);
        return fallback;
    }
}

// ============================================================
// Main Processing Pipeline (Two-Step Inference)
// ============================================================

async function processSeoPage(product: string, category: string, origin: string, dest: string) {
    try {
        // 0. Pre-check: Skip if we already generated this (avoids RLS update issues with anon keys)
        let slug = generateSlug(category, product, origin, dest);

        let { data: existing } = await supabase.from('landed_costs').select('product_description, origin_country, destination_country, seo_h1, calculation_json').eq('slug', slug).maybeSingle();

        // Handle collision
        if (existing && (existing.product_description !== product || existing.origin_country !== origin || existing.destination_country !== dest)) {
            slug = `${slug}-customs`;
            const { data: existing2 } = await supabase.from('landed_costs').select('product_description, origin_country, destination_country, seo_h1, calculation_json').eq('slug', slug).maybeSingle();
            if (existing2 && (existing2.product_description !== product || existing2.origin_country !== origin || existing2.destination_country !== dest)) {
                slug = `${slug}-shipping`;
                existing = (await supabase.from('landed_costs').select('product_description, origin_country, destination_country, seo_h1, calculation_json').eq('slug', slug).maybeSingle()).data;
            } else {
                existing = existing2;
            }
        }

        // If it exists and already has an SEO payload, skip it!
        if (existing && (existing.seo_h1 || (existing.calculation_json as any)?._seo_h1)) {
            // console.log(`⏭️ Skipped: ${product} (${origin} -> ${dest}) | Already exists`);
            return;
        }

        // 1. Get Live 2026 Tax Data
        const taxData = await fetchInternalTaxData(product, dest, origin);

        // 2. STEP A: Research Agent (Llama-4-Maverick)
        const blueprint = await runResearchAgent(product, category, origin, dest);
        let needsHumanReview = false;

        // Fallback blueprint if Maverick returns nothing
        const effectiveBlueprint: SEOBlueprint = blueprint || {
            primary_keyword: `import duty on ${product.toLowerCase()} to ${dest.toLowerCase()} 2026`,
            high_intent_keywords: [
                `${product.toLowerCase()} import duty ${dest}`,
                `customs duty ${product.toLowerCase()} 2026`,
                `how to import ${product.toLowerCase()} to ${dest}`,
                `${product.toLowerCase()} HTS code ${dest}`,
                `landed cost ${product.toLowerCase()} from ${origin}`
            ],
            lsi_terms: ["tariff classification", "customs clearance fees", "import compliance"],
            search_intent_questions: [
                `What is the import duty on ${product} shipped to ${dest}?`,
                `What documents do I need to import ${product} from ${origin} to ${dest}?`
            ],
            tax_exemptions: []
        };

        if (!blueprint) {
            needsHumanReview = true;
            console.warn(`🔍 No blueprint for ${product} (${origin}->${dest}). Using general template. Flagged for review.`);
        }

        // 3. STEP B: Content Writer (Llama-3.3-70b-Versatile)
        const content = await runContentWriter(product, category, origin, dest, effectiveBlueprint, taxData);

        // Try with all new SEO columns first
        const fullPayload: Record<string, any> = {
            session_id: crypto.randomUUID(),
            product_description: product,
            matched_hts_id: taxData.raw.htsId,
            origin_country: origin,
            destination_country: dest,
            product_value: taxData.raw.productValue,
            currency: "USD",
            shipping_cost: taxData.raw.shippingCost,
            insurance_cost: taxData.raw.insuranceCost,
            cif_value: taxData.raw.cifValue,
            customs_duty: taxData.raw.customsDuty,
            vat_amount: taxData.raw.vatAmount,
            total_landed_cost: taxData.raw.totalLandedCost,
            calculation_json: taxData,
            slug: slug,
            seo_blueprint: effectiveBlueprint,
            seo_h1: content.seo_h1?.slice(0, 80),
            seo_title: content.seo_title?.slice(0, 60),
            seo_description: content.seo_description?.slice(0, 155),
            semantic_h2_problem: content.semantic_h2_problem,
            semantic_h2_solution: content.semantic_h2_solution,
            seo_h2_intent: content.seo_h2_intent,
            seo_h3_technical: content.seo_h3_technical,
            faqs_json: content.faqs_json,
            needs_human_review: needsHumanReview,
        };

        let { error } = await supabase.from('landed_costs').upsert(fullPayload, { onConflict: 'slug' });

        // Graceful fallback: if new columns don't exist yet, store blueprint in calculation_json
        if (error && (error.message?.includes('seo_blueprint') || error.message?.includes('seo_h1') || error.message?.includes('seo_h2_intent') || error.code === '42703')) {
            console.warn(`   ⚠️ New columns not yet migrated. Embedding blueprint in calculation_json...`);
            const fallbackPayload: Record<string, any> = {
                session_id: fullPayload.session_id,
                product_description: product,
                matched_hts_id: taxData.raw.htsId,
                origin_country: origin,
                destination_country: dest,
                product_value: taxData.raw.productValue,
                currency: "USD",
                shipping_cost: taxData.raw.shippingCost,
                insurance_cost: taxData.raw.insuranceCost,
                cif_value: taxData.raw.cifValue,
                customs_duty: taxData.raw.customsDuty,
                vat_amount: taxData.raw.vatAmount,
                total_landed_cost: taxData.raw.totalLandedCost,
                calculation_json: {
                    ...taxData,
                    _seo_blueprint: effectiveBlueprint,
                    _seo_h1: content.seo_h1,
                    _seo_h2_intent: content.seo_h2_intent,
                    _seo_h3_technical: content.seo_h3_technical,
                    _needs_human_review: needsHumanReview,
                },
                slug: slug,
                seo_title: content.seo_title?.slice(0, 60),
                seo_description: content.seo_description?.slice(0, 155),
                semantic_h2_problem: content.semantic_h2_problem,
                semantic_h2_solution: content.semantic_h2_solution,
                faqs_json: content.faqs_json,
            };
            const result = await supabase.from('landed_costs').upsert(fallbackPayload, { onConflict: 'slug' });
            error = result.error;
        }

        if (error) {
            console.error(`❌ DB Insert Failed for: ${slug}`, error);
        } else {
            const status = blueprint ? '✅' : '⚠️';
            console.log(`${status} Generated: ${product} (${origin} -> ${dest}) | Primary KW: "${effectiveBlueprint.primary_keyword}"`);
        }
    } catch (error) {
        console.error(`❌ Zero-Error Catch -> Failed to generate: ${product} (${origin}->${dest}). Skipping...`);
    }
}

// ============================================================
// Main Async Batcher
// ============================================================

async function generateAllPages() {
    console.log("🚀 Initializing Research-Driven Content Factory (Two-Step AI Inference)...");
    console.log("   Step A: Llama-4-Maverick (Keyword Research Agent)");
    console.log("   Step B: Llama-3.3-70b (Contextual Content Writer)");
    console.log("");

    const tasks: (() => Promise<void>)[] = [];
    let count = 0;

    for (const [category, products] of Object.entries(CATEGORIZED_PRODUCTS)) {
        for (const product of products) {
            for (const origin of ORIGINS) {
                for (const dest of DESTINATIONS) {
                    if (origin !== dest) {
                        if (count >= 5000) break;

                        tasks.push(() => limit(() => processSeoPage(product, category, origin, dest)));
                        count++;
                    }
                }
                if (count >= 5000) break;
            }
            if (count >= 5000) break;
        }
        if (count >= 5000) break;
    }

    console.log(`📦 Loaded ${tasks.length} routines into concurrent batcher.`);

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

    console.log("\n🚀 Research-Driven Content Factory Complete!");
}

generateAllPages();
