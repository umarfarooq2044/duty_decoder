/**
 * Generate a static sitemap.xml in /public
 * Run: npx tsx src/scripts/generate-sitemap.ts
 * 
 * This fetches all calculation slugs from Supabase and writes a complete
 * sitemap.xml to /public/sitemap.xml. The file is served instantly by the CDN.
 */

import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";
import { resolve } from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BASE_URL = "https://dutydecoder.com";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── All 50 country slugs from countries.ts ──
const COUNTRY_SLUGS = [
    "united-states", "china", "germany", "united-kingdom", "france", "japan",
    "netherlands", "india", "canada", "south-korea", "italy", "singapore",
    "mexico", "hong-kong", "ireland", "spain", "belgium", "switzerland",
    "sweden", "australia", "austria", "poland", "czech-republic", "denmark",
    "norway", "finland", "portugal", "hungary", "romania", "thailand",
    "vietnam", "malaysia", "indonesia", "philippines", "taiwan", "turkey",
    "saudi-arabia", "united-arab-emirates", "south-africa", "nigeria",
    "egypt", "kenya", "pakistan", "bangladesh", "brazil", "chile",
    "colombia", "argentina", "peru", "israel",
];

const COUNTRY_SUPPORT_PAGES = [
    "import-duty-calculator",
    "import-duty",
    "import-tax",
    "hs-code-lookup",
    "duty-free-threshold",
    "customs-clearance",
    "import-restrictions",
    "import-documents",
    "shipping-customs-fees",
];

const CATEGORY_IDS = [
    "medical", "electronics", "energy", "textiles",
    "food", "automotive", "industrial", "chemicals",
];

function xmlEntry(url: string, lastmod: string, changefreq: string, priority: number): string {
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
}

async function main() {
    const now = new Date().toISOString().split("T")[0]!; // YYYY-MM-DD
    const entries: string[] = [];

    // ── 1. Static global routes ──
    const staticPages = [
        { path: "/", priority: 1.0, freq: "weekly" },
        { path: "/calculate/", priority: 0.9, freq: "weekly" },
        { path: "/import-duty/", priority: 0.9, freq: "weekly" },
        { path: "/customs-duty/", priority: 0.9, freq: "weekly" },
        { path: "/import-tax/", priority: 0.9, freq: "weekly" },
        { path: "/tariff-rates/", priority: 0.9, freq: "weekly" },
        { path: "/hs-code-lookup/", priority: 0.9, freq: "weekly" },
        { path: "/hs-code-finder/", priority: 0.9, freq: "weekly" },
        { path: "/import-documents/", priority: 0.9, freq: "weekly" },
        { path: "/import-restrictions/", priority: 0.9, freq: "weekly" },
        { path: "/customs-clearance/", priority: 0.9, freq: "weekly" },
        { path: "/methodology/", priority: 0.5, freq: "monthly" },
        { path: "/privacy/", priority: 0.3, freq: "monthly" },
        { path: "/terms/", priority: 0.3, freq: "monthly" },
        { path: "/disclaimer/", priority: 0.3, freq: "monthly" },
    ];

    for (const p of staticPages) {
        entries.push(xmlEntry(`${BASE_URL}${p.path}`, now, p.freq, p.priority));
    }

    // ── 2. Category pages ──
    for (const cat of CATEGORY_IDS) {
        entries.push(xmlEntry(`${BASE_URL}/category/${cat}/`, now, "weekly", 0.8));
    }

    // ── 3. Country hub pages + sub-pages ──
    for (const slug of COUNTRY_SLUGS) {
        entries.push(xmlEntry(`${BASE_URL}/${slug}/`, now, "weekly", 0.9));
        for (const sp of COUNTRY_SUPPORT_PAGES) {
            entries.push(xmlEntry(
                `${BASE_URL}/${slug}/${sp}/`,
                now,
                sp === "import-duty-calculator" ? "weekly" : "monthly",
                sp === "import-duty-calculator" ? 0.85 : 0.6,
            ));
        }
    }

    // ── 4. Dynamic calculation pages from Supabase ──
    let offset = 0;
    const BATCH = 1000;
    let totalDynamic = 0;

    while (true) {
        const { data: pages, error } = await supabase
            .from("landed_costs")
            .select("slug, created_at")
            .not("slug", "is", null)
            .order("created_at", { ascending: false })
            .range(offset, offset + BATCH - 1);

        if (error) {
            console.error("  Supabase error:", error.message);
            break;
        }
        if (!pages || pages.length === 0) break;

        for (const p of pages) {
            const lastmod = new Date(p.created_at).toISOString().split("T")[0]!;
            entries.push(xmlEntry(`${BASE_URL}/calculate/${p.slug}/`, lastmod, "monthly", 0.7));
            totalDynamic++;
        }

        if (pages.length < BATCH) break;
        offset += BATCH;
    }

    // ── Build XML ──
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

    const outPath = resolve("public", "sitemap.xml");
    writeFileSync(outPath, xml, "utf-8");

    console.log(`\n✅ Sitemap generated: ${outPath}`);
    console.log(`   Static pages: ${staticPages.length}`);
    console.log(`   Category pages: ${CATEGORY_IDS.length}`);
    console.log(`   Country pages: ${COUNTRY_SLUGS.length * (1 + COUNTRY_SUPPORT_PAGES.length)}`);
    console.log(`   Calculation pages: ${totalDynamic}`);
    console.log(`   Total URLs: ${entries.length}\n`);
}

main().catch(console.error);
