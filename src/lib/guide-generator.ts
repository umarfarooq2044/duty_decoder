/**
 * Shared guide generation pipeline for API route background processing.
 * Exports a single function that runs the 3-step pipeline for one page.
 * Used by both the batch script and the API route's after() callback.
 */
import Groq from "groq-sdk";
import { SupabaseClient } from "@supabase/supabase-js";

// ============================================================
// Country Metadata Maps
// ============================================================

const COUNTRY_NAMES: Record<string, string> = {
    CN: "China", US: "United States", GB: "United Kingdom", EU: "European Union",
    DE: "Germany", JP: "Japan", MX: "Mexico", CA: "Canada", IN: "India",
    VN: "Vietnam", TW: "Taiwan", KR: "South Korea", PK: "Pakistan",
    AE: "UAE", BR: "Brazil", AU: "Australia", SG: "Singapore", SA: "Saudi Arabia",
    FR: "France", TR: "Turkey", TH: "Thailand", ID: "Indonesia", MY: "Malaysia",
    IT: "Italy", ES: "Spain", NL: "Netherlands", SE: "Sweden", PL: "Poland",
};

const TRADE_CURRENCIES: Record<string, string> = {
    US: "USD", GB: "USD", DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR",
    NL: "EUR", SE: "USD", PL: "USD", EU: "EUR", MX: "USD", CA: "USD",
    JP: "USD", IN: "USD", AU: "USD", SG: "USD", AE: "USD", SA: "USD",
    BR: "USD", PK: "USD", CN: "USD", KR: "USD", VN: "USD", TW: "USD",
    TR: "USD", TH: "USD", ID: "USD", MY: "USD",
};

const REGULATORY_BODIES: Record<string, string[]> = {
    US: ["U.S. Customs and Border Protection (CBP)", "U.S. International Trade Commission (USITC)"],
    GB: ["HM Revenue & Customs (HMRC)", "UK Border Force"],
    DE: ["German Customs (Zoll)", "Federal Office of Economics and Export Control (BAFA)"],
    FR: ["French Customs (DGDDI)", "Direction Générale des Finances Publiques (DGFiP)"],
    EU: ["European Commission Directorate-General for Taxation", "EU Customs Authority"],
    MX: ["Servicio de Administración Tributaria (SAT)", "Agencia Nacional de Aduanas de México (ANAM)"],
    CA: ["Canada Border Services Agency (CBSA)", "Canada Revenue Agency (CRA)"],
    JP: ["Japan Customs", "Ministry of Finance"],
    IN: ["Central Board of Indirect Taxes and Customs (CBIC)", "Directorate General of Foreign Trade (DGFT)"],
    AU: ["Australian Border Force (ABF)", "Department of Agriculture, Fisheries and Forestry (DAFF)"],
    SG: ["Singapore Customs", "Enterprise Singapore"],
    AE: ["Federal Customs Authority (FCA)", "Dubai Customs"],
    SA: ["Saudi Customs (Zakat, Tax and Customs Authority — ZATCA)", "Saudi Food and Drug Authority (SFDA)"],
    PK: ["Pakistan Customs (Federal Board of Revenue — FBR)", "Pakistan Standards & Quality Control Authority (PSQCA)"],
    BR: ["Receita Federal do Brasil", "ANVISA (for regulated goods)"],
    CN: ["General Administration of Customs of China (GACC)", "State Administration for Market Regulation (SAMR)"],
    KR: ["Korea Customs Service (KCS)", "Ministry of Trade, Industry and Energy (MOTIE)"],
    VN: ["General Department of Vietnam Customs (GDVC)", "Ministry of Industry and Trade (MOIT)"],
    TW: ["Customs Administration, Ministry of Finance", "Bureau of Standards, Metrology and Inspection (BSMI)"],
    TR: ["Turkish Customs Administration", "Ministry of Trade"],
};

// ============================================================
// Types
// ============================================================

