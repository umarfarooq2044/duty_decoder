import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Cpu, BarChart3, ShieldCheck, Users, DollarSign, BookOpen, Scale } from "lucide-react";

export const metadata: Metadata = {
    title: "About Us — Global Trade Compliance Platform",
    description:
        "Learn about DutyDecoder — an independent international trade intelligence platform providing import duty calculations, AI HS code classification, and landed cost forecasting.",
    alternates: { canonical: "/about/" },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About DutyDecoder",
    description:
        "DutyDecoder is an independent trade compliance platform providing import duty and landed cost calculators across 50+ jurisdictions with official 2026 tariff schedules.",
    url: "https://dutydecoder.com/about/",
    mainEntity: {
        "@type": "Organization",
        name: "DutyDecoder",
        url: "https://dutydecoder.com",
        email: "contact@dutydecoder.com",
        description:
            "AI-powered import duty calculation and customs compliance engine providing landed cost estimates for 50+ countries.",
        foundingDate: "2025",
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
    const cardStyle: React.CSSProperties = {
        background: "var(--surface, #FFFFFF)",
        border: "1px solid var(--border, #E3E8EF)",
        borderRadius: "14px",
        padding: "1.5rem",
        boxShadow: "0 2px 8px rgba(11, 31, 58, 0.03)",
    };

    const paraStyle: React.CSSProperties = {
        fontSize: "1rem",
        color: "var(--text-body, #475569)",
        lineHeight: 1.8,
        marginBottom: "1.25rem",
    };

    return (
        <main style={{ maxWidth: "850px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <header style={{ marginBottom: "3rem" }}>
                <h1
                    style={{
                        fontSize: "clamp(2rem, 4vw, 2.75rem)",
                        fontWeight: 800,
                        color: "var(--foreground)",
                        margin: "0 0 0.75rem",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                    }}
                >
                    About DutyDecoder
                </h1>
                <p style={{ fontSize: "1.1rem", color: "var(--muted-foreground)", margin: 0, lineHeight: 1.6 }}>
                    Demystifying international customs duties, tariffs, and landed costs for modern cross-border trade.
                </p>
            </header>

            {/* Mission Statement */}
            <section style={{ marginBottom: "3rem" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--foreground)", margin: "0 0 1rem" }}>
                    Our Mission
                </h2>
                <p style={paraStyle}>
                    International trade documentation and tariff schedules should not require an expensive customs brokerage retainer to decipher. DutyDecoder was created to solve a fundamental problem facing modern commerce: <strong>landed costs are opaque, unpredictable, and laden with hidden fees</strong>.
                </p>
                <p style={paraStyle}>
                    Whether you are an e-commerce entrepreneur importing a first production run from Shenzhen to Los Angeles, a procurement manager sourcing industrial parts from Tokyo to Hamburg, or a logistics forwarder estimating duties for a client, DutyDecoder provides <strong>transparent, instant, and legally referenced import cost breakdowns</strong>.
                </p>
            </section>

            {/* Entity, Leadership & Governance */}
            <section style={{ marginBottom: "3rem" }}>
                <div
                    style={{
                        background: "var(--bg, #F7F9FC)",
                        border: "1px solid var(--border, #E3E8EF)",
                        borderRadius: "16px",
                        padding: "2rem",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                        <Building2 size={24} style={{ color: "var(--accent)" }} />
                        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                            Organization &amp; Editorial Leadership
                        </h2>
                    </div>
                    <p style={paraStyle}>
                        DutyDecoder is developed and operated as an independent digital trade publishing project led by <strong>Umar Farooq</strong> (Lead Systems Engineer &amp; Trade Architecture) alongside a dedicated editorial network of customs specialists and international trade researchers.
                    </p>
                    <p style={{ ...paraStyle, marginBottom: 0 }}>
                        {/* TODO_OWNER: Provide formal company legal registration number, registered office address, and primary regulatory jurisdiction */}
                        <strong>Operating Entity:</strong> DutyDecoder Digital Publications / Umar Farooq<br />
                        <strong>Headquarters:</strong> Lahore, Pakistan &amp; International Contributor Network<br />
                        <strong>Editorial Contact:</strong> <a href="mailto:contact@dutydecoder.com" style={{ color: "var(--accent)", fontWeight: 600 }}>contact@dutydecoder.com</a>
                    </p>
                </div>
            </section>

            {/* Core Capabilities */}
            <section style={{ marginBottom: "3rem" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--foreground)", margin: "0 0 1.25rem" }}>
                    Core Capabilities
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.25rem" }}>
                    <div style={cardStyle}>
                        <Cpu size={22} style={{ color: "var(--accent)", marginBottom: "0.75rem" }} />
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--foreground)", margin: "0 0 0.5rem" }}>
                            AI HS Code Classification
                        </h3>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-body, #475569)", lineHeight: 1.6, margin: 0 }}>
                            Proprietary multi-layer classification engine aligning plain-English product descriptions with the World Customs Organization (WCO) General Rules of Interpretation (GRI 1–6).
                        </p>
                    </div>

                    <div style={cardStyle}>
                        <Scale size={22} style={{ color: "var(--accent)", marginBottom: "0.75rem" }} />
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--foreground)", margin: "0 0 0.5rem" }}>
                            50+ National Tariff Schedules
                        </h3>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-body, #475569)", lineHeight: 1.6, margin: 0 }}>
                            Direct integration with official gazettes including USITC HTS, EU TARIC, HMRC UK Global Tariff, CBSA Canada, and CBIC India schedules.
                        </p>
                    </div>

                    <div style={cardStyle}>
                        <BarChart3 size={22} style={{ color: "var(--accent)", marginBottom: "0.75rem" }} />
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--foreground)", margin: "0 0 0.5rem" }}>
                            Precision Landed Cost Modeling
                        </h3>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-body, #475569)", lineHeight: 1.6, margin: 0 }}>
                            Arbitrary-precision math calculating ad valorem duties, specific rates, national harbor/merchandise fees, and destination VAT/GST compounded legally.
                        </p>
                    </div>

                    <div style={cardStyle}>
                        <BookOpen size={22} style={{ color: "var(--accent)", marginBottom: "0.75rem" }} />
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--foreground)", margin: "0 0 0.5rem" }}>
                            Original Educational Guides
                        </h3>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-body, #475569)", lineHeight: 1.6, margin: 0 }}>
                            Comprehensive, peer-reviewed handbooks on Incoterms 2020, customs brokerage, export documentation, and trade finance instruments.
                        </p>
                    </div>
                </div>
            </section>

            {/* How We Make Money — Transparency Disclosure */}
            <section style={{ marginBottom: "3rem" }}>
                <div
                    style={{
                        background: "var(--teal-50, #F0FDFA)",
                        border: "1px solid rgba(15, 118, 110, 0.25)",
                        borderRadius: "16px",
                        padding: "2rem",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                        <DollarSign size={24} style={{ color: "var(--teal-700, #0F766E)" }} />
                        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--navy-900, #0B1F3A)", margin: 0 }}>
                            How We Make Money (Monetization Transparency)
                        </h2>
                    </div>
                    <p style={{ ...paraStyle, color: "var(--navy-900, #0B1F3A)", marginBottom: "1rem" }}>
                        DutyDecoder is completely free for all users. We do not charge subscription fees, sell user calculation inputs, or gate critical tariff intelligence behind paywalls.
                    </p>
                    <p style={{ ...paraStyle, color: "var(--text-body, #475569)", marginBottom: 0 }}>
                        To cover cloud hosting, AI compute infrastructure, and tariff database licensing costs, <strong>DutyDecoder plans to display contextual digital advertising (including Google AdSense)</strong>. Advertising units are strictly segregated from calculation logic, never dictate editorial conclusions, and follow our strict <Link href="/editorial-policy/" style={{ color: "var(--teal-700, #0F766E)", fontWeight: 600 }}>Editorial Policy</Link>.
                    </p>
                </div>
            </section>

            {/* Editorial Rigor & Verification */}
            <section style={{ marginBottom: "3rem" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--foreground)", margin: "0 0 1rem" }}>
                    Editorial Independence &amp; Verification Standards
                </h2>
                <p style={paraStyle}>
                    Every piece of editorial analysis, country customs guide, and tariff explanation on DutyDecoder adheres to our structured publishing workflow:
                </p>
                <ol style={{ ...paraStyle, paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <li>
                        <strong>Primary-Source Authority:</strong> Rates originate exclusively from official government customs publications — never from unverified third-party aggregators.
                    </li>
                    <li>
                        <strong>Human Accountability:</strong> While automated tools and AI models assist in classifying commodity nomenclature, human editors review legal interpretations and verify rates against official Federal Register and EU Official Journal updates.
                    </li>
                    <li>
                        <strong>Continuous Correction Process:</strong> We maintain a public corrections channel (<a href="mailto:corrections@dutydecoder.com" style={{ color: "var(--accent)", fontWeight: 600 }}>corrections@dutydecoder.com</a>) and investigate reported discrepancies within 48 hours.
                    </li>
                </ol>
                <p style={{ ...paraStyle, margin: "1rem 0 0" }}>
                    Explore our detailed <Link href="/methodology/" style={{ color: "var(--accent)", fontWeight: 600 }}>Methodology &amp; Calculation Formulas</Link> and our <Link href="/data-sources/" style={{ color: "var(--accent)", fontWeight: 600 }}>Data Sources Register</Link>.
                </p>
            </section>
        </main>
    );
}
