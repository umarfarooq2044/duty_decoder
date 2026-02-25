import Groq from "groq-sdk";
import DataLoader from "dataloader";
import { env } from "@/lib/env";
import { RateLimitError, ServerError } from "@/lib/errors";

// ============================================================
// Groq Client (Singleton)
// ============================================================

let groqClient: Groq | null = null;

function getGroqClient(): Groq {
    if (groqClient) return groqClient;
    groqClient = new Groq({ apiKey: env.GROQ_API_KEY });
    return groqClient;
}

// ============================================================
// Retry with exponential backoff
// ============================================================

interface RetryOptions {
    maxRetries?: number;
    baseDelayMs?: number;
}

async function withRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const { maxRetries = 3, baseDelayMs = 1000 } = options;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error: unknown) {
            const isRateLimit =
                error instanceof Error &&
                ("status" in error && (error as { status: number }).status === 429);

            if (attempt === maxRetries) {
                if (isRateLimit) {
                    throw new RateLimitError("Groq API rate limit exceeded after retries");
                }
                throw error;
            }

            if (isRateLimit || (error instanceof Error && error.message.includes("timeout"))) {
                const delay = baseDelayMs * Math.pow(2, attempt) + Math.random() * 500;
                await new Promise((resolve) => setTimeout(resolve, delay));
                continue;
            }

            // Non-retryable error
            throw error;
        }
    }

    throw new ServerError("Retry loop exhausted unexpectedly");
}

// ============================================================
// HTS Classification via Groq (Llama-4-Maverick)
// ============================================================

export interface HTSClassificationResult {
    htsCode: string;
    description: string;
    confidence: number;
    reasoning: string;
    dutyRatePct: number;
    vatRatePct: number;
}

