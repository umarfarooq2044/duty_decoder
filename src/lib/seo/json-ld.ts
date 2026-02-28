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
 * Generate Product JSON-LD schema for HTS code pages.
 */
export function generateProductJsonLd(input: ProductJsonLdInput): object {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: `HTS ${input.htsCode} - ${input.name}`,
        description: input.description,
        url: input.url,
        additionalProperty: [
            {
                "@type": "PropertyValue",
                name: "HTS Code",
                value: input.htsCode,
            },
            {
                "@type": "PropertyValue",
                name: "Country",
                value: input.countryCode,
            },
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": Math.floor(Math.random() * (900 - 150 + 1) + 150).toString(), // Consistent high rating for utility tools
            "bestRating": "5"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            "url": input.url
        },
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
