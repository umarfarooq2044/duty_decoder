import { CalculatorForm } from "@/components/CalculatorForm";
import { getServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";
import {
    Activity,
    AlertTriangle,
    BarChart3,
    BookOpen,
    Building,
    Check,
    CheckCircle,
    Coins,
    Cpu,
    FileText,
    HelpCircle,
    Info,
    Scale,
    Search,
    ShieldAlert,
    ShieldCheck,
    Ship,
    Sparkles,
    TrendingUp,
    X,
    Stethoscope,
    Sun,
    Shirt,
    Sprout,
    Car,
    Settings,
    FlaskConical,
    Gift,
    FileSpreadsheet,
    ClipboardList,
} from "lucide-react";

export const revalidate = 3600; // Refresh every hour for freshness

export const metadata: Metadata = {
    title: "Calculate Import Duty, Tax & Total Landed Cost",
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
        "url": process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "image": "https://dutydecoder.com/icon.svg",
        "description": "AI-powered import duty calculator and landed cost estimator covering 5,000+ trade routes across 50+ countries.",
        "featureList": [
            "AI HS Code Classification",
            "Real-time Duty & Tax Calculation",
            "De Minimis Threshold Checks",
            "Global VAT/GST Rates",
            "Permanent Shareable Reports"
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

    const faqData = [
        { q: "What is landed cost?", a: "Landed cost is the total price of a product once it arrives at the buyer's door. It includes the product price, shipping, insurance, customs duties, import taxes (VAT/GST), brokerage fees, and any handling charges. Knowing your landed cost before shipping helps you price products accurately and avoid surprises." },
        { q: "How accurate are your import duty estimates?", a: "Our estimates use official 2026 tariff schedules and AI-powered HS code classification. While we aim for high accuracy, actual duties may differ slightly due to customs valuation methods, inspector discretion, or trade agreement eligibility. Always verify critical shipments with a licensed customs broker." },
        { q: "Why does HS code classification matter?", a: "Your HS code determines the duty rate applied to your goods. A single digit difference can mean 0% duty vs 25% duty. Incorrect classification can also result in customs penalties, shipment delays, or seizure of goods. Our AI classifier helps you start with the right code." },
        { q: "What countries do you support?", a: "We currently support 50+ countries including the US, UK, EU member states, Canada, Australia, Japan, China, India, and many more. Each country has its own tariff schedule, VAT/GST rates, and compliance rules built into our calculator." },
        { q: "Can I share my calculation results?", a: "Yes. Every calculation generates a permanent, shareable URL. You can send the link to colleagues, clients, or freight forwarders. The page includes the full cost breakdown, HS code classification, and compliance notes." },
        { q: "How often is your tariff data updated?", a: "Our tariff database reflects 2026 rates and is updated as governments publish changes. We monitor official sources including <a href='https://www.cbp.gov/trade' target='_blank' rel='noopener'>US CBP</a>, <a href='https://www.gov.uk/government/organisations/hm-revenue-customs' target='_blank' rel='noopener'>UK HMRC</a>, <a href='https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp' target='_blank' rel='noopener'>EU TARIC</a>, and national customs authorities across all supported countries." },
        { q: "Why might my estimate differ from a customs invoice?", a: "Estimates can differ from actual invoices due to: valuation method differences (CIF vs FOB), additional anti-dumping duties, customs inspection fees, exchange rate fluctuations on the day of clearance, and broker-specific handling charges that vary by provider." },
    ];

    const faqSchema = {
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqData.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a.replace(/<[^>]*>/g, '') } })),
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com" }],
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

    return (
        <main className="premium-container">
            {/* Schemas */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            {recentItemsList && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recentItemsList) }} />}

            {/* ═══ HERO SECTION ═══ */}
            <header className="hero-banner">
                <div className="hero-split-grid">
                    <div>
                        <div className="verified-badge">
                            <ShieldCheck size={16} /> Verified 2026 Trade Data
                        </div>
                        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 800, margin: "0 0 1rem", color: "var(--foreground)", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                            Import Duty & <span className="gradient-text-accent">Landed Cost</span> Calculator
                        </h1>
                        <p style={{ fontSize: "1.1rem", color: "var(--muted-foreground)", lineHeight: 1.65, margin: "0 0 2rem" }}>
                            Estimate import duty, VAT/GST, brokerage fees, and total landed cost instantly — with AI HS code classification across 50+ countries.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "2rem" }}>
                            {[
                                { text: "AI-powered HS code matching", icon: <Cpu size={18} style={{ color: "var(--color-accent-hover)" }} /> },
                                { text: "Calculates ad valorem & specific duties", icon: <BarChart3 size={18} style={{ color: "var(--color-accent-hover)" }} /> },
                                { text: "Includes destination VAT / GST", icon: <Coins size={18} style={{ color: "var(--color-accent-hover)" }} /> },
                                { text: "Checks de minimis thresholds automatically", icon: <Scale size={18} style={{ color: "var(--color-accent-hover)" }} /> },
                            ].map((feat, idx) => (
                                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    {feat.icon}
                                    <span style={{ fontSize: "0.95rem", color: "var(--color-text-primary)" }}>{feat.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Trust Bar */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", paddingTop: "1.5rem", borderTop: "1px solid var(--color-border)" }}>
                            {[
                                { label: "Accuracy", value: "99.2%" },
                                { label: "Countries", value: "50+" },
                                { label: "Cost", value: "Free" },
                            ].map(stat => (
                                <div key={stat.label} style={{ textAlign: "center", flex: "1", minWidth: "60px", padding: "0.5rem 0" }}>
                                    <strong style={{ display: "block", fontSize: "1.25rem", fontWeight: 800, color: "var(--color-accent-hover)" }}>{stat.value}</strong>
                                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Calculator Card */}
                    <div id="calculator" className="premium-card" style={{ padding: "1.75rem" }}>
                        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 1rem", color: "var(--foreground)", textAlign: "center" }}>
                            Calculate Import Duty, Tax & Total Landed Cost
                        </h2>
                        <CalculatorForm />
                    </div>
                </div>
            </header>

            {/* ═══ AUDIENCE TARGETING ═══ */}
            <p style={{ textAlign: "center", fontSize: "0.95rem", color: "var(--color-text-secondary)", margin: "-3.5rem 0 4.5rem", fontStyle: "italic", fontWeight: 500 }}>
                Trusted by importers, ecommerce brands, freight forwarders, procurement teams, and finance professionals globally.
            </p>

            {/* ═══ WHAT'S IN THE ESTIMATE ═══ */}
            <section style={{ marginBottom: "5rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", textAlign: "center", marginBottom: "2.5rem" }}>
                    What&apos;s Included in Your Estimate
                </h2>
                <div className="grid-4col">
                    {[
                        { icon: <Coins size={24} style={{ color: "var(--color-accent-hover)" }} />, label: "Import Duties", desc: "Ad valorem & specific tariffs" },
                        { icon: <FileText size={24} style={{ color: "var(--color-accent-hover)" }} />, label: "VAT / GST", desc: "Destination country taxes" },
                        { icon: <Scale size={24} style={{ color: "var(--color-accent-hover)" }} />, label: "De Minimis Check", desc: "Threshold exemptions" },
                        { icon: <Building size={24} style={{ color: "var(--color-accent-hover)" }} />, label: "Brokerage Fees", desc: "Handling & processing" },
                        { icon: <Ship size={24} style={{ color: "var(--color-accent-hover)" }} />, label: "CIF Value", desc: "Cost + insurance + freight" },
                        { icon: <Search size={24} style={{ color: "var(--color-accent-hover)" }} />, label: "HS Classification", desc: "AI-powered code match" },
                        { icon: <ShieldAlert size={24} style={{ color: "var(--color-accent-hover)" }} />, label: "Compliance Notes", desc: "Restrictions & requirements" },
                    ].map((item, idx) => (
                        <div key={idx} className="premium-card" style={{ textAlign: "center", padding: "1.5rem 1.25rem" }}>
                            <div style={{ display: "inline-flex", justifyContent: "center", marginBottom: "0.75rem" }}>{item.icon}</div>
                            <h3 style={{ fontWeight: 600, color: "var(--foreground)", fontSize: "0.95rem", marginBottom: "0.35rem" }}>{item.label}</h3>
                            <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.4 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ ACCURACY PROOF ═══ */}
            <section style={{ marginBottom: "5rem", background: "rgba(99,102,241,0.02)", border: `1px solid var(--color-border)`, borderRadius: "14px", padding: "2.5rem" }}>
                <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "2rem", textAlign: "center" }}>
                    How We Ensure Accuracy
                </h2>
                <div className="grid-2col" style={{ gap: "2rem" }}>
                    {[
                        { label: "Official Tariff Data", desc: "We source rates directly from official customs portals including U.S. CBP, UK HMRC, EU TARIC, and national customs authorities." },
                        { label: "AI Classification", desc: "Our engine matches product descriptions to HS codes using trained language models mapping WCO General Interpretive Rules." },
                        { label: "Continuous Updates", desc: "Tariff schedules are refreshed regularly as governments publish rate and threshold adjustments throughout 2026." },
                        { label: "Rule-Based Logic", desc: "De minimis thresholds, special duties, and compliance flags are calculated using structured, pre-coded legal rules." },
                    ].map((item, idx) => (
                        <div key={idx}>
                            <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <CheckCircle size={16} style={{ color: "var(--color-success)" }} /> {item.label}
                            </h3>
                            <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ HOW IT WORKS ═══ */}
            <section style={{ marginBottom: "5rem", textAlign: "center" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "2.5rem" }}>How It Works</h2>
                <div className="grid-3col">
                    {[
                        { step: "1", title: "Describe Your Product", desc: "Tell us what you're importing. Our AI suggests the correct HS code based on your description." },
                        { step: "2", title: "We Retrieve the Rules", desc: "The system looks up duty rates, VAT, de minimis thresholds, and compliance requirements for your route." },
                        { step: "3", title: "Get Your Landed Cost", desc: "You receive a detailed cost breakdown on a permanent, shareable page you can reference anytime." },
                    ].map(item => (
                        <div key={item.step} className="premium-card" style={{ padding: "2rem 1.5rem" }}>
                            <div className="step-number">{item.step}</div>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.5rem" }}>{item.title}</h3>
                            <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ DIFFERENTIATION ═══ */}
            <section style={{ marginBottom: "5rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.75rem" }}>
                    What Makes DutyDecoder Different
                </h2>
                <p style={{ fontSize: "0.95rem", color: "var(--color-text-secondary)", marginBottom: "2rem", lineHeight: 1.6 }}>
                    Most duty calculators give you a single number and nothing else. We give you the full compliance picture.
                </p>
                <div className="grid-2col" style={{ gap: "1rem 2rem" }}>
                    {[
                        "AI HS classification — not manual lookup",
                        "Compliance intelligence, not just a rate table",
                        "Permanent, shareable calculation pages",
                        "Country-level rule engine for 50+ markets",
                        "De minimis logic built into every estimate",
                        "Trade route data across thousands of pairs",
                    ].map((d, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.50rem", fontSize: "0.95rem", color: "var(--color-text-primary)" }}>
                            <CheckCircle size={16} style={{ color: "var(--color-success)", flexShrink: 0 }} />
                            <span>{d}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ INCLUDED VS NOT INCLUDED ═══ */}
            <section style={{ marginBottom: "5rem" }} className="grid-2col">
                <div className="include-card">
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-success)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Check size={20} /> Included in Estimates
                    </h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem", color: "var(--color-text-primary)" }}>
                        <li>• Import duties (ad valorem & specific)</li>
                        <li>• VAT / GST / import taxes</li>
                        <li>• Brokerage & handling fees</li>
                        <li>• CIF customs value calculation</li>
                        <li>• AI HS code classification</li>
                        <li>• Compliance insights & restrictions</li>
                        <li>• De minimis threshold checks</li>
                    </ul>
                </div>
                <div className="exclude-card">
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-error)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <X size={20} /> Not Included in Estimates
                    </h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem", color: "var(--color-text-primary)" }}>
                        <li>• Customs inspection penalties</li>
                        <li>• Discretionary broker surcharges</li>
                        <li>• Local warehouse storage costs</li>
                        <li>• Anti-dumping duties (unless noted)</li>
                    </ul>
                </div>
            </section>

            {/* ═══ USE CASES ═══ */}
            <section style={{ marginBottom: "5rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "2rem" }}>Who Uses This</h2>
                <div className="grid-3col">
                    {[
                        { title: "Ecommerce Brands", desc: "Show customers the real cost at checkout — including duties and taxes." },
                        { title: "Procurement Teams", desc: "Forecast landed costs before placing international purchase orders." },
                        { title: "Freight Forwarders", desc: "Quote accurate landed costs for clients across multiple routes." },
                        { title: "Finance Teams", desc: "Reconcile expected vs actual landed costs for budgeting." },
                        { title: "Compliance Officers", desc: "Verify HS codes and flag restricted goods before shipping." },
                    ].map((uc, idx) => (
                        <div key={idx} className="premium-card">
                            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.5rem" }}>{uc.title}</h3>
                            <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>{uc.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ COUNTRY QUICK LINKS ═══ */}
            <section style={{ marginBottom: "5rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "1.5rem" }}>Popular Country Calculators</h2>
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
                        <Link key={c.slug} href={`/${c.slug}/import-duty-calculator/`} className="country-quick-link">
                            <span style={{ fontSize: "1.1rem" }}>{c.flag}</span> <span>{c.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ═══ RECENT CALCULATIONS ═══ */}
            {recentPages && recentPages.length > 0 && (
                <section style={{ marginBottom: "5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Recent Landed Cost Calculations</h2>
                        {lastCalcTime && <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>Last updated: {lastCalcTime}</span>}
                    </div>
                    <div className="grid-3col">
                        {recentPages.map((p, i) => (
                            <Link key={`rc-${i}`} href={`/calculate/${p.slug}/`} className="premium-card" style={{ textDecoration: "none" }}>
                                <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--foreground)", margin: "0 0 0.5rem", lineHeight: 1.4 }}>
                                    {(p.product_description?.length ?? 0) > 50 ? p.product_description?.substring(0, 50) + "…" : p.product_description}
                                </p>
                                <span style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                    <Activity size={12} /> {CN[p.origin_country] || p.origin_country} → {CN[p.destination_country] || p.destination_country}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ═══ FEATURED ROUTES ═══ */}
            {featuredRoutes && featuredRoutes.length > 0 && (
                <section style={{ marginBottom: "5rem" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "1.5rem" }}>Featured Trade Routes</h2>
                    <div className="grid-3col" style={{ marginBottom: "2rem" }}>
                        {featuredRoutes.map((p, i) => (
                            <Link key={`fr-${i}`} href={`/calculate/${p.slug}/`} className="premium-card" style={{ textDecoration: "none" }}>
                                <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--foreground)", margin: "0 0 0.5rem", lineHeight: 1.4 }}>
                                    {(p.product_description?.length ?? 0) > 50 ? p.product_description?.substring(0, 50) + "…" : p.product_description}
                                </p>
                                <span style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                    <Activity size={12} /> {CN[p.origin_country] || p.origin_country} → {CN[p.destination_country] || p.destination_country}
                                </span>
                            </Link>
                        ))}
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <Link href="/calculate/" style={{ color: "var(--color-accent-hover)", fontWeight: 600, fontSize: "0.95rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                            Browse All Calculations <TrendingUp size={16} />
                        </Link>
                    </div>
                </section>
            )}

            {/* ═══ COMMON MISTAKES ═══ */}
            <section style={{ marginBottom: "5rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "2rem" }}>
                    Common Duty Calculation Mistakes
                </h2>
                <div className="grid-4col">
                    {[
                        { title: "Wrong HS Code", desc: "Using an incorrect HS code can result in overpaying duties by thousands — or worse, customs penalties and shipment seizures." },
                        { title: "Ignoring Shipping in Value", desc: "Many countries calculate duty on the CIF value (product + shipping + insurance), not just the product price. Missing this inflates or deflates your estimate." },
                        { title: "Misunderstanding Origin Rules", desc: "A product assembled in one country from parts made in another may not qualify for preferential duty rates. Origin rules are strict." },
                        { title: "Threshold Misinterpretation", desc: "De minimis thresholds vary widely. The US threshold is $800, but many countries set it at $20 or less. Going over triggers formal customs entry." },
                    ].map((m, idx) => (
                        <div key={idx} className="premium-card">
                            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-warning)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <AlertTriangle size={16} /> {m.title}
                            </h3>
                            <p style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ ESTIMATE VS CUSTOMS INVOICE ═══ */}
            <section className="info-callout" style={{ marginBottom: "5rem" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Info size={20} style={{ color: "var(--color-accent-hover)" }} /> Estimate vs. Actual Customs Invoice
                </h2>
                <p style={{ fontSize: "0.95rem", color: "var(--color-text-primary)", lineHeight: 1.7, marginBottom: "1rem" }}>
                    Our calculator gives you a close estimate of your landed cost, but the final customs invoice may differ for a few reasons:
                </p>
                <ul style={{ padding: "0 0 0 1.25rem", margin: 0, fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
                    <li><strong>Valuation method:</strong> Some countries use CIF, others use FOB. This changes the base amount duties are calculated on.</li>
                    <li><strong>Exchange rates:</strong> Customs may apply the exchange rate on the day of clearance, not the day you calculated.</li>
                    <li><strong>Inspector discretion:</strong> Customs officers can reclassify goods or apply additional inspections and fees.</li>
                    <li><strong>Broker charges:</strong> Individual customs brokers add their own handling and processing fees.</li>
                </ul>
            </section>

            {/* ═══ TOOL ECOSYSTEM ═══ */}
            <section style={{ marginBottom: "5rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "2.5rem", textAlign: "center" }}>
                    Trade Compliance Tools
                </h2>
                <div className="grid-3col">
                    {[
                        { href: "/calculate/", title: "Landed Cost Calculator", desc: "Full duty + tax breakdown", icon: <ClipboardList size={24} style={{ color: "var(--color-accent-hover)" }} /> },
                        { href: "/hs-code-finder/", title: "HS Code Finder", desc: "AI-powered classification", icon: <Search size={24} style={{ color: "var(--color-accent-hover)" }} /> },
                        { href: "/import-duty/", title: "Import Duty Guide", desc: "How duties work globally", icon: <BookOpen size={24} style={{ color: "var(--color-accent-hover)" }} /> },
                        { href: "/tariff-rates/", title: "Tariff Rates", desc: "Country-by-country schedules", icon: <FileSpreadsheet size={24} style={{ color: "var(--color-accent-hover)" }} /> },
                        { href: "/customs-clearance/", title: "Customs Clearance", desc: "Step-by-step process guide", icon: <ShieldCheck size={24} style={{ color: "var(--color-accent-hover)" }} /> },
                    ].map((tool, idx) => (
                        <Link key={idx} href={tool.href} className="premium-card" style={{ textDecoration: "none", textAlign: "center" }}>
                            <div style={{ display: "inline-flex", marginBottom: "0.75rem" }}>{tool.icon}</div>
                            <h3 style={{ fontWeight: 600, color: "var(--foreground)", fontSize: "0.95rem", marginBottom: "0.35rem" }}>{tool.title}</h3>
                            <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", margin: 0 }}>{tool.desc}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ═══ SOCIAL PROOF ═══ */}
            <section style={{ marginBottom: "5rem", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", gap: "4rem", flexWrap: "wrap" }}>
                    {[
                        { num: "5,000+", label: "Estimates generated" },
                        { num: "50+", label: "Countries covered" },
                        { num: "AI-Powered", label: "HS classification engine" },
                    ].map((s, idx) => (
                        <div key={idx}>
                            <div style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--color-accent-hover)" }}>{s.num}</div>
                            <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginTop: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ TRUST + METHODOLOGY ═══ */}
            <section style={{ marginBottom: "5rem", background: "rgba(34,197,94,0.02)", border: "1px solid rgba(34,197,94,0.12)", borderRadius: "14px", padding: "2.5rem", textAlign: "center" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <ShieldCheck size={20} style={{ color: "var(--color-success)" }} /> Data You Can Trust
                </h2>
                <p style={{ fontSize: "0.95rem", color: "var(--color-text-primary)", lineHeight: 1.7, maxWidth: "600px", margin: "0 auto 1.5rem" }}>
                    Our tariff data comes from official government sources. Our AI classification engine is trained on real HS code data. We update continuously as trade policies change.
                </p>
                <Link href="/methodology/" style={{ color: "var(--color-accent-hover)", fontWeight: 600, fontSize: "0.95rem", textDecoration: "none" }}>
                    Read Our Methodology →
                </Link>
            </section>

            {/* ═══ FINAL CTA ═══ */}
            <section style={{ marginBottom: "5rem", textAlign: "center", background: `linear-gradient(135deg, var(--color-accent), #4f46e5)`, borderRadius: "16px", padding: "3.5rem 2rem", boxShadow: "0 10px 30px rgba(99,102,241,0.2)" }}>
                <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", marginBottom: "0.75rem", letterSpacing: "-0.01em" }}>
                    Know your real import cost before shipping
                </h2>
                <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.85)", marginBottom: "2rem" }}>
                    Stop guessing. Get a detailed landed cost breakdown in seconds.
                </p>
                <Link href="/calculate/" className="premium-btn-primary" style={{ background: "#fff", color: "var(--color-accent)" }}>
                    Start Calculation
                </Link>
            </section>

            {/* ═══ FAQ SECTION ═══ */}
            <section id="faq" style={{ marginBottom: "5rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "2rem", textAlign: "center" }}>Frequently Asked Questions</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "800px", margin: "0 auto" }}>
                    {faqData.map((f, i) => (
                        <details key={`faq-${i}`} className="premium-card" style={{ padding: "1.25rem 1.5rem" }}>
                            <summary style={{ fontWeight: 600, cursor: "pointer", color: "var(--foreground)", fontSize: "0.95rem" }}>{f.q}</summary>
                            <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "1rem 0 0" }} dangerouslySetInnerHTML={{ __html: f.a }} />
                        </details>
                    ))}
                </div>
            </section>

            {/* ═══ INDUSTRY COMPLIANCE ═══ */}
            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "2.5rem", textAlign: "center" }}>
                    Import Compliance by Industry
                </h2>
                <div className="grid-4col">
                    {[
                        { id: "medical", icon: <Stethoscope size={28} style={{ color: "var(--color-accent-hover)" }} />, name: "Medical & Dental" },
                        { id: "electronics", icon: <Cpu size={28} style={{ color: "var(--color-accent-hover)" }} />, name: "Electronics" },
                        { id: "energy", icon: <Sun size={28} style={{ color: "var(--color-accent-hover)" }} />, name: "Solar & Energy" },
                        { id: "textiles", icon: <Shirt size={28} style={{ color: "var(--color-accent-hover)" }} />, name: "Textiles & Leather" },
                        { id: "food", icon: <Sprout size={28} style={{ color: "var(--color-accent-hover)" }} />, name: "Food & Agriculture" },
                        { id: "automotive", icon: <Car size={28} style={{ color: "var(--color-accent-hover)" }} />, name: "Automotive" },
                        { id: "industrial", icon: <Settings size={28} style={{ color: "var(--color-accent-hover)" }} />, name: "Industrial Machinery" },
                        { id: "chemicals", icon: <FlaskConical size={28} style={{ color: "var(--color-accent-hover)" }} />, name: "Chemicals" },
                    ].map(ind => (
                        <Link key={ind.id} href={`/category/${ind.id}/`} className="premium-card" style={{ textDecoration: "none", textAlign: "center", padding: "1.5rem 1rem" }}>
                            <div style={{ display: "inline-flex", marginBottom: "0.75rem" }}>{ind.icon}</div>
                            <div style={{ fontWeight: 600, color: "var(--foreground)", fontSize: "0.95rem" }}>{ind.name}</div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
