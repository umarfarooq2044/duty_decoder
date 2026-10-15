import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CheckCircle, RefreshCw, AlertTriangle, ShieldCheck, Cpu, UserCheck } from "lucide-react";

export const metadata: Metadata = {
    title: "Editorial Policy & Verification Standards",
    description:
        "DutyDecoder Editorial Policy: Learn how our trade compliance research is conducted, how tariff schedules are verified, human editorial accountability, and how AI technology is ethically utilized.",
    alternates: { canonical: "/editorial-policy/" },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "DutyDecoder Editorial Policy",
    description: "Editorial guidelines, verification procedures, and AI governance standards for DutyDecoder.",
    url: "https://dutydecoder.com/editorial-policy/",
    publisher: {
        "@type": "Organization",
        name: "DutyDecoder",
        url: "https://dutydecoder.com",
    },
};

export default function EditorialPolicyPage() {
    const cardStyle: React.CSSProperties = {
        background: "var(--surface, #FFFFFF)",
        border: "1px solid var(--border, #E3E8EF)",
        borderRadius: "14px",
        padding: "1.5rem",
        marginBottom: "1.5rem",
        boxShadow: "0 2px 8px rgba(11, 31, 58, 0.03)",
    };

    const paraStyle: React.CSSProperties = {
        fontSize: "0.975rem",
        color: "var(--text-body, #475569)",
        lineHeight: 1.8,
        marginBottom: "1rem",
    };

    return (
        <main style={{ maxWidth: "850px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <header style={{ marginBottom: "3rem", borderBottom: "1px solid var(--border, #E3E8EF)", paddingBottom: "1.5rem" }}>
                <h1
                    style={{
                        fontSize: "clamp(2rem, 4vw, 2.75rem)",
                        fontWeight: 800,
                        color: "var(--foreground)",
                        margin: "0 0 0.5rem",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                    }}
                >
                    Editorial Policy &amp; Standards
                </h1>
                <p style={{ fontSize: "1.05rem", color: "var(--muted-foreground)", margin: 0 }}>
                    Our commitment to accuracy, factual verification, human accountability, and transparent tariff research.
                </p>
            </header>

            {/* Core Principle */}
            <section style={{ marginBottom: "2.5rem" }}>
                <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--foreground)", margin: "0 0 1rem" }}>
                    1. Primary Principles of DutyDecoder Content
                </h2>
                <p style={paraStyle}>
                    DutyDecoder publishes technical trade intelligence, customs calculation tools, and educational guides for international importers, e-commerce sellers, and logistics coordinators. Because customs misclassifications and rate errors carry significant financial and regulatory consequences, our editorial integrity rests on three pillars:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
                    <div style={cardStyle}>
                        <CheckCircle size={20} style={{ color: "var(--teal-700, #0F766E)", marginBottom: "0.5rem" }} />
                        <strong style={{ display: "block", fontSize: "1rem", color: "var(--foreground)", marginBottom: "0.25rem" }}>Primary Authority Only</strong>
                        <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", margin: 0, lineHeight: 1.6 }}>
                            Every tariff percentage, VAT threshold, and customs fee cited on DutyDecoder traces directly to an official government agency or statutory publication.
                        </p>
                    </div>

                    <div style={cardStyle}>
                        <ShieldCheck size={20} style={{ color: "var(--teal-700, #0F766E)", marginBottom: "0.5rem" }} />
                        <strong style={{ display: "block", fontSize: "1rem", color: "var(--foreground)", marginBottom: "0.25rem" }}>Independence</strong>
                        <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", margin: 0, lineHeight: 1.6 }}>
                            Our duty rates and classifications are completely independent of commercial sponsorship, advertising agreements, or carrier partnerships.
                        </p>
                    </div>

                    <div style={cardStyle}>
                        <RefreshCw size={20} style={{ color: "var(--teal-700, #0F766E)", marginBottom: "0.5rem" }} />
                        <strong style={{ display: "block", fontSize: "1rem", color: "var(--foreground)", marginBottom: "0.25rem" }}>Continuous Revision</strong>
                        <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", margin: 0, lineHeight: 1.6 }}>
                            We track international gazettes, Federal Register notices, and official customs communiqués to revise rates promptly when regulations evolve.
                        </p>
                    </div>
                </div>
            </section>

            {/* AI Usage & Human Governance */}
            <section style={{ marginBottom: "2.5rem" }}>
                <div
                    style={{
                        background: "var(--bg, #F7F9FC)",
                        border: "1px solid var(--border, #E3E8EF)",
                        borderRadius: "16px",
                        padding: "1.75rem",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                        <Cpu size={22} style={{ color: "var(--accent)" }} />
                        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                            2. Artificial Intelligence Policy &amp; Human Accountability
                        </h2>
                    </div>
                    <p style={paraStyle}>
                        DutyDecoder employs specialized natural language processing and inference models (Groq Llama 3) to perform real-time semantic matching between everyday product descriptions and the 5,000+ headings of the Harmonized System.
                    </p>
                    <p style={{ ...paraStyle, fontWeight: 600, color: "var(--foreground)" }}>
                        Our strict governance rules regarding AI include:
                    </p>
                    <ul style={{ ...paraStyle, paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <li>
                            <strong>AI Assists, Humans Govern:</strong> AI is used for terminology mapping and multi-language normalization. All underlying customs rules, mathematical formulas, and legal disclaimers are engineered and verified by human specialists.
                        </li>
                        <li>
                            <strong>Mandatory Legal Framework:</strong> AI classification algorithms are strictly bound to the WCO General Rules of Interpretation (GRI 1–6). If a model output cannot cite an applicable GRI rule or chapter heading note, it is rejected.
                        </li>
                        <li>
                            <strong>Zero Hallucinated Rates:</strong> AI models are strictly prohibited from generating tariff percentages. Duty rates must resolve to a verified database row originating from an official government schedule.
                        </li>
                        <li>
                            <strong>Human Curation of Indexed Content:</strong> Programmatic or AI-generated pages must meet our strict <Link href="/methodology/" style={{ color: "var(--accent)", fontWeight: 600 }}>Quality Gate</Link> before being included in our searchable index. Pages failing quality criteria are marked <code>noindex</code>.
                        </li>
                    </ul>
                </div>
            </section>

            {/* Research & Sourcing Standards */}
            <section style={{ marginBottom: "2.5rem" }}>
                <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--foreground)", margin: "0 0 1rem" }}>
                    3. Research and Sourcing Standards
                </h2>
                <p style={paraStyle}>
                    All guides, articles, and documentation on DutyDecoder are created following structured research protocols:
                </p>
                <ol style={{ ...paraStyle, paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    <li>
                        <strong>Statutory Tariff Reference:</strong> Verification against official publications including USITC Harmonized Tariff Schedule, EU TARIC, UK Trade Tariff Service (HMRC), Canada CBSA Customs Tariff, and national customs agencies.
                    </li>
                    <li>
                        <strong>Incoterms 2020 Compliance:</strong> Cost breakdowns and delivery terms conform to the International Chamber of Commerce (ICC) Incoterms 2020 definitions (FOB, CIF, DDP, DAP, EXW).
                    </li>
                    <li>
                        <strong>Worked Numerical Examples:</strong> Technical concepts (such as CIF vs FOB duty valuation or compounding VAT) must be illustrated with concrete, verifiable arithmetic examples.
                    </li>
                    <li>
                        <strong>Clear Date &amp; Citation Footnotes:</strong> Every article and guide clearly displays its publication and latest review date alongside links to authoritative source materials.
                    </li>
                </ol>
            </section>

            {/* Corrections & Error Handling */}
            <section style={{ marginBottom: "2.5rem" }}>
                <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--foreground)", margin: "0 0 1rem" }}>
                    4. Corrections &amp; Discrepancy Reporting
                </h2>
                <p style={paraStyle}>
                    International trade law is dynamic. When national customs authorities modify tariff classifications, emergency surcharges, or de minimis exemptions, we strive to update our databases promptly.
                </p>
                <p style={paraStyle}>
                    We encourage users, customs brokers, and importers to notify us of any perceived discrepancies. Our correction protocol is as follows:
                </p>
                <ul style={{ ...paraStyle, paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <li>
                        Submit reports via our <Link href="/contact/" style={{ color: "var(--accent)", fontWeight: 600 }}>Contact Form</Link> (select &ldquo;Tariff Rate Correction / Dispute&rdquo;) or email <a href="mailto:corrections@dutydecoder.com" style={{ color: "var(--accent)", fontWeight: 600 }}>corrections@dutydecoder.com</a>.
                    </li>
                    <li>
                        Include the specific URL, product name, destination country, and statutory citation if available.
                    </li>
                    <li>
                        Our editorial team cross-references the report against the national authority within 48 hours. If verified, the database rate is updated immediately and a correction note is logged.
                    </li>
                </ul>
            </section>

            {/* Author Attribution */}
            <section style={{ marginBottom: "2.5rem" }}>
                <div style={cardStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                        <UserCheck size={20} style={{ color: "var(--accent)" }} />
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                            5. Authorship &amp; Attribution
                        </h3>
                    </div>
                    <p style={{ ...paraStyle, marginBottom: 0 }}>
                        All published guides are authored and reviewed by the <strong>DutyDecoder Editorial Team</strong> under the direction of Lead Engineer Umar Farooq and international logistics advisors. For detailed data sources and methodology, visit our <Link href="/data-sources/" style={{ color: "var(--accent)", fontWeight: 600 }}>Data Sources Register</Link> and <Link href="/methodology/" style={{ color: "var(--accent)", fontWeight: 600 }}>Methodology Guide</Link>.
                    </p>
                </div>
            </section>
        </main>
    );
}
