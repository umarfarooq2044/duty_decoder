/**
 * Google Indexing API — Submit all static URLs for indexing
 * 
 * Usage:
 *   npx tsx src/scripts/google-index-urls.ts
 * 
 * On first run, it opens a browser for Google OAuth2 consent.
 * After authorization, it submits all static URLs in batches.
 */

import { google } from "googleapis";
import http from "http";
import open from "open";
import { COUNTRIES } from "../lib/countries";

// ── OAuth2 Credentials (set in .env.local) ──
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = "http://localhost:3939/oauth2callback";
const BASE_URL = "https://dutydecoder.com";

// ── Collect all static URLs ──
function getAllStaticUrls(): string[] {
    const urls: string[] = [];

    // 1. Top-level pages
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

// ── OAuth2 flow with local callback server ──
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

                if (!code) {
                    res.writeHead(400, { "Content-Type": "text/html" });
                    res.end("<h1>Error: No code received</h1>");
                    return;
                }

                const { tokens } = await oauth2Client.getToken(code);
                oauth2Client.setCredentials(tokens);

                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(`
                    <html><body style="font-family:system-ui;text-align:center;padding:3rem;background:#0a0a0a;color:#fff">
                        <h1 style="color:#4ade80">✅ Authorization Successful!</h1>
                        <p>You can close this window. The indexing script is now running...</p>
                    </body></html>
                `);

                server.close();
                resolve(tokens.access_token!);
            } catch (err) {
                res.writeHead(500, { "Content-Type": "text/html" });
                res.end(`<h1>Error</h1><pre>${err}</pre>`);
                reject(err);
            }
        });

        server.listen(3939, () => {
            console.log("\n🔐 Opening browser for Google OAuth2 authorization...\n");
            console.log(`   If browser doesn't open, visit:\n   ${authUrl}\n`);
            open(authUrl);
        });
    });
}

// ── Submit URL to Google Indexing API ──
async function submitUrl(accessToken: string, url: string, type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"): Promise<{ url: string; status: string }> {
    try {
        const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ url, type }),
        });

        if (res.ok) {
            return { url, status: "✅ Submitted" };
        } else {
            const err = await res.json();
            return { url, status: `❌ ${res.status}: ${err.error?.message || JSON.stringify(err)}` };
        }
    } catch (err: any) {
        return { url, status: `❌ Error: ${err.message}` };
    }
}

// ── Main ──
async function main() {
    const urls = getAllStaticUrls();
    console.log(`\n📋 Collected ${urls.length} static URLs to index\n`);

    // Get OAuth2 access token
    const accessToken = await getAccessToken();
    console.log(`\n🔑 Access token obtained. Starting submission...\n`);

    // Submit in batches of 5 with 1s delay between batches
    const BATCH_SIZE = 5;
    let submitted = 0;
    let succeeded = 0;
    let failed = 0;

    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
        const batch = urls.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(
            batch.map(url => submitUrl(accessToken, url))
        );

        for (const r of results) {
            submitted++;
            if (r.status.startsWith("✅")) {
                succeeded++;
            } else {
                failed++;
                console.log(`   ${r.status} — ${r.url}`);
            }
        }

        const pct = Math.round((submitted / urls.length) * 100);
        process.stdout.write(`\r   📤 Progress: ${submitted}/${urls.length} (${pct}%) — ✅ ${succeeded} | ❌ ${failed}`);

        // Rate limit: 1 second between batches
        if (i + BATCH_SIZE < urls.length) {
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    console.log(`\n\n✅ Done! Submitted ${submitted} URLs:`);
    console.log(`   ✅ Succeeded: ${succeeded}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`\n💡 Google typically processes these within 24-48 hours.\n`);
}

main().catch(console.error);
