import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: { absolute: "Export Documents — Required Paperwork for International Shipping 2026" },
    description: "Complete guide to export documentation: shipper's letter of instruction, export license (EAR/ITAR), AES filing, commercial invoice requirements, and country-specific export compliance.",
    alternates: { canonical: "/export-documents/" },
    keywords: [
        "export documents", "export documentation", "export license", "shipper letter of instruction",
        "AES filing", "EEI filing", "export compliance", "export paperwork", "ITAR export",
        "EAR export controls", "export declaration", "certificate of origin export",
    ],
    openGraph: {
        title: "Export Documents — Complete Guide to Export Paperwork & Compliance",
        description: "Every document exporters need: from SLI and AES filings to export licenses, EAR/ITAR controls, and country-specific requirements.",
        url: "/export-documents",
        type: "article",
    },
};

export default function ExportDocumentsPage() {
    const sS: React.CSSProperties = { marginBottom: "2.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid var(--border)" };
    const h2: React.CSSProperties = { fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" };
    const body: React.CSSProperties = { color: "var(--muted-foreground)", lineHeight: 1.85, fontSize: "1.05rem" };

    const sections = [
        {
            id: "why-export-docs-matter", heading: "Why Export Documentation Matters",
            content: `<strong>Export documentation failures</strong> cause costly delays and can result in serious legal consequences. Unlike import errors that mainly cause customs holds, export violations can carry <strong>criminal penalties</strong> — especially for controlled technology, defense articles, and dual-use goods.
            <p style="margin-top:1rem;">The U.S. <a href="https://www.bis.doc.gov/" target="_blank" rel="dofollow">Bureau of Industry and Security (BIS)</a> enforces export controls through the <strong>Export Administration Regulations (EAR)</strong>, while the <a href="https://www.pmddtc.state.gov/" target="_blank" rel="dofollow">Directorate of Defense Trade Controls (DDTC)</a> administers <strong>ITAR</strong> for defense articles. Penalties for violations can reach <strong>$1 million per violation</strong> or 20 years imprisonment for willful ITAR violations.</p>
            <div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.15);border-radius:12px;padding:1.25rem;margin-top:1.5rem;">
                <strong style="color:var(--foreground);">⚠️ Critical Warning:</strong>
                <p style="margin:0.5rem 0 0;font-size:0.95rem;">Export compliance is not optional. Even for commercial goods, filing incorrect AES data, shipping to sanctioned entities, or exporting without required licenses can result in <strong>denial of export privileges</strong> — effectively shutting down your international business.</p>
            </div>`
        },
        {
            id: "core-export-documents", heading: "Core Export Documents",
            content: `<div style="display:flex;flex-direction:column;gap:1.5rem;margin-top:0.5rem;">
                <div style="border-left:4px solid var(--accent);padding-left:1.5rem;">
                    <h3 style="font-size:1.15rem;font-weight:700;margin-bottom:0.5rem;">1. Commercial Invoice (Export)</h3>
                    <p style="color:var(--muted-foreground);">Same document used for imports but from the seller's perspective. Must include: complete buyer/seller details, product description, HS codes (Schedule B in the US), quantity, value, <a href="/incoterms/">Incoterm</a>, and country of ultimate destination. Required for all commercial exports.</p>
                </div>
                <div style="border-left:4px solid var(--accent);padding-left:1.5rem;">
                    <h3 style="font-size:1.15rem;font-weight:700;margin-bottom:0.5rem;">2. Shipper's Letter of Instruction (SLI)</h3>
                    <p style="color:var(--muted-foreground);">Authorizes the freight forwarder to act as the exporter's agent and file AES/EEI on their behalf. Contains shipper details, consignee information, transportation details, and specific handling instructions. Not a government-mandated form but essential for freight forwarder authorization.</p>
                </div>
                <div style="border-left:4px solid var(--accent);padding-left:1.5rem;">
                    <h3 style="font-size:1.15rem;font-weight:700;margin-bottom:0.5rem;">3. Packing List</h3>
                    <p style="color:var(--muted-foreground);">Details the physical contents of each package: carton numbers, dimensions, weights (gross and net), and descriptions. Used by carriers for handling and by customs for inspection verification.</p>
                </div>
                <div style="border-left:4px solid var(--accent);padding-left:1.5rem;">
                    <h3 style="font-size:1.15rem;font-weight:700;margin-bottom:0.5rem;">4. Bill of Lading / Air Waybill</h3>
                    <p style="color:var(--muted-foreground);">The transport document issued by the carrier. For ocean freight, the B/L acts as title document and receipt of goods. For air, the AWB serves as contract of carriage. Mirrors the same document used on the <a href="/import-documents/">import side</a>.</p>
                </div>
                <div style="border-left:4px solid var(--accent);padding-left:1.5rem;">
                    <h3 style="font-size:1.15rem;font-weight:700;margin-bottom:0.5rem;">5. Certificate of Origin</h3>
                    <p style="color:var(--muted-foreground);">Certifies the country of manufacture. Required by many importing countries for <a href="/tariff-rates/">preferential duty rates</a> under FTAs. In the US, chambers of commerce issue non-preferential COOs; FTA-specific forms (EUR.1, USMCA COO, Form A for GSP) follow agreement-specific formats.</p>
                </div>
            </div>`
        },
        {
            id: "aes-eei-filing", heading: "AES/EEI Filing — US Export Declaration",
            content: `<p>The <strong>Automated Export System (AES)</strong> is the U.S. Census Bureau's system for collecting export data. Exporters must file an <strong>Electronic Export Information (EEI)</strong> record through AES for:</p>
            <ul style="padding-left:1.5rem;margin-top:1rem;">
                <li style="margin-bottom:0.75rem;">Shipments valued over <strong>$2,500 per Schedule B number</strong> to any country</li>
                <li style="margin-bottom:0.75rem;">Any shipment requiring an <strong>export license</strong> (regardless of value)</li>
                <li style="margin-bottom:0.75rem;">Shipments to countries subject to <strong>US sanctions or embargoes</strong> (regardless of value)</li>
                <li>Rough diamonds (Kimberley Process) and certain ITAR/EAR controlled items</li>
            </ul>
            <div style="background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.15);border-radius:12px;padding:1.25rem;margin-top:1.5rem;">
                <strong style="color:var(--foreground);">Filing Timeline:</strong>
                <p style="margin:0.5rem 0 0;font-size:0.95rem;">EEI must be filed and accepted <strong>before</strong> the goods are exported. For vessel shipments: 24 hours before loading. For air: 2 hours before departure. For truck/rail to Canada/Mexico: 2 hours before arrival at the border. The ITN (Internal Transaction Number) returned by AES must be provided to the carrier.</p>
            </div>`
        },
        {
            id: "export-licenses", heading: "Export Licenses & Controls (EAR/ITAR)",
            content: `<p>Not all goods can be freely exported. The US government controls exports through two main regulatory frameworks:</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;margin:1.5rem 0;">
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:var(--accent);margin-bottom:0.5rem;">EAR — Export Administration Regulations</strong>
                    <p style="font-size:0.9rem;margin:0;">Administered by <strong>BIS (Commerce Dept)</strong>. Controls dual-use commercial items via the <strong>Commerce Control List (CCL)</strong>. Items are classified by ECCN (Export Control Classification Number). Most commercial goods are EAR99 (no license needed unless sanctioned end-user or country).</p>
                </div>
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:var(--accent);margin-bottom:0.5rem;">ITAR — International Traffic in Arms Regulations</strong>
                    <p style="font-size:0.9rem;margin:0;">Administered by <strong>DDTC (State Dept)</strong>. Controls defense articles and services on the <strong>US Munitions List (USML)</strong>. Requires registration with DDTC and individual export licenses. Violations carry severe criminal penalties.</p>
                </div>
            </div>
            <p><strong>Determining if you need a license:</strong> Classify your product → Check the CCL/USML → Screen end-user against <a href="https://www.bis.doc.gov/index.php/policy-guidance/lists-of-parties-of-concern" target="_blank" rel="dofollow">Denied Persons/Entity Lists</a> → Check destination country against <a href="https://www.bis.doc.gov/index.php/regulations/commerce-country-chart" target="_blank" rel="dofollow">Commerce Country Chart</a> → Apply for license if required.</p>`
        },
        {
            id: "country-requirements", heading: "Country-Specific Export Requirements",
            content: `<div style="overflow-x:auto;margin:1rem 0;">
                <table style="width:100%;border-collapse:collapse;font-size:0.95rem;">
                    <thead><tr style="border-bottom:2px solid var(--border);">
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Country</th>
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Export Requirements</th>
                    </tr></thead>
                    <tbody>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;">🇺🇸 United States</td><td style="padding:0.75rem;">AES/EEI filing, Schedule B classification, EAR/ITAR screening, denied party screening, sanctions compliance (OFAC SDN list)</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;">🇪🇺 European Union</td><td style="padding:0.75rem;">Export declaration via national systems, EU Dual-Use Regulation, EORI number, sanctions screening, phytosanitary certificates for food/agriculture</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;">🇬🇧 United Kingdom</td><td style="padding:0.75rem;">Export declaration through CHIEF/CDS, UK Strategic Export Controls, OGEL licenses where applicable, UK sanctions list screening</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;">🇨🇳 China</td><td style="padding:0.75rem;">Export license for restricted technologies, MOFCOM approval for dual-use items, customs declaration through China e-Port</td></tr>
                        <tr><td style="padding:0.75rem;">🇮🇳 India</td><td style="padding:0.75rem;">Shipping Bill through ICEGATE, IEC (Import Export Code), DGFT approval for restricted items, GST export refund documentation</td></tr>
                    </tbody>
                </table>
            </div>`
        },
        {
            id: "export-process", heading: "Step-by-Step Export Process",
            content: `<ol style="padding-left:1.5rem;">
                <li style="margin-bottom:1rem;"><strong>Classify your product:</strong> Determine the correct Schedule B / HS code and check if an ECCN applies. Use the <a href="/hs-code-finder/">AI HS Code Finder</a> for automated classification.</li>
                <li style="margin-bottom:1rem;"><strong>Screen the transaction:</strong> Check the buyer, end-user, and destination against restricted party lists (SDN, Entity List, Denied Persons). Use <a href="https://www.bis.doc.gov/index.php/policy-guidance/lists-of-parties-of-concern/consolidated-list" target="_blank" rel="dofollow">BIS Consolidated Screening List</a>.</li>
                <li style="margin-bottom:1rem;"><strong>Determine license requirements:</strong> Cross-reference ECCN + destination country on the Commerce Country Chart. Most commercial EAR99 goods don't need a license.</li>
                <li style="margin-bottom:1rem;"><strong>Prepare documentation:</strong> Commercial invoice, packing list, SLI (if using a forwarder), COO if requested by buyer, and any product-specific certificates.</li>
                <li style="margin-bottom:1rem;"><strong>File AES/EEI:</strong> Submit through AESDirect or your freight forwarder. Receive ITN and provide to carrier before export.</li>
                <li><strong>Ship and retain records:</strong> Maintain all export records for <strong>5 years</strong> from date of export (US requirement per 15 CFR §762). This includes all correspondence, contracts, and shipping documents.</li>
            </ol>`
        },
    ];

    const faqs = [
        { question: "What documents do I need to export goods?", answer: "At minimum: commercial invoice, packing list, and bill of lading or air waybill. For US exports over $2,500, you also need AES/EEI filing. Depending on the product, you may need export licenses, certificates of origin, and phytosanitary certificates." },
        { question: "Do I need an export license to sell products internationally?", answer: "Most commercial goods (classified as EAR99) don't require an export license. However, dual-use technology, defense articles (ITAR), certain chemicals, encryption software, and nuclear-related items may require BIS or DDTC licenses. Always classify your product first." },
        { question: "What is AES filing and when is it required?", answer: "AES (Automated Export System) filing creates an Electronic Export Information (EEI) record with US Census. Required for shipments over $2,500 per Schedule B number, any licensed exports, and shipments to sanctioned countries. Must be filed before export." },
        { question: "What is the difference between export and import documents?", answer: "Many documents overlap (commercial invoice, B/L, packing list). Export-specific documents include: Shipper's Letter of Instruction (SLI), AES/EEI filing, export licenses, and destination control statements. Import-specific: customs declaration, customs bond, import license." },
        { question: "How long must I keep export records?", answer: "In the United States, export records must be retained for 5 years from the date of export per 15 CFR §762. This includes all documents, correspondence, contracts, and electronic records related to the transaction." },
    ];

    const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) };
    const bcJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com" }, { "@type": "ListItem", "position": 2, "name": "Export Documents" }] };

    return (<>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bcJsonLd) }} />
        <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(1rem, 4vw, 1.5rem)" }} role="main">
            <header style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(59,130,246,0.04))", border: "1px solid var(--border)", borderRadius: "16px", padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 3rem)", marginBottom: "2rem", textAlign: "center" }}>
                <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}><Link href="/" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Home</Link><span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>›</span><span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Export Documents</span></nav>
                <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800, margin: "0 0 1rem", color: "var(--foreground)", lineHeight: 1.2 }}>Export Documents — Required Paperwork & Compliance Guide</h1>
                <p style={{ fontSize: "1.1rem", color: "var(--muted-foreground)", lineHeight: 1.6, margin: "0 auto", maxWidth: "800px" }}>Every document exporters need: from AES filings and export licenses to EAR/ITAR controls, certificates of origin, and country-specific compliance requirements.</p>
            </header>
            <div className="content-sidebar-grid">
                <article aria-label="Export documents guide">
                    {sections.map((s, i) => (<section key={`s-${i}`} id={s.id} style={{ ...sS, borderBottom: i < sections.length - 1 ? "1px solid var(--border)" : "none" }}><h2 style={h2}>{s.heading}</h2><div style={{ ...body, maxWidth: "100%", overflowWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: s.content }} /></section>))}
                    <div role="banner" style={{ margin: "3rem 0", background: "linear-gradient(135deg, var(--accent), #6366f1)", borderRadius: "16px", padding: "clamp(1.5rem, 4vw, 2.5rem)", textAlign: "center", boxShadow: "0 10px 30px rgba(99,102,241,0.15)" }}>
                        <h2 style={{ fontSize: "clamp(1.25rem, 3.5vw, 1.75rem)", fontWeight: 800, color: "#fff", margin: "0 0 0.75rem" }}>Calculate Import Costs at Destination</h2>
                        <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.85)", margin: "0 0 1.5rem" }}>Help your buyers understand duties and taxes they'll pay on arrival.</p>
                        <Link href="/calculate/" style={{ display: "inline-block", background: "#fff", color: "var(--accent)", fontWeight: 700, padding: "1rem 2.5rem", borderRadius: "8px", textDecoration: "none", fontSize: "1.1rem" }}>Open Calculator →</Link>
                    </div>
                    <section id="faq" aria-label="FAQ" style={{ marginBottom: "3rem" }}><h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--foreground)" }}>Frequently Asked Questions</h2>{faqs.map((f, i) => (<details key={`faq-${i}`} style={{ background: "var(--card)", padding: "1.25rem 1.5rem", borderRadius: "12px", border: "1px solid var(--border)", marginBottom: "0.85rem" }}><summary style={{ fontWeight: 600, cursor: "pointer", color: "var(--foreground)", fontSize: "1rem" }}>{f.question}</summary><div style={{ marginTop: "1rem", color: "var(--muted-foreground)", lineHeight: 1.75, fontSize: "0.95rem" }}>{f.answer}</div></details>))}</section>
                </article>
                <aside aria-label="Quick links" style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <section style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}><h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.5rem" }}>HS Code Finder</h3><p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", marginBottom: "1.25rem", lineHeight: 1.5 }}>Classify your export with AI-powered search.</p><Link href="/hs-code-finder/" style={{ display: "block", textAlign: "center", background: "var(--accent)", color: "#fff", fontWeight: 600, padding: "0.85rem 1rem", borderRadius: "8px", textDecoration: "none", fontSize: "0.95rem" }}>Find HS Code →</Link></section>
                    <nav aria-label="Related" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem" }}><h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "1rem" }}>Related Guides</h3><ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}><li><Link href="/import-documents/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Import Documents</Link></li><li><Link href="/incoterms/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Incoterms 2020 Guide</Link></li><li><Link href="/customs-clearance/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Customs Clearance</Link></li><li><Link href="/customs-broker/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Customs Broker Guide</Link></li><li><Link href="/trade-finance/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Trade Finance</Link></li></ul></nav>
                    <nav aria-label="Official" style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "12px", padding: "1.25rem" }}><h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>Official Sources</h3><ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}><li><a href="https://www.bis.doc.gov/" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>BIS Export Controls ↗</a></li><li><a href="https://aesdirect.census.gov/" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>AESDirect Filing ↗</a></li><li><a href="https://www.trade.gov/export-solutions" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>Trade.gov Export Solutions ↗</a></li></ul></nav>
                    <nav aria-label="TOC" style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}><h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>On This Page</h3><ul style={{ listStyle: "none", padding: 0, margin: 0 }}>{sections.map((s, i) => (<li key={`t-${i}`} style={{ marginBottom: "0.4rem" }}><a href={`#${s.id}`} style={{ color: "var(--muted-foreground)", textDecoration: "none", fontSize: "0.85rem" }}>{s.heading}</a></li>))}<li style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}><a href="#faq" style={{ color: "var(--foreground)", fontWeight: 500, textDecoration: "none", fontSize: "0.85rem" }}>FAQs</a></li></ul></nav>
                </aside>
            </div>
        </main>
    </>);
}
