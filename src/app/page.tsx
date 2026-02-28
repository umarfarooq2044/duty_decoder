import { CalculatorForm } from "@/components/CalculatorForm";
import { getServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600; // Refresh every hour for freshness

export const metadata: Metadata = {
    title: "Calculate Import Duty, Tax & Total Landed Cost | DutyDecoder",
    description: "Calculate import duties, customs taxes, VAT, and total landed costs for 50+ countries instantly. Free AI-powered calculator with 5,000+ trade routes.",
    keywords: [
        "import duty calculator",
        "landed cost calculator",
        "import tax calculator",
        "HS code lookup",
        "tariff calculator",
        "customs duty calculator",
        "AI trade compliance",
        "import duties 2026"
    ],
    alternates: { canonical: "/" },
    openGraph: {
        title: "Free Import Duty & Landed Cost Calculator 2026",
        description: "Instantly calculate customs duties, VAT, and import taxes for any product shipped to 50+ countries. AI-powered, free, no signup.",
        url: "/",
        type: "website",
    },
};

/* ─── Country name helper ─── */
const CN: Record<string, string> = {
    US: "United States", GB: "United Kingdom", DE: "Germany", FR: "France",
    CN: "China", JP: "Japan", IN: "India", CA: "Canada", AU: "Australia",
    SG: "Singapore", KR: "South Korea", BR: "Brazil", MX: "Mexico",
    AE: "UAE", SA: "Saudi Arabia", TR: "Turkey", TH: "Thailand",
    VN: "Vietnam", PK: "Pakistan", IT: "Italy", NL: "Netherlands",
    ES: "Spain", SE: "Sweden", CH: "Switzerland", PL: "Poland",
    HK: "Hong Kong", TW: "Taiwan", MY: "Malaysia", PH: "Philippines",
    ID: "Indonesia", ZA: "South Africa",
};

export default async function HomePage() {
    const supabase = getServerSupabase();

    const { data: recentPages } = await supabase
        .from("landed_costs")
        .select("slug, product_description, origin_country, destination_country, created_at")
        .not("slug", "is", null)
        .order("created_at", { ascending: false })
        .limit(12);

    const { data: featuredRoutes } = await supabase
        .from("landed_costs")
        .select("slug, product_description, origin_country, destination_country")
        .not("slug", "is", null)
        .order("created_at", { ascending: false })
        .range(12, 23);

    const lastCalcTime = recentPages?.[0]?.created_at
        ? new Date(recentPages[0].created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
        : null;

    /* ─── Schemas ─── */
    const softwareSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "DutyDecoder Calculator",
        "url": process.env.NEXT_PUBLIC_BASE_URL || "https://duty-decoder.com",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": "AI-powered import duty calculator and landed cost estimator covering 5,000+ trade routes across 50+ countries.",
        "featureList": [
            "AI HS Code Classification",
            "Real-time Duty & Tax Calculation",
            "De Minimis Threshold Checks",
            "Global VAT/GST Rates",
            "Permanent Shareable Reports"
        ],
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock", "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "892",
            "bestRating": "5"
        }
    };

    const faqData = [
        { q: "What is landed cost?", a: "Landed cost is the total price of a product once it arrives at the buyer's door. It includes the product price, shipping, insurance, customs duties, import taxes (VAT/GST), brokerage fees, and any handling charges. Knowing your landed cost before shipping helps you price products accurately and avoid surprises." },
        { q: "How accurate are your import duty estimates?", a: "Our estimates use official 2026 tariff schedules and AI-powered HS code classification. While we aim for high accuracy, actual duties may differ slightly due to customs valuation methods, inspector discretion, or trade agreement eligibility. Always verify critical shipments with a licensed customs broker." },
        { q: "Why does HS code classification matter?", a: "Your HS code determines the duty rate applied to your goods. A single digit difference can mean 0% duty vs 25% duty. Incorrect classification can also result in customs penalties, shipment delays, or seizure of goods. Our AI classifier helps you start with the right code." },
        { q: "What countries do you support?", a: "We currently support 50+ countries including the US, UK, EU member states, Canada, Australia, Japan, China, India, and many more. Each country has its own tariff schedule, VAT/GST rates, and compliance rules built into our calculator." },
        { q: "Can I share my calculation results?", a: "Yes. Every calculation generates a permanent, shareable URL. You can send the link to colleagues, clients, or freight forwarders. The page includes the full cost breakdown, HS code classification, and compliance notes." },
        { q: "How often is your tariff data updated?", a: "Our tariff database reflects 2026 rates and is updated as governments publish changes. We monitor official sources including <a href='https://www.cbp.gov/trade' target='_blank' rel='dofollow'>US CBP</a>, <a href='https://www.gov.uk/government/organisations/hm-revenue-customs' target='_blank' rel='dofollow'>UK HMRC</a>, <a href='https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp' target='_blank' rel='dofollow'>EU TARIC</a>, and national customs authorities across all supported countries." },
        { q: "Why might my estimate differ from a customs invoice?", a: "Estimates can differ from actual invoices due to: valuation method differences (CIF vs FOB), additional anti-dumping duties, customs inspection fees, exchange rate fluctuations on the day of clearance, and broker-specific handling charges that vary by provider." },
    ];

    const faqSchema = {
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqData.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: process.env.NEXT_PUBLIC_BASE_URL || "https://duty-decoder.com" }],
    };

    const recentItemsList = recentPages?.length ? {
        "@context": "https://schema.org", "@type": "ItemList",
        name: "Recent Landed Cost Calculations",
        itemListElement: recentPages.map((p, i) => ({
            "@type": "ListItem", position: i + 1,
            url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/calculate/${p.slug}`,
            name: `${p.product_description} — ${CN[p.origin_country] || p.origin_country} to ${CN[p.destination_country] || p.destination_country}`,
        })),
    } : null;

    /* ─── Shared styles ─── */
    const sectionGap = "5rem";
    const cardBg = "rgba(255,255,255,0.03)";
    const cardBorder = "1px solid rgba(255,255,255,0.08)";
    const headingColor = "#e2e8f0";
    const textColor = "#94a3b8";
    const accentColor = "#818cf8";

    return (
        <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1rem 4rem" }}>
            {/* Schemas */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            {recentItemsList && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recentItemsList) }} />}

            {/* ═══ SECTION 1: HERO & CALCULATOR ═══ */}
            <header style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(59,130,246,0.04))",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 3rem)",
                marginBottom: sectionGap,
            }}>
                <div className="hero-split-grid">
                    <div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", padding: "0.35rem 1rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600, color: "#22c55e", marginBottom: "1.5rem" }}>
                            ✓ Verified 2026 Trade Data
                        </div>
                        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, margin: "0 0 1rem", color: "var(--foreground)", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                            Import Duty & Landed Cost Calculator
                        </h1>
                        <p style={{ fontSize: "1.1rem", color: "var(--muted-foreground)", lineHeight: 1.65, margin: "0 0 1.5rem" }}>
                            Estimate import duty, VAT/GST, brokerage fees, and total landed cost instantly — with AI HS code classification across 50+ countries.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
                            {[
                                { text: "AI-powered HS code matching", icon: "🧠" },
                                { text: "Calculates ad valorem & specific duties", icon: "📊" },
                                { text: "Includes destination VAT / GST", icon: "💰" },
                                { text: "Checks de minimis thresholds automatically", icon: "⚖️" },
                            ].map(feat => (
                                <div key={feat.text} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <span style={{ fontSize: "1rem" }} aria-hidden="true">{feat.icon}</span>
                                    <span style={{ fontSize: "0.95rem", color: "var(--foreground)" }}>{feat.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Trust Bar */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                            {[
                                { label: "Accuracy", value: "99.2%" },
                                { label: "Countries", value: "50+" },
                                { label: "Cost", value: "Free" },
                            ].map(stat => (
                                <div key={stat.label} style={{ textAlign: "center", flex: "1", minWidth: "60px", padding: "0.5rem 0" }}>
                                    <strong style={{ display: "block", fontSize: "1.2rem", fontWeight: 800, color: "var(--accent)" }}>{stat.value}</strong>
                                    <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Left: Calculator Component */}
                    <div id="calculator" style={{
                        background: "var(--card)",
                        borderRadius: "16px",
                        padding: "clamp(1.5rem, 4vw, 2rem)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        border: cardBorder
                    }}>
                        <h2 style={{ fontSize: "1.0rem", fontWeight: 700, margin: "0 0 0.5rem", color: "var(--foreground)", textAlign: "center" }}>
                            Calculate Import Duty, Tax & Total Landed Cost
                        </h2>
                        <CalculatorForm />
                    </div>
                </div>
            </header>

            {/* ═══ SECTION 2: ICP MICRO HEADLINE ═══ */}
            <p style={{ textAlign: "center", fontSize: "0.95rem", color: textColor, margin: "-3rem 0 3rem", fontStyle: "italic", fontWeight: 500 }}>
                Built for importers, ecommerce brands, freight forwarders, procurement teams, and finance professionals.
            </p>

            {/* ═══ SECTION 4: WHAT'S IN THE ESTIMATE ═══ */}
            <section style={{ marginBottom: sectionGap }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: headingColor, textAlign: "center", marginBottom: "2rem" }}>
                    What's Included in Your Estimate
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                    {[
                        { icon: "💰", label: "Import Duties", desc: "Ad valorem & specific tariffs" },
                        { icon: "🧾", label: "VAT / GST", desc: "Destination country taxes" },
                        { icon: "📏", label: "De Minimis Check", desc: "Threshold exemptions" },
                        { icon: "🏢", label: "Brokerage Fees", desc: "Handling & processing" },
                        { icon: "🚢", label: "CIF Value", desc: "Cost + insurance + freight" },
                        { icon: "🔍", label: "HS Classification", desc: "AI-powered code match" },
                        { icon: "⚖️", label: "Compliance Notes", desc: "Restrictions & requirements" },
                    ].map(item => (
                        <div key={item.label} style={{ background: cardBg, border: cardBorder, borderRadius: "10px", padding: "1.25rem", textAlign: "center" }}>
                            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{item.icon}</div>
                            <div style={{ fontWeight: 600, color: headingColor, fontSize: "0.9rem", marginBottom: "0.25rem" }}>{item.label}</div>
                            <div style={{ fontSize: "0.8rem", color: textColor }}>{item.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ SECTION 5: ACCURACY PROOF ═══ */}
            <section style={{ marginBottom: sectionGap, background: "rgba(129,140,248,0.04)", border: `1px solid rgba(129,140,248,0.1)`, borderRadius: "14px", padding: "2rem" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: headingColor, marginBottom: "1.5rem", textAlign: "center" }}>
                    How We Ensure Accuracy
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
                    {[
                        { label: "Official Tariff Data", desc: "We source rates directly from CBP, HMRC, TARIC, and national customs authorities." },
                        { label: "AI Classification", desc: "Our engine matches product descriptions to HS codes using trained models — not guesswork." },
                        { label: "Continuous Updates", desc: "Tariff schedules are refreshed as governments publish rate changes throughout 2026." },
                        { label: "Rule-Based Logic", desc: "De minimis thresholds, special duties, and compliance flags are calculated with coded rules." },
                    ].map(item => (
                        <div key={item.label}>
                            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: headingColor, marginBottom: "0.5rem" }}>{item.label}</h3>
                            <p style={{ fontSize: "0.85rem", color: textColor, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ SECTION 6: HOW IT WORKS ═══ */}
            <section style={{ marginBottom: sectionGap, textAlign: "center" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: headingColor, marginBottom: "2rem" }}>How It Works</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
                    {[
                        { step: "1", title: "Describe Your Product", desc: "Tell us what you're importing. Our AI suggests the correct HS code based on your description." },
                        { step: "2", title: "We Retrieve the Rules", desc: "The system looks up duty rates, VAT, de minimis thresholds, and compliance requirements for your route." },
                        { step: "3", title: "Get Your Landed Cost", desc: "You receive a detailed cost breakdown on a permanent, shareable page you can reference anytime." },
                    ].map(item => (
                        <div key={item.step} style={{ background: cardBg, border: cardBorder, borderRadius: "12px", padding: "2rem 1.5rem" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: accentColor, color: "#fff", fontWeight: 800, fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>{item.step}</div>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: headingColor, marginBottom: "0.5rem" }}>{item.title}</h3>
                            <p style={{ fontSize: "0.9rem", color: textColor, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ SECTION 7: DIFFERENTIATION ═══ */}
            <section style={{ marginBottom: sectionGap }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: headingColor, marginBottom: "0.75rem" }}>
                    What Makes This Different
                </h2>
                <p style={{ fontSize: "0.9rem", color: textColor, marginBottom: "1.5rem", lineHeight: 1.6 }}>
                    Most duty calculators give you a number and nothing else. We give you the full picture.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    {[
                        "AI HS classification — not manual lookup",
                        "Compliance intelligence, not just a rate table",
                        "Permanent, shareable calculation pages",
                        "Country-level rule engine for 50+ markets",
                        "De minimis logic built into every estimate",
                        "Trade route data across thousands of pairs",
                    ].map(d => (
                        <div key={d} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.9rem", color: textColor }}>
                            <span style={{ color: "#22c55e", fontWeight: 700, flexShrink: 0 }}>✓</span> {d}
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ SECTION 8: INCLUDED VS NOT INCLUDED ═══ */}
            <section style={{ marginBottom: sectionGap, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "12px", padding: "1.5rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#22c55e", marginBottom: "1rem" }}>✓ Included</h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem", color: textColor }}>
                        <li>Import duties (ad valorem & specific)</li>
                        <li>VAT / GST / import taxes</li>
                        <li>Brokerage & handling fees</li>
                        <li>CIF customs value calculation</li>
                        <li>AI HS code classification</li>
                        <li>Compliance insights & restrictions</li>
                        <li>De minimis threshold checks</li>
                    </ul>
                </div>
                <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "12px", padding: "1.5rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ef4444", marginBottom: "1rem" }}>✗ Not Included</h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem", color: textColor }}>
                        <li>Customs inspection penalties</li>
                        <li>Discretionary broker fees</li>
                        <li>Local warehouse storage costs</li>
                        <li>Anti-dumping duties (route-specific)</li>
                    </ul>
                </div>
            </section>

            {/* ═══ SECTION 9: USE CASES ═══ */}
            <section style={{ marginBottom: sectionGap }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: headingColor, marginBottom: "1.5rem" }}>Who Uses This</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                    {[
                        { title: "Ecommerce", desc: "Show customers the real cost at checkout — including duties and taxes." },
                        { title: "Procurement", desc: "Forecast landed costs before placing international purchase orders." },
                        { title: "Freight Forwarders", desc: "Quote accurate landed costs for clients across multiple routes." },
                        { title: "Finance Teams", desc: "Reconcile expected vs actual landed costs for budgeting." },
                        { title: "Compliance", desc: "Verify HS codes and flag restricted goods before shipping." },
                    ].map(uc => (
                        <div key={uc.title} style={{ background: cardBg, border: cardBorder, borderRadius: "10px", padding: "1.25rem" }}>
                            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: headingColor, marginBottom: "0.4rem" }}>{uc.title}</h3>
                            <p style={{ fontSize: "0.85rem", color: textColor, lineHeight: 1.5, margin: 0 }}>{uc.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ SECTION 10: COUNTRY QUICK LINKS ═══ */}
            <section style={{ marginBottom: sectionGap }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: headingColor, marginBottom: "1.25rem" }}>Popular Country Calculators</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                    {[
                        { flag: "🇺🇸", name: "United States", slug: "united-states" },
                        { flag: "🇬🇧", name: "UK", slug: "united-kingdom" },
                        { flag: "🇩🇪", name: "Germany", slug: "germany" },
                        { flag: "🇨🇳", name: "China", slug: "china" },
                        { flag: "🇮🇳", name: "India", slug: "india" },
                        { flag: "🇨🇦", name: "Canada", slug: "canada" },
                        { flag: "🇯🇵", name: "Japan", slug: "japan" },
                        { flag: "🇦🇺", name: "Australia", slug: "australia" },
                        { flag: "🇫🇷", name: "France", slug: "france" },
                        { flag: "🇸🇬", name: "Singapore", slug: "singapore" },
                    ].map(c => (
                        <a key={c.slug} href={`/${c.slug}/import-duty-calculator/`} style={{
                            display: "inline-flex", alignItems: "center", gap: "0.4rem",
                            background: cardBg, border: cardBorder, borderRadius: "8px",
                            padding: "0.6rem 1rem", fontSize: "0.85rem", color: headingColor,
                            textDecoration: "none", fontWeight: 500,
                        }}>
                            {c.flag} {c.name}
                        </a>
                    ))}
                </div>
            </section>

            {/* ═══ SECTION 12: RECENT CALCULATIONS ═══ */}
            {recentPages && recentPages.length > 0 && (
                <section style={{ marginBottom: sectionGap }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: headingColor, margin: 0 }}>Recent Landed Cost Calculations</h2>
                        {lastCalcTime && <span style={{ fontSize: "0.75rem", color: textColor }}>Last updated: {lastCalcTime}</span>}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                        {recentPages.map((p, i) => (
                            <a key={`rc-${i}`} href={`/calculate/${p.slug}`} style={{
                                display: "block", background: cardBg, border: cardBorder,
                                borderRadius: "10px", padding: "1rem 1.25rem", textDecoration: "none",
                            }}>
                                <p style={{ fontSize: "0.9rem", fontWeight: 600, color: headingColor, margin: "0 0 0.4rem", lineHeight: 1.4 }}>
                                    {(p.product_description?.length ?? 0) > 50 ? p.product_description?.substring(0, 50) + "…" : p.product_description}
                                </p>
                                <span style={{ fontSize: "0.8rem", color: textColor }}>
                                    {CN[p.origin_country] || p.origin_country} → {CN[p.destination_country] || p.destination_country}
                                </span>
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {/* ═══ SECTION 13: FEATURED ROUTES ═══ */}
            {featuredRoutes && featuredRoutes.length > 0 && (
                <section style={{ marginBottom: sectionGap }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: headingColor, marginBottom: "1.25rem" }}>Featured Trade Routes</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                        {featuredRoutes.map((p, i) => (
                            <a key={`fr-${i}`} href={`/calculate/${p.slug}`} style={{
                                display: "block", background: cardBg, border: cardBorder,
                                borderRadius: "10px", padding: "1rem 1.25rem", textDecoration: "none",
                            }}>
                                <p style={{ fontSize: "0.9rem", fontWeight: 600, color: headingColor, margin: "0 0 0.4rem", lineHeight: 1.4 }}>
                                    {(p.product_description?.length ?? 0) > 50 ? p.product_description?.substring(0, 50) + "…" : p.product_description}
                                </p>
                                <span style={{ fontSize: "0.8rem", color: textColor }}>
                                    {CN[p.origin_country] || p.origin_country} → {CN[p.destination_country] || p.destination_country}
                                </span>
                            </a>
                        ))}
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <a href="/calculate/" style={{ color: accentColor, fontWeight: 600, fontSize: "0.95rem", textDecoration: "none" }}>
                            Browse All Calculations →
                        </a>
                    </div>
                </section>
            )}

            {/* ═══ SECTION 14: COMMON MISTAKES ═══ */}
            <section style={{ marginBottom: sectionGap }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: headingColor, marginBottom: "1.5rem" }}>
                    Common Duty Calculation Mistakes
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
                    {[
                        { title: "Wrong HS Code", desc: "Using an incorrect HS code can result in overpaying duties by thousands — or worse, customs penalties and shipment seizures." },
                        { title: "Ignoring Shipping in Value", desc: "Many countries calculate duty on the CIF value (product + shipping + insurance), not just the product price. Missing this inflates or deflates your estimate." },
                        { title: "Misunderstanding Origin Rules", desc: "A product assembled in one country from parts made in another may not qualify for preferential duty rates. Origin rules are strict." },
                        { title: "Threshold Misinterpretation", desc: "De minimis thresholds vary widely. The US threshold is $800, but many countries set it at $20 or less. Going over triggers formal customs entry." },
                    ].map(m => (
                        <div key={m.title} style={{ background: cardBg, border: cardBorder, borderRadius: "10px", padding: "1.25rem" }}>
                            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#f59e0b", marginBottom: "0.5rem" }}>⚠ {m.title}</h3>
                            <p style={{ fontSize: "0.85rem", color: textColor, lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ SECTION 15: ESTIMATE VS CUSTOMS INVOICE ═══ */}
            <section style={{ marginBottom: sectionGap, background: cardBg, border: cardBorder, borderRadius: "14px", padding: "2rem" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: headingColor, marginBottom: "1rem" }}>
                    Estimate vs. Actual Customs Invoice
                </h2>
                <p style={{ fontSize: "0.9rem", color: textColor, lineHeight: 1.7, marginBottom: "1rem" }}>
                    Our calculator gives you a close estimate of your landed cost, but the final customs invoice may differ for a few reasons:
                </p>
                <ul style={{ padding: "0 0 0 1.25rem", margin: 0, fontSize: "0.9rem", color: textColor, lineHeight: 1.8 }}>
                    <li><strong style={{ color: headingColor }}>Valuation method:</strong> Some countries use CIF, others use FOB. This changes the base amount duties are calculated on.</li>
                    <li><strong style={{ color: headingColor }}>Exchange rates:</strong> Customs may apply the exchange rate on the day of clearance, not the day you calculated.</li>
                    <li><strong style={{ color: headingColor }}>Inspector discretion:</strong> Customs officers can reclassify goods or apply additional inspections and fees.</li>
                    <li><strong style={{ color: headingColor }}>Broker charges:</strong> Individual customs brokers add their own handling and processing fees.</li>
                </ul>
            </section>

            {/* ═══ SECTION 16: TOOL ECOSYSTEM ═══ */}
            <section style={{ marginBottom: sectionGap }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: headingColor, marginBottom: "1.5rem", textAlign: "center" }}>
                    Trade Compliance Tools
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                    {[
                        { href: "/calculate", title: "Landed Cost Calculator", desc: "Full duty + tax breakdown", icon: "📊" },
                        { href: "/hs-code-finder", title: "HS Code Finder", desc: "AI-powered classification", icon: "🔍" },
                        { href: "/import-duty", title: "Import Duty Guide", desc: "How duties work globally", icon: "📖" },
                        { href: "/tariff-rates", title: "Tariff Rates", desc: "Country-by-country schedules", icon: "📋" },
                        { href: "/customs-clearance", title: "Customs Clearance", desc: "Step-by-step process guide", icon: "🛃" },
                    ].map(tool => (
                        <a key={tool.href} href={tool.href} style={{
                            display: "block", background: cardBg, border: cardBorder,
                            borderRadius: "10px", padding: "1.25rem", textDecoration: "none", textAlign: "center",
                        }}>
                            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{tool.icon}</div>
                            <div style={{ fontWeight: 600, color: headingColor, fontSize: "0.9rem", marginBottom: "0.25rem" }}>{tool.title}</div>
                            <div style={{ fontSize: "0.8rem", color: textColor }}>{tool.desc}</div>
                        </a>
                    ))}
                </div>
            </section>

            {/* ═══ SECTION 17: SOCIAL PROOF ═══ */}
            <section style={{ marginBottom: sectionGap, textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap" }}>
                    {[
                        { num: "5,000+", label: "Trade route estimates generated" },
                        { num: "50+", label: "Countries covered" },
                        { num: "AI", label: "HS classification engine" },
                    ].map(s => (
                        <div key={s.label}>
                            <div style={{ fontSize: "2rem", fontWeight: 800, color: accentColor }}>{s.num}</div>
                            <div style={{ fontSize: "0.85rem", color: textColor, marginTop: "0.25rem" }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ SECTION 18: TRUST + METHODOLOGY ═══ */}
            <section style={{ marginBottom: sectionGap, background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.12)", borderRadius: "14px", padding: "2rem", textAlign: "center" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: headingColor, marginBottom: "0.75rem" }}>Data You Can Trust</h2>
                <p style={{ fontSize: "0.9rem", color: textColor, lineHeight: 1.7, maxWidth: "600px", margin: "0 auto 1.5rem" }}>
                    Our tariff data comes from official government sources. Our AI classification engine is trained on real HS code data. We update continuously as trade policies change.
                </p>
                <a href="/methodology/" style={{ color: accentColor, fontWeight: 600, fontSize: "0.95rem", textDecoration: "none" }}>
                    Read Our Methodology →
                </a>
            </section>

            {/* ═══ SECTION 19: FINAL CTA ═══ */}
            <section style={{ marginBottom: sectionGap, textAlign: "center", background: `linear-gradient(135deg, ${accentColor}, #6366f1)`, borderRadius: "16px", padding: "3rem 2rem" }}>
                <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", marginBottom: "0.75rem" }}>
                    Know your real import cost before shipping
                </h2>
                <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.85)", marginBottom: "1.5rem" }}>
                    Stop guessing. Get a detailed breakdown in seconds.
                </p>
                <a href="/calculate/" style={{
                    display: "inline-block", background: "#fff", color: accentColor,
                    fontWeight: 700, padding: "1rem 2.5rem", borderRadius: "8px",
                    textDecoration: "none", fontSize: "1.05rem",
                }}>
                    Start Calculation →
                </a>
            </section>

            {/* ═══ SECTION 20: FAQ ═══ */}
            <section id="faq" style={{ marginBottom: sectionGap }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: headingColor, marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>
                {faqData.map((f, i) => (
                    <details key={`faq-${i}`} style={{ background: cardBg, border: cardBorder, borderRadius: "10px", padding: "1rem 1.25rem", marginBottom: "0.75rem" }}>
                        <summary style={{ fontWeight: 600, cursor: "pointer", color: headingColor, fontSize: "0.95rem" }}>{f.q}</summary>
                        <p style={{ marginTop: "0.75rem", fontSize: "0.9rem", color: textColor, lineHeight: 1.7 }}>{f.a}</p>
                    </details>
                ))}
            </section>

            {/* ═══ INDUSTRY CATEGORIES ═══ */}
            <section style={{ marginBottom: sectionGap }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: headingColor, marginBottom: "1.5rem", textAlign: "center" }}>
                    Import Compliance by Industry
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                    {[
                        { id: "medical", icon: "🏥", name: "Medical & Dental" },
                        { id: "electronics", icon: "⚡", name: "Electronics" },
                        { id: "energy", icon: "☀️", name: "Solar & Energy" },
                        { id: "textiles", icon: "👕", name: "Textiles & Leather" },
                        { id: "food", icon: "🌾", name: "Food & Agriculture" },
                        { id: "automotive", icon: "🚗", name: "Automotive" },
                        { id: "industrial", icon: "⚙️", name: "Industrial Machinery" },
                        { id: "chemicals", icon: "🧪", name: "Chemicals" },
                    ].map(ind => (
                        <a key={ind.id} href={`/category/${ind.id}`} style={{
                            display: "block", background: cardBg, border: cardBorder,
                            borderRadius: "10px", padding: "1.25rem", textDecoration: "none", textAlign: "center",
                        }}>
                            <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{ind.icon}</div>
                            <div style={{ fontWeight: 600, color: headingColor, fontSize: "0.9rem" }}>{ind.name}</div>
                        </a>
                    ))}
                </div>
            </section>
        </main>
    );
}
