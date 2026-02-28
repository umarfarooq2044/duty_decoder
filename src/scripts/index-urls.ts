/**
 * URL Indexing Script — Submit static URLs to search engines
 * 
 * Approaches used:
 * 1. Google Sitemap Ping (no auth needed)
 * 2. Bing/Yandex IndexNow Protocol (instant indexing, no complex auth)
 * 3. Direct URL pinging to warm up crawlers
 * 
 * Usage:
 *   npx tsx src/scripts/index-urls.ts
 * 
 * Limit: 500 URLs per day (configurable)
 */

import { COUNTRIES } from "../lib/countries";

const BASE_URL = "https://dutydecoder.com";
const DAILY_LIMIT = 500;
const BATCH_SIZE = 10;
const DELAY_MS = 1500; // 1.5s between batches

// IndexNow key — place a file with this name at your site root: /indexnow-key.txt
const INDEXNOW_KEY = "dutydecoder2026key";

// ── Collect all static URLs ──
function getAllStaticUrls(): string[] {
    const urls: string[] = [];

    // 1. Top-level pages (highest priority)
    const topPages = [
        "/", "/import-duty/", "/customs-duty/", "/import-tax/", "/tariff-rates/",
        "/calculate/", "/hs-code-lookup/", "/hs-code-finder/", "/import-documents/",
        "/import-restrictions/", "/customs-clearance/", "/methodology/",
        "/privacy/", "/terms/", "/disclaimer/",
    ];
    for (const p of topPages) {
        urls.push(`${BASE_URL}${p}`);
    }

    // 2. Category pages
    const categories = ["medical", "electronics", "energy", "textiles", "food", "automotive", "industrial", "chemicals"];
    for (const cat of categories) {
        urls.push(`${BASE_URL}/category/${cat}/`);
    }

    // 3. Country hub pages + all sub-pages
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

// ── 1. Ping Google Sitemap ──
async function pingGoogleSitemap(): Promise<void> {
    const sitemapUrl = `${BASE_URL}/sitemap.xml`;
    try {
        const res = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
        console.log(`\n🔍 Google Sitemap Ping: ${res.ok ? "✅ Success" : `❌ ${res.status}`}`);
    } catch (err: any) {
        console.log(`\n🔍 Google Sitemap Ping: ❌ ${err.message}`);
    }
}

// ── 2. Bing/Yandex IndexNow ──
async function submitIndexNow(urls: string[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    // IndexNow supports batch submission (up to 10,000 URLs per request)
    // Submit in chunks of 500
    for (let i = 0; i < urls.length; i += 500) {
        const batch = urls.slice(i, i + 500);
        try {
            const res = await fetch("https://api.indexnow.org/indexnow", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    host: "dutydecoder.com",
                    key: INDEXNOW_KEY,
                    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
                    urlList: batch,
                }),
            });

            if (res.ok || res.status === 200 || res.status === 202) {
                success += batch.length;
            } else {
                failed += batch.length;
                console.log(`   ❌ IndexNow batch failed: ${res.status} ${res.statusText}`);
            }
        } catch (err: any) {
            failed += batch.length;
            console.log(`   ❌ IndexNow error: ${err.message}`);
        }
    }

    return { success, failed };
}

// ── 3. Warm up URLs (direct GET requests) ──
async function warmUpUrls(urls: string[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
        const batch = urls.slice(i, i + BATCH_SIZE);
        const results = await Promise.allSettled(
            batch.map(async (url) => {
                const res = await fetch(url, {
                    method: "HEAD",
                    headers: { "User-Agent": "DutyDecoder-Indexer/1.0" },
                    signal: AbortSignal.timeout(5000),
                });
                return res.ok;
            })
        );

        for (const r of results) {
            if (r.status === "fulfilled" && r.value) success++;
            else failed++;
        }

        const pct = Math.round(((i + batch.length) / urls.length) * 100);
        process.stdout.write(`\r   📤 Warming up: ${Math.min(i + BATCH_SIZE, urls.length)}/${urls.length} (${pct}%)`);

        if (i + BATCH_SIZE < urls.length) {
            await new Promise(r => setTimeout(r, DELAY_MS));
        }
    }

    return { success, failed };
}

// ── Main ──
async function main() {
    const allUrls = getAllStaticUrls();
    const urls = allUrls.slice(0, DAILY_LIMIT);

    console.log(`\n📋 DutyDecoder URL Indexing Script`);
    console.log(`   Total static URLs: ${allUrls.length}`);
    console.log(`   Daily limit: ${DAILY_LIMIT}`);
    console.log(`   Submitting: ${urls.length} URLs\n`);

    // Step 1: Ping Google with sitemap
    console.log("─── Step 1: Google Sitemap Ping ───");
    await pingGoogleSitemap();

    // Step 2: Submit to IndexNow (Bing, Yandex, etc.)
    console.log("\n─── Step 2: IndexNow (Bing/Yandex) ───");
    const indexNowResult = await submitIndexNow(urls);
    console.log(`   ✅ IndexNow: ${indexNowResult.success} submitted, ${indexNowResult.failed} failed`);

    // Step 3: Warm up URLs
    console.log("\n─── Step 3: Warming Up URLs ───");
    const warmResult = await warmUpUrls(urls);
    console.log(`\n   ✅ Warmed up: ${warmResult.success} OK, ${warmResult.failed} failed`);

    // Summary
    console.log(`\n${"═".repeat(50)}`);
    console.log(`✅ DONE! Submitted ${urls.length}/${allUrls.length} URLs`);
    console.log(`   Google: Sitemap pinged`);
    console.log(`   Bing/Yandex: ${indexNowResult.success} via IndexNow`);
    console.log(`   Warmed up: ${warmResult.success} URLs`);

    if (allUrls.length > DAILY_LIMIT) {
        console.log(`\n⚠️  ${allUrls.length - DAILY_LIMIT} URLs remaining. Run again tomorrow.`);
    }

    console.log(`\n💡 Important: Place a file at ${BASE_URL}/${INDEXNOW_KEY}.txt`);
    console.log(`   containing just: ${INDEXNOW_KEY}`);
    console.log(`   This verifies ownership for IndexNow.\n`);
}

main().catch(console.error);
