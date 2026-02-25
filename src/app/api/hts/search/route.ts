import { NextResponse } from "next/server";
import { HTSSearchRequestSchema } from "@/schemas/hts";
import { handleApiError } from "@/lib/errors";
import { getServerSupabase } from "@/lib/supabase/server";
import { generateSearchKeywords, classifyProduct } from "@/lib/groq";
import { resetClassificationLoader } from "@/lib/groq";
import Groq from "groq-sdk";
import { env } from "@/lib/env";
import { hsFinderLimiter, getClientIP, isSuspiciousRequest } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { randomUUID } from "crypto";

// ============================================================
// Confidence Scoring — how well does a DB result match the query?
// ============================================================

function scoreMatch(query: string, dbDescription: string): number {
    const q = query.toLowerCase().trim();
    const d = dbDescription.toLowerCase().trim();

    // Exact match
    if (d.includes(q) || q.includes(d)) return 0.95;

    // Word overlap scoring
    const queryWords = q.split(/\s+/).filter(w => w.length > 2);
    const descWords = new Set(d.split(/[\s,;/()]+/).filter(w => w.length > 2));

    if (queryWords.length === 0) return 0.3;

    let matchedWords = 0;
    for (const word of queryWords) {
        for (const dw of descWords) {
            if (dw.includes(word) || word.includes(dw)) {
                matchedWords++;
                break;
            }
        }
    }

    const overlap = matchedWords / queryWords.length;

    // Score: 0.4 base + up to 0.5 for word overlap
    return Math.min(0.95, 0.4 + overlap * 0.5);
}

// ============================================================
// Fast product validation using the lightweight model
// ============================================================

async function validateProductDescription(description: string): Promise<{ isProduct: boolean; reason?: string }> {
    try {
        const groq = new Groq({ apiKey: env.GROQ_API_KEY });
        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: `You are a Customs Classification intake validator. Your job is to determine whether user input describes a TANGIBLE GOOD that could physically cross a border and be classified under the Harmonized System (HS Chapters 1-97).

CLASSIFIABLE (answer YES):
- Raw materials: "copper wire", "crude oil", "cotton fiber", "iron ore"
- Manufactured goods: "laptop computer", "leather handbag", "steel pipe"
- Food & agriculture: "frozen chicken", "basmati rice", "olive oil"
- Components & parts: "car brake pads", "circuit board", "ball bearings"
- Chemicals & substances: "ethanol", "polyethylene resin", "titanium dioxide"

NOT CLASSIFIABLE (answer NO):
- Services: "consulting", "freight forwarding service", "insurance"
- Software/digital: "Microsoft Office license", "mobile app", "cryptocurrency"
- Questions: "what is import duty?", "how much tax on shoes?"
- Gibberish: "asdfghjkl", "hello world", "test123"
- Opinions/chat: "I love pizza", "the weather is nice", "please help"
- Abstract concepts: "freedom", "happiness", "knowledge"

BORDERLINE RULES:
- Physical media WITH software (e.g., "USB drive with Windows") = YES (the physical medium is classifiable)
- "Electricity" or "natural gas via pipeline" = YES (HS Chapter 27)
- Brand names alone ("Nike", "Apple") = NO (too vague, need product type)

Answer ONLY "YES" or "NO" followed by a one-sentence reason.`
                },
                {
                    role: "user",
                    content: description
                }
            ],
            temperature: 0,
            max_tokens: 50,
        });

        const answer = response.choices[0]?.message?.content?.trim().toUpperCase() || "";
        const isProduct = answer.startsWith("YES");
        const reason = response.choices[0]?.message?.content?.trim().replace(/^(YES|NO)\s*[-:.]?\s*/i, "") || undefined;
        return { isProduct, reason };
    } catch (err) {
        // If validation fails, allow the search to proceed (fail-open)
        console.warn("[HTS Validation] AI validation failed, allowing search:", err);
        return { isProduct: true };
    }
}

// ============================================================
// Minimum confidence threshold — below this, trigger AI research
// ============================================================
const MIN_CONFIDENCE_THRESHOLD = 0.65;

