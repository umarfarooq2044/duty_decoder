import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

// ============================================================
// Clients
// ============================================================

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// We use Mixtral for keywords per the user request, but Mixtral is deprecated on Groq.
// We will use llama-3.1-8b-instant as the fast semantic proxy instead, as in previous scripts.
const MODEL_KEYWORD = "llama-3.1-8b-instant";
const MODEL_META = "llama-3.1-8b-instant";
const MODEL_CONTENT = "llama-3.3-70b-versatile";
const MODEL_JSON = "llama-3.1-8b-instant"; // Proxy for gemma-7b-it which is deprecated

// Define the 9 Global Pillars and their specific requirements
const PILLARS = [
    {
        slug: "import-duty",
        topic: "Import Duty",
        keywords: "import duty, customs duty, tariff rates, duty rates, how import duty works",
        sections: "What is import duty, How duty is calculated, Factors affecting duty, Role of HS code, Origin country impact, Link to calculator"
    },
    {
        slug: "customs-duty",
        topic: "Customs Duty",
        keywords: "customs duty definition, customs tariff, duty calculation method",
        sections: "What is Customs Duty, Differences from other import taxes, How customs tariffs are determined, Valuation methods, Link to calculator" // Guessed section since user didn't explicitly separate sections for this one in prompt
    },
    {
        slug: "import-tax",
        topic: "Import Tax",
        keywords: "import tax, VAT on imports, GST on imports, sales tax imports",
        sections: "Difference between duty and tax, VAT/GST mechanism, Tax base calculation, Link to calculator"
    },
    {
        slug: "tariff-rates",
        topic: "Tariff Rates",
        keywords: "tariff rates, tariff schedule, duty rates by HS code",
        sections: "Overview of global tariff schedules, MFN vs Preferential rates, How to read a tariff schedule, Link to calculator"
    },
    {
        slug: "calculate",
        topic: "Landed Cost (Calculator Hub)",
        keywords: "import duty calculator, customs duty calculator, import tax calculator, landed cost calculator, landed cost, total import cost, cost breakdown imports",
        sections: "Landed cost definition, Cost components, Calculation examples, Link to calculator"
    },
    {
        slug: "hs-code-lookup",
        topic: "HS Code Lookup",
        keywords: "HS code lookup, tariff code lookup, HS classification, harmonized system code",
        sections: "What is HS code, How classification works, Common mistakes, Link to calculator"
    },
    {
        slug: "import-documents",
        topic: "Import Documents",
        keywords: "import documents, customs paperwork, import documentation checklist",
        sections: "Invoice, Packing list, Bill of lading, Certificates, Link to calculator"
    },
    {
        slug: "import-restrictions",
        topic: "Import Restrictions",
        keywords: "import restrictions, prohibited items, restricted imports",
        sections: "Restricted goods categories, Licensing requirements, Compliance tips, Link to calculator"
    },
    {
        slug: "customs-clearance",
        topic: "Customs Clearance",
        keywords: "customs clearance, customs process, clearance fees",
        sections: "Clearance process, Courier vs freight, Fees, Link to calculator"
    }
];

// Top 5 Country Hubs for linking
const TOP_COUNTRIES = ["/usa/", "/uk/", "/canada/", "/germany/", "/india/"];

// ============================================================
// Pipeline Functions
// ============================================================

async function generateKeywords(pillar: any): Promise<any> {
    const response = await groq.chat.completions.create({
        model: MODEL_KEYWORD,
        messages: [{
            role: "user",
            content: `You are an International Trade Content Strategist. Generate semantic SEO keyword clusters for a global authority pillar page about ${pillar.topic}.
Must include these core keywords: ${pillar.keywords}.

Return JSON:
{
  "primary_keywords": ["3-5 exact match primary keywords"],
  "secondary_keywords": ["5-8 high-intent long-tail generic questions"]
}
Return ONLY valid JSON.`
        }],
        temperature: 0.2,
        response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0]?.message?.content || "{}");
}

