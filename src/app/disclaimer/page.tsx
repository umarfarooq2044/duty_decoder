import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Disclaimer | DutyDecoder",
    description: "Important disclaimers regarding the use of DutyDecoder's import duty calculator, HS code classification, and landed cost estimates.",
    alternates: { canonical: "/disclaimer/" }
};

export default function DisclaimerPage() {
    const sectionStyle: React.CSSProperties = { marginBottom: "2.5rem" };
    const headingStyle: React.CSSProperties = { fontSize: "1.3rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "1rem" };
    const paraStyle: React.CSSProperties = { fontSize: "1rem", color: "var(--muted-foreground)", lineHeight: 1.8, marginBottom: "1rem" };

    return (
        <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
            <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--foreground)", marginBottom: "0.5rem" }}>
                Disclaimer
            </h1>
            <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", marginBottom: "3rem" }}>
                Last updated: February 23, 2026
            </p>

            <div style={{
                background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "12px", padding: "1.5rem 2rem", marginBottom: "2.5rem",
            }}>
                <p style={{ ...paraStyle, color: "var(--foreground)", fontWeight: 600, margin: 0 }}>
                    ⚠️ The calculations and information provided by DutyDecoder are estimates for informational purposes only. They should not be treated as official customs assessments. Always verify with a licensed customs broker or your country&apos;s customs authority before making import decisions.
                </p>
            </div>

            <section style={sectionStyle}>
                <h2 style={headingStyle}>Calculation Accuracy</h2>
                <p style={paraStyle}>
                    Our import duty calculations are based on publicly available tariff schedules and trade regulations. While we use a proprietary AI classification engine and regularly updated 2026 tariff data, the actual duties assessed by customs authorities may differ due to: (a) valuation method differences (CIF vs. FOB), (b) country-specific surcharges and handling fees, (c) Free Trade Agreement (FTA) eligibility, (d) anti-dumping or countervailing duties, (e) seasonal or emergency tariff adjustments.
                </p>
            </section>

            <section style={sectionStyle}>
                <h2 style={headingStyle}>HS Code Classification</h2>
                <p style={paraStyle}>
                    HS code suggestions provided by our AI classification engine are probabilistic estimates based on product descriptions. The Harmonized System encompasses over 5,000 commodity groups, and correct classification often requires detailed knowledge of a product&apos;s composition, manufacturing process, and intended use. Our suggestions should be used as a starting point — final classification decisions should always be made by a qualified customs professional.
                </p>
            </section>

            <section style={sectionStyle}>
                <h2 style={headingStyle}>No Professional Advice</h2>
                <p style={paraStyle}>
                    DutyDecoder does not provide legal, financial, or customs brokerage advice. The information and tools on this platform are intended for educational and estimation purposes. For binding rulings or professional customs advice, consult a licensed customs broker, trade attorney, or your national customs authority (e.g., <a href="https://www.cbp.gov/trade" target="_blank" rel="dofollow" style={{ color: "var(--accent)" }}>US CBP</a>, <a href="https://www.gov.uk/government/organisations/hm-revenue-customs" target="_blank" rel="dofollow" style={{ color: "var(--accent)" }}>UK HMRC</a>, <a href="https://taxation-customs.ec.europa.eu/" target="_blank" rel="dofollow" style={{ color: "var(--accent)" }}>EU Commission DG TAXUD</a>).
                </p>
            </section>

            <section style={sectionStyle}>
                <h2 style={headingStyle}>Data Currency</h2>
                <p style={paraStyle}>
                    Tariff rates, de minimis thresholds, VAT/GST rates, and compliance rules are updated to reflect 2026 regulations to the best of our ability. However, trade policy changes can occur rapidly — particularly in response to geopolitical events, trade disputes, or legislative action. Users are encouraged to check our <a href="/methodology/" style={{ color: "var(--accent)" }}>methodology page</a> for information about our data sources and update frequency.
                </p>
            </section>

            <section style={sectionStyle}>
                <h2 style={headingStyle}>Limitation of Liability</h2>
                <p style={paraStyle}>
                    DutyDecoder shall not be held liable for any losses, penalties, customs fines, or financial damages resulting from reliance on calculations, classifications, or information provided by this platform. Users assume all risk associated with using these estimates for commercial decisions.
                </p>
            </section>
        </main>
    );
}
