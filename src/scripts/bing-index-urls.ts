/**
 * Bing IndexNow — Submit URLs directly to Bing + Yandex
 * Includes BOTH static pages AND dynamic calculation pages from Supabase
 * 
 * Usage:
 *   npx tsx src/scripts/bing-index-urls.ts            # Submit ALL URLs
 *   npx tsx src/scripts/bing-index-urls.ts --limit 5000  # Cap at 5000 URLs
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from "@supabase/supabase-js";
import { COUNTRIES } from "../lib/countries";
import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'bing-indexed-urls.db');
const db = new Database(DB_PATH);

// Initialize DB schema
db.exec(`
  CREATE TABLE IF NOT EXISTS indexed_urls (
    url TEXT PRIMARY KEY,
    indexed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const BASE_URL = "https://dutydecoder.com";
const INDEXNOW_KEY = "dutydecoder2026key";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Parse CLI args ──
const limitArg = process.argv.indexOf("--limit");
const URL_LIMIT = limitArg !== -1 ? parseInt(process.argv[limitArg + 1] || "0", 10) : 0;

function getStaticUrls(): string[] {
    const urls: string[] = [];

    const topPages = [
        "/", "/import-duty/", "/customs-duty/", "/import-tax/", "/tariff-rates/",
        "/calculate/", "/hs-code-lookup/", "/hs-code-finder/", "/import-documents/",
        "/import-restrictions/", "/customs-clearance/", "/methodology/",
        "/privacy/", "/terms/", "/disclaimer/",
    ];
    for (const p of topPages) urls.push(`${BASE_URL}${p}`);

    const categories = ["medical", "electronics", "energy", "textiles", "food", "automotive", "industrial", "chemicals"];
    for (const cat of categories) urls.push(`${BASE_URL}/category/${cat}/`);

    const supportPages = [
        "import-duty-calculator", "import-duty", "import-tax", "hs-code-lookup",
        "duty-free-threshold", "customs-clearance", "import-restrictions",
        "import-documents", "shipping-customs-fees",
    ];

    for (const country of COUNTRIES) {
        urls.push(`${BASE_URL}/${country.slug}/`);
        for (const sp of supportPages) {
            urls.push(`${BASE_URL}/${country.slug}/${sp}/`);
        }
    }

    return urls;
}

/**
 * Filter a list of URLs and return only those that haven't been indexed.
 */
function filterUnindexed(urls: string[]): string[] {
    return urls.filter(url => {
        const row = db.prepare('SELECT 1 FROM indexed_urls WHERE url = ?').get(url);
        return !row;
    });
}

async function getDynamicUrls(neededCount: number): Promise<string[]> {
    const urls: string[] = [];
    const BATCH = 1000;
    let offset = 0;

    console.log(`   Fetching dynamic calculation URLs from Supabase...`);

    while (true) {
        const { data: pages, error } = await supabase
            .from("landed_costs")
            .select("slug")
            .not("slug", "is", null)
            .order("created_at", { ascending: false })
            .range(offset, offset + BATCH - 1);

        if (error) {
            console.error(`   ⚠️ Supabase error: ${error.message}`);
            break;
        }
        if (!pages || pages.length === 0) break;

        const candidateUrls = pages.map(p => `${BASE_URL}/calculate/${p.slug}/`);
        const unindexedCandidates = filterUnindexed(candidateUrls);

        urls.push(...unindexedCandidates);

        if (neededCount > 0 && urls.length >= neededCount) {
            urls.length = neededCount; // Truncate to exactly neededCount
            break;
        }

        if (pages.length < BATCH) break;
        offset += BATCH;
    }

    console.log(`   Found ${urls.length} NEW dynamic calculation URLs`);
    return urls;
}