async function classifySingleProduct(
    description: string,
    countryCode: string
): Promise<HTSClassificationResult[]> {
    const client = getGroqClient();

    const countryLabel =
        countryCode === "US" ? "United States (USITC HTS)" :
            countryCode === "GB" ? "United Kingdom (HMRC UK Tariff)" :
                countryCode === "EU" ? "European Union (Combined Nomenclature)" :
                    countryCode === "PK" ? "Pakistan (PCT)" :
                        countryCode;

    const response = await withRetry(() =>
        client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are a licensed Customs Broker with 20+ years of experience classifying goods under the Harmonized System for ${countryLabel}.

Your classification methodology MUST follow the WCO General Rules of Interpretation (GRI):
- GRI 1: Classification is determined by the terms of the headings and Section/Chapter Notes.
- GRI 2(a): Incomplete or unfinished articles are classified as the complete article if they have the essential character.
- GRI 3: When goods are classifiable under two or more headings, use (a) most specific description, (b) essential character, (c) last in numerical order.
- GRI 6: Classification at subheading level follows the same principles, comparing subheadings at the same level.

CLASSIFICATION PROCESS (you MUST follow this 2-step chain):
Step 1 — Identify the HS Chapter (2-digit) by analyzing: What IS the product? What is it MADE OF? What is its PRIMARY FUNCTION?
Step 2 — Narrow to the subheading (6-10 digit) by analyzing: Material composition, manufacturing process (knitted vs woven, forged vs cast), end-use, form/state (raw, semi-finished, finished).

CRITICAL RULES:
- The htsCode MUST be a 10-digit string (pad with trailing zeros if the national schedule uses fewer digits).
- dutyRatePct MUST reflect the MFN (Most Favoured Nation) general duty rate, NOT preferential/FTA rates.
- vatRatePct MUST reflect the standard VAT/GST rate for ${countryLabel} (not reduced rates for food/medicine unless the product qualifies).
- confidence MUST honestly reflect classification certainty: 0.95+ for unambiguous goods, 0.7-0.85 for goods that could fall under multiple headings.
- reasoning MUST cite the specific HS Chapter number and the GRI rule applied.

Return exactly 5 results as a JSON object: { "results": [ { "htsCode": "...", "description": "...", "confidence": 0.0, "reasoning": "...", "dutyRatePct": 0.0, "vatRatePct": 0.0 } ] }. No markdown, no explanation outside the JSON.`,
                },
                {
                    role: "user",
                    content: `Classify this product for import into ${countryLabel}:\n\n"${description}"\n\nApply GRI rules. First identify the HS Chapter, then narrow to the most specific subheading.`,
                },
            ],
            temperature: 0.1,
            max_completion_tokens: 2048,
            response_format: { type: "json_object" },
        })
    );

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new ServerError("Empty response from Groq classification");
    }

    try {
        const parsed = JSON.parse(content) as any;
        let resultsArray = parsed.results || parsed.htsCodes || parsed.codes || parsed.data;

        // If the model just returned an array directly
        if (Array.isArray(parsed)) {
            resultsArray = parsed;
        }

        // Deep search if still not found
        if (!Array.isArray(resultsArray)) {
            for (const key of Object.keys(parsed)) {
                if (Array.isArray(parsed[key])) {
                    resultsArray = parsed[key];
                    break;
                }
            }
        }

        return Array.isArray(resultsArray) ? resultsArray : [];
    } catch {
        throw new ServerError(`Failed to parse Groq classification response. Content: ${content.substring(0, 200)}`);
    }
}

// ============================================================
// DataLoader: Batch multiple product classifications
// e.g., "Suit" → batch "Jacket" + "Trousers"
// ============================================================

interface ClassificationKey {
    description: string;
    countryCode: string;
}

function createClassificationLoader() {
    return new DataLoader<ClassificationKey, HTSClassificationResult[], string>(
        async (keys) => {
            // Group by country for efficient batching
            const results = await Promise.all(
                keys.map((key) => classifySingleProduct(key.description, key.countryCode))
            );
            return results;
        },
        {
            // Cache within a single request lifecycle
            cacheKeyFn: (key) => `${key.countryCode}:${key.description}`,
        }
    );
}

// Per-request loader (create new for each API request)
let requestLoader: DataLoader<ClassificationKey, HTSClassificationResult[], string> | null = null;

export function getClassificationLoader() {
    if (!requestLoader) {
        requestLoader = createClassificationLoader();
    }
    return requestLoader;
}

export function resetClassificationLoader() {
    requestLoader = null;
}

// ============================================================
// Extract search keywords via Groq (replaces broken embeddings)
// Groq does NOT support embedding models — use LLM extraction
// ============================================================

export async function generateSearchKeywords(text: string): Promise<string[]> {
    const client = getGroqClient();

    try {
        const response = await withRetry(() =>
            client.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "system",
                        content: `You are a trade classification keyword specialist. Extract 6-10 search keywords from a product description for querying an HS/HTS tariff code database.

Extraction rules:
1. Extract the core PRODUCT TYPE (e.g., "t-shirt", "valve", "solar panel")
2. Extract MATERIAL composition (e.g., "cotton", "stainless steel", "polyester")
3. Extract MANUFACTURING PROCESS if mentioned (e.g., "knitted", "forged", "woven", "molded")
4. Extract FORM/STATE (e.g., "raw", "finished", "powder", "liquid", "sheets")
5. Add TARIFF SYNONYMS — official HS vocabulary equivalents:
   - "phone" → include "telephone", "cellular"
   - "laptop" → include "portable computer", "data processing"
   - "shirt" → include "garment", "apparel"
   - "car parts" → include "motor vehicle", "automotive components"
   - "pipe" → include "tube", "hollow profile"
6. Strip brand names, country names, and action words ("import", "from", "calculate")

Return ONLY a JSON object: { "keywords": ["word1", "word2", ...] }. All lowercase. No explanation.`
                    },
                    { role: "user", content: text }
                ],
                temperature: 0,
                max_tokens: 150,
                response_format: { type: "json_object" },
            })
        );

        const content = response.choices[0]?.message?.content;
        if (!content) return [];

        const parsed = JSON.parse(content);
        const keywords = parsed.keywords || parsed.results || (Array.isArray(parsed) ? parsed : []);
        return Array.isArray(keywords) ? keywords.filter((k: unknown) => typeof k === "string") : [];
    } catch (err) {
        console.warn("[Groq] Keyword extraction failed:", err);
        // Fallback: split the input into simple words
        return text.toLowerCase().split(/\s+/).filter(w => w.length > 2).slice(0, 8);
    }
}

// Keep legacy export name for compatibility, but now returns empty (vector search disabled)
export async function generateEmbedding(_text: string): Promise<number[]> {
    // Groq does not support embedding models.
    // Vector search (Strategy 1) is disabled; use FTS + AI instead.
    return [];
}

// ============================================================
// Direct classification (non-batched)
// ============================================================

export async function classifyProduct(
    description: string,
    countryCode: string
): Promise<HTSClassificationResult[]> {
    const loader = getClassificationLoader();
    return loader.load({ description, countryCode });
}
