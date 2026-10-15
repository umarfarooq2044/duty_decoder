import type { Metadata } from "next";
import Link from "next/link";
import { Database, CheckCircle, ExternalLink, RefreshCw, AlertCircle, ShieldAlert, Mail } from "lucide-react";

export const metadata: Metadata = {
    title: "Official Data Sources & Tariff Schedules Register",
    description:
        "Complete directory of government customs schedules, international trade databases, update cadences, and rate correction protocols powering DutyDecoder.",
    alternates: { canonical: "/data-sources/" },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "DutyDecoder Official Data Sources Register",
    description: "Official government customs databases and tariff schedules utilized by DutyDecoder.",
    url: "https://dutydecoder.com/data-sources/",
    publisher: {
        "@type": "Organization",
        name: "DutyDecoder",
        url: "https://dutydecoder.com",
    },
};

const PRIMARY_DATA_SOURCES = [
    {
        country: "United States",
        authority: "U.S. International Trade Commission (USITC) / U.S. Customs & Border Protection (CBP)",
        schedule: "Harmonized Tariff Schedule of the United States (HTSUS 2026)",
        url: "https://hts.usitc.gov/",
        cadence: "Continuous / Within 48h of Federal Register publication",
        valuation: "FOB (Free on Board) — Duty assessed on product value only; excludes international freight & insurance.",
    },
    {
        country: "European Union (27 Member States)",
        authority: "European Commission — Taxation and Customs Union (DG TAXUD)",
        schedule: "TARIC (Integrated Tariff of the European Union) / Combined Nomenclature",
        url: "https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp",
        cadence: "Daily synchronization with Official Journal of the EU",
        valuation: "CIF (Cost, Insurance & Freight) — Duty assessed on sum of product value, shipping, and transit insurance.",
    },
    {
        country: "United Kingdom",
        authority: "His Majesty's Revenue and Customs (HMRC) / Department for Business and Trade",
        schedule: "UK Global Tariff (UKGT)",
        url: "https://www.trade-tariff.service.gov.uk/",
        cadence: "Continuous / Post-Brexit statutory updates",
        valuation: "CIF (Cost, Insurance & Freight) — UK customs value includes freight and insurance to the UK border.",
    },
    {
        country: "Canada",
        authority: "Canada Border Services Agency (CBSA)",
        schedule: "Canadian Customs Tariff Schedule",
        url: "https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/",
        cadence: "Monthly / Federal Gazette notices",
        valuation: "FOB (Free on Board) — Duty assessed on value of goods at point of direct shipment.",
    },
    {
        country: "Japan",
        authority: "Ministry of Finance (MOF) / Japan Customs",
        schedule: "Customs Tariff Schedules of Japan",
        url: "https://www.customs.go.jp/english/tariff/",
        cadence: "Semi-annual & statutory gazettes",
        valuation: "CIF (Cost, Insurance & Freight)",
    },
    {
        country: "Australia",
        authority: "Australian Border Force (ABF) / Department of Home Affairs",
        schedule: "Australian Working Tariff",
        url: "https://www.abf.gov.au/importing-exporting-and-manufacturing/tariff-classification",
        cadence: "Periodic statutory updates",
        valuation: "FOB (Customs Value is based on Free on Board purchase price)",
    },
    {
        country: "India",
        authority: "Central Board of Indirect Taxes and Customs (CBIC)",
        schedule: "Indian Customs Tariff Act / Central Excise Schedules",
        url: "https://www.cbic.gov.in/entities/customs-tariff",
        cadence: "Continuous / Annual Union Budget notifications & SROs",
        valuation: "CIF + 1% Landing Charges assessable value base",
    },
    {
        country: "Pakistan",
        authority: "Federal Board of Revenue (FBR)",
        schedule: "Pakistan Customs Tariff (PCT) & Statutory Regulatory Orders (SROs)",
        url: "https://www.fbr.gov.pk/customs-tariff/131253",
        cadence: "Continuous tracking of SROs, ACD, and Regulatory Duties",
        valuation: "CIF with national minimum valuation rulings (Valuation Rulings/VRs)",
    },
];

