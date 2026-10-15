import type { Metadata } from "next";
import Link from "next/link";
import { COUNTRIES } from "@/lib/countries";
import { Map, Calculator, BookOpen, Globe2, ShieldCheck, Layers } from "lucide-react";

export const metadata: Metadata = {
    title: "HTML Sitemap — Global Trade & Customs Directory",
    description:
        "Human-readable sitemap of DutyDecoder: Browse all 50 country import duty calculators, customs guides, landed cost tools, and compliance policies.",
    alternates: { canonical: "/sitemap/" },
};

export default function HtmlSitemapPage() {
    const cardStyle: React.CSSProperties = {
        background: "var(--surface, #FFFFFF)",
        border: "1px solid var(--border, #E3E8EF)",
        borderRadius: "14px",
        padding: "1.75rem",
        marginBottom: "2rem",
        boxShadow: "0 2px 8px rgba(11, 31, 58, 0.03)",
    };

    const linkListStyle: React.CSSProperties = {
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "0.6rem 1rem",
    };

    const linkStyle: React.CSSProperties = {
        color: "var(--accent)",
        textDecoration: "none",
        fontSize: "0.9rem",
    };

    return (
        <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
            <header style={{ marginBottom: "2.5rem", borderBottom: "1px solid var(--border, #E3E8EF)", paddingBottom: "1.5rem" }}>
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
                    DutyDecoder Site Directory &amp; Sitemap
                </h1>
                <p style={{ fontSize: "1.05rem", color: "var(--muted-foreground)", margin: 0 }}>
                    Direct navigational index to all calculators, country duty tools, compliance guides, and legal registers.
                </p>
            </header>

            {/* Calculators & Tools */}
            <div style={cardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                    <Calculator size={20} style={{ color: "var(--accent)" }} />
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                        Calculators &amp; Interactive Tools
                    </h2>
                </div>
                <ul style={linkListStyle}>
                    <li><Link href="/" style={linkStyle}>DutyDecoder Homepage</Link></li>
                    <li><Link href="/calculate/" style={linkStyle}>Global Landed Cost Calculator</Link></li>
                    <li><Link href="/hs-code-finder/" style={linkStyle}>AI HS Code Classification Finder</Link></li>
                    <li><Link href="/tariff-rates/" style={linkStyle}>2026 Global Tariff Schedules</Link></li>
                    <li><Link href="/hs-code-lookup/" style={linkStyle}>HS Code Hierarchy Lookup</Link></li>
                </ul>
            </div>

            {/* Cornerstone Guides */}
            <div style={cardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                    <BookOpen size={20} style={{ color: "var(--accent)" }} />
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                        Cornerstone Trade &amp; Customs Guides
                    </h2>
                </div>
                <ul style={linkListStyle}>
                    <li><Link href="/import-duty/" style={linkStyle}>Import Duty Explained (Ad Valorem vs Specific)</Link></li>
                    <li><Link href="/customs-duty/" style={linkStyle}>Customs Valuation (FOB vs CIF Rules)</Link></li>
                    <li><Link href="/import-tax/" style={linkStyle}>Import Tax, VAT &amp; GST Structures</Link></li>
                    <li><Link href="/incoterms/" style={linkStyle}>Incoterms 2020 Complete Importer Guide</Link></li>
                    <li><Link href="/import-from-china/" style={linkStyle}>Importing from China Handbook</Link></li>
                    <li><Link href="/customs-broker/" style={linkStyle}>Working with Licensed Customs Brokers</Link></li>
                    <li><Link href="/customs-clearance/" style={linkStyle}>Step-by-Step Customs Clearance Process</Link></li>
                    <li><Link href="/import-documents/" style={linkStyle}>Mandatory Import Documentation Checklist</Link></li>
                    <li><Link href="/import-restrictions/" style={linkStyle}>Import Restrictions &amp; Prohibited Goods</Link></li>
                    <li><Link href="/export-documents/" style={linkStyle}>Export Documentation &amp; Certificates</Link></li>
                    <li><Link href="/trade-finance/" style={linkStyle}>Trade Finance &amp; Letters of Credit (LC)</Link></li>
                </ul>
            </div>

            {/* Industry Verticals */}
            <div style={cardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                    <Layers size={20} style={{ color: "var(--accent)" }} />
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                        Industry Verticals &amp; Commodity Hubs
                    </h2>
                </div>
                <ul style={linkListStyle}>
                    <li><Link href="/category/medical/" style={linkStyle}>Medical Devices &amp; Equipment</Link></li>
                    <li><Link href="/category/electronics/" style={linkStyle}>Electronics &amp; IT Hardware</Link></li>
                    <li><Link href="/category/energy/" style={linkStyle}>Solar &amp; Renewable Energy Equipment</Link></li>
                    <li><Link href="/category/textiles/" style={linkStyle}>Textiles, Apparel &amp; Footwear</Link></li>
                    <li><Link href="/category/food/" style={linkStyle}>Food Products &amp; Agriculture</Link></li>
                    <li><Link href="/category/automotive/" style={linkStyle}>Automotive Parts &amp; Vehicles</Link></li>
                    <li><Link href="/category/industrial/" style={linkStyle}>Industrial Machinery &amp; Tooling</Link></li>
                    <li><Link href="/category/chemicals/" style={linkStyle}>Chemicals &amp; Industrial Materials</Link></li>
                </ul>
            </div>

            {/* 50 Country Calculators */}
            <div style={cardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                    <Globe2 size={20} style={{ color: "var(--accent)" }} />
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                        50+ Country Import Duty Calculators
                    </h2>
                </div>
                <ul style={linkListStyle}>
                    {COUNTRIES.map((c) => (
                        <li key={c.code}>
                            <Link href={`/${c.slug}/import-duty-calculator/`} style={linkStyle}>
                                {c.name} Duty Calculator
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Transparency & Legal */}
            <div style={cardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                    <ShieldCheck size={20} style={{ color: "var(--accent)" }} />
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                        Transparency, Methodology &amp; Legal Policies
                    </h2>
                </div>
                <ul style={linkListStyle}>
                    <li><Link href="/about/" style={linkStyle}>About DutyDecoder</Link></li>
                    <li><Link href="/methodology/" style={linkStyle}>Tariff Methodology &amp; Accuracy</Link></li>
                    <li><Link href="/data-sources/" style={linkStyle}>Official Data Sources Register</Link></li>
                    <li><Link href="/editorial-policy/" style={linkStyle}>Editorial Policy &amp; AI Standards</Link></li>
                    <li><Link href="/contact/" style={linkStyle}>Contact Compliance Desk</Link></li>
                    <li><Link href="/privacy/" style={linkStyle}>Privacy Policy (GDPR / CCPA / AdSense)</Link></li>
                    <li><Link href="/terms/" style={linkStyle}>Terms of Service</Link></li>
                    <li><Link href="/disclaimer/" style={linkStyle}>Customs Estimation Disclaimer</Link></li>
                </ul>
            </div>
        </main>
    );
}