interface CountryResearch {
    regulatory_body_1: string;
    regulatory_body_2: string;
    de_minimis_threshold: string;
    de_minimis_currency: string;
    applicable_ftas: string[];
    fta_details: string;
    penalty_mechanism: string;
    required_certifications: string[];
    compliance_nuance: string;
    bonded_warehouse_program: string;
    preferential_tariff_programs: string[];
    anti_dumping_relevant: boolean;
    anti_dumping_details: string;
    currency: string;
}

const BANNED_PHRASES = [
    "it is crucial", "it is essential", "it is recommended", "in conclusion",
    "it goes without saying", "it's worth noting", "navigating the complexities",
    "understanding the nuances", "it is important to ensure", "it is important to note",
    "plays a vital role", "in today's global", "the landscape of",
    "navigating the landscape", "a key consideration",
];

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

// ============================================================
// STEP 1: Country Research Agent
// ============================================================

async function runResearchAgent(
    groq: Groq, product: string, origin: string, dest: string,
    hsCode: string, dutyRate: number, vatRate: number
): Promise<CountryResearch> {
    const originName = COUNTRY_NAMES[origin] || origin;
    const destName = COUNTRY_NAMES[dest] || dest;
    const defaultBodies = REGULATORY_BODIES[dest] || [`${destName} Customs Authority`, `${destName} Trade Ministry`];
    const currency = TRADE_CURRENCIES[dest] || "USD";

    const prompt = `You are a licensed customs broker with 20 years of hands-on experience clearing goods into ${destName}.

I need VERIFIED, SPECIFIC facts about importing "${product}" from ${originName} to ${destName} in 2026. Do NOT guess. If you are uncertain about a specific detail, say "verify with your customs broker" for that item.

Return ONLY a JSON object with these exact keys:

{
    "regulatory_body_1": "The PRIMARY customs/revenue authority in ${destName} that handles import declarations. Use the full official name.",
    "regulatory_body_2": "The SECONDARY regulatory body relevant to ${product} imports. Use full official name.",
    "de_minimis_threshold": "The exact de minimis value below which no customs duties are collected in ${destName}. Give the number only, or 'N/A' if no threshold exists.",
    "de_minimis_currency": "${currency}",
    "applicable_ftas": ["List ONLY Free Trade Agreements that ACTUALLY exist between ${originName} and ${destName} as of 2026. Return empty array if none exist."],
    "fta_details": "One sentence explaining the FTA benefit for this product, or 'No bilateral FTA exists between ${originName} and ${destName}.' if none apply.",
    "penalty_mechanism": "The specific penalty or consequence for HS code misclassification in ${destName}.",
    "required_certifications": ["List specific certifications or standards required to import ${product} into ${destName}. Return empty array if none apply."],
    "compliance_nuance": "ONE country-specific compliance requirement that a generic guide would miss.",
    "bonded_warehouse_program": "Name the bonded warehouse or Free Trade Zone program available in ${destName}.",
    "preferential_tariff_programs": ["List preferential tariff schemes available in ${destName}. Return empty array if none apply."],
    "anti_dumping_relevant": false,
    "anti_dumping_details": "",
    "currency": "${currency}"
}`;

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a customs compliance data researcher. Return ONLY valid JSON. No markdown. No explanation." },
                { role: "user", content: prompt }
            ],
            temperature: 0.2,
            max_completion_tokens: 1500,
            response_format: { type: "json_object" }
        });

        const parsed = JSON.parse(response.choices[0]?.message?.content || "{}");
        return {
            regulatory_body_1: parsed.regulatory_body_1 || defaultBodies[0] || `${destName} Customs Authority`,
            regulatory_body_2: parsed.regulatory_body_2 || defaultBodies[1] || `${destName} Trade Ministry`,
            de_minimis_threshold: parsed.de_minimis_threshold || "N/A",
            de_minimis_currency: parsed.de_minimis_currency || currency,
            applicable_ftas: Array.isArray(parsed.applicable_ftas) ? parsed.applicable_ftas : [],
            fta_details: parsed.fta_details || `No bilateral FTA exists between ${originName} and ${destName}.`,
            penalty_mechanism: parsed.penalty_mechanism || `${defaultBodies[0] || destName} may impose penalties including duty reassessment and fines for misclassification.`,
            required_certifications: Array.isArray(parsed.required_certifications) ? parsed.required_certifications : [],
            compliance_nuance: parsed.compliance_nuance || "",
            bonded_warehouse_program: parsed.bonded_warehouse_program || `${destName} Customs Warehousing`,
            preferential_tariff_programs: Array.isArray(parsed.preferential_tariff_programs) ? parsed.preferential_tariff_programs : [],
            anti_dumping_relevant: !!parsed.anti_dumping_relevant,
            anti_dumping_details: parsed.anti_dumping_details || "",
            currency: parsed.currency || currency,
        };
    } catch {
        return {
            regulatory_body_1: defaultBodies[0] || `${destName} Customs Authority`,
            regulatory_body_2: defaultBodies[1] || `${destName} Trade Ministry`,
            de_minimis_threshold: "N/A", de_minimis_currency: currency,
            applicable_ftas: [], fta_details: `No bilateral FTA exists between ${originName} and ${destName}.`,
            penalty_mechanism: `${defaultBodies[0] || destName} may impose penalties.`,
            required_certifications: [], compliance_nuance: "",
            bonded_warehouse_program: `${destName} Customs Warehousing`,
            preferential_tariff_programs: [], anti_dumping_relevant: false,
            anti_dumping_details: "", currency,
        };
    }
}

