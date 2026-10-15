import type { LandedCostBreakdown } from "@/schemas/landed-cost";

// ============================================================
// JSON-LD Structured Data Generators
// ============================================================

interface ProductJsonLdInput {
    name: string;
    description: string;
    htsCode: string;
    countryCode: string;
    url: string;
    keywords?: string[];
}

/**
 * Generate Structured Data schema for HTS code calculation reports.
 * Uses WebApplication and PropertyValue types — 100% compliant with Google Search policies.
 */
export function generateProductJsonLd(input: ProductJsonLdInput): object {
    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: `Import Duty & Landed Cost: ${input.name} (HTS ${input.htsCode})`,
        description: input.description || `Official 2026 customs duty rate, VAT/GST, and landed cost breakdown for ${input.name} under HTS code ${input.htsCode} into ${input.countryCode}.`,
        url: input.url,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        image: "https://dutydecoder.com/icon.svg",
        provider: {
            "@type": "Organization",
            name: "DutyDecoder",
            url: "https://dutydecoder.com",
            logo: "https://dutydecoder.com/icon.svg"
        },
        additionalProperty: [
            {
                "@type": "PropertyValue",
                name: "HTS Code",
                value: input.htsCode,
            },
            {
                "@type": "PropertyValue",
                name: "Destination Country",
                value: input.countryCode,
            },
            {
                "@type": "PropertyValue",
                name: "Tariff Gazette Year",
                value: "2026",
            },
        ],
        ...(input.keywords?.length ? { keywords: input.keywords.join(", ") } : {}),
    };
}


interface FaqJsonLdInput {
    productDescription: string;
    htsCode: string;
    countryCode: string;
    breakdown: LandedCostBreakdown;
    disclaimer: string;
}

/**
 * Generate FAQPage JSON-LD schema for calculation result pages.
 */
export function generateFaqJsonLd(input: FaqJsonLdInput): object {
    const countryLabel =
        input.countryCode === "US" ? "the United States" :
            input.countryCode === "GB" ? "the United Kingdom" :
                input.countryCode === "EU" ? "the European Union" :
                    input.countryCode === "PK" ? "Pakistan" :
                        input.countryCode;

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: `What is the HTS code for "${input.productDescription}" importing to ${countryLabel}?`,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `The most likely HTS/commodity code is ${input.htsCode}. This classification determines the applicable customs duty rate for imports into ${countryLabel}.`,
                },
            },
            {
                "@type": "Question",
                name: `What is the total landed cost for "${input.productDescription}" shipped to ${countryLabel}?`,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `The estimated total landed cost is ${input.breakdown.totalLandedCost.amount} ${input.breakdown.totalLandedCost.currency}, including customs duty of ${input.breakdown.customsDuty.amount} ${input.breakdown.customsDuty.currency} and VAT/GST of ${input.breakdown.vatGst.amount} ${input.breakdown.vatGst.currency}.`,
                },
            },
            {
                "@type": "Question",
                name: `What customs duties apply to HTS code ${input.htsCode}?`,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `The customs duty for HTS ${input.htsCode} is ${input.breakdown.customsDuty.rate ?? "variable"}. ${input.breakdown.deMinimisApplied ? "De minimis exemption was applied. " : ""}${input.breakdown.deMinimisDetails ?? ""}`,
                },
            },
            {
                "@type": "Question",
                name: "Is this landed cost estimate legally binding?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: input.disclaimer,
                },
            },
        ],
    };
}

/**
 * Render JSON-LD script tag for embedding in pages.
 */
export function renderJsonLd(data: object): string {
    return `<script type="application/ld+json">${JSON.stringify(data, null, 0)}</script>`;
}