async function submitToEngine(engineName: string, endpoint: string, urls: string[]): Promise<{ ok: number; fail: number }> {
    console.log(`\n── ${engineName}: Submitting ${urls.length} URLs ──`);
    let okCount = 0, failCount = 0;
    const totalBatches = Math.ceil(urls.length / 100);

    // IndexNow supports batches up to 10,000 but we chunk at 100 for reliability
    for (let i = 0; i < urls.length; i += 100) {
        const batch = urls.slice(i, i + 100);

        // Filter out already indexed URLs (just in case they were added between gathering and submitting)
        const unindexedBatch = filterUnindexed(batch);

        if (unindexedBatch.length === 0) {
            console.log(`   Batch ${Math.floor(i / 100) + 1}/${totalBatches}: Skipped (already indexed)`);
            continue;
        }

        const batchNum = Math.floor(i / 100) + 1;
        const payload = {
            host: "dutydecoder.com",
            key: INDEXNOW_KEY,
            keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
            urlList: unindexedBatch,
        };

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify(payload),
            });

            const statusText = res.ok ? "✅" : `❌ ${res.status}`;
            let detail = "";
            try { detail = await res.text(); } catch { }

            if (res.ok) {
                okCount += unindexedBatch.length;
                // Insert successful URLs into DB
                const insert = db.prepare('INSERT OR IGNORE INTO indexed_urls (url) VALUES (?)');
                const insertMany = db.transaction((urlsToInsert: string[]) => {
                    for (const url of urlsToInsert) insert.run(url);
                });
                insertMany(unindexedBatch);
            }
            else failCount += unindexedBatch.length;

            console.log(`   Batch ${batchNum}/${totalBatches}: ${statusText} (${unindexedBatch.length} new URLs)${detail && !res.ok ? ` — ${detail.slice(0, 100)}` : ""}`);
        } catch (err: any) {
            failCount += unindexedBatch.length;
            console.log(`   Batch ${batchNum}/${totalBatches}: ❌ ${err.message}`);
        }

        // Small delay between batches to avoid rate limiting
        if (i + 100 < urls.length) await new Promise(r => setTimeout(r, 500));
    }

    return { ok: okCount, fail: failCount };
}

async function main() {
    console.log(`\n${"═".repeat(60)}`);
    console.log(`📋 Bing/Yandex IndexNow Submission`);
    console.log(`${"═".repeat(60)}`);

    // 1. Gather all URLs
    let staticUrls = getStaticUrls();
    staticUrls = filterUnindexed(staticUrls);
    console.log(`\n   New Static pages: ${staticUrls.length}`);

    // Calculate how many dynamic URLs we need
    const dynamicLimit = URL_LIMIT > 0 ? Math.max(0, URL_LIMIT - staticUrls.length) : 0;
    const dynamicUrls = await getDynamicUrls(URL_LIMIT > 0 ? dynamicLimit : 999999);

    let allUrls = [...staticUrls, ...dynamicUrls];

    // Apply overall limit if specified
    if (URL_LIMIT > 0 && allUrls.length > URL_LIMIT) {
        allUrls = allUrls.slice(0, URL_LIMIT);
    }

    console.log(`\n   📊 URL Breakdown:`);
    console.log(`      Static pages: ${staticUrls.length}`);
    console.log(`      Dynamic calculation pages: ${Math.min(dynamicUrls.length, allUrls.length - staticUrls.length)}`);
    console.log(`      ─────────────────────────`);
    console.log(`      Total to submit: ${allUrls.length}`);
    if (URL_LIMIT > 0) console.log(`      (Limit: ${URL_LIMIT})`);
    console.log(`\n   Key file: ${BASE_URL}/${INDEXNOW_KEY}.txt`);

    // 2. Submit to all engines
    const engines = [
        { name: "Bing", endpoint: "https://www.bing.com/indexnow" },
        { name: "Yandex", endpoint: "https://yandex.com/indexnow" },
        { name: "IndexNow Hub", endpoint: "https://api.indexnow.org/indexnow" },
    ];

    const results: Record<string, { ok: number; fail: number }> = {};
    for (const engine of engines) {
        results[engine.name] = await submitToEngine(engine.name, engine.endpoint, allUrls);
    }

    // 3. Summary
    console.log(`\n${"═".repeat(60)}`);
    console.log(`📊 SUBMISSION SUMMARY`);
    console.log(`${"═".repeat(60)}`);
    console.log(`   Total URLs submitted: ${allUrls.length}`);
    for (const [name, r] of Object.entries(results)) {
        console.log(`   ${name}: ✅ ${r.ok} accepted, ❌ ${r.fail} failed`);
    }
    console.log(`\n💡 Bing typically indexes within 24-48 hours via IndexNow.`);
    console.log(`💡 Yandex may take 1-2 weeks to process IndexNow submissions.\n`);
}

main().catch(console.error);