// ============================================================
// STEP 2: Longform HTML Guide Writer
// ============================================================

function buildGuidePrompt(
    product: string, origin: string, dest: string,
    hsCode: string, dutyRate: number, vatRate: number,
    research: CountryResearch
): string {
    const originName = COUNTRY_NAMES[origin] || origin;
    const destName = COUNTRY_NAMES[dest] || dest;
    const currency = research.currency;
    const year = "2026";

    const ftaSection = research.applicable_ftas.length > 0
        ? `Applicable FTAs: ${research.applicable_ftas.join(", ")}. ${research.fta_details}`
        : `No bilateral Free Trade Agreement exists between ${originName} and ${destName}. State this clearly.`;
    const certSection = research.required_certifications.length > 0
        ? `Required certifications: ${research.required_certifications.join(", ")}.`
        : `No special product certifications are required beyond standard customs documentation.`;
    const antiDumpingInstruction = research.anti_dumping_relevant
        ? `Anti-dumping duties ARE relevant. Details: ${research.anti_dumping_details}. Include the <h3>Anti-Dumping or Safeguard Duties</h3> section.`
        : `Anti-dumping duties are NOT relevant. OMIT the Anti-Dumping H3 section entirely.`;
    const preferentialPrograms = research.preferential_tariff_programs.length > 0
        ? research.preferential_tariff_programs.join(", ")
        : "No preferential tariff programs apply to this route.";

    return `You are a senior customs compliance specialist and international trade expert with 20+ years of experience writing for DutyDecoder.com.

STRICT CONTENT RULES:
- NEVER use: "it is crucial", "it is essential", "it is recommended", "in conclusion", "it goes without saying", "it's worth noting", "navigating the complexities", "understanding the nuances"
- NEVER write in passive voice more than 10% of the time
- NEVER exceed 2 sentences per paragraph in FAQ answers
- NEVER start consecutive paragraphs with the same word
- Write every sentence as if a licensed customs broker reviewed it
- Use SPECIFIC, ACTIONABLE language: name the exact form, body, or procedure
- Cite ${research.regulatory_body_1} by name where enforcement/filing is discussed
- Use "${product}" naturally 1-2 times per H2 section
- Vary sentence length: mix short punchy sentences with detailed technical ones
- Write in active voice: "${research.regulatory_body_1} requires..." not "It is required by..."

VERIFIED DATA:
- Product: ${product} | Origin: ${originName} | Destination: ${destName}
- HS Code: ${hsCode} | Duty: ${dutyRate}% | VAT/GST: ${vatRate}% | Currency: ${currency} | Year: ${year}
- Regulatory Body 1: ${research.regulatory_body_1} | Body 2: ${research.regulatory_body_2}
- De Minimis: ${research.de_minimis_threshold} ${research.de_minimis_currency}
- ${ftaSection}
- ${certSection}
- Compliance nuance: ${research.compliance_nuance}
- Bonded warehouse: ${research.bonded_warehouse_program}
- Preferential programs: ${preferentialPrograms}
- Penalty: ${research.penalty_mechanism}
- ${antiDumpingInstruction}

OUTPUT — Use EXACTLY this heading hierarchy in clean HTML:

<h2>${year} Tariff & Cost Breakdown for Importing ${product}</h2>
→ 1 paragraph: plain-English cost explanation. Reference ${dutyRate}% duty, ${vatRate}% VAT, CIF value, ${currency}.

<h2>HS Code Classification for ${product}</h2>
<h3>Primary HS Code: ${hsCode} — What It Covers</h3>
<h3>Why Misclassification Carries Risk in ${destName}</h3>

<h2>Step-by-Step Guide: Importing ${product} from ${originName} to ${destName}</h2>
<h3>Step 1: Verify Your HS Code & Product Description</h3>
<h3>Step 2: Gather Required Import Documents</h3>
<h4>Commercial Invoice Requirements</h4>
<h4>Certificate of Origin</h4>
<h4>Packing List & Shipping Documents</h4>
<h3>Step 3: Calculate Your Landed Cost</h3>
→ Show formula: CIF + Duty (${dutyRate}%) + VAT (${vatRate}%) = Total. Use ${currency}.
<h3>Step 4: Submit to ${destName} Customs Authority</h3>
<h3>Step 5: Pay Duties & Clear Goods</h3>

<h2>How to Legally Reduce Duty on ${product} Imports into ${destName}</h2>
<h3>Applicable Free Trade Agreements in ${year}</h3>
<h3>Duty Deferral Options: Bonded Warehouses & FTZs</h3>
<h3>Preferential Tariff Programs</h3>

<h2>${destName} Customs Compliance Rules for ${product}</h2>
<h3>${research.regulatory_body_1} Requirements for ${product}</h3>
<h3>De Minimis Threshold</h3>
${research.anti_dumping_relevant ? `<h3>Anti-Dumping or Safeguard Duties</h3>` : ""}

<h2>Frequently Asked Questions About ${product} Import Duty from ${originName} to ${destName}</h2>
→ 6 FAQs wrapped in: <div class="faq-item"><h3>Question?</h3><p>Answer (2-3 sentences).</p></div>

Output in this exact order:
1. <meta_description> tag (150-160 chars)
2. Full HTML content
3. <disclaimer>Rates are based on ${year} tariff schedules. Verify with a licensed customs broker before making import decisions.</disclaimer>

Do NOT include <h1>, preamble, or commentary.`;
}

