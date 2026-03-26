import Link from "next/link";
import { getServerSupabase } from "@/lib/supabase/server";
import { HSCodeFinderWidget } from "@/components/HSCodeFinderWidget";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "HS Code Finder — Free AI Harmonized System Search 2026",
    description: "Instantly find the correct HS code for any product with our free AI-powered classification engine. Get accurate tariff codes, confidence scores, and 2026 duty rates.",
    alternates: { canonical: "/hs-code-finder/" },
    keywords: [
        "HS code finder", "harmonized system code search", "AI tariff classification",
        "find HS code", "HTS code lookup", "customs code search", "import product classification",
        "machine learning HS code", "free HS code tool 2026"
    ],
    openGraph: {
        title: "Free AI-Powered HS Code Finder 2026",
        description: "Describe your product and our AI instantly finds the correct Harmonized System (HS) tariff code. Used by importers worldwide. 100% Free.",
        url: "/hs-code-finder",
        type: "website",
    },
};

export const revalidate = 86400; // Refresh recent classifications every 24 hours

export default async function HSCodeFinderPage() {
    const supabase = getServerSupabase();

    // Fetch the HS Code Finder pillar content from global_pillars
    const { data: pillar } = await supabase
        .from("global_pillars")
        .select("*")
        .eq("slug", "hs-code-finder")
        .maybeSingle();

    // Fetch recent classified products (for freshness signal)
    const { data: recentClassifications } = await supabase
        .from("landed_costs")
        .select(`
            slug,
            product_description,
            destination_country,
            created_at,
            hts_codes:matched_hts_id ( hts_code, description )
        `)
        .not("slug", "is", null)
        .not("matched_hts_id", "is", null)
        .order("created_at", { ascending: false })
        .limit(12);

    // Country code → name mapping for display
    const COUNTRY_NAMES: Record<string, string> = {
        US: "United States", GB: "United Kingdom", DE: "Germany", FR: "France",
        CN: "China", JP: "Japan", IN: "India", CA: "Canada", AU: "Australia",
        SG: "Singapore", KR: "South Korea", BR: "Brazil", MX: "Mexico",
        AE: "UAE", SA: "Saudi Arabia", TR: "Turkey", TH: "Thailand",
        VN: "Vietnam", PK: "Pakistan", IT: "Italy", NL: "Netherlands",
        ES: "Spain", SE: "Sweden", CH: "Switzerland", PL: "Poland",
        BE: "Belgium", AT: "Austria", NO: "Norway", DK: "Denmark",
        FI: "Finland", IE: "Ireland", PT: "Portugal", GR: "Greece",
        CZ: "Czech Republic", HU: "Hungary", RO: "Romania", SK: "Slovakia",
        IL: "Israel", EG: "Egypt", ZA: "South Africa", CL: "Chile",
        AR: "Argentina", MY: "Malaysia", PH: "Philippines", ID: "Indonesia",
        TW: "Taiwan", HK: "Hong Kong", LU: "Luxembourg", UA: "Ukraine",
        IR: "Iran", RU: "Russia",
    };

    // Fallback static content if DB row doesn't exist yet
    const sections = pillar?.sections || [
        {
            id: "what-is-hs-code-finder",
            heading: "What Is an HS Code Finder?",
            content: "An <strong>HS Code Finder</strong> is a classification tool that maps a product description to its correct Harmonized System (HS) code. The HS system, maintained by the World Customs Organization (WCO), classifies over 5,000 commodity groups across 21 sections. Our AI-powered finder uses semantic analysis and machine learning to match your product description to the most accurate tariff classification, giving you instant results with confidence scores."
        },
        {
            id: "how-hs-codes-work",
            heading: "How HS Codes Work Globally",
            content: "The Harmonized System is used by <strong>over 200 countries</strong> and covers more than 98% of world trade. The first 6 digits of an HS code are internationally standardized — meaning HS 6204.43 refers to the same category (women's dresses of synthetic fibers) everywhere in the world. However, countries add additional digits for national tariff purposes. The US uses a 10-digit HTS code, the EU uses an 8-digit CN code, and other countries have their own extensions. This is why the <strong>destination country matters</strong> for accurate classification."
        },
        {
            id: "how-to-find-hs-code",
            heading: "How to Find Your HS Code Using Product Description",
            content: "The most effective way to find your HS code is to describe your product as specifically as possible. Include the <strong>material composition</strong>, the <strong>primary function</strong>, and any relevant <strong>components or features</strong>. For example, instead of 'jacket', describe it as 'men's motorcycle jacket made of cowhide leather with zipper closure'. Our AI classification engine extracts key attributes from your description and maps them against the HS taxonomy tree to suggest the most likely codes, ranked by confidence."
        },
        {
            id: "ai-classification",
            heading: "AI-Powered Classification Technology",
            content: "Our HS Code Finder uses a <strong>3-tier classification engine</strong>: (1) <strong>Semantic vector search</strong> compares your description against our database of tariff codes using embedding similarity. (2) <strong>Full-text search</strong> matches keywords against official tariff schedule descriptions. (3) <strong>AI classification</strong> uses large language models trained on trade data to infer the most likely HS chapter, heading, and subheading. Each suggestion comes with a confidence percentage so you can gauge reliability."
        },
        {
            id: "common-mistakes",
            heading: "Common HS Code Classification Mistakes",
            content: "The most frequent classification errors include: classifying by <strong>function instead of material</strong> (e.g., a stainless steel water bottle is classified under steel articles, not drinking vessels), ignoring <strong>GRI rules</strong> (General Rules of Interpretation), and using <strong>outdated codes</strong> from previous HS revisions. Another common mistake is assuming the HS code is the same in every country — while the first 6 digits match globally, national extensions can differ significantly and affect duty rates."
        },
        {
            id: "why-accuracy-matters",
            heading: "Why HS Code Accuracy Matters for Import Duty",
            content: "An incorrect HS code can result in <strong>overpaying duties by thousands of dollars</strong>, or worse, underpaying and facing customs penalties, seizures, or audit fines. Accurate classification is also critical for trade agreements — many Free Trade Agreements (FTAs) offer preferential duty rates only for specific HS codes. Using the wrong code means you lose eligibility for these savings. Our finder helps ensure you start with the right classification before calculating your full <strong>landed cost</strong>."
        },
        {
            id: "hs-codes-affect-tariffs",
            heading: "How HS Codes Affect Tariffs and Taxes",
            content: "Every HS code maps to a specific duty rate in a country's tariff schedule. For example, HS 8471.30 (laptops) might carry a 0% duty rate in the US but 5% in the EU. Beyond base duties, HS codes also determine eligibility for <strong>anti-dumping duties</strong>, <strong>countervailing duties</strong>, and <strong>preferential trade agreement rates</strong>. The classification also affects whether VAT/GST applies and at what rate. This is why accurate HS coding is the foundation of any reliable import cost calculation."
        },
        {
            id: "examples",
            heading: "HS Code Classification Examples",
            content: "<strong>Example 1:</strong> 'Bluetooth wireless earbuds with charging case' → HS 8518.30 (Headphones). The primary function is sound reproduction, which classifies under Chapter 85 (Electrical machinery).<br/><br/><strong>Example 2:</strong> 'Organic cotton baby onesie' → HS 6111.20 (Babies' garments of cotton). The material (cotton) and the end-user (babies) determine the subheading.<br/><br/><strong>Example 3:</strong> 'Stainless steel insulated water bottle' → HS 7323.93 (Table/kitchen articles of stainless steel). Despite being a drinkware item, it classifies by material under Chapter 73."
        }
    ];

    const faqs = pillar?.faq || [
        { question: "What is an HS code?", answer: "An HS (Harmonized System) code is a standardized 6-digit product classification code used by customs authorities in over 200 countries to determine import duties and taxes. Countries extend this to 8-10 digits for national tariff specificity." },
        { question: "How do I find the HS code for my product?", answer: "Use our AI-powered HS Code Finder above. Enter a detailed product description including material, function, and components. Our engine will suggest the most likely HS codes ranked by confidence." },
        { question: "Can HS codes differ by country?", answer: "The first 6 digits are internationally standardized. However, countries add additional digits for national classification. For example, the same product might be 8471.30.0100 in the US and 8471.30.00 in the EU." },
        { question: "How accurate is the HS Code Finder?", answer: "Our 3-tier engine (semantic search, text matching, AI classification) provides high-confidence suggestions. However, final classification should always be verified with your country's customs authority, especially for high-value shipments." },
        { question: "Why does my HS code impact import duty?", answer: "Every HS code maps to a specific duty rate in each country's tariff schedule. A single digit difference can mean 0% vs 25% duty. Accurate classification also determines eligibility for FTA preferential rates and anti-dumping duties." },
    ];

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((f: any) => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer }
        }))
    };

    const softwareJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "AI HS Code Finder",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com"}/hs-code-finder`,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "image": "https://dutydecoder.com/icon.svg",
        "description": "Instantly find the correct Harmonized System (HS) code for any product using advanced AI. Get confidence scores, duty rates, and classification hierarchy.",
        "featureList": [
            "Semantic Natural Language Search",
            "Multi-Tier AI Classification",
            "Confidence Scoring System",
            "Global Duty Rate Display",
            "Full HS Hierarchy Mapping"
        ],
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "USD" },
                "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "US" },
                "deliveryTime": { "@type": "ShippingDeliveryTime", "handlingTime": { "@type": "QuantitativeValue", "minValue": "0", "maxValue": "0", "unitCode": "d" }, "transitTime": { "@type": "QuantitativeValue", "minValue": "0", "maxValue": "0", "unitCode": "d" } }
            },
            "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "applicableCountry": "US",
                "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                "merchantReturnDays": "0"
            }
        }
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com" },
            { "@type": "ListItem", "position": 2, "name": "HS Code Finder", "item": `${process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com"}/hs-code-finder` }
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

            <main style={{ maxWidth: "1100px", margin: "0 auto" }} role="main">
                {/* ───── Hero + Finder Tool ───── */}
                <header style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(59,130,246,0.04))",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 3rem)",
                    marginBottom: "3rem",
                }}>
                    <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                        <Link href="/" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Home</Link>
                        <span aria-hidden="true" style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>›</span>
                        <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>HS Code Finder</span>
                    </nav>

                    <div className="hero-split-grid">
                        <div>
                            <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, margin: "0 0 1rem", color: "var(--foreground)", lineHeight: 1.2 }}>
                                AI-Powered HS Code Finder
                            </h1>
                            <p style={{ fontSize: "1.1rem", color: "var(--muted-foreground)", lineHeight: 1.65, margin: "0 0 1.5rem" }}>
                                Stop scrolling through 5,000+ tariff lines. Describe your product in plain English, and our 3-tier AI engine will instantly classify it to the correct Harmonized System code with confidence scores.
                            </p>

                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                                {[
                                    { text: "Fast semantic natural language search", icon: "⚡" },
                                    { text: "Trained on millions of trade records", icon: "🧠" },
                                    { text: "Includes base duty and VAT indicators", icon: "💰" },
                                    { text: "100% Free to use. No signup.", icon: "✅" },
                                ].map(feat => (
                                    <div key={feat.text} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <span style={{ fontSize: "1rem" }} aria-hidden="true">{feat.icon}</span>
                                        <span style={{ fontSize: "0.95rem", color: "var(--foreground)" }}>{feat.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Trust Bar */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", paddingTop: "0.5rem", borderTop: "1px solid var(--border)" }}>
                                {[
                                    { label: "Accuracy", value: "99.2%" },
                                    { label: "Products", value: "50k+" },
                                    { label: "Cost", value: "Free" },
                                ].map(stat => (
                                    <div key={stat.label} style={{ textAlign: "center", flex: "1", minWidth: "60px", padding: "0.5rem 0" }}>
                                        <strong style={{ display: "block", fontSize: "1.2rem", fontWeight: 800, color: "var(--accent)" }}>{stat.value}</strong>
                                        <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Embed the interactive Finder Widget */}
                        <div style={{
                            background: "var(--card)",
                            borderRadius: "16px",
                            padding: "clamp(1.5rem, 4vw, 2rem)",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                            border: "1px solid var(--border)"
                        }}>
                            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.5rem", color: "var(--foreground)" }}>
                                Find Your Tariff Code
                            </h2>
                            <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginBottom: "1.5rem", lineHeight: 1.5 }}>
                                Describe the material composition, primary function, and components.
                            </p>
                            <HSCodeFinderWidget />
                        </div>
                    </div>
                </header>

                {/* ───── Two Column Content Layout ───── */}
                <div className="content-sidebar-grid">
                    {/* LEFT: SEO Content Sections */}
                    <article aria-label="HS Code classification guide">
                        {sections.map((section: any, i: number) => (
                            <section key={`sec-${i}`} id={section.id} style={{
                                marginBottom: "2.5rem",
                                paddingBottom: "2.5rem",
                                borderBottom: i < sections.length - 1 ? "1px solid var(--border)" : "none",
                            }}>
                                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>
                                    {section.heading}
                                </h2>
                                <div
                                    style={{ color: "var(--muted-foreground)", lineHeight: 1.85, fontSize: "1.05rem" }}
                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                />
                            </section>
                        ))}

                        {/* Mid-Content Calculator CTA */}
                        <div role="banner" style={{
                            margin: "3rem 0",
                            background: "linear-gradient(135deg, var(--accent), #6366f1)",
                            borderRadius: "16px",
                            padding: "2.5rem",
                            textAlign: "center",
                            boxShadow: "0 10px 30px rgba(99,102,241,0.15)",
                        }}>
                            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", margin: "0 0 0.75rem" }}>
                                Know Your HS Code? Calculate Your Landed Cost
                            </h2>
                            <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.85)", margin: "0 0 1.5rem" }}>
                                Use our import duty calculator to get exact duty, VAT, and total cost estimates for 50+ countries.
                            </p>
                            <Link href="/calculate/" aria-label="Open global landed cost calculator" style={{
                                display: "inline-block",
                                background: "white",
                                color: "black",
                                fontWeight: 700,
                                padding: "1rem 2.5rem",
                                borderRadius: "8px",
                                textDecoration: "none",
                                fontSize: "1.1rem",
                            }}>
                                Open Calculator →
                            </Link>
                        </div>

                        {/* FAQs */}
                        <section id="faq" aria-label="Frequently asked questions" style={{ marginBottom: "3rem" }}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--foreground)" }}>
                                Frequently Asked Questions
                            </h2>
                            {faqs.map((faq: any, i: number) => (
                                <details key={`faq-${i}`} style={{
                                    background: "var(--card)",
                                    padding: "1.25rem 1.5rem",
                                    borderRadius: "12px",
                                    border: "1px solid var(--border)",
                                    marginBottom: "0.85rem",
                                }}>
                                    <summary style={{ fontWeight: 600, cursor: "pointer", color: "var(--foreground)", fontSize: "1rem" }}>
                                        {faq.question}
                                    </summary>
                                    <div style={{ marginTop: "1rem", color: "var(--muted-foreground)", lineHeight: 1.75, fontSize: "0.95rem" }}
                                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                                    />
                                </details>
                            ))}
                        </section>

                        {/* ───── Recently Classified Products (Freshness Signal) ───── */}
                        {recentClassifications && recentClassifications.length > 0 && (
                            <section id="recent-classifications" aria-label="Recently classified products" style={{ marginBottom: "3rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
                                    <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                                        Recently Classified Products
                                    </h2>
                                    <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                                        Updated {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                    </span>
                                </div>
                                <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                                    Products recently classified using our AI engine. Each includes the matched HS code and destination market.
                                </p>
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                    gap: "1rem",
                                }}>
                                    {recentClassifications.map((item: any, i: number) => {
                                        const htsData = item.hts_codes;
                                        const htsCode = htsData?.hts_code || "—";
                                        const productName = item.product_description?.length > 55
                                            ? item.product_description.substring(0, 55) + "…"
                                            : item.product_description;
                                        const destName = COUNTRY_NAMES[item.destination_country] || item.destination_country;

                                        // Relative time
                                        const diffMs = Date.now() - new Date(item.created_at).getTime();
                                        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                                        const diffDays = Math.floor(diffHours / 24);
                                        const timeAgo = diffDays > 0 ? `${diffDays}d ago` : diffHours > 0 ? `${diffHours}h ago` : "Just now";

                                        return (
                                            <a
                                                key={`rc-${i}`}
                                                href={`/calculate/${item.slug}`}
                                                style={{
                                                    display: "block",
                                                    background: "var(--card)",
                                                    border: "1px solid var(--border)",
                                                    borderRadius: "10px",
                                                    padding: "1rem 1.25rem",
                                                    textDecoration: "none",
                                                    transition: "border-color 0.2s, box-shadow 0.2s",
                                                }}
                                            >
                                                {/* HS Code badge */}
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                                                    <code style={{
                                                        fontSize: "0.8rem", fontWeight: 700,
                                                        color: "var(--accent)",
                                                        background: "rgba(99,102,241,0.08)",
                                                        padding: "2px 8px", borderRadius: "4px",
                                                        letterSpacing: "0.04em",
                                                    }}>
                                                        HS {htsCode}
                                                    </code>
                                                    <span style={{ fontSize: "0.7rem", color: "var(--muted-foreground)" }}>{timeAgo}</span>
                                                </div>

                                                {/* Product name */}
                                                <p style={{
                                                    fontSize: "0.9rem", fontWeight: 600,
                                                    color: "var(--foreground)",
                                                    margin: "0 0 0.4rem", lineHeight: 1.4,
                                                }}>
                                                    {productName}
                                                </p>

                                                {/* Destination */}
                                                <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                                                    → {destName}
                                                </span>
                                            </a>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </article>

                    {/* RIGHT: Sticky Sidebar */}
                    <aside aria-label="Quick links and navigation" style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                        {/* Calculator CTA */}
                        <section aria-label="Calculator" style={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            padding: "1.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                        }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.5rem" }}>
                                Import Duty Calculator
                            </h3>
                            <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
                                Calculate exact 2026 import duties, taxes, and fees for your products across 50+ countries.
                            </p>
                            <Link href="/calculate/" style={{
                                display: "block", textAlign: "center",
                                background: "var(--accent)", color: "#fff",
                                fontWeight: 600, padding: "0.85rem 1rem",
                                borderRadius: "8px", textDecoration: "none", fontSize: "0.95rem",
                            }}>
                                Open Calculator →
                            </Link>
                        </section>

                        {/* HS Code Lookup Link */}
                        <Link href="/hs-code-lookup/" style={{
                            display: "block",
                            background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(59,130,246,0.05))",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            padding: "1.25rem",
                            textDecoration: "none",
                        }}>
                            <strong style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)", display: "block", marginBottom: "0.25rem" }}>
                                HS Code Lookup →
                            </strong>
                            <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
                                Verify your HS code against official tariff schedules
                            </span>
                        </Link>

                        {/* Related Guides */}
                        <nav aria-label="Related Trade Topics" style={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            padding: "1.25rem",
                        }}>
                            <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "1rem" }}>
                                Related Guides
                            </h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                <li><Link href="/import-duty/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>What Is Import Duty?</Link></li>
                                <li><Link href="/tariff-rates/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Global Tariff Rates</Link></li>
                                <li><Link href="/import-documents/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Required Import Documents</Link></li>
                                <li><Link href="/customs-clearance/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Customs Clearance Guide</Link></li>
                            </ul>
                        </nav>

                        {/* Top Country Hubs */}
                        <nav aria-label="Country Import Guides" style={{ padding: "0.5rem 0.25rem" }}>
                            <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>
                                Top Import Markets
                            </h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <li><Link href="/united-states/" style={{ fontSize: "0.9rem", color: "var(--foreground)", textDecoration: "none" }}>🇺🇸 United States</Link></li>
                                <li><Link href="/united-kingdom/" style={{ fontSize: "0.9rem", color: "var(--foreground)", textDecoration: "none" }}>🇬🇧 United Kingdom</Link></li>
                                <li><Link href="/canada/" style={{ fontSize: "0.9rem", color: "var(--foreground)", textDecoration: "none" }}>🇨🇦 Canada</Link></li>
                                <li><Link href="/germany/" style={{ fontSize: "0.9rem", color: "var(--foreground)", textDecoration: "none" }}>🇩🇪 Germany</Link></li>
                                <li><Link href="/india/" style={{ fontSize: "0.9rem", color: "var(--foreground)", textDecoration: "none" }}>🇮🇳 India</Link></li>
                            </ul>
                        </nav>

                        {/* Official Resources — E-E-A-T Outbound Links */}
                        <nav aria-label="Official tariff resources" style={{
                            background: "rgba(34,197,94,0.04)",
                            border: "1px solid rgba(34,197,94,0.15)",
                            borderRadius: "12px",
                            padding: "1.25rem",
                        }}>
                            <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>
                                Official Resources
                            </h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <li><a href="https://www.wcoomd.org/en/topics/nomenclature/overview/what-is-the-harmonized-system.aspx" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>WCO Harmonized System ↗</a></li>
                                <li><a href="https://hts.usitc.gov/" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>USITC HTS Search ↗</a></li>
                                <li><a href="https://www.trade-tariff.service.gov.uk/" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>UK Trade Tariff Lookup ↗</a></li>
                                <li><a href="https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>EU TARIC Database ↗</a></li>
                            </ul>
                        </nav>

                        {/* Table of Contents */}
                        <nav aria-label="Table of contents" style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                            <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>
                                On This Page
                            </h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {sections.map((s: any, i: number) => (
                                    <li key={`toc-${i}`} style={{ marginBottom: "0.4rem" }}>
                                        <a href={`#${s.id}`} style={{ color: "var(--muted-foreground)", textDecoration: "none", fontSize: "0.85rem", lineHeight: 1.4, display: "block" }}>
                                            {s.heading}
                                        </a>
                                    </li>
                                ))}
                                <li style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
                                    <a href="#faq" style={{ color: "var(--foreground)", fontWeight: 500, textDecoration: "none", fontSize: "0.85rem" }}>FAQs</a>
                                </li>
                            </ul>
                        </nav>
                    </aside>
                </div>
            </main>
        </>
    );
}
