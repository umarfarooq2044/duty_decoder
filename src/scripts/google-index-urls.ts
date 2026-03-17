/**
 * Google Indexing API — Submit dynamic /calculate/ URLs (with dedup tracking)
 * 
 * Tracks submitted URLs in .indexed-urls.json so it never re-submits.
 * 
 * Usage: npx tsx src/scripts/google-index-urls.ts
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { google } from "googleapis";
import http from "http";
import open from "open";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { COUNTRIES } from "../lib/countries";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = "http://localhost:3939/oauth2callback";
const BASE_URL = "https://dutydecoder.com";
const TOTAL_LIMIT = 210;

// ── Tracking file ──
const TRACKING_FILE = path.join(process.cwd(), ".indexed-urls.json");

function loadSubmittedUrls(): Set<string> {
    try {
        if (fs.existsSync(TRACKING_FILE)) {
            const data = JSON.parse(fs.readFileSync(TRACKING_FILE, "utf-8"));
            return new Set(data.urls || []);
        }
    } catch {}
    return new Set();
}

function saveSubmittedUrls(urls: Set<string>) {
    fs.writeFileSync(TRACKING_FILE, JSON.stringify({
        lastRun: new Date().toISOString(),
        totalSubmitted: urls.size,
        urls: Array.from(urls),
    }, null, 2));
}

// ── Collect all static URLs ──
function getAllStaticUrls(): string[] {
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

    // Load previously submitted URLs
    const submitted = loadSubmittedUrls();
    console.log(`\n📋 Google Indexing API — Smart Batch (skips already submitted)`);
    console.log(`   Previously submitted: ${submitted.size} URLs`);

    // Collect all URLs
    const staticUrls = getAllStaticUrls();
    console.log(`   Fetching dynamic /calculate/ URLs from Supabase...`);
    const dynamicUrls = await getDynamicCalculateUrls();

    const allUrls = [...staticUrls, ...dynamicUrls];
    console.log(`   Total static: ${staticUrls.length}`);
    console.log(`   Total dynamic: ${dynamicUrls.length}`);

    // Filter out already-submitted URLs
    const newUrls = allUrls.filter(url => !submitted.has(url));
    const batch = newUrls.slice(0, TOTAL_LIMIT);

    console.log(`   New (not yet submitted): ${newUrls.length}`);
    console.log(`   Today's batch: ${batch.length} (limit: ${TOTAL_LIMIT})\n`);

    if (batch.length === 0) {
        console.log("🎉 All URLs have been submitted! No new URLs to index.\n");
        return;
    }

    const token = await getAccessToken();
    console.log(`\n🔑 Token obtained. Submitting ${batch.length} URLs...\n`);

    let success = 0, failed = 0;

    for (let i = 0; i < batch.length; i += 5) {
        const chunk = batch.slice(i, i + 5);
        const results = await Promise.all(chunk.map(url => submitUrl(token, url)));

        for (let j = 0; j < results.length; j++) {
            const url = chunk[j];
            if (results[j] && url) {
                success++;
                submitted.add(url); // Track successful submission
            } else {
                failed++;
            }
        }

        const total = Math.min(i + 5, batch.length);
        const pct = Math.round((total / batch.length) * 100);
        process.stdout.write(`\r   📤 ${total}/${batch.length} (${pct}%) — ✅ ${success} | ❌ ${failed}`);

        if (i + 5 < batch.length) await new Promise(r => setTimeout(r, 1200));
    }

    // Save updated tracking
    saveSubmittedUrls(submitted);

    console.log(`\n\n${"═".repeat(50)}`);
    console.log(`✅ Done!`);
    console.log(`   Submitted today: ${success}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Total ever submitted: ${submitted.size}`);
    console.log(`   Remaining: ${newUrls.length - success}`);

    if (newUrls.length > TOTAL_LIMIT) {
        console.log(`\n⚠️  Run again tomorrow for the next batch.`);
    } else {
        console.log(`\n🎉 All URLs submitted!`);
    }
    console.log();
}

main().catch(console.error);