export default function DataSourcesPage() {
    const cardStyle: React.CSSProperties = {
        background: "var(--surface, #FFFFFF)",
        border: "1px solid var(--border, #E3E8EF)",
        borderRadius: "14px",
        padding: "1.5rem",
        marginBottom: "1.25rem",
        boxShadow: "0 2px 8px rgba(11, 31, 58, 0.03)",
    };

    return (
        <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
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
                    Official Data Sources Register
                </h1>
                <p style={{ fontSize: "1.05rem", color: "var(--muted-foreground)", margin: 0 }}>
                    Authoritative government tariff schedules, valuation bases, and synchronization standards.
                </p>
            </header>

            {/* Sourcing Commitment */}
            <section style={{ marginBottom: "2.5rem" }}>
                <div
                    style={{
                        background: "var(--teal-50, #F0FDFA)",
                        border: "1px solid rgba(15, 118, 110, 0.25)",
                        borderRadius: "16px",
                        padding: "1.5rem",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <Database size={20} style={{ color: "var(--teal-700, #0F766E)" }} />
                        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--navy-900, #0B1F3A)", margin: 0 }}>
                            Our Primary Sourcing Standard
                        </h2>
                    </div>
                    <p style={{ fontSize: "0.95rem", color: "var(--text-body, #475569)", lineHeight: 1.7, margin: 0 }}>
                        DutyDecoder does not use web-scraped aggregators, crowd-sourced rate estimates, or unverified secondary databases. Every duty rate, de minimis threshold, and fee calculation originates directly from an official government tariff authority or bilateral Free Trade Agreement schedule.
                    </p>
                </div>
            </section>

            {/* Primary Sourcing Directory */}
            <section style={{ marginBottom: "3rem" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--foreground)", margin: "0 0 1.25rem" }}>
                    Primary National Customs Schedules
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {PRIMARY_DATA_SOURCES.map((source) => (
                        <div key={source.country} style={cardStyle}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                                    {source.country}
                                </h3>
                                <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.3rem",
                                        fontSize: "0.85rem",
                                        color: "var(--accent)",
                                        textDecoration: "none",
                                        fontWeight: 600,
                                    }}
                                >
                                    <span>Official Portal</span>
                                    <ExternalLink size={14} />
                                </a>
                            </div>

                            <p style={{ fontSize: "0.9rem", color: "var(--foreground)", fontWeight: 600, margin: "0 0 0.4rem" }}>
                                {source.authority} &bull; <em>{source.schedule}</em>
                            </p>

                            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.85rem", color: "var(--text-body, #475569)", lineHeight: 1.6 }}>
                                <div>
                                    <strong>Update Cadence:</strong> {source.cadence}
                                </div>
                                <div>
                                    <strong>Valuation Rule:</strong> {source.valuation}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Currency & Exchange Rate Data */}
            <section style={{ marginBottom: "3rem" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--foreground)", margin: "0 0 1rem" }}>
                    Foreign Exchange &amp; Multi-Currency Valuation
                </h2>
                <p style={{ fontSize: "0.975rem", color: "var(--text-body, #475569)", lineHeight: 1.8 }}>
                    When a shipment is invoiced in a currency other than the importing country&apos;s legal assessment tender, conversions are executed using institutional mid-market rates from ExchangeRate-API, synchronized every 24 hours. Customs calculations are processed with arbitrary decimal precision (Decimal.js) to avoid compound currency truncation discrepancies.
                </p>
            </section>

            {/* Rate Corrections Protocol */}
            <section style={{ marginBottom: "3rem" }}>
                <div
                    style={{
                        background: "var(--bg, #F7F9FC)",
                        border: "1px solid var(--border, #E3E8EF)",
                        borderRadius: "16px",
                        padding: "1.75rem",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
                        <Mail size={22} style={{ color: "var(--accent)" }} />
                        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                            Data Corrections &amp; Rate Inquiries
                        </h2>
                    </div>
                    <p style={{ fontSize: "0.95rem", color: "var(--text-body, #475569)", lineHeight: 1.7, marginBottom: "1rem" }}>
                        We welcome feedback from licensed customs brokers, trade compliance attorneys, and importers. If you notice a tariff rate, regulatory duty, or de minimis policy that does not reflect a newly enacted statutory order, please notify our corrections desk.
                    </p>
                    <p style={{ fontSize: "0.95rem", color: "var(--text-body, #475569)", lineHeight: 1.7, margin: 0 }}>
                        Submit rate notices to:{" "}
                        <a href="mailto:corrections@dutydecoder.com" style={{ color: "var(--accent)", fontWeight: 600 }}>
                            corrections@dutydecoder.com
                        </a>{" "}
                        or via our <Link href="/contact/" style={{ color: "var(--accent)", fontWeight: 600 }}>Contact Desk</Link>.
                    </p>
                </div>
            </section>
        </main>
    );
}