async function generateMetadata(pillar: any): Promise<any> {
    const response = await groq.chat.completions.create({
        model: MODEL_META,
        messages: [{
            role: "user",
            content: `Generate metadata for an SEO pillar page about ${pillar.topic}. It must be globally generic, not tied to a specific country.
        
Return JSON:
{
  "title_tag": "55-60 char meta title | Duty Decoder",
  "meta_description": "140-155 char meta description summarizing the page",
  "h1": "Compelling H1 headline under 80 chars",
  "schema_notes": "FAQPage + Article schema recommended format"
}
Return ONLY valid JSON.`
        }],
        temperature: 0.2,
        response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0]?.message?.content || "{}");
}

async function generateContent(pillar: any): Promise<any> {
    const response = await groq.chat.completions.create({
        model: MODEL_CONTENT,
        messages: [{
            role: "user",
            content: `You are a Senior Programmatic SEO Architect and International Trade Expert writing a global pillar page.
Topic: ${pillar.topic}
Target Keywords: ${pillar.keywords}
Required Sections: ${pillar.sections}

Write deeply authoritative, generic content that applies globally. DO NOT hallucinate numeric duty rates. Use placeholders like "varies by product" if specific data is impossible to generalize.

Return JSON:
{
  "sections": [
    {"id": "section-slug", "heading": "Exact Heading from Required Sections", "content": "2-3 comprehensive paragraphs with <strong> tags for key terms..."},
    ...
  ],
  "faq": [
    {"question": "FAQ Question 1?", "answer": "Detailed generic answer..."},
    {"question": "FAQ Question 2?", "answer": "Detailed generic answer..."}
  ]
}

CRITICAL: Return ONLY valid JSON.`
        }],
        temperature: 0.3,
        response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0]?.message?.content || "{}");
}

// ============================================================
// Main Execution
// ============================================================

async function processPillar(pillar: any) {
    console.log(`\n🏛️  Processing Pillar: /${pillar.slug}/`);

    console.log(`   [Keywords]...`);
    const kw = await generateKeywords(pillar);

    console.log(`   [Metadata]...`);
    const meta = await generateMetadata(pillar);

    console.log(`   [Content] (Llama 70B)...`);
    const content = await generateContent(pillar);

    // Build the required internal links
    const internalLinks = [
        { url: "/calculate/", text: "Global Landed Cost Calculator", type: "calculator" },
        { url: "/hs-code-lookup/", text: "HS Code Lookup", type: "pillar" },
        { url: "/import-documents/", text: "Import Documentation", type: "pillar" },
        // Add top country hubs
        ...TOP_COUNTRIES.map(c => ({ url: c, text: `${c.replace(/\//g, '').toUpperCase()} Import Guide`, type: "country_hub" }))
    ];

    const finalData = {
        slug: pillar.slug,
        title_tag: meta.title_tag || `${pillar.topic} | Duty Decoder`,
        meta_description: meta.meta_description || `Complete global guide to ${pillar.topic.toLowerCase()}.`,
        h1: meta.h1 || pillar.topic,
        primary_keywords: kw.primary_keywords || [],
        secondary_keywords: kw.secondary_keywords || [],
        sections: content.sections || [],
        faq: content.faq || [],
        schema_notes: meta.schema_notes || "FAQPage + Article",
        internal_links: internalLinks
    };

    const { error } = await supabase
        .from("global_pillars")
        .upsert(finalData);

    if (error) {
        console.error(`   ❌ DB Error: ${error.message}`);
    } else {
        console.log(`   ✅ Saved /${pillar.slug}/ successfully`);
    }
}

async function main() {
    console.log("🚀 Global Pillar Pages Generator");
    console.log("   Rate: Sequential processing to respect Groq limits\n");

    for (const pillar of PILLARS) {
        await processPillar(pillar);
        // 3 second pause between heavy 70B calls
        await new Promise(r => setTimeout(r, 3000));
    }

    console.log("\n🎉 COMPLETE! Generated all 9 Global Pillar Pages.");
}

main().catch(console.error);
