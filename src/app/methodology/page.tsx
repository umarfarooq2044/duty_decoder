import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: { absolute: 'Methodology & Data Sources — How We Calculate Landed Costs' },
    description: 'Our data sources, AI classification pipeline, calculation methodology, and accuracy commitments. Learn how we source rates from 50+ customs authorities and apply WCO classification rules.',
    alternates: { canonical: '/methodology/' },
    openGraph: {
        title: 'Methodology & Data Sources — DutyDecoder',
        description: 'Enterprise-grade transparency: official government data sources, AI classification pipeline, and calculation methodology behind our landed cost estimates.',
        url: '/methodology',
        type: 'article',
    },
};

export default function MethodologyPage() {
    const sectionStyle: React.CSSProperties = {
        padding: "clamp(1.5rem, 4vw, 3rem)",
        marginBottom: "2.5rem",
        borderRadius: "var(--radius)",
    };

    const h2Style: React.CSSProperties = {
        fontSize: "clamp(1.35rem, 3vw, 1.75rem)",
        color: "var(--accent)",
        marginBottom: "1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        fontWeight: 700,
    };

    const bodyStyle: React.CSSProperties = {
        lineHeight: "1.85",
        color: "var(--foreground)",
        fontSize: "1rem",
    };

    const listStyle: React.CSSProperties = {
        paddingLeft: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
        marginTop: "1rem",
    };

    return (
        <main className="methodology-page" style={{ padding: "clamp(2rem, 5vw, 4rem) 1rem", maxWidth: "1000px", margin: "0 auto" }}>

            <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
                <Link href="/" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Home</Link>
                <span aria-hidden="true" style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>›</span>
                <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Methodology</span>
            </nav>

            <header style={{ marginBottom: "3.5rem" }}>
                <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "var(--foreground)", marginBottom: "1rem", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                    Methodology, Data Sources &amp; Accuracy
                </h1>
                <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.2rem)", color: "var(--muted-foreground)", lineHeight: 1.7, maxWidth: "750px" }}>
                    Transparency is the cornerstone of trade compliance. This page details exactly how we source tariff data, classify goods, calculate landed costs, and maintain accuracy across 50+ jurisdictions — so you can trust the numbers before you ship.
                </p>
            </header>

            {/* ─── Section 1: Data Sources ─── */}
            <section className="glass-panel" style={sectionStyle}>
                <h2 style={h2Style}>
                    <span aria-hidden="true">🏛️</span> Official Data Sources
                </h2>
                <div style={bodyStyle}>
                    <p style={{ marginBottom: "1.25rem" }}>
                        We do not rely on static spreadsheets, screen-scraped aggregators, or unverified third-party databases. Every duty rate in our system traces back to an <strong>official government-published tariff schedule</strong>. Our data team continuously indexes and cross-references rates from these authorities:
                    </p>
                    <ul style={listStyle}>
                        <li>
                            <strong>United States — <a href="https://hts.usitc.gov/" target="_blank" rel="dofollow">USITC HTS</a>:</strong> Harmonized Tariff Schedule maintained by the U.S. International Trade Commission, including Section 201, Section 301 tariffs, and AD/CVD orders. We track <a href="https://www.federalregister.gov/" target="_blank" rel="nofollow">Federal Register</a> updates within 48 hours of publication.
                        </li>
                        <li>
                            <strong>European Union — <a href="https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp" target="_blank" rel="dofollow">EU TARIC</a> / Combined Nomenclature:</strong> Full EU customs tariff including preferential duty rates, anti-dumping duties, and country-specific suspensions. Updated in alignment with <a href="https://eur-lex.europa.eu/" target="_blank" rel="dofollow">Official Journal of the European Union</a> publications.
                        </li>
                        <li>
                            <strong>United Kingdom — <a href="https://www.trade-tariff.service.gov.uk/" target="_blank" rel="dofollow">HMRC UK Global Tariff</a>:</strong> Post-Brexit UK tariff schedule maintained by His Majesty&apos;s Revenue and Customs. Includes UKGT-specific preference rates under CPTPP and UK-Japan CEPA.
                        </li>
                        <li>
                            <strong>Pakistan — <a href="https://www.fbr.gov.pk/customs-tariff/131253" target="_blank" rel="dofollow">FBR PCT / SROs</a>:</strong> Pakistan Customs Tariff from the Federal Board of Revenue, incorporating Regulatory Duties (RD), Additional Customs Duty (ACD), and Statutory Regulatory Orders that change frequently.
                        </li>
                        <li>
                            <strong>50+ Additional Jurisdictions:</strong> Including <a href="https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/" target="_blank" rel="dofollow">Canada (CBSA)</a>, <a href="https://www.customs.go.jp/english/tariff/" target="_blank" rel="dofollow">Japan (MOF)</a>, <a href="https://www.cbic.gov.in/entities/customs-tariff" target="_blank" rel="dofollow">India (CBIC)</a>, <a href="https://www.abf.gov.au/importing-exporting-and-manufacturing/tariff-classification" target="_blank" rel="dofollow">Australia (ABF)</a>, UAE (FCA), Singapore (SC), <a href="https://www.customs.go.kr/english/" target="_blank" rel="dofollow">South Korea (KCS)</a>, Turkey (GTB), Mexico (SAT), Brazil (RFB), and others. Each country&apos;s rates are sourced from its officially published tariff schedule.
                        </li>
                    </ul>
                </div>
            </section>

            {/* ─── Section 2: AI Classification Pipeline ─── */}
            <section className="glass-panel" style={sectionStyle}>
                <h2 style={h2Style}>
                    <span aria-hidden="true">🤖</span> The AI Classification Pipeline
                </h2>
                <div style={bodyStyle}>
                    <p style={{ marginBottom: "1.25rem" }}>
                        Customs misclassification is the single largest source of import penalties globally. A miscoded HS heading can mean a 15% duty swing or a shipment held at port for weeks. To mitigate this, we built a <strong>multi-layer AI classification pipeline</strong> that mirrors the decision-making process of a licensed customs broker — but in seconds. Our classification methodology follows the <a href="https://www.wcoomd.org/en/topics/nomenclature/overview/what-is-the-harmonized-system.aspx" target="_blank" rel="dofollow">WCO Harmonized System</a> conventions used by over 200 countries.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: "2rem" }}>
                        <div style={{ borderLeft: "4px solid var(--color-success)", paddingLeft: "1.5rem" }}>
                            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>Layer 1: Input Validation &amp; Normalization</h3>
                            <p style={{ color: "var(--muted-foreground)" }}>
                                Before classification begins, our <strong>fast-inference classifying engine</strong> validates that the input describes a tangible, classifiable good — not a question, brand name, or gibberish. Simultaneously, a trade nomenclature normalizer strips country names, brand identifiers, and filler words, extracting the standardized product name and an HS Chapter hint (2-digit) to accelerate downstream processing.
                            </p>
                        </div>

                        <div style={{ borderLeft: "4px solid var(--color-success)", paddingLeft: "1.5rem" }}>
                            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>Layer 2: Keyword Extraction &amp; Database Matching</h3>
                            <p style={{ color: "var(--muted-foreground)" }}>
                                A specialized keyword extractor identifies HS-relevant attributes — material composition (cotton, polyester, stainless steel), manufacturing process (knitted, forged, woven), form/state (raw, semi-finished, powder), and end-use. These keywords are enriched with <strong>tariff-vocabulary synonyms</strong> (e.g., &quot;phone&quot; → &quot;telephone apparatus&quot;, &quot;laptop&quot; → &quot;portable data processing machine&quot;) then matched against our full-text-indexed database of official HTS codes using GIN tsvector search.
                            </p>
                        </div>

                        <div style={{ borderLeft: "4px solid var(--color-success)", paddingLeft: "1.5rem" }}>
                            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>Layer 3: Deep AI Classification (GRI-Driven)</h3>
                            <p style={{ color: "var(--muted-foreground)" }}>
                                When database matching produces no results, our <strong>deep-reasoning classification model</strong> applies the <strong><a href="https://www.wcoomd.org/en/topics/nomenclature/instrument-and-tools/tools-to-assist-with-the-classification-in-the-hs/general-rules-of-interpretation-gri.aspx" target="_blank" rel="dofollow">WCO General Rules of Interpretation (GRI 1-6)</a></strong> — the same legal framework licensed customs brokers use worldwide. The model follows a mandatory 2-step chain: first identify the HS Chapter (2-digit) by analyzing what the product IS, what it&apos;s MADE OF, and its PRIMARY FUNCTION; then narrow to the exact 6-10 digit subheading by evaluating material composition, manufacturing process, and competing chapter notes. Each classification includes an honest confidence score and explicit GRI rule citations.
                            </p>
                        </div>

                        <div style={{ borderLeft: "4px solid var(--color-success)", paddingLeft: "1.5rem" }}>
                            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>Layer 4: Hierarchical Fallback Matching</h3>
                            <p style={{ color: "var(--muted-foreground)" }}>
                                AI-generated HS codes are cross-referenced against our database at three levels: exact 10-digit match → 6-digit subheading chapter match → 4-digit heading match. This ensures that even when a national schedule uses different subheading conventions, the system finds the closest official rate rather than fabricating one.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Section 3: Calculation Methodology ─── */}
            <section className="glass-panel" style={sectionStyle}>
                <h2 style={h2Style}>
                    <span aria-hidden="true">📐</span> Landed Cost Calculation Methodology
                </h2>
                <div style={bodyStyle}>
                    <p style={{ marginBottom: "1.25rem" }}>
                        &quot;Landed cost&quot; is the total price of a product delivered to the buyer&apos;s warehouse door — not just the invoice price. Our calculator uses <strong>Decimal.js arbitrary-precision arithmetic</strong> (not floating-point) to eliminate rounding errors that compound across multi-tier tax calculations.
                    </p>
                    <p style={{ marginBottom: "1rem" }}>
                        Every calculation follows this formula:
                    </p>

                    <div style={{
                        background: "rgba(99, 102, 241, 0.08)",
                        border: "1px solid rgba(99, 102, 241, 0.2)",
                        borderRadius: "12px",
                        padding: "1.5rem",
                        fontFamily: "monospace",
                        fontSize: "0.9rem",
                        lineHeight: 1.8,
                        marginBottom: "1.5rem",
                    }}>
                        <div><strong>CIF Value</strong> = Product Value + Shipping + Insurance</div>
                        <div><strong>Customs Duty</strong> = CIF × Duty Rate % <em>(ad valorem)</em></div>
                        <div style={{ paddingLeft: "2rem", color: "var(--muted-foreground)" }}>— or Weight × Specific Rate <em>(specific duty)</em></div>
                        <div style={{ paddingLeft: "2rem", color: "var(--muted-foreground)" }}>— or MAX(ad valorem, specific) <em>(compound duty)</em></div>
                        <div><strong>Additional Duties</strong> = Σ (Anti-dumping + Countervailing + Regulatory + Excise)</div>
                        <div><strong>Processing Fees</strong> = Country-specific customs processing charges</div>
                        <div><strong>National Handling</strong> = Fixed fee per country (e.g., US MPF)</div>
                        <div><strong>VAT/GST</strong> = (CIF + All Duties + Fees) × VAT Rate %</div>
                        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                            <strong>Total Landed Cost</strong> = CIF + All Duties + Fees + VAT/GST
                        </div>
                    </div>

                    <ul style={listStyle}>
                        <li><strong>De Minimis Thresholds:</strong> For countries with duty-free import thresholds (e.g., US $800, AU A$1,000, UK £135), our system automatically checks shipment value against the applicable threshold and applies full or partial exemptions — including 2026-specific transition rules for nations adjusting their de minimis policies.</li>
                        <li><strong>Currency Conversion:</strong> When the shipment currency differs from the destination country&apos;s duty-assessment currency, we convert using live exchange rates from <a href="https://www.exchangerate-api.com/" target="_blank" rel="nofollow">ExchangeRate-API</a> (refreshed every 24 hours) with Decimal.js precision to 6 decimal places.</li>
                        <li><strong>Duty Comparison:</strong> When a classified HTS code carries a duty rate above 10%, our system automatically searches for alternative commodity codes within the same 4-digit HS heading that may offer a lower legitimate rate — surfacing potential classification optimization opportunities.</li>
                    </ul>
                </div>
            </section>

            {/* ─── Section 4: Data Pipeline ─── */}
            <section className="glass-panel" style={sectionStyle}>
                <h2 style={h2Style}>
                    <span aria-hidden="true">🔄</span> Data Pipeline &amp; Update Cadence
                </h2>
                <div style={bodyStyle}>
                    <ul style={listStyle}>
                        <li><strong>Rate Updates:</strong> Tariff schedules are refreshed continuously. Major trade partners (US, EU, UK, Pakistan) receive rate updates within 48 hours of any gazette publication, SRO, or Federal Register notice. Other jurisdictions update on a weekly cadence.</li>
                        <li><strong>AI-Generated Codes:</strong> When our AI pipeline classifies a new product, the resulting HTS code and duty rate are automatically persisted to our database. This means the same product description will resolve instantly on future queries — no redundant AI inference. Over 5,000+ product-route combinations are already pre-classified.</li>
                        <li><strong>Compliance Rules:</strong> Country-specific rules (handling fees, de minimis thresholds, disclaimer text) are stored as compliance policies in our database and cached with 24-hour TTL, ensuring rapid access without stale data.</li>
                    </ul>
                </div>
            </section>

            {/* ─── Section 6: Limitations ─── */}
            <section className="glass-panel" style={sectionStyle}>
                <h2 style={h2Style}>
                    <span aria-hidden="true">⚠️</span> Known Limitations
                </h2>
                <div style={bodyStyle}>
                    <ul style={listStyle}>
                        <li><strong>Preferential Rates:</strong> Our default duty rates reflect MFN (Most Favoured Nation) rates. Preferential rates under specific FTAs (e.g., <a href="https://ustr.gov/trade-agreements/free-trade-agreements/united-states-mexico-canada-agreement" target="_blank" rel="dofollow">USMCA</a>, <a href="https://www.dfat.gov.au/trade/agreements/in-force/cptpp" target="_blank" rel="dofollow">CPTPP</a>, EU-Korea FTA) are not automatically applied because they require proof of origin documentation that varies by agreement. We note when FTA savings may be available.</li>
                        <li><strong>Sanctions &amp; Embargoes:</strong> We do not screen for OFAC sanctions, EU restrictive measures, or UN embargo lists. Importers dealing with sanctioned jurisdictions must conduct separate compliance checks.</li>
                        <li><strong>End-Use Controls:</strong> Dual-use goods requiring export licenses (EAR, ITAR, Wassenaar) are outside the scope of our duty calculator. We classify goods for tariff purposes only.</li>
                        <li><strong>HS Classification Certainty:</strong> While our AI achieves high accuracy, some goods (especially novel products, multi-component assemblies, or goods near chapter boundaries) may have classification ambiguity. We always display a confidence score and recommend verification with customs authorities for high-value shipments.</li>
                    </ul>
                </div>
            </section>

            {/* ─── Section 7: Commitment ─── */}
            <section className="glass-panel" style={sectionStyle}>
                <h2 style={h2Style}>
                    <span aria-hidden="true">🎯</span> Our Commitment to Accuracy
                </h2>
                <div style={bodyStyle}>
                    <p style={{ marginBottom: "1rem" }}>
                        Our system is designed as a <strong>professional-grade estimation and research tool</strong>. We invest heavily in data integrity, AI model quality, and calculation precision because we understand that every percentage point matters in international trade. A 2% duty miscalculation on a $500,000 container is $10,000 off the bottom line.
                    </p>
                    <p style={{ marginBottom: "1.5rem" }}>
                        That said, international trade law is inherently complex and subject to legislative changes that can take effect overnight. We strongly advise that importers:
                    </p>
                    <ul style={listStyle}>
                        <li>Validate final HS classifications with a licensed customs broker for high-value or recurring shipments.</li>
                        <li>Obtain binding tariff rulings from customs authorities when classification certainty is critical.</li>
                        <li>Engage a customs agent to verify preferential rate eligibility and origin documentation.</li>
                    </ul>
                    <p style={{ marginTop: "1.5rem" }}>
                        Questions about our methodology? <Link href="/disclaimer/" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Read our disclaimer</Link> or contact us for a detailed explanation of any calculation.
                    </p>
                </div>
            </section>
        </main>
    );
}
