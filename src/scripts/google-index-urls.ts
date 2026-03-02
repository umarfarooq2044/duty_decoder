/**
 * Google Indexing API — Submit remaining 94 static + dynamic calculate URLs
 * 
 * Usage: npx tsx src/scripts/google-index-urls.ts
 * 
 * Requires GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET in .env.local
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { google } from "googleapis";
import http from "http";
import open from "open";
import { createClient } from "@supabase/supabase-js";
import { COUNTRIES } from "../lib/countries";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = "http://localhost:3939/oauth2callback";
const BASE_URL = "https://dutydecoder.com";

const STATIC_SKIP = 523;  // All static URLs submitted (429 + 94 on Mar 2)
const DYNAMIC_SKIP = 115; // Dynamic URLs already submitted (Mar 2 batch)
const TOTAL_LIMIT = 210;  // Google daily quota

// ── Collect remaining static URLs ──
function getRemainingStaticUrls(): string[] {
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

    // Skip already-submitted static URLs
    return urls.slice(STATIC_SKIP);
}

// ── Fetch dynamic /calculate/ slugs from Supabase ──
async function getDynamicCalculateUrls(): Promise<string[]> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const urls: string[] = [];
    let offset = 0;
    const pageSize = 1000;

    while (true) {
        const { data, error } = await supabase
            .from("landed_costs")
            .select("slug")
            .not("slug", "is", null)
            .order("created_at", { ascending: false })
            .range(offset, offset + pageSize - 1);

        if (error) { console.error("Supabase error:", error.message); break; }
        if (!data || data.length === 0) break;

        for (const row of data) {
            if (row.slug) urls.push(`${BASE_URL}/calculate/${row.slug}/`);
        }

        offset += pageSize;
        if (data.length < pageSize) break;
    }

    return urls;
}

// ── OAuth2 flow ──
async function getAccessToken(): Promise<string> {
    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/indexing"],
    });

    return new Promise((resolve, reject) => {
        const server = http.createServer(async (req, res) => {
            try {
                const url = new URL(req.url!, `http://localhost:3939`);
                const code = url.searchParams.get("code");
                if (!code) { res.writeHead(400); res.end("No code"); return; }
                const { tokens } = await oauth2Client.getToken(code);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(`<html><body style="font-family:system-ui;text-align:center;padding:3rem;background:#0a0a0a;color:#fff"><h1 style="color:#4ade80">✅ Authorized!</h1><p>Close this tab.</p></body></html>`);
                server.close();
                resolve(tokens.access_token!);
            } catch (err) { res.writeHead(500); res.end(`${err}`); reject(err); }
        });
        server.listen(3939, () => {
            console.log("\n🔐 Opening browser for Google OAuth2...\n");
            open(authUrl);
        });
    });
}

// ── Submit URL ──
async function submitUrl(token: string, url: string): Promise<boolean> {
    try {
        const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ url, type: "URL_UPDATED" }),
        });
        return res.ok;
    } catch { return false; }
}

// ── Main ──
async function main() {
    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.error("❌ Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local");
        process.exit(1);
    }

    console.log(`\n📋 Google Indexing API — Remaining Static + Dynamic URLs`);

    // Get remaining static URLs
    const staticUrls = getRemainingStaticUrls();
    console.log(`   Remaining static: ${staticUrls.length}`);

    // Get dynamic calculate URLs from Supabase
    console.log(`   Fetching dynamic /calculate/ URLs from Supabase...`);
    const dynamicUrls = await getDynamicCalculateUrls();
    console.log(`   Dynamic calculate pages: ${dynamicUrls.length}`);

    // Combine: static first, then dynamic (skipping already-submitted)
    const allUrls = [...staticUrls, ...dynamicUrls.slice(DYNAMIC_SKIP)];
    const batch = allUrls.slice(0, TOTAL_LIMIT);

    console.log(`   Combined total: ${allUrls.length}`);
    console.log(`   Today's batch: ${batch.length} (limit: ${TOTAL_LIMIT})\n`);

    const token = await getAccessToken();
    console.log(`\n🔑 Token obtained. Submitting ${batch.length} URLs...\n`);

    let success = 0, failed = 0;

    for (let i = 0; i < batch.length; i += 5) {
        const chunk = batch.slice(i, i + 5);
        const results = await Promise.all(chunk.map(url => submitUrl(token, url)));

        for (const ok of results) { if (ok) success++; else failed++; }

        const total = Math.min(i + 5, batch.length);
        const pct = Math.round((total / batch.length) * 100);
        process.stdout.write(`\r   📤 ${total}/${batch.length} (${pct}%) — ✅ ${success} | ❌ ${failed}`);

        if (i + 5 < batch.length) await new Promise(r => setTimeout(r, 1200));
    }

    console.log(`\n\n${"═".repeat(50)}`);
    console.log(`✅ Done!`);
    console.log(`   Static submitted: ${Math.min(staticUrls.length, success)}`);
    console.log(`   Dynamic submitted: ${Math.max(0, success - staticUrls.length)}`);
    console.log(`   Total success: ${success}`);
    console.log(`   Failed: ${failed}`);

    if (allUrls.length > TOTAL_LIMIT) {
        console.log(`\n⚠️  ${allUrls.length - TOTAL_LIMIT} URLs remaining. Run again tomorrow.`);
    } else {
        console.log(`\n🎉 All URLs submitted!`);
    }
    console.log();
}

main().catch(console.error);
