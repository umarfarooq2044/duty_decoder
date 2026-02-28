import { NextResponse, after } from "next/server";
import { randomUUID as uuidv4 } from "crypto";
import Decimal from "decimal.js";
import { LandedCostRequestSchema } from "@/schemas/landed-cost";
import { handleApiError, NotFoundError, ValidationError } from "@/lib/errors";
import { getServerSupabase } from "@/lib/supabase/server";
import { getCachedHTSCode, getCachedComplianceRules } from "@/lib/cache";
import { classifyProduct } from "@/lib/groq";
import { calculateLandedCost, type LandedCostInput } from "@/lib/calculator/landed-cost";
import { HandlingFeeRuleSchema } from "@/schemas/compliance";
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";
import { calculatorLimiter, getClientIP, isSuspiciousRequest } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Generate SEO-friendly slug from calculation details.
 */
function generateSlug(description: string, origin: string, destination: string): string {
    const base = `${description}-from-${origin}-to-${destination}`
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80);

    return base.endsWith('-') ? base.slice(0, -1) : base;
}

/**
 * Non-blocking background function to generate deep SEO content on-the-fly.
 */
async function generateSEOInBackground(rowId: string, product: string, origin: string, dest: string) {
    try {
        console.log(`[Background AI] Triggering Llama-70b Guidelines for: ${product} (${origin}->${dest})...`);

        // Use a dedicated service client so Next.js doesn't crash when the request context dies
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const prompt = `You are a Senior Trade Compliance Advisor with 20+ years of experience in international customs, tariff engineering, and cross-border supply chain optimization.

Product: ${product}
Trade Lane: ${origin} → ${dest}

Generate three pieces of DEEP, expert-level SEO content in JSON format. Your content must demonstrate genuine trade expertise — not generic filler.

Rules for "semantic_h2_problem":
- Identify the SPECIFIC customs compliance barriers for THIS product on THIS trade lane
- Mention real regulatory bodies (e.g., FDA for food to US, CE marking for EU, PSQCA for Pakistan)
- Discuss actual risks: misclassification penalties, valuation disputes, country-of-origin challenges
- Reference real document requirements (commercial invoice, packing list, certificate of origin, bill of lading)
- Use <strong> tags for key terms. Two paragraphs minimum.

Rules for "semantic_h2_solution":
- Provide actionable steps to minimize landed cost on this specific trade lane
- Mention applicable Free Trade Agreements (FTAs) or preferential duty programs if relevant
- Discuss duty deferral mechanisms (bonded warehouses, FTZs, temporary import provisions)
- Include compliance best practices specific to ${dest} customs procedures
- Use <strong> tags. Two paragraphs minimum.

Rules for "faqs_json":
- Generate 4-5 FAQs that match REAL search intent queries importers would type
- Each answer must be specific to THIS product and trade lane, with actual numbers/rates where possible
- Include questions about: (1) duty rate, (2) required documents, (3) compliance requirements, (4) cost savings, (5) common mistakes
- Answers should be 2-3 sentences, factual, authoritative

Return ONLY valid JSON:
{
  "semantic_h2_problem": "<p>HTML content...</p>",
  "semantic_h2_solution": "<p>HTML content...</p>",
  "faqs_json": [
    { "question": "...", "answer": "..." }
  ]
}`;

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        const content = JSON.parse(response.choices[0]?.message?.content || "{}");

        if (content.faqs_json) {
            await supabaseAdmin.from("landed_costs").update({
                semantic_h2_problem: content.semantic_h2_problem,
                semantic_h2_solution: content.semantic_h2_solution,
                faqs_json: content.faqs_json
            }).eq("id", rowId);
            console.log(`[Background AI] ✅ Successfully injected Guidelines for ${product}`);
        }
    } catch (err) {
        console.error(`[Background AI] ❌ Failed to generate Guidelines for ${product}:`, err);
    }
}

