import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CATEGORY_KEYWORDS: Record<string, string[]> = {
    medical: ["surgery", "medical", "dental", "x-ray", "syringe", "implant", "stethoscope", "catheter", "prosthetic", "wheelchair", "bandage", "pharmaceutical", "vaccine", "diagnostic", "scalpel"],
    electronics: ["computer", "phone", "laptop", "circuit", "battery", "led", "screen", "camera", "headphone", "earbuds", "charger", "cable", "tablet", "monitor", "keyboard", "mouse", "printer", "router"],
    energy: ["solar", "inverter", "turbine", "generator", "panel", "wind", "transformer", "motor", "pump", "compressor", "photovoltaic"],
    textiles: ["shirt", "shoe", "cotton", "leather", "silk", "jacket", "dress", "jeans", "fabric", "wool", "polyester", "trouser", "coat", "sweater", "sock", "underwear", "scarf", "glove", "hat", "bag", "handbag"],
    food: ["food", "grain", "rice", "wheat", "fruit", "vegetable", "meat", "fish", "dairy", "cheese", "milk", "chocolate", "coffee", "tea", "spice", "sugar", "flour", "oil", "honey", "wine", "beer", "juice", "seed", "fertilizer"],
    automotive: ["car", "vehicle", "tire", "brake", "engine", "automotive", "truck", "motorcycle", "bicycle", "wheel", "exhaust", "bumper", "windshield", "spark plug", "transmission", "clutch"],
    industrial: ["machine", "machinery", "valve", "pipe", "steel", "iron", "metal", "aluminum", "copper", "bearing", "bolt", "nut", "screw", "welding", "crane", "forklift", "conveyor", "hydraulic", "pneumatic", "tool"],
    chemicals: ["chemical", "plastic", "resin", "polymer", "adhesive", "paint", "coating", "solvent", "acid", "rubber", "silicone", "pigment", "ink", "detergent", "soap", "cosmetic", "fragrance", "perfume", "makeup"],
};

function categorize(desc: string): string[] {
    const lower = desc.toLowerCase();
    const matched: string[] = [];
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        for (const kw of keywords) {
            if (lower.includes(kw)) {
                matched.push(cat);
                break;
            }
        }
    }
    return matched;
}

async function main() {
    const all: { product_description: string }[] = [];
    let offset = 0;
    const BATCH = 1000;

    while (true) {
        const { data, error } = await supabase
            .from("landed_costs")
            .select("product_description")
            .not("slug", "is", null)
            .order("created_at", { ascending: false })
            .range(offset, offset + BATCH - 1);

        if (error) { console.error(error.message); break; }
        if (!data || data.length === 0) break;
        all.push(...data);
        if (data.length < BATCH) break;
        offset += BATCH;
    }

    // Get unique product descriptions
    const uniqueDescriptions = [...new Set(all.map(p => p.product_description))];
    console.log(`Total unique product descriptions: ${uniqueDescriptions.length}\n`);

    const uncategorized: string[] = [];
    for (const desc of uniqueDescriptions) {
        const cats = categorize(desc);
        if (cats.length === 0) {
            uncategorized.push(desc);
        }
    }

    console.log(`Uncategorized unique products: ${uncategorized.length}\n`);
    console.log("=== ALL UNCATEGORIZED UNIQUE PRODUCTS ===");
    uncategorized.sort();
    for (const desc of uncategorized) {
        console.log(`  • ${desc}`);
    }
}

main().catch(console.error);
