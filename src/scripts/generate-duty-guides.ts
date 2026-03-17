import { createClient } from "@supabase/supabase-js";
import Groq from "groq-sdk";
import pLimit from "p-limit";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GROQ_API_KEY = process.env.GROQ_API_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !GROQ_API_KEY) {
    console.error("Missing required environment variables.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const groq = new Groq({ apiKey: GROQ_API_KEY });
const limit = pLimit(6); // 2X speed — higher concurrency

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

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
// STEP 1: Country Research Agent
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

async function runResearchAgent(
    product: string, origin: string, dest: string,
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
    "regulatory_body_2": "The SECONDARY regulatory body relevant to ${product} imports (e.g., product safety, standards, health authority). Use full official name.",
    "de_minimis_threshold": "The exact de minimis value below which no customs duties are collected in ${destName}. Give the number only, or 'N/A' if no threshold exists.",
    "de_minimis_currency": "${currency}",
    "applicable_ftas": ["List ONLY Free Trade Agreements that ACTUALLY exist between ${originName} and ${destName} as of 2026. Return empty array if none exist. Examples: USMCA, CPTPP, RCEP, UK-Japan CEPA, etc."],
    "fta_details": "One sentence explaining the FTA benefit for this product, or 'No bilateral FTA exists between ${originName} and ${destName}.' if none apply.",
    "penalty_mechanism": "The specific penalty or consequence for HS code misclassification in ${destName}. Name the penalty type (fine, seizure, duty reassessment, criminal liability) and which authority enforces it.",
    "required_certifications": ["List specific certifications or standards required to import ${product} into ${destName}. Examples: CE marking, FDA approval, BIS certification, SASO, NOM, etc. Return empty array if no special certifications apply."],
    "compliance_nuance": "ONE country-specific compliance requirement that a generic guide would miss. Examples: Mexico's pedimento system, India's IGST structure, EU's REACH regulation, US's ISF 10+2 filing, Japan's JETRO pre-clearance system, etc. Be specific to ${destName}.",
    "bonded_warehouse_program": "Name the bonded warehouse or Free Trade Zone program available in ${destName}. Example: US Foreign Trade Zones (FTZ), UK Customs Warehousing, EU Customs Warehousing Procedure, etc.",
    "preferential_tariff_programs": ["List preferential tariff schemes available in ${destName}. Examples: US GSP, EU GSP/GSP+/EBA, Australia's DCS, Canada's GPT, etc. Return empty array if none apply."],
    "anti_dumping_relevant": false,
    "anti_dumping_details": "Only fill this if anti-dumping or countervailing duties are known to apply to ${product} from ${originName} into ${destName}. Otherwise leave as empty string.",
    "currency": "${currency}"
}`;

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a customs compliance data researcher. Return ONLY valid JSON. No markdown. No explanation. Be factually precise — wrong data is worse than saying 'verify with your customs broker'."
                },
                { role: "user", content: prompt }
            ],
            temperature: 0.2,
            max_completion_tokens: 1500,
            response_format: { type: "json_object" }
        });

        const parsed = JSON.parse(response.choices[0]?.message?.content || "{}");

        return {
            regulatory_body_1: parsed.regulatory_body_1 || defaultBodies[0],
            regulatory_body_2: parsed.regulatory_body_2 || defaultBodies[1],
            de_minimis_threshold: parsed.de_minimis_threshold || "N/A",
            de_minimis_currency: parsed.de_minimis_currency || currency,
            applicable_ftas: Array.isArray(parsed.applicable_ftas) ? parsed.applicable_ftas : [],
            fta_details: parsed.fta_details || `No bilateral FTA exists between ${originName} and ${destName}.`,
            penalty_mechanism: parsed.penalty_mechanism || `${defaultBodies[0]} may impose penalties including duty reassessment and fines for misclassification.`,
            required_certifications: Array.isArray(parsed.required_certifications) ? parsed.required_certifications : [],
            compliance_nuance: parsed.compliance_nuance || "",
            bonded_warehouse_program: parsed.bonded_warehouse_program || `${destName} Customs Warehousing`,
            preferential_tariff_programs: Array.isArray(parsed.preferential_tariff_programs) ? parsed.preferential_tariff_programs : [],
            anti_dumping_relevant: !!parsed.anti_dumping_relevant,
            anti_dumping_details: parsed.anti_dumping_details || "",
            currency: parsed.currency || currency,
        };
    } catch (err) {
        console.warn(`⚠️ Research Agent failed for ${product} (${origin}->${dest}). Using defaults.`);
        return {
            regulatory_body_1: defaultBodies[0] || `${destName} Customs Authority`,
            regulatory_body_2: defaultBodies[1] || `${destName} Trade Ministry`,
            de_minimis_threshold: "N/A",
            de_minimis_currency: currency,
            applicable_ftas: [],
            fta_details: `No bilateral FTA exists between ${originName} and ${destName}.`,
            penalty_mechanism: `${defaultBodies[0]} may impose penalties including duty reassessment and fines for misclassification.`,
            required_certifications: [],
            compliance_nuance: "",
            bonded_warehouse_program: `${destName} Customs Warehousing`,
            preferential_tariff_programs: [],
            anti_dumping_relevant: false,
            anti_dumping_details: "",
            currency,
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
        : `Anti-dumping duties are NOT relevant for this product/route. OMIT the Anti-Dumping H3 section entirely.`;

    const preferentialPrograms = research.preferential_tariff_programs.length > 0
        ? research.preferential_tariff_programs.join(", ")
        : "No preferential tariff programs apply to this route.";

    return `You are a senior customs compliance specialist and international trade expert with 20+ years of experience. You have deep hands-on knowledge of customs procedures, tariff schedules, HS code classification, VAT/GST systems, and import regulations for countries worldwide.

You are writing content for DutyDecoder.com — an authoritative, data-driven import duty reference tool used by importers, freight forwarders, customs brokers, and trade compliance teams.

STRICT CONTENT RULES — FOLLOW EVERY ONE:

NEVER DO THIS:
- NEVER write vague, generic advice like "it is important to ensure compliance"
- NEVER use these filler phrases: "it is crucial", "it is essential", "it is recommended", "in conclusion", "it goes without saying", "it's worth noting", "navigating the complexities", "understanding the nuances"
- NEVER fabricate specific penalty percentages, fines, or legal codes unless provided below
- NEVER write in passive voice more than 10% of the time
- NEVER repeat the same information across different sections
- NEVER exceed 2 sentences per paragraph in FAQ answers
- NEVER use generic transition sentences between sections
- NEVER start consecutive paragraphs with the same word
- NEVER use the word "landscape" or "navigate" in a metaphorical sense

ALWAYS DO THIS:
- Write every sentence as if a licensed customs broker reviewed it
- Use SPECIFIC, ACTIONABLE language: name the exact form, body, or procedure
- Cite ${research.regulatory_body_1} by name in every section where enforcement/filing is discussed
- Each FAQ must answer something NOT already covered in the body text
- Use "${product}" naturally 1-2 times per H2 section (no more)
- Include at least ONE country-specific compliance nuance per major section that a generic AI would miss
- Vary sentence length: mix short punchy sentences (under 10 words) with detailed technical ones (20-30 words)
- Lead every paragraph with the most important fact
- Write in active voice: "${research.regulatory_body_1} requires..." not "It is required by..."

VERIFIED RESEARCH DATA (use these facts, do NOT invent others):
- Product: ${product}
- Origin Country: ${originName}
- Destination Country: ${destName}
- HS Code: ${hsCode}
- Customs Duty Rate: ${dutyRate}%
- VAT/GST Rate: ${vatRate}%
- Currency: ${currency}
- Data Year: ${year}
- Regulatory Body 1: ${research.regulatory_body_1}
- Regulatory Body 2: ${research.regulatory_body_2}
- De Minimis Threshold: ${research.de_minimis_threshold} ${research.de_minimis_currency}
- ${ftaSection}
- ${certSection}
- Country-specific nuance: ${research.compliance_nuance}
- Bonded warehouse program: ${research.bonded_warehouse_program}
- Preferential programs: ${preferentialPrograms}
- Penalty mechanism: ${research.penalty_mechanism}
- ${antiDumpingInstruction}

OUTPUT STRUCTURE — Use EXACTLY this heading hierarchy. Output in clean HTML with proper semantic tags. Do NOT output markdown.

<h2>${year} Tariff & Cost Breakdown for Importing ${product}</h2>
→ 1 paragraph: plain-English explanation of what each cost component means for ${product} imported into ${destName}. Reference the ${dutyRate}% duty rate and ${vatRate}% VAT rate. Mention that duties are calculated on CIF value. Use ${currency}.

<h2>HS Code Classification for ${product}</h2>
<h3>Primary HS Code: ${hsCode} — What It Covers</h3>
→ 2-3 precise sentences explaining what HS ${hsCode} classifies.
<h3>Why Misclassification Carries Risk in ${destName}</h3>
→ Name the specific penalty mechanism: ${research.penalty_mechanism}. Cite ${research.regulatory_body_1} as the enforcing authority.

<h2>Step-by-Step Guide: Importing ${product} from ${originName} to ${destName}</h2>
<h3>Step 1: Verify Your HS Code & Product Description</h3>
→ Reference the ${destName} tariff lookup tool. Mention binding tariff information if available.
<h3>Step 2: Gather Required Import Documents</h3>
<h4>Commercial Invoice Requirements</h4>
→ List specific fields required on the commercial invoice for ${destName} customs.
<h4>Certificate of Origin</h4>
→ Explain when a CO is needed and which format ${destName} accepts. ${research.applicable_ftas.length > 0 ? `Mention the ${research.applicable_ftas[0]} origin certificate if applicable.` : ""}
<h4>Packing List & Shipping Documents</h4>
→ Bill of lading/airway bill requirements. Mention specific ${destName} requirements.
<h3>Step 3: Calculate Your Landed Cost</h3>
→ Show the formula: CIF Value + Customs Duty (${dutyRate}% of CIF) + VAT/GST (${vatRate}% of CIF + Duty) = Total Landed Cost. Use ${currency}.
<h3>Step 4: Submit to ${destName} Customs Authority</h3>
→ Name the specific declaration system used by ${research.regulatory_body_1}. ${research.compliance_nuance ? `Include: ${research.compliance_nuance}` : ""}
<h3>Step 5: Pay Duties & Clear Goods</h3>
→ Explain payment methods accepted and typical clearance timeline.

<h2>How to Legally Reduce Duty on ${product} Imports into ${destName}</h2>
<h3>Applicable Free Trade Agreements in ${year}</h3>
→ ${research.applicable_ftas.length > 0 ? `Cover: ${research.applicable_ftas.join(", ")}. Explain the duty reduction benefit.` : `State clearly: No bilateral FTA exists between ${originName} and ${destName} as of ${year}.`}
<h3>Duty Deferral Options: Bonded Warehouses & FTZs</h3>
→ Reference ${research.bonded_warehouse_program}. Explain how duty deferral works in ${destName}.
<h3>Preferential Tariff Programs</h3>
→ ${research.preferential_tariff_programs.length > 0 ? `Cover: ${preferentialPrograms}.` : `State that no preferential programs currently apply to ${product} from ${originName}.`}

<h2>${destName} Customs Compliance Rules for ${product}</h2>
<h3>${research.regulatory_body_1} Requirements for ${product}</h3>
→ Specific filing and documentation requirements enforced by ${research.regulatory_body_1}. ${certSection}
<h3>De Minimis Threshold</h3>
→ State the threshold: ${research.de_minimis_threshold} ${research.de_minimis_currency}. Explain what it means for this shipment.
${research.anti_dumping_relevant ? `<h3>Anti-Dumping or Safeguard Duties</h3>\n→ ${research.anti_dumping_details}` : ""}

<h2>Frequently Asked Questions About ${product} Import Duty from ${originName} to ${destName}</h2>
→ Write exactly 6 FAQs. Each FAQ MUST cover a unique angle NOT addressed in the body text above.
→ Each answer: 2-3 sentences, specific, no fluff.
→ FAQ topics MUST include: (1) duty rate explanation, (2) documents checklist, (3) FTA eligibility, (4) penalties for non-compliance, (5) clearance timeline, (6) one wild-card topic specific to ${product} in ${destName}.
→ Wrap each FAQ in: <div class="faq-item"><h3>Question here?</h3><p>Answer here.</p></div>

SEO REQUIREMENTS:
- Primary keyword: "${product} import duty ${originName} to ${destName}"
- Weave in naturally (do NOT stuff): "${product} customs duty ${destName}", "${product} HS code ${destName}", "${product} landed cost ${destName}", "import ${product} from ${originName} ${year}"
- Target keyword density: 1.2%–1.8% for primary keyword
- Every H2 must contain at least one keyword variation

TONE: Authoritative but accessible — like a customs broker explaining to a smart business owner. Direct. Confident. Zero corporate jargon.

Output in this exact order:
1. <meta_description> tag (150-160 characters, include primary keyword, duty rate, and year)
2. Full HTML content (all H2 through FAQs)
3. <disclaimer>Rates are based on ${year} tariff schedules. Verify with a licensed customs broker before making import decisions.</disclaimer>

Do NOT include <h1>, any preamble, commentary, or explanation outside the requested output.`;
}

async function runGuideWriter(
    product: string, origin: string, dest: string,
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
                    content: `You are a senior customs compliance specialist writing for DutyDecoder.com. Output clean semantic HTML only. No markdown. No code fences. No preamble. Start directly with the <meta_description> tag.

Your writing style rules:
- Start paragraphs with the key fact, not a transition
- Alternate between short sentences (5-10 words) and detailed ones (20-30 words)
- Use <strong> tags for key terms, rates, and regulatory body names
- Use <p> tags for paragraphs, not line breaks
- Never use "it is important", "it is crucial", "it is essential", "it is recommended", or "in conclusion"
- Write as if your reader is a business owner who has imported before but needs route-specific details
- Every claim about a regulatory body, threshold, or penalty must use the data provided in the prompt — do not invent additional legal details`
                },
                { role: "user", content: prompt }
            ],
            temperature: 0.65,
            max_completion_tokens: 8192,
        });

        const rawContent = response.choices[0]?.message?.content || "";

        if (!rawContent || rawContent.length < 500) {
            console.warn(`⚠️ Guide Writer returned insufficient content (${rawContent.length} chars)`);
            return null;
        }

        // Extract meta description
        const metaMatch = rawContent.match(/<meta_description>([\s\S]*?)<\/meta_description>/);
        const metaDescription = metaMatch?.[1]?.trim().slice(0, 160) ?? "";

        // Extract the main HTML (everything between meta_description and disclaimer, inclusive of disclaimer)
        let html = rawContent;

        // Remove meta_description tags from the HTML body
        html = html.replace(/<meta_description>[\s\S]*?<\/meta_description>\s*/g, "").trim();

        // Clean up any markdown code fences the model might wrap around the output
        html = html.replace(/^```html?\s*/i, "").replace(/\s*```$/i, "").trim();

        // Sanitize: force all internal links to https
        html = html.replace(/http:\/\/(www\.)?dutydecoder\.com/gi, 'https://dutydecoder.com');

        return { html, metaDescription };
    } catch (err: any) {
        console.error(`❌ Guide Writer failed: ${err.message}`);
        return null;
    }
}

// ============================================================
// STEP 3: Quality Validator
// ============================================================

const BANNED_PHRASES = [
    "it is crucial", "it is essential", "it is recommended", "in conclusion",
    "it goes without saying", "it's worth noting", "navigating the complexities",
    "understanding the nuances", "it is important to ensure", "it is important to note",
    "plays a vital role", "in today's global", "the landscape of",
    "navigating the landscape", "a key consideration",
];

interface ValidationResult {
    pass: boolean;
    issues: string[];
}

function validateGuideQuality(html: string, product: string): ValidationResult {
    const issues: string[] = [];

    // Check required H2 sections exist
    const requiredH2s = [
        "Tariff & Cost Breakdown",
        "HS Code Classification",
        "Step-by-Step Guide",
        "Legally Reduce Duty",
        "Customs Compliance Rules",
        "Frequently Asked Questions",
    ];
    for (const h2 of requiredH2s) {
        if (!html.toLowerCase().includes(h2.toLowerCase())) {
            issues.push(`Missing H2 section: "${h2}"`);
        }
    }

    // Check for banned phrases
    const lowerHtml = html.toLowerCase();
    for (const phrase of BANNED_PHRASES) {
        if (lowerHtml.includes(phrase.toLowerCase())) {
            issues.push(`Contains banned phrase: "${phrase}"`);
        }
    }

    // Check FAQ count (look for faq-item divs or h3 tags within FAQ section)
    const faqMatches = html.match(/<div class="faq-item">/g) || [];
    const faqH3inSection = html.match(/class="faq-item"[\s\S]*?<h3>/g) || [];
    // Also count h3 tags after the FAQ h2 if faq-items aren't used
    if (faqMatches.length < 5 && faqH3inSection.length < 5) {
        // Fallback: count all h3 tags after "Frequently Asked"
        const faqSectionStart = html.indexOf("Frequently Asked");
        if (faqSectionStart > -1) {
            const faqSection = html.slice(faqSectionStart);
            const h3Count = (faqSection.match(/<h3>/g) || []).length;
            if (h3Count < 5) {
                issues.push(`Only ${Math.max(faqMatches.length, h3Count)} FAQs found (need 6)`);
            }
        } else {
            issues.push("FAQ section not found");
        }
    }

    // Check meta description was extractable (checked upstream, but belt-and-suspenders)
    if (!html.includes("<h2>")) {
        issues.push("No H2 tags found — likely malformed output");
    }

    // Check minimum content length (~2000+ words expected)
    const textOnly = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const wordCount = textOnly.split(/\s+/).length;
    if (wordCount < 800) {
        issues.push(`Content too short: ${wordCount} words (expected 1500+)`);
    }

    // Check disclaimer exists
    if (!html.includes("<disclaimer>") && !html.toLowerCase().includes("verify with a licensed customs broker")) {
        issues.push("Missing disclaimer section");
    }

    return {
        pass: issues.length === 0,
        issues,
    };
}

// ============================================================
// Pipeline Orchestrator
// ============================================================

async function generateGuideForRow(row: any) {
    const product = row.product_description;
    const origin = row.origin_country;
    const dest = row.destination_country;
    const calcJson = row.calculation_json as any;

    // Extract HS code and rates from existing data
    const hsCode = (row as any).hts_codes?.hts_code || calcJson?.raw?.htsId || "0000.00.0000";
    const dutyRateStr = calcJson?.customsDuty?.rate || "0%";
    const vatRateStr = calcJson?.vatGst?.rate || "0%";
    const dutyRate = parseFloat(dutyRateStr.replace("%", "")) || 0;
    const vatRate = parseFloat(vatRateStr.replace("%", "")) || 0;

    try {
        // STEP 1: Research
        console.log(`  📊 Step 1/3: Researching ${product} (${origin}->${dest})...`);
        const research = await runResearchAgent(product, origin, dest, hsCode, dutyRate, vatRate);
        await sleep(500); // Rate limit breathing room

        // STEP 2: Write Guide
        console.log(`  ✍️  Step 2/3: Writing longform guide...`);
        let result = await runGuideWriter(product, origin, dest, hsCode, dutyRate, vatRate, research);
        await sleep(500);

        if (!result) {
            console.error(`  ❌ Guide Writer returned null for ${product} (${origin}->${dest})`);
            return;
        }

        // STEP 3: Validate
        console.log(`  🔍 Step 3/3: Validating quality...`);
        const validation = validateGuideQuality(result.html, product);

        if (!validation.pass) {
            console.warn(`  ⚠️  Validation issues: ${validation.issues.join("; ")}`);

            // One retry with specific fix instructions
            if (validation.issues.some(i => i.includes("banned phrase") || i.includes("Missing H2") || i.includes("too short"))) {
                console.log(`  🔄 Retrying with fix instructions...`);
                await sleep(1000);

                // Re-run Step 2 with additional instructions about the issues
                const retryResult = await runGuideWriter(product, origin, dest, hsCode, dutyRate, vatRate, research);
                if (retryResult && retryResult.html.length > result.html.length) {
                    const retryValidation = validateGuideQuality(retryResult.html, product);
                    if (retryValidation.issues.length < validation.issues.length) {
                        result = retryResult;
                        console.log(`  ✅ Retry improved quality (${retryValidation.issues.length} issues remaining)`);
                    }
                }
            }
        }

        // Save to database
        const { error } = await supabase
            .from("landed_costs")
            .update({
                guide_html: result.html,
                guide_meta_description: result.metaDescription,
            })
            .eq("id", row.id);

        if (error) {
            console.error(`  ❌ DB update failed for ${row.slug}: ${error.message}`);
        } else {
            const statusIcon = validation.pass ? "✅" : "⚠️";
            const wordCount = result.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().split(/\s+/).length;
            console.log(`  ${statusIcon} Saved: ${row.slug} (${wordCount} words, meta: ${result.metaDescription.length} chars)`);
        }
    } catch (err: any) {
        console.error(`  ❌ Pipeline failed for ${product} (${origin}->${dest}): ${err.message}`);
    }
}

// ============================================================
// Main Runner
// ============================================================

async function run() {
    const isTest = process.argv.includes("--test");
    const slugFilter = process.argv.find(a => a.startsWith("--slug="))?.split("=")[1];

    console.log("🚀 DutyDecoder Longform Guide Generator (3-Step AI Pipeline)");
    console.log("   Step 1: Country Research Agent (Llama-3.3-70b, temp: 0.2)");
    console.log("   Step 2: Longform HTML Writer (Llama-3.3-70b, temp: 0.65)");
    console.log("   Step 3: Quality Validator (local rules + banned phrase scan)");
    console.log("");

    // Build query
    let query = supabase
        .from("landed_costs")
        .select("id, slug, product_description, origin_country, destination_country, calculation_json, hts_codes(hts_code, description)")
        .is("guide_html", null) // Only rows without a guide
        .not("product_description", "is", null)
        .not("slug", "is", null);

    if (slugFilter) {
        query = query.eq("slug", slugFilter);
    }

    if (isTest) {
        query = query.limit(1);
    } else {
        query = query.limit(1000);
    }

    const { data: rows, error } = await query;

    if (error) {
        console.error("❌ Failed to fetch rows:", error.message);
        return;
    }

    if (!rows || rows.length === 0) {
        console.log("✅ No rows need guide generation. All caught up!");
        return;
    }

    console.log(`📦 Found ${rows.length} pages to generate guides for.\n`);

    // Process with concurrency limit
    const tasks = rows.map(row => () => limit(() => generateGuideForRow(row)));

    const BATCH_SIZE = 50;
    for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
        console.log(`\n═══════════ BATCH ${Math.floor(i / BATCH_SIZE) + 1} (${i + 1}-${Math.min(i + BATCH_SIZE, tasks.length)}/${tasks.length}) ═══════════`);

        if (i > 0) {
            console.log(`⏸️  Pause: 1 second...`);
            await sleep(1000);
        }

        const batch = tasks.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(fn => fn()));
    }

    console.log(`\n🎉 Guide generation complete! Processed ${rows.length} pages.`);
}

run();