export async function POST(request: Request) {
    try {
        // ─── Bot Protection: Rate Limit + CAPTCHA ───
        const clientIP = getClientIP(request);

        // 1. Bot signal detection
        if (isSuspiciousRequest(request)) {
            return NextResponse.json(
                { error: "Automated requests are not allowed. Please use the website." },
                { status: 403 }
            );
        }

        // 2. Temporarily bypassed IP rate limiting for live deployment
        /*
        const rateResult = calculatorLimiter.check(clientIP);
        if (!rateResult.allowed) {
            return NextResponse.json(
                { error: `Rate limit exceeded. Please wait ${Math.ceil(rateResult.retryAfterMs / 1000)} seconds before trying again.` },
                { status: 429, headers: { "Retry-After": String(Math.ceil(rateResult.retryAfterMs / 1000)) } }
            );
        }
        */

        const body: unknown = await request.json();

        // 3. Temporarily bypassed Turnstile CAPTCHA verification
        /*
        const bodyObj = body as Record<string, unknown>;
        const turnstileToken = (bodyObj?.turnstileToken as string) || "";
        const turnstileResult = await verifyTurnstileToken(turnstileToken, clientIP);
        if (!turnstileResult.success) {
            return NextResponse.json(
                { error: "CAPTCHA verification failed. Please refresh the page and try again." },
                { status: 403 }
            );
        }
        */

        const parsed = LandedCostRequestSchema.parse(body);

        const supabase = getServerSupabase();

        // ----------------------------------------------------------
        // Validate Input Object via Fast AI Guardrail
        // ----------------------------------------------------------
        if (!parsed.htsCodeId && parsed.productDescription) {
            const validationResponse = await groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [{
                    role: "system",
                    content: `You are a customs intake classifier. Determine if the input describes a TANGIBLE PHYSICAL GOOD that can be shipped through customs and classified under the Harmonized System (HS Chapters 1-97). Answer ONLY "true" or "false".

true: raw materials, manufactured products, food, machinery, electronics, chemicals, textiles, vehicles, components
false: services, software licenses, digital goods, questions, gibberish, opinions, abstract concepts, brand names alone`
                }, {
                    role: "user",
                    content: `Is this a physical importable good? "${parsed.productDescription}"`
                }],
                temperature: 0.1,
                max_tokens: 10
            });

            const isValidProduct = validationResponse.choices[0]?.message?.content?.trim().toLowerCase();
            if (isValidProduct !== "true") {
                throw new ValidationError(`"${parsed.productDescription}" does not appear to be a physical product. Please enter a valid physical item or material to calculate import duties.`);
            }
        }

        // ----------------------------------------------------------
        // Smart Product Name Extraction (ALWAYS runs)
        // ----------------------------------------------------------
        // Step 1: Strip country names, directions, and filler words
        const STRIP_WORDS = [
            'from', 'to', 'import', 'export', 'importing', 'exporting', 'duty', 'tariff', 'tariffs',
            'china', 'usa', 'us', 'uk', 'eu', 'india', 'japan', 'germany', 'pakistan', 'brazil',
            'mexico', 'canada', 'australia', 'uae', 'singapore', 'vietnam', 'taiwan', 'south korea',
            'saudi arabia', 'france', 'italy', 'turkey', 'thailand', 'indonesia', 'malaysia',
            'cn', 'gb', 'de', 'jp', 'in', 'pk', 'br', 'mx', 'ca', 'au', 'sg', 'vn', 'tw', 'kr',
            'sa', 'ae', 'fr', 'calculate', 'calculator', 'how', 'much', 'cost', 'costs', 'rate',
        ];

        let cleanedInput = parsed.productDescription.trim();
        for (const word of STRIP_WORDS) {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            cleanedInput = cleanedInput.replace(regex, '');
        }
        cleanedInput = cleanedInput.replace(/\s+/g, ' ').trim();

        // Step 2: AI extracts BOTH the specific product name AND the generic base category
        let shortProductName = cleanedInput || parsed.productDescription.trim();
        let baseCategory = shortProductName; // fallback

        const extractResponse = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [{
                role: "system",
                content: `You are a trade nomenclature specialist. Extract the standardized product name from user queries that may contain countries, actions, brands, and filler words.

Rules:
1. product_name: The specific 1-4 word product name using TRADE TERMINOLOGY (not brand names). Capitalize each word.
2. base_category: The generic single-word HS commodity category this belongs to.
3. hs_chapter_hint: Your best guess of the 2-digit HS Chapter number (01-97).

Examples:
"branded Nike shoes from china to USA" -> {"product_name":"Athletic Shoes","base_category":"Footwear","hs_chapter_hint":"64"}
"import cotton t-shirts" -> {"product_name":"Cotton T-Shirts","base_category":"Garments","hs_chapter_hint":"61"}
"large industrial laser cutting machine" -> {"product_name":"Laser Cutting Machine","base_category":"Machinery","hs_chapter_hint":"84"}
"organic green tea bags" -> {"product_name":"Green Tea Bags","base_category":"Tea","hs_chapter_hint":"09"}
"stainless steel bolts M10" -> {"product_name":"Steel Bolts","base_category":"Fasteners","hs_chapter_hint":"73"}
"Samsung Galaxy phone" -> {"product_name":"Smartphone","base_category":"Telephones","hs_chapter_hint":"85"}

Return ONLY JSON. No explanation.`
            }, {
                role: "user",
                content: `Extract trade-normalized product name from: "${parsed.productDescription}"`
            }],
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        try {
            const extracted = JSON.parse(extractResponse.choices[0]?.message?.content || "{}");
            if (extracted.product_name && extracted.product_name.length > 1 && extracted.product_name.length < 60) {
                shortProductName = extracted.product_name;
            }
            if (extracted.base_category && extracted.base_category.length > 1) {
                baseCategory = extracted.base_category;
            }
        } catch { /* keep defaults */ }

        // ----------------------------------------------------------
        // Check for existing page (avoid duplicates)
        // ----------------------------------------------------------
        const candidateSlug = generateSlug(shortProductName, parsed.originCountry, parsed.destinationCountry);

        // Search 1: Exact slug match
        const { data: slugMatch } = await supabase
            .from("landed_costs")
            .select("id, slug, calculation_json")
            .eq("slug", candidateSlug)
            .maybeSingle();

        let existingPage = slugMatch;

        // Search 2: Fuzzy match on product name + route
        if (!existingPage) {
            const { data: nameMatch } = await supabase
                .from("landed_costs")
                .select("id, slug, calculation_json")
                .ilike("product_description", `%${shortProductName}%`)
                .eq("origin_country", parsed.originCountry)
                .eq("destination_country", parsed.destinationCountry)
                .not("slug", "is", null)
                .limit(1)
                .maybeSingle();
            existingPage = nameMatch;
        }

        // Search 3: Match on base category + route (e.g., "branded shoes" -> finds "Shoes")
        if (!existingPage && baseCategory !== shortProductName) {
            const { data: categoryMatch } = await supabase
                .from("landed_costs")
                .select("id, slug, calculation_json")
                .ilike("product_description", `%${baseCategory}%`)
                .eq("origin_country", parsed.originCountry)
                .eq("destination_country", parsed.destinationCountry)
                .not("slug", "is", null)
                .limit(1)
                .maybeSingle();
            existingPage = categoryMatch;
        }

        // Search 4: Check slug built from base category
        if (!existingPage) {
            const baseCategorySlug = generateSlug(baseCategory, parsed.originCountry, parsed.destinationCountry);
            if (baseCategorySlug !== candidateSlug) {
                const { data: baseSlugMatch } = await supabase
                    .from("landed_costs")
                    .select("id, slug, calculation_json")
                    .eq("slug", baseCategorySlug)
                    .maybeSingle();
                existingPage = baseSlugMatch;
            }
        }

        if (existingPage && existingPage.slug) {
            const disclaimerRules = await getCachedComplianceRules(parsed.destinationCountry, "disclaimer");
            const disclaimer = disclaimerRules.length > 0
                ? ((disclaimerRules[0]?.rule_value as { text?: string })?.text ?? "Estimates are for informational purposes only.")
                : "Estimates are for informational purposes only.";

            return NextResponse.json({
                id: existingPage.id,
                slug: existingPage.slug,
                htsCode: null,
                breakdown: existingPage.calculation_json,
                disclaimer,
                timestamp: new Date().toISOString(),
                cached: true,
            });
        }

        // ----------------------------------------------------------
        // Resolve HTS code
        // ----------------------------------------------------------
        let htsData: {
            id: string;
            hts_code: string;
            description: string;
            duty_type: string;
            duty_rate_pct: number | null;
            duty_rate_specific: number | null;
            duty_unit: string | null;
            vat_rate_pct: number | null;
            additional_duties: Record<string, { rate_pct?: number; rate_specific?: number; description?: string }>;
            meta_data: Record<string, unknown>;
            country_code: string;
        };

        if (parsed.htsCodeId) {
            const cached = await getCachedHTSCode(parsed.htsCodeId);
            if (!cached) throw new NotFoundError("HTS code not found");
            htsData = cached as typeof htsData;
        } else {
            // Auto-match via exact text search
            const { data: searchResults, error } = await supabase
                .from("hts_codes")
                .select("*")
                .eq("country_code", parsed.destinationCountry)
                .eq("is_active", true)
                .textSearch("search_vector", parsed.productDescription.split(/\s+/).filter((t) => t.length > 2).join(" & "), { type: "plain" })
                .limit(1)
                .maybeSingle();

            if (searchResults) {
                htsData = searchResults as typeof htsData;
            } else {
                // FALLBACK: AI Deep Research
                const aiResults = await classifyProduct(parsed.productDescription, parsed.destinationCountry);
                const bestResult = aiResults[0];
                if (!bestResult || !bestResult.htsCode) {
                    throw new NotFoundError("AI could not determine an HTS code for this product.");
                }

                const bestHtsRaw = String(bestResult.htsCode || "").replace(/\D/g, ''); // strip punctuation
                const bestHts = bestHtsRaw.substring(0, 10).padEnd(10, '0'); // exact 10-digit requirement

                const fallbackAiId = uuidv4();

                // Try 6-digit chapter level matching
                const chapterPrefix = bestHts.substring(0, 6);
                const { data: aiMatch, error: aiError } = await supabase
                    .from("hts_codes")
                    .select("*")
                    .eq("country_code", parsed.destinationCountry)
                    .like("hts_code", `${chapterPrefix}%`)
                    .limit(1)
                    .maybeSingle();

                if (aiMatch) {
                    htsData = aiMatch as typeof htsData;
                } else {
                    // Try 4-digit heading level matching
                    const headingPrefix = bestHts.substring(0, 4);
                    const { data: looseMatch, error: looseError } = await supabase
                        .from("hts_codes")
                        .select("*")
                        .eq("country_code", parsed.destinationCountry)
                        .like("hts_code", `${headingPrefix}%`)
                        .limit(1)
                        .maybeSingle();

                    if (looseMatch) {
                        htsData = looseMatch as typeof htsData;
                    } else {
                        // AI Inference Fallback when database chapter is completely empty
                        htsData = {
                            id: fallbackAiId,
                            hts_code: bestHts,
                            description: bestResult.description,
                            duty_type: "ad_valorem",
                            duty_rate_pct: (bestResult.dutyRatePct !== null && bestResult.dutyRatePct !== undefined && !isNaN(parseFloat(bestResult.dutyRatePct as any))) ? parseFloat(bestResult.dutyRatePct as any) : 5.0,
                            duty_rate_specific: null,
                            duty_unit: null,
                            vat_rate_pct: (bestResult.vatRatePct !== null && bestResult.vatRatePct !== undefined && !isNaN(parseFloat(bestResult.vatRatePct as any))) ? parseFloat(bestResult.vatRatePct as any) : 20.0,
                            additional_duties: {},
                            meta_data: { ai_generated: true, reasoning: bestResult.reasoning },
                            country_code: parsed.destinationCountry,
                        };
                    }
                }

                // SYNCHRONOUS: Cache this newly AI-researched HTS code back into our database
                // We MUST await this so the subsequent `landed_costs` row doesn't violate its Foreign Key constraint!
                const { error: cacheError } = await supabase.from("hts_codes").insert({
                    id: htsData.id === fallbackAiId ? fallbackAiId : uuidv4(),
                    hts_code: bestHts,
                    hs6_prefix: bestHts.substring(0, 6).padEnd(6, '0'),
                    chapter: parseInt(bestHts.substring(0, 2)) || 99,
                    heading: parseInt(bestHts.substring(2, 4)) || 99,
                    description: parsed.productDescription, // Cache under the user's exact semantic description
                    duty_type: htsData.duty_type,
                    duty_rate_pct: htsData.duty_rate_pct,
                    country_code: parsed.destinationCountry,
                    effective_from: new Date().toISOString().split("T")[0],
                    is_active: true
                });
                if (cacheError) console.error("[HTS Cache] Failed to save AI prediction:", cacheError);
            }
        }

        // ----------------------------------------------------------
        // Check for national handling fees
        // ----------------------------------------------------------
        let nationalHandlingFee = 0;
        let nationalHandlingCurrency = "";

        const handlingRules = await getCachedComplianceRules(parsed.destinationCountry, "handling_fee");
        if (handlingRules.length > 0) {
            const feeRule = HandlingFeeRuleSchema.safeParse(handlingRules[0]?.rule_value);
            if (feeRule.success) {
                nationalHandlingFee = feeRule.data.fee_value;
                nationalHandlingCurrency = feeRule.data.fee_currency;
            }
        }

        // ----------------------------------------------------------
        // Calculate landed cost
        // ----------------------------------------------------------
        const input: LandedCostInput = {
            productValue: parsed.productValue,
            currency: parsed.currency,
            shippingCost: parsed.shippingCost,
            insuranceCost: parsed.insuranceCost,
            quantity: parsed.quantity,
            weight: parsed.weight,
            dutyType: htsData.duty_type as LandedCostInput["dutyType"],
            dutyRatePct: htsData.duty_rate_pct,
            dutyRateSpecific: htsData.duty_rate_specific,
            dutyUnit: htsData.duty_unit,
            vatRatePct: htsData.vat_rate_pct,
            additionalDuties: (htsData.additional_duties ?? {}) as LandedCostInput["additionalDuties"],
            metaData: htsData.meta_data ?? {},
            originCountry: parsed.originCountry,
            destinationCountry: parsed.destinationCountry,
            nationalHandlingFee,
            nationalHandlingCurrency,
        };

        const result = await calculateLandedCost(input);

        // ----------------------------------------------------------
        // Compare Alternative HTS Codes (CRO / Value-add)
        // ----------------------------------------------------------
        if (htsData.duty_rate_pct !== null && htsData.duty_rate_pct > 10 && htsData.hts_code) {
            // Find cheaper HTS codes in the same 4-digit chapter
            const chapterPrefix = htsData.hts_code.replace(/\./g, "").substring(0, 4);
            const { data: alternatives } = await supabase
                .from("hts_codes")
                .select("hts_code, description, duty_rate_pct")
                .eq("country_code", parsed.destinationCountry)
                .like("hts_code", `${chapterPrefix}%`)
                .lt("duty_rate_pct", htsData.duty_rate_pct)
                .neq("hts_code", htsData.hts_code)
                .limit(3);

            if (alternatives && alternatives.length > 0) {
                result.breakdown.alternativeHts = alternatives;
            }
        }

        // ----------------------------------------------------------
        // Generate slug and persist
        // ----------------------------------------------------------

        // Fetch disclaimer
        const disclaimerRules = await getCachedComplianceRules(parsed.destinationCountry, "disclaimer");
        const disclaimer = disclaimerRules.length > 0
            ? ((disclaimerRules[0]?.rule_value as { text?: string })?.text ?? "Estimates are for informational purposes only.")
            : "Estimates are for informational purposes only.";

        // Use pre-computed slug from duplicate check above
        let slug = candidateSlug;

        // Collision Detection
        const { data: existingSlug } = await supabase.from("landed_costs").select("id").eq("slug", slug).maybeSingle();
        if (existingSlug) {
            slug = `${slug}-customs`;
            const { data: existingSlug2 } = await supabase.from("landed_costs").select("id").eq("slug", slug).maybeSingle();
            if (existingSlug2) {
                slug = `${slug}-${crypto.randomUUID().split("-")[0]}`;
            }
        }

        const sessionId = parsed.sessionId ?? crypto.randomUUID();

        let originName: string = parsed.originCountry;
        try { originName = new Intl.DisplayNames(['en'], { type: 'region' }).of(parsed.originCountry) || parsed.originCountry; } catch { }

        let destName: string = parsed.destinationCountry;
        try { destName = new Intl.DisplayNames(['en'], { type: 'region' }).of(parsed.destinationCountry) || parsed.destinationCountry; } catch { }

        // Inject htsId into calculation_json.raw for HS code display fallback
        const enrichedBreakdown = {
            ...result.breakdown,
            raw: {
                ...(result.breakdown as any)?.raw,
                htsId: htsData.hts_code ? htsData.hts_code.replace(/(\d{4})(\d{2})/, '$1.$2') : null,
            },
            hsDescription: htsData.description || shortProductName,
        };

        // Generate SEO-optimized fields matching the format used across all pages
        const seoTitle = `${shortProductName} Import Duty: ${originName} to ${destName} | 2026`;
        const seoDescription = `Calculate the import duty, VAT, and total landed cost for ${shortProductName} shipped from ${originName} to ${destName}. Free 2026 duty rates with HS code classification.`;
        const seoH1 = `${shortProductName} Import Duty & Landed Cost: ${originName} to ${destName}`;
        const seoH2Intent = `How Much Does It Cost to Import ${shortProductName} into ${destName}?`;
        const hsCodeFormatted = htsData.hts_code ? htsData.hts_code.replace(/(\d{4})(\d{2})/, '$1.$2') : null;
        const seoH3Technical = hsCodeFormatted && hsCodeFormatted !== '9999.99'
            ? `HS Code ${hsCodeFormatted} — Customs Classification for ${shortProductName}`
            : `Customs Classification & Tariff Rates for ${shortProductName}`;

        const { data: saved, error: saveError } = await supabase
            .from("landed_costs")
            .insert({
                session_id: sessionId,
                product_description: shortProductName, // FIXED: Use Short Name globally for UI & FAQs
                matched_hts_id: htsData.id,
                origin_country: parsed.originCountry,
                destination_country: parsed.destinationCountry,
                product_value: result.totals.cifValue.minus(new Decimal(parsed.shippingCost)).minus(new Decimal(parsed.insuranceCost)).toNumber(),
                currency: parsed.currency,
                shipping_cost: parsed.shippingCost,
                insurance_cost: parsed.insuranceCost,
                cif_value: result.totals.cifValue.toNumber(),
                customs_duty: result.totals.customsDuty.toNumber(),
                additional_duties: result.totals.additionalDuties.toNumber(),
                processing_fees: result.totals.processingFees.toNumber(),
                national_handling: result.totals.nationalHandling.toNumber(),
                vat_amount: result.totals.vatAmount.toNumber(),
                total_landed_cost: result.totals.totalLandedCost.toNumber(),
                exchange_rate: result.exchangeRate?.toNumber() ?? null,
                calculation_json: enrichedBreakdown,
                slug,
                seo_title: seoTitle,
                seo_description: seoDescription,
                seo_h1: seoH1,
                seo_h2_intent: seoH2Intent,
                seo_h3_technical: seoH3Technical,
            })
            .select("id")
            .single();

        if (saveError) {
            console.error("[Landed Cost] Save error:", saveError);
        } else if (saved) {
            // TRIGGER BACKGROUND AI SEEDING
            // Use after() so Vercel keeps the function alive after responding
            after(async () => {
                try {
                    await generateSEOInBackground(saved.id, shortProductName, originName, destName);
                } catch (err) {
                    console.error('[Background AI] after() error:', err);
                }
            });
        }

        return NextResponse.json({
            id: saved?.id ?? crypto.randomUUID(),
            slug,
            htsCode: {
                code: htsData.hts_code,
                description: htsData.description,
                countryCode: htsData.country_code,
            },
            breakdown: result.breakdown,
            disclaimer,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return handleApiError(error);
    }
}