async function runGuideWriter(
    groq: Groq, product: string, origin: string, dest: string,
    hsCode: string, dutyRate: number, vatRate: number,
    research: CountryResearch
): Promise<{ html: string; metaDescription: string } | null> {
    const prompt = buildGuidePrompt(product, origin, dest, hsCode, dutyRate, vatRate, research);

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are a senior customs compliance specialist writing for DutyDecoder.com. Output clean semantic HTML only. No markdown. No code fences. Start directly with the <meta_description> tag.
- Start paragraphs with the key fact, not a transition
- Use <strong> tags for key terms, rates, and regulatory body names
- Use <p> tags for paragraphs, not line breaks
- Never use "it is important", "it is crucial", "it is essential", "it is recommended", or "in conclusion"`
                },
                { role: "user", content: prompt }
            ],
            temperature: 0.65,
            max_completion_tokens: 8192,
        });

        const rawContent = response.choices[0]?.message?.content || "";
        if (!rawContent || rawContent.length < 500) return null;

        const metaMatch = rawContent.match(/<meta_description>([\s\S]*?)<\/meta_description>/);
        const metaDescription = metaMatch?.[1]?.trim().slice(0, 160) ?? "";

        let html = rawContent
            .replace(/<meta_description>[\s\S]*?<\/meta_description>\s*/g, "")
            .replace(/^```html?\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        return { html, metaDescription };
    } catch {
        return null;
    }
}

