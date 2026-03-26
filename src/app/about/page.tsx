import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Learn about DutyDecoder — the AI-powered import duty calculator and trade compliance platform trusted by importers, e-commerce sellers, and customs professionals in 50+ countries.",
    alternates: { canonical: "/about/" },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About DutyDecoder",
    description:
        "DutyDecoder is an AI-powered import duty and landed cost calculator covering 50+ countries with real-time 2026 tariff data.",
    url: "https://dutydecoder.com/about/",
    mainEntity: {
        "@type": "Organization",
        name: "DutyDecoder",
        url: "https://dutydecoder.com",
        email: "contact@dutydecoder.com",
        description:
            "AI-powered import duty calculator and customs compliance engine providing landed cost estimates for 50+ countries.",
        foundingDate: "2025",
        sameAs: [],
        knowsAbout: [
            "Import duty calculation",
            "Customs tariff classification",
            "HS code lookup",
            "Landed cost estimation",
            "International trade compliance",
            "WCO Harmonized System",
            "Trade agreements and preferential duty rates",
            "De minimis thresholds",
            "Customs clearance procedures",
            "VAT/GST on imports",
        ],
    },
};

export default function AboutPage() {
    const sectionStyle: React.CSSProperties = { marginBottom: "2.5rem" };
    const headingStyle: React.CSSProperties = {
        fontSize: "1.3rem",
        fontWeight: 700,
        color: "var(--foreground)",
        marginBottom: "1rem",
    };
    const paraStyle: React.CSSProperties = {
        fontSize: "1rem",
        color: "var(--muted-foreground)",
        lineHeight: 1.8,
        marginBottom: "1rem",
    };

    return (
        <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <h1
                style={{
                    fontSize: "2.25rem",
                    fontWeight: 800,
                    color: "var(--foreground)",
                    marginBottom: "0.5rem",
                }}
            >
                About DutyDecoder
            </h1>
            <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", marginBottom: "3rem" }}>
                Simplifying global trade, one shipment at a time
            </p>

            {/* Mission */}
            <section style={sectionStyle}>
                <h2 style={headingStyle}>Our Mission</h2>
                <p style={paraStyle}>
                    International trade shouldn&apos;t require a degree in customs law. DutyDecoder
                    was built with a simple mission: <strong>make import duties, tariffs, and
                        landed costs transparent and accessible to everyone</strong> — from first-time
                    importers and small e-commerce sellers to seasoned logistics professionals.
                </p>
                <p style={paraStyle}>
                    We believe that every business, regardless of size, deserves access to the
                    same caliber of trade intelligence that multinational corporations rely on.
                    That&apos;s why our core tools are completely free.
                </p>
            </section>

            {/* What We Do */}
            <section style={sectionStyle}>
                <h2 style={headingStyle}>What We Do</h2>
                <p style={paraStyle}>
                    DutyDecoder is an <strong>AI-powered import duty calculator and customs
                        compliance platform</strong> that helps you understand the true cost of
                    importing goods into <strong>50+ countries</strong>. Our platform provides:
                </p>
                <ul
                    style={{
                        ...paraStyle,
                        paddingLeft: "1.5rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                    }}
                >
                    <li>
                        <strong>Landed Cost Calculator</strong> — Estimate import duties, VAT/GST,
                        and total costs before you ship
                    </li>
                    <li>
                        <strong>AI HS Code Classification</strong> — Automatically classify
                        products into the correct Harmonized System codes using natural language
                        descriptions
                    </li>
                    <li>
                        <strong>Country-Specific Import Guides</strong> — Detailed duty rates,
                        de minimis thresholds, import restrictions, and required documents for
                        each destination country
                    </li>
                    <li>
                        <strong>Real-Time 2026 Tariff Data</strong> — Continuously updated tariff
                        schedules so your calculations reflect the latest trade regulations
                    </li>
                </ul>
            </section>

            {/* How It Works */}
            <section style={sectionStyle}>
                <h2 style={headingStyle}>How It Works</h2>
                <p style={paraStyle}>
                    Simply describe your product, select the origin and destination countries,
                    and enter the shipment value. Our AI engine classifies the product under the
                    correct HS code, looks up the applicable duty rate from our tariff database,
                    and calculates the full landed cost — including customs duty, VAT/GST,
                    and any applicable surcharges.
                </p>
                <p style={paraStyle}>
                    Every calculation is stored as a public reference page so future importers
                    shipping similar products can instantly access estimated costs.
                </p>
            </section>

            {/* Our Data */}
            <section style={sectionStyle}>
                <h2 style={headingStyle}>Our Data &amp; Methodology</h2>
                <p style={paraStyle}>
                    Accuracy matters in trade compliance. Our tariff data is sourced from
                    official government customs schedules, WTO tariff databases, and verified
                    trade agreements. We combine this structured data with a proprietary
                    AI classification engine to deliver reliable estimates.
                </p>
                <p style={paraStyle}>
                    For full transparency on how we source, validate, and update our data,
                    visit our{" "}
                    <Link href="/methodology/" style={{ color: "var(--accent)" }}>
                        Data Methodology
                    </Link>{" "}
                    page.
                </p>
            </section>

            {/* Who We Serve */}
            <section style={sectionStyle}>
                <h2 style={headingStyle}>Who We Serve</h2>
                <ul
                    style={{
                        ...paraStyle,
                        paddingLeft: "1.5rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                    }}
                >
                    <li>
                        <strong>E-Commerce Sellers</strong> — Know the exact landed cost before
                        pricing products for international markets
                    </li>
                    <li>
                        <strong>Small &amp; Medium Businesses</strong> — Budget accurately for
                        import expenses without hiring a customs consultant
                    </li>
                    <li>
                        <strong>Freight Forwarders &amp; Customs Brokers</strong> — Quickly
                        estimate duties for client quotations
                    </li>
                    <li>
                        <strong>Individual Importers</strong> — Understand what you&apos;ll owe at
                        customs before ordering from overseas
                    </li>
                    <li>
                        <strong>Trade Compliance Teams</strong> — Cross-reference HS codes and
                        duty rates across multiple countries
                    </li>
                </ul>
            </section>

            {/* Commitment */}
            <section
                style={{
                    background: "rgba(34,197,94,0.06)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: "12px",
                    padding: "1.5rem 2rem",
                    marginBottom: "2.5rem",
                }}
            >
                <h2
                    style={{
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        color: "var(--foreground)",
                        marginBottom: "0.75rem",
                    }}
                >
                    🌍 Our Commitment
                </h2>
                <p style={{ ...paraStyle, margin: 0 }}>
                    We are committed to keeping DutyDecoder&apos;s core tools{" "}
                    <strong>free and accessible</strong>. As global trade evolves, we
                    continuously expand our country coverage, improve our AI classification
                    accuracy, and update tariff data to reflect the latest regulations. Our
                    goal is to be the most trusted, comprehensive import duty resource on the web.
                </p>
            </section>

            {/* Editorial Team & Expertise */}
            <section style={sectionStyle}>
                <h2 style={headingStyle}>Our Expertise</h2>
                <p style={paraStyle}>
                    DutyDecoder was built and is maintained by a team combining <strong>deep
                    customs and trade compliance knowledge</strong> with modern AI and software
                    engineering. Our content and calculations are informed by:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", marginBottom: "1.5rem" }}>
                    {[
                        {
                            icon: "🏛️",
                            title: "Official Tariff Schedules",
                            desc: "Every duty rate traces directly to an official government-published tariff schedule — USITC HTS, EU TARIC, UK Global Tariff, and 50+ national customs authorities.",
                        },
                        {
                            icon: "🤖",
                            title: "AI + Human Verification",
                            desc: "Our AI classification engine follows WCO General Rules of Interpretation (GRI 1–6) — the same legal framework licensed customs brokers use. Edge cases are flagged for manual review.",
                        },
                        {
                            icon: "📊",
                            title: "Trade Data Analysis",
                            desc: "Over 5,000+ product-route combinations classified and cross-referenced against official HS nomenclature to continuously improve accuracy.",
                        },
                        {
                            icon: "📝",
                            title: "Domain-Expert Content",
                            desc: "All country guides, compliance articles, and educational content are written by contributors with real-world import/export experience and reviewed against official customs publications.",
                        },
                    ].map(card => (
                        <div key={card.title} style={{
                            background: "rgba(30, 34, 53, 0.5)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            borderRadius: "12px",
                            padding: "1.25rem",
                        }}>
                            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }} aria-hidden="true">{card.icon}</div>
                            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.5rem" }}>{card.title}</h3>
                            <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", lineHeight: 1.7, margin: 0 }}>{card.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Editorial Process */}
            <section
                style={{
                    background: "rgba(99, 102, 241, 0.04)",
                    border: "1px solid rgba(99, 102, 241, 0.12)",
                    borderRadius: "12px",
                    padding: "1.5rem 2rem",
                    marginBottom: "2.5rem",
                }}
            >
                <h2
                    style={{
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        color: "var(--foreground)",
                        marginBottom: "1rem",
                    }}
                >
                    📋 Our Editorial Process
                </h2>
                <p style={{ ...paraStyle, marginBottom: "1rem" }}>
                    Every piece of content on DutyDecoder follows a rigorous editorial process
                    to ensure accuracy and trustworthiness:
                </p>
                <ol
                    style={{
                        ...paraStyle,
                        paddingLeft: "1.5rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                        margin: 0,
                    }}
                >
                    <li>
                        <strong>Research:</strong> All tariff data is sourced directly from
                        official government customs authorities — never from scraped aggregators
                        or unverified third-party databases.
                    </li>
                    <li>
                        <strong>AI Classification:</strong> Product classifications follow the
                        WCO Harmonized System standards and General Rules of Interpretation
                        (GRI 1–6), the same legal framework used by licensed customs brokers
                        worldwide.
                    </li>
                    <li>
                        <strong>Cross-Verification:</strong> AI-generated HS codes are
                        cross-referenced against our database at three levels (10-digit, 6-digit,
                        4-digit heading) to ensure the closest official rate match.
                    </li>
                    <li>
                        <strong>Continuous Updates:</strong> Major trade partners receive rate
                        updates within 48 hours of any official gazette publication or Federal
                        Register notice.
                    </li>
                    <li>
                        <strong>Transparency:</strong> We publish our full{" "}
                        <Link href="/methodology/" style={{ color: "var(--accent)" }}>
                            data sources and methodology
                        </Link>, including known limitations and areas where professional customs
                        broker consultation is recommended.
                    </li>
                </ol>
            </section>

            {/* Contact CTA */}
            <section style={sectionStyle}>
                <h2 style={headingStyle}>Get in Touch</h2>
                <p style={paraStyle}>
                    Have questions, feedback, or a partnership idea? We&apos;d love to hear from
                    you. Visit our{" "}
                    <Link href="/contact/" style={{ color: "var(--accent)" }}>
                        Contact Us
                    </Link>{" "}
                    page or email us directly at{" "}
                    <a
                        href="mailto:contact@dutydecoder.com"
                        style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}
                    >
                        contact@dutydecoder.com
                    </a>
                    .
                </p>
            </section>
        </main>
    );
}