export async function POST(request: Request) {
    // Reset DataLoader per request
    resetClassificationLoader();

    try {
        // ─── Bot Protection: Rate Limit + CAPTCHA ───
        const clientIP = getClientIP(request);

        // 1. Bot signal detection
        if (isSuspiciousRequest(request)) {
            return NextResponse.json(
                { results: [], error: "Automated requests are not allowed." },
                { status: 403 }
            );
        }

        // 2. Temporarily bypassed IP rate limiting
        /*
        const rateResult = hsFinderLimiter.check(clientIP);
        if (!rateResult.allowed) {
            return NextResponse.json(
                { results: [], error: `Rate limit exceeded. Please wait ${Math.ceil(rateResult.retryAfterMs / 1000)} seconds.` },
                { status: 429, headers: { "Retry-After": String(Math.ceil(rateResult.retryAfterMs / 1000)) } }
            );
        }
        */

        const body: unknown = await request.json();

        // 3. Temporarily bypassed Turnstile CAPTCHA
        /*
        const bodyObj = body as Record<string, unknown>;
        const turnstileToken = (bodyObj?.turnstileToken as string) || "";
        const turnstileResult = await verifyTurnstileToken(turnstileToken, clientIP);
        if (!turnstileResult.success) {
            return NextResponse.json(
                { results: [], error: "CAPTCHA verification failed. Please refresh the page and try again." },
                { status: 403 }
            );
        }
        */

        const parsed = HTSSearchRequestSchema.parse(body);

        // ─── Step 0: Validate that input is a real product ───
        const validation = await validateProductDescription(parsed.description);
        if (!validation.isProduct) {
            return NextResponse.json({
                results: [],
                query: parsed.description,
                countryCode: parsed.countryCode,
                timestamp: new Date().toISOString(),
                error: validation.reason
                    ? `This doesn't appear to be a product description. ${validation.reason}`
                    : "Please enter a description of a real physical product (e.g., \"cotton t-shirt\", \"stainless steel pipe\", \"lithium-ion battery\").",
                validated: false,
            }, { status: 400 });
        }

        const supabase = getServerSupabase();

        // ============================================================
        // PHASE 1: Database search (AI-keyword FTS + raw FTS)
        // ============================================================
        let dbResults: Array<{
            id: string;
            htsCode: string;
            description: string;
            dutyType: string;
            dutyRatePct: number | null;
            dutyRateSpecific: number | null;
            dutyUnit: string | null;
            vatRatePct: number | null;
            confidence: number;
            matchMethod: "fts" | "ai";
        }> = [];

        // Strategy 1: AI-Keyword Assisted FTS
        try {
            const keywords = await generateSearchKeywords(parsed.description);

            if (keywords.length > 0) {
                const searchTerms = keywords.join(" & ");

                const { data: keywordResults, error } = await supabase
                    .from("hts_codes")
                    .select("id, hts_code, description, duty_type, duty_rate_pct, duty_rate_specific, duty_unit, vat_rate_pct")
                    .eq("country_code", parsed.countryCode)
                    .eq("is_active", true)
                    .textSearch("search_vector", searchTerms, { type: "plain" })
                    .limit(parsed.maxResults);

                if (!error && keywordResults && keywordResults.length > 0) {
                    for (const r of keywordResults) {
                        dbResults.push({
                            id: r.id,
                            htsCode: r.hts_code,
                            description: r.description,
                            dutyType: r.duty_type,
                            dutyRatePct: r.duty_rate_pct,
                            dutyRateSpecific: r.duty_rate_specific,
                            dutyUnit: r.duty_unit,
                            vatRatePct: r.vat_rate_pct,
                            confidence: scoreMatch(parsed.description, r.description),
                            matchMethod: "fts",
                        });
                    }
                }
            }
        } catch (kwError) {
            console.warn("[HTS Search] AI-keyword search failed, falling back:", kwError);
        }

        // Strategy 2: Full-text search fallback (GIN)
        if (dbResults.length === 0) {
            try {
                const searchTerms = parsed.description
                    .split(/\s+/)
                    .filter((t) => t.length > 2)
                    .join(" & ");

                const { data: ftsResults, error } = await supabase
                    .from("hts_codes")
                    .select("id, hts_code, description, duty_type, duty_rate_pct, duty_rate_specific, duty_unit, vat_rate_pct")
                    .eq("country_code", parsed.countryCode)
                    .eq("is_active", true)
                    .textSearch("search_vector", searchTerms, { type: "plain" })
                    .limit(parsed.maxResults);

                if (!error && ftsResults) {
                    for (const r of ftsResults) {
                        dbResults.push({
                            id: r.id,
                            htsCode: r.hts_code,
                            description: r.description,
                            dutyType: r.duty_type,
                            dutyRatePct: r.duty_rate_pct,
                            dutyRateSpecific: r.duty_rate_specific,
                            dutyUnit: r.duty_unit,
                            vatRatePct: r.vat_rate_pct,
                            confidence: scoreMatch(parsed.description, r.description),
                            matchMethod: "fts",
                        });
                    }
                }
            } catch (ftsError) {
                console.warn("[HTS Search] FTS search failed, falling back to AI:", ftsError);
            }
        }

        // Sort DB results by confidence (highest first)
        dbResults.sort((a, b) => b.confidence - a.confidence);

        // ============================================================
        // PHASE 2: Decide if AI research is needed
        // Trigger AI if: no results, OR best DB match is below threshold
        // ============================================================
        const bestDbConfidence = dbResults.length > 0 ? (dbResults[0]?.confidence ?? 0) : 0;
        const needsAiResearch = dbResults.length === 0 || bestDbConfidence < MIN_CONFIDENCE_THRESHOLD;

        let aiResults: typeof dbResults = [];

        if (needsAiResearch) {
            console.log(`[HTS Search] DB best confidence: ${bestDbConfidence.toFixed(2)} → Triggering AI research for "${parsed.description}"`);

            try {
                const aiClassifications = await classifyProduct(parsed.description, parsed.countryCode);

                for (const r of aiClassifications.slice(0, parsed.maxResults)) {
                    const htsRaw = String(r.htsCode || "").replace(/\D/g, "");
                    const htsCode = htsRaw.substring(0, 10).padEnd(10, "0");

                    // Try to find matching DB record for duty rates
                    let dutyRatePct: number | null = null;
                    let vatRatePct: number | null = null;
                    let dutyType = "ad_valorem";

                    // Look up the 6-digit chapter in DB for real rates
                    const chapterPrefix = htsCode.substring(0, 6);
                    const { data: dbMatch } = await supabase
                        .from("hts_codes")
                        .select("duty_type, duty_rate_pct, vat_rate_pct")
                        .eq("country_code", parsed.countryCode)
                        .like("hts_code", `${chapterPrefix}%`)
                        .limit(1)
                        .maybeSingle();

                    if (dbMatch) {
                        dutyRatePct = dbMatch.duty_rate_pct;
                        vatRatePct = dbMatch.vat_rate_pct;
                        dutyType = dbMatch.duty_type || "ad_valorem";
                    } else {
                        // Use AI-provided rates as fallback
                        dutyRatePct = (r.dutyRatePct !== null && r.dutyRatePct !== undefined && !isNaN(parseFloat(r.dutyRatePct as any)))
                            ? parseFloat(r.dutyRatePct as any) : null;
                        vatRatePct = (r.vatRatePct !== null && r.vatRatePct !== undefined && !isNaN(parseFloat(r.vatRatePct as any)))
                            ? parseFloat(r.vatRatePct as any) : null;
                    }

                    aiResults.push({
                        id: "", // Will be set after DB insert
                        htsCode,
                        description: r.description,
                        dutyType,
                        dutyRatePct,
                        dutyRateSpecific: null,
                        dutyUnit: null,
                        vatRatePct,
                        confidence: Math.min(r.confidence, 0.99),
                        matchMethod: "ai",
                    });
                }

                // ============================================================
                // PHASE 3: Cache AI results back to database (fire-and-forget)
                // ============================================================
                if (aiResults.length > 0) {
                    // Cache the top AI result into hts_codes table
                    const topAi = aiResults[0];
                    if (topAi) {
                        const cacheId = randomUUID();

                        const htsForCache = topAi.htsCode.replace(/\D/g, "").padEnd(10, "0");

                        supabase.from("hts_codes").insert({
                            id: cacheId,
                            hts_code: htsForCache,
                            hs6_prefix: htsForCache.substring(0, 6).padEnd(6, "0"),
                            chapter: parseInt(htsForCache.substring(0, 2)) || 99,
                            heading: parseInt(htsForCache.substring(2, 4)) || 99,
                            description: parsed.description, // Cache under user's original query for future FTS matches
                            duty_type: topAi.dutyType,
                            duty_rate_pct: topAi.dutyRatePct,
                            vat_rate_pct: topAi.vatRatePct,
                            country_code: parsed.countryCode,
                            effective_from: new Date().toISOString().split("T")[0],
                            is_active: true,
                            meta_data: { ai_generated: true, original_query: parsed.description, cached_at: new Date().toISOString() },
                        }).then(({ error: cacheError }) => {
                            if (cacheError) {
                                // Duplicate or constraint error is fine — means it's already cached
                                if (!cacheError.message?.includes("duplicate")) {
                                    console.warn("[HTS Search] Failed to cache AI result:", cacheError.message);
                                }
                            } else {
                                console.log(`[HTS Search] ✅ Cached AI code ${htsForCache} for "${parsed.description}" (${parsed.countryCode})`);
                                // Update the ID so the response includes it
                                topAi.id = cacheId;
                            }
                        });
                    } // end if (topAi)
                }

            } catch (aiError) {
                console.error("[HTS Search] AI classification failed:", aiError);
            }
        }

        // ============================================================
        // PHASE 4: Merge, deduplicate, and rank all results
        // ============================================================
        const allResults = [...aiResults, ...dbResults];

        // Deduplicate by HTS code (keep highest confidence)
        const seen = new Map<string, typeof allResults[0]>();
        for (const r of allResults) {
            const code = r.htsCode.replace(/\D/g, "");
            const existing = seen.get(code);
            if (!existing || r.confidence > existing.confidence) {
                seen.set(code, r);
            }
        }

        // Sort by confidence descending, take top N
        const finalResults = Array.from(seen.values())
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, parsed.maxResults);

        return NextResponse.json({
            results: finalResults,
            query: parsed.description,
            countryCode: parsed.countryCode,
            timestamp: new Date().toISOString(),
            ...(needsAiResearch && aiResults.length > 0 ? { aiResearched: true } : {}),
        });
    } catch (error) {
        return handleApiError(error);
    }
}