// ============================================================
// STEP 3: Quality Validator
// ============================================================

function validateGuideQuality(html: string): { pass: boolean; issues: string[] } {
    const issues: string[] = [];
    const lowerHtml = html.toLowerCase();

    const requiredH2s = ["Tariff & Cost Breakdown", "HS Code Classification", "Step-by-Step Guide", "Legally Reduce Duty", "Customs Compliance Rules", "Frequently Asked Questions"];
    for (const h2 of requiredH2s) {
        if (!lowerHtml.includes(h2.toLowerCase())) issues.push(`Missing H2: "${h2}"`);
    }

    for (const phrase of BANNED_PHRASES) {
        if (lowerHtml.includes(phrase.toLowerCase())) issues.push(`Banned: "${phrase}"`);
    }

    if (!html.includes("<h2>")) issues.push("No H2 tags");

    const textOnly = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (textOnly.split(/\s+/).length < 800) issues.push("Content too short");

    return { pass: issues.length === 0, issues };
}

// ============================================================
// Main Export: Generate Guide for a Single Page
// ============================================================

export async function generateGuideForPage(
    rowId: string,
    product: string,
    origin: string,
    dest: string,
    hsCode: string,
    dutyRate: number,
    vatRate: number,
    supabase: SupabaseClient,
    groqClient?: Groq
): Promise<boolean> {
    const client = groqClient || new Groq({ apiKey: process.env.GROQ_API_KEY });

    try {
        // STEP 1: Research
        const research = await runResearchAgent(client, product, origin, dest, hsCode, dutyRate, vatRate);
        await sleep(1000);

        // STEP 2: Write Guide
        let result = await runGuideWriter(client, product, origin, dest, hsCode, dutyRate, vatRate, research);
        await sleep(1000);

        if (!result) {
            console.error(`[Guide Pipeline] Writer returned null for ${product} (${origin}->${dest})`);
            return false;
        }

        // STEP 3: Validate
        const validation = validateGuideQuality(result.html);
        if (!validation.pass) {
            console.warn(`[Guide Pipeline] Validation issues: ${validation.issues.join("; ")}`);
            // One retry
            if (validation.issues.some(i => i.includes("Banned") || i.includes("Missing H2") || i.includes("too short"))) {
                await sleep(2000);
                const retry = await runGuideWriter(client, product, origin, dest, hsCode, dutyRate, vatRate, research);
                if (retry && retry.html.length > result.html.length) {
                    const rv = validateGuideQuality(retry.html);
                    if (rv.issues.length < validation.issues.length) result = retry;
                }
            }
        }

        // Save to DB
        const { error } = await supabase
            .from("landed_costs")
            .update({ guide_html: result.html, guide_meta_description: result.metaDescription })
            .eq("id", rowId);

        if (error) {
            console.error(`[Guide Pipeline] DB update failed: ${error.message}`);
            return false;
        }

        const wordCount = result.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().split(/\s+/).length;
        console.log(`[Guide Pipeline] ✅ Saved guide for ${product} (${origin}->${dest}): ${wordCount} words`);
        return true;
    } catch (err: any) {
        console.error(`[Guide Pipeline] ❌ Failed for ${product}: ${err.message}`);
        return false;
    }
}
