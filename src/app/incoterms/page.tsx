import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: { absolute: "Incoterms 2020 Guide — All 11 Rules Explained with Examples" },
    description: "Complete Incoterms 2020 guide: understand all 11 rules (EXW, FOB, CIF, DDP, and more), how they affect customs value, insurance, risk transfer, and total landed cost.",
    alternates: { canonical: "/incoterms/" },
    keywords: [
        "incoterms 2020", "incoterms guide", "FOB vs CIF", "DDP incoterms", "EXW meaning",
        "incoterms 2020 chart", "FOB shipping terms", "CIF meaning", "DAP incoterms",
        "international commercial terms", "incoterms explained", "incoterms for import",
        "incoterms customs value", "shipping terms 2026",
    ],
    openGraph: {
        title: "Incoterms 2020 — Complete Guide to All 11 International Trade Rules",
        description: "Master all 11 Incoterms 2020 rules. Learn how FOB, CIF, DDP, and EXW affect your customs value, insurance obligations, and total landed cost.",
        url: "/incoterms",
        type: "article",
    },
};

export default function IncotermsPage() {
    const sS: React.CSSProperties = { marginBottom: "2.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid var(--border)" };
    const h2: React.CSSProperties = { fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" };
    const body: React.CSSProperties = { color: "var(--muted-foreground)", lineHeight: 1.85, fontSize: "1.05rem" };

    const sections = [
        {
            id: "what-are-incoterms", heading: "What Are Incoterms?",
            content: `<strong>Incoterms</strong> (International Commercial Terms) are a set of 11 globally recognized trade rules published by the <a href="https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/" target="_blank" rel="dofollow">International Chamber of Commerce (ICC)</a>. They define the responsibilities of buyers and sellers in international transactions — specifically, who pays for <strong>shipping</strong>, <strong>insurance</strong>, <strong>customs duties</strong>, and <strong>risk transfer</strong> at each stage of the supply chain.
            <p style="margin-top:1rem;">The current version, <strong>Incoterms® 2020</strong>, came into effect on January 1, 2020, replacing the 2010 edition. These rules are not law — they are <strong>contractual terms</strong> incorporated into sales contracts by reference. However, customs authorities worldwide use the declared Incoterm to determine the <strong>customs value</strong> of imported goods, making them critical for accurate <a href="/import-duty/">duty calculation</a>.</p>
            <div style="background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.15);border-radius:12px;padding:1.25rem;margin-top:1.5rem;">
                <strong style="color:var(--foreground);">Why This Matters for Importers:</strong>
                <p style="margin:0.5rem 0 0;font-size:0.95rem;">Choosing the wrong Incoterm can mean <strong>paying double insurance</strong>, unexpectedly <strong>covering port fees</strong>, or declaring the wrong <strong>customs value</strong> — resulting in either overpaying duty or triggering a customs valuation dispute.</p>
            </div>`
        },
        {
            id: "all-11-rules", heading: "All 11 Incoterms 2020 Rules",
            content: `<p>Incoterms 2020 are split into two groups: <strong>7 rules for any mode of transport</strong> (including multimodal), and <strong>4 rules exclusively for sea/inland waterway transport</strong>.</p>
            <h3 style="font-size:1.15rem;font-weight:700;margin:1.5rem 0 1rem;color:var(--foreground);">Any Mode of Transport (7 Rules)</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;margin-bottom:2rem;">
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:var(--accent);margin-bottom:0.5rem;">EXW — Ex Works</strong>
                    <p style="font-size:0.9rem;margin:0;">Seller makes goods available at their premises. <strong>Buyer bears all costs and risks</strong> from that point — loading, export clearance, shipping, import clearance, duties. Minimum seller obligation.</p>
                </div>
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:var(--accent);margin-bottom:0.5rem;">FCA — Free Carrier</strong>
                    <p style="font-size:0.9rem;margin:0;">Seller delivers goods to a carrier or named place. Seller handles <strong>export clearance</strong>. Risk transfers when goods are handed to the carrier. Most versatile rule.</p>
                </div>
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:var(--accent);margin-bottom:0.5rem;">CPT — Carriage Paid To</strong>
                    <p style="font-size:0.9rem;margin:0;">Seller pays freight to named destination. Risk transfers to buyer when goods are handed to <strong>first carrier</strong>. Buyer is responsible for import clearance and duties.</p>
                </div>
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:var(--accent);margin-bottom:0.5rem;">CIP — Carriage & Insurance Paid To</strong>
                    <p style="font-size:0.9rem;margin:0;">Same as CPT, plus seller must procure <strong>insurance</strong> (CIP 2020 requires <strong>maximum coverage</strong> per ICC Clause A, unlike 2010). Risk still transfers at first carrier.</p>
                </div>
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:var(--accent);margin-bottom:0.5rem;">DAP — Delivered at Place</strong>
                    <p style="font-size:0.9rem;margin:0;">Seller delivers goods to named destination, <strong>ready for unloading</strong>. Seller bears all costs and risks until arrival. <strong>Buyer pays import duties and unloading.</strong></p>
                </div>
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:var(--accent);margin-bottom:0.5rem;">DPU — Delivered at Place Unloaded</strong>
                    <p style="font-size:0.9rem;margin:0;">Seller delivers and <strong>unloads</strong> goods at named destination. The only Incoterm where the seller must unload. Replaced DAT from Incoterms 2010.</p>
                </div>
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:var(--accent);margin-bottom:0.5rem;">DDP — Delivered Duty Paid</strong>
                    <p style="font-size:0.9rem;margin:0;"><strong>Maximum seller obligation.</strong> Seller pays everything: freight, insurance, import customs clearance, duties, and taxes. Buyer only receives goods. Common in B2B ecommerce.</p>
                </div>
            </div>
            <h3 style="font-size:1.15rem;font-weight:700;margin:1.5rem 0 1rem;color:var(--foreground);">Sea & Inland Waterway Only (4 Rules)</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;">
                <div style="background:rgba(59,130,246,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:#3b82f6;margin-bottom:0.5rem;">FAS — Free Alongside Ship</strong>
                    <p style="font-size:0.9rem;margin:0;">Seller delivers goods alongside the vessel at the port of shipment. Risk transfers at the port. Buyer arranges loading, shipping, and import.</p>
                </div>
                <div style="background:rgba(59,130,246,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:#3b82f6;margin-bottom:0.5rem;">FOB — Free on Board</strong>
                    <p style="font-size:0.9rem;margin:0;">Seller delivers goods <strong>on board the vessel</strong>. Risk transfers when goods pass the ship's rail. Seller handles export clearance. <strong>Most common for sea freight.</strong></p>
                </div>
                <div style="background:rgba(59,130,246,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:#3b82f6;margin-bottom:0.5rem;">CFR — Cost and Freight</strong>
                    <p style="font-size:0.9rem;margin:0;">Seller pays freight to destination port. Risk transfers when goods are loaded on board. Buyer handles insurance and import clearance.</p>
                </div>
                <div style="background:rgba(59,130,246,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:#3b82f6;margin-bottom:0.5rem;">CIF — Cost, Insurance & Freight</strong>
                    <p style="font-size:0.9rem;margin:0;">Seller pays freight + insurance to port. CIF insurance is <strong>minimum coverage</strong> (ICC Clause C) — unlike CIP which requires maximum. <strong>CIF value = basis for customs valuation in most countries.</strong></p>
                </div>
            </div>`
        },
        {
            id: "fob-vs-cif", heading: "FOB vs CIF — The Most Important Comparison",
            content: `<p>FOB and CIF are the two most used Incoterms in global trade, and the choice directly impacts your <strong>customs value</strong> and total <a href="/import-duty/">import duty</a> calculation.</p>
            <div style="overflow-x:auto;margin:1.5rem 0;">
                <table style="width:100%;border-collapse:collapse;font-size:0.95rem;">
                    <thead><tr style="border-bottom:2px solid var(--border);">
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Factor</th>
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">FOB (Free on Board)</th>
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">CIF (Cost, Insurance & Freight)</th>
                    </tr></thead>
                    <tbody>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">Freight Cost</td><td style="padding:0.75rem;">Buyer pays</td><td style="padding:0.75rem;">Seller pays</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">Insurance</td><td style="padding:0.75rem;">Buyer arranges</td><td style="padding:0.75rem;">Seller provides (minimum)</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">Risk Transfer</td><td style="padding:0.75rem;">When loaded on vessel</td><td style="padding:0.75rem;">When loaded on vessel</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">Customs Value</td><td style="padding:0.75rem;"><strong>Lower</strong> (excludes freight/insurance)</td><td style="padding:0.75rem;"><strong>Higher</strong> (includes freight + insurance)</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">Used for Duty Calc</td><td style="padding:0.75rem;">🇺🇸 US uses FOB</td><td style="padding:0.75rem;">🇪🇺🇬🇧🇦🇺 Most countries use CIF</td></tr>
                        <tr><td style="padding:0.75rem;font-weight:600;">Best For</td><td style="padding:0.75rem;">Experienced importers with own freight contracts</td><td style="padding:0.75rem;">Beginners or smaller shipments</td></tr>
                    </tbody>
                </table>
            </div>
            <div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.2);border-radius:12px;padding:1.25rem;margin-top:1rem;">
                <strong style="color:var(--foreground);">⚠️ Critical Duty Impact:</strong>
                <p style="margin:0.5rem 0 0;font-size:0.95rem;">On a $50,000 shipment with $5,000 freight + $500 insurance, the CIF customs value is $55,500 — meaning you'd pay duty on $5,500 more than FOB. At a 10% duty rate, that's <strong>$550 extra duty</strong> in CIF-based countries.</p>
            </div>`
        },
        {
            id: "customs-value-impact", heading: "How Incoterms Affect Customs Value",
            content: `<p>Your declared Incoterm directly determines your <strong>customs value</strong> — the amount on which <a href="/import-duty/">import duty</a> is calculated. This is one of the most consequential yet misunderstood aspects of international trade.</p>
            <ul style="padding-left:1.5rem;margin-top:1rem;">
                <li style="margin-bottom:1rem;"><strong>CIF-based countries (most of the world):</strong> The EU, UK, Australia, Japan, India, and most African/Asian nations use CIF (Cost + Insurance + Freight) as the dutiable value. If you buy FOB, customs will <strong>add</strong> estimated freight and insurance to calculate the dutiable value.</li>
                <li style="margin-bottom:1rem;"><strong>FOB-based countries (US, Canada):</strong> The United States and Canada use <strong>FOB value</strong> (transaction value at port of export). Freight and insurance to the US are <strong>not</strong> included in the dutiable value — a significant advantage for high-freight goods.</li>
                <li style="margin-bottom:1rem;"><strong>DDP implications:</strong> Under DDP, the seller handles customs. But if the commercial invoice shows a DDP price (all-inclusive), customs may need to unbundle the value to determine the correct customs basis. Always keep the <strong>ex-works value</strong> separately documented.</li>
                <li><strong>EXW pitfall:</strong> EXW value is typically the lowest, but customs authorities may add loading, inland transport, and freight costs to arrive at the proper CIF/FOB value for duty calculation.</li>
            </ul>`
        },
        {
            id: "choosing-right-incoterm", heading: "How to Choose the Right Incoterm",
            content: `<p>Choosing the optimal Incoterm depends on your experience level, shipping volume, and risk tolerance:</p>
            <div style="display:flex;flex-direction:column;gap:1rem;margin-top:1rem;">
                <div style="border-left:4px solid var(--accent);padding-left:1.5rem;">
                    <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:0.5rem;">First-Time Importers → CIF or DDP</h3>
                    <p style="color:var(--muted-foreground);font-size:0.95rem;margin:0;">Let the seller handle shipping and insurance (CIF) or even customs (DDP). You'll pay more but with fewer surprises. Good for learning the process.</p>
                </div>
                <div style="border-left:4px solid var(--accent);padding-left:1.5rem;">
                    <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:0.5rem;">Regular Importers → FOB or FCA</h3>
                    <p style="color:var(--muted-foreground);font-size:0.95rem;margin:0;">Once you have freight forwarder relationships and volume discounts, buying FOB gives you control over shipping costs and insurance quality. FCA is better for air/multimodal.</p>
                </div>
                <div style="border-left:4px solid var(--accent);padding-left:1.5rem;">
                    <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:0.5rem;">Large Volume / Own Logistics → EXW</h3>
                    <p style="color:var(--muted-foreground);font-size:0.95rem;margin:0;">Maximum control and typically lowest unit cost, but you handle <strong>everything</strong> including export clearance in the seller's country — which can be complex.</p>
                </div>
                <div style="border-left:4px solid var(--accent);padding-left:1.5rem;">
                    <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:0.5rem;">Selling to End Buyers → DAP or DDP</h3>
                    <p style="color:var(--muted-foreground);font-size:0.95rem;margin:0;">If you're selling internationally, offering DAP (buyer pays duties) or DDP (you pay everything) provides the best customer experience. DDP is standard for B2B ecommerce platforms.</p>
                </div>
            </div>`
        },
        {
            id: "common-mistakes", heading: "6 Common Incoterms Mistakes That Cost Money",
            content: `<ol style="padding-left:1.5rem;">
                <li style="margin-bottom:1rem;"><strong>Using FOB for air freight:</strong> FOB is sea-only. Use <strong>FCA</strong> for air, road, or multimodal transport. Using FOB for air creates legal ambiguity about risk transfer point.</li>
                <li style="margin-bottom:1rem;"><strong>Confusing CIF with CIP insurance levels:</strong> Under Incoterms 2020, CIF requires only <strong>minimum coverage</strong> (ICC Clause C — ~60% of loss), while CIP requires <strong>maximum coverage</strong> (ICC Clause A — all risks). This change from 2010 catches many traders off guard.</li>
                <li style="margin-bottom:1rem;"><strong>Not specifying the exact delivery point:</strong> "FOB Shanghai" is insufficient. Always specify: "FOB Shanghai Port, Yangshan Terminal." Ambiguous locations create disputes about who pays terminal handling charges.</li>
                <li style="margin-bottom:1rem;"><strong>Assuming DDP means zero buyer costs:</strong> DDP covers duties and taxes but may not cover unloading, warehousing, or demurrage. Clarify these in the contract.</li>
                <li style="margin-bottom:1rem;"><strong>Using EXW but expecting the seller to load:</strong> Under EXW, loading at the seller's premises is the <strong>buyer's</strong> responsibility. Most sellers will help, but if goods are damaged during loading, the buyer bears the risk.</li>
                <li><strong>Ignoring Incoterm on customs declaration:</strong> Customs authorities use the declared Incoterm to determine dutiable value. Declaring CIF when your invoice is FOB (or vice versa) creates valuation mismatches that trigger audits.</li>
            </ol>`
        },
    ];

    const faqs = [
        { question: "What are Incoterms 2020?", answer: "Incoterms 2020 are the current set of 11 international trade rules published by the International Chamber of Commerce (ICC) that define the responsibilities of buyers and sellers for shipping, insurance, customs, and risk transfer in international transactions." },
        { question: "What is the difference between FOB and CIF?", answer: "Under FOB (Free on Board), the buyer pays for freight and insurance from the port of shipment. Under CIF (Cost, Insurance & Freight), the seller pays freight and insurance to the destination port. CIF results in a higher customs value in most countries, meaning higher import duty." },
        { question: "Which Incoterm is best for first-time importers?", answer: "CIF or DDP are recommended for first-time importers. CIF means the seller handles shipping and insurance. DDP means the seller handles everything including customs clearance and duties — the simplest option for buyers." },
        { question: "Do Incoterms 2020 apply to domestic trade?", answer: "Yes, Incoterms can be used for both international and domestic transactions. However, they are most commonly used in international trade where cross-border complexity makes clear responsibility allocation essential." },
        { question: "What changed between Incoterms 2010 and 2020?", answer: "Key changes: DAT was replaced by DPU (Delivered at Place Unloaded), CIP now requires maximum insurance coverage (ICC Clause A vs. the old minimum), FCA now allows on-board bills of lading, and security-related transport obligations are more detailed." },
        { question: "How do Incoterms affect import duty calculation?", answer: "The Incoterm determines the customs value base. Most countries (EU, UK, Australia) calculate duty on CIF value. The US and Canada calculate duty on FOB value. The difference means freight and insurance costs are or aren't included in the dutiable amount." },
    ];

    const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) };
    const bcJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com" }, { "@type": "ListItem", "position": 2, "name": "Incoterms 2020 Guide" }] };

    return (<>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bcJsonLd) }} />
        <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(1rem, 4vw, 1.5rem)" }} role="main">
            <header style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(59,130,246,0.04))", border: "1px solid var(--border)", borderRadius: "16px", padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 3rem)", marginBottom: "2rem", textAlign: "center" }}>
                <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}><Link href="/" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Home</Link><span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>›</span><span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Incoterms 2020</span></nav>
                <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800, margin: "0 0 1rem", color: "var(--foreground)", lineHeight: 1.2 }}>Incoterms 2020 — Complete Guide to All 11 Trade Rules</h1>
                <p style={{ fontSize: "1.1rem", color: "var(--muted-foreground)", lineHeight: 1.6, margin: "0 auto", maxWidth: "800px" }}>Understand how EXW, FOB, CIF, DDP, and all 11 Incoterms rules affect your shipping costs, insurance, customs value, and total landed cost.</p>
            </header>
            <div className="content-sidebar-grid">
                <article aria-label="Incoterms 2020 guide">
                    {sections.map((s, i) => (<section key={`s-${i}`} id={s.id} style={{ ...sS, borderBottom: i < sections.length - 1 ? "1px solid var(--border)" : "none" }}><h2 style={h2}>{s.heading}</h2><div style={{ ...body, maxWidth: "100%", overflowWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: s.content }} /></section>))}
                    <div role="banner" style={{ margin: "3rem 0", background: "linear-gradient(135deg, var(--accent), #6366f1)", borderRadius: "16px", padding: "clamp(1.5rem, 4vw, 2.5rem)", textAlign: "center", boxShadow: "0 10px 30px rgba(99,102,241,0.15)" }}>
                        <h2 style={{ fontSize: "clamp(1.25rem, 3.5vw, 1.75rem)", fontWeight: 800, color: "#fff", margin: "0 0 0.75rem" }}>Calculate Your Total Landed Cost</h2>
                        <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.85)", margin: "0 0 1.5rem" }}>See exactly how your Incoterm choice affects duties, taxes, and final cost.</p>
                        <Link href="/calculate/" style={{ display: "inline-block", background: "#fff", color: "var(--accent)", fontWeight: 700, padding: "1rem 2.5rem", borderRadius: "8px", textDecoration: "none", fontSize: "1.1rem" }}>Open Calculator →</Link>
                    </div>
                    <section id="faq" aria-label="FAQ" style={{ marginBottom: "3rem" }}><h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--foreground)" }}>Frequently Asked Questions</h2>{faqs.map((f, i) => (<details key={`faq-${i}`} style={{ background: "var(--card)", padding: "1.25rem 1.5rem", borderRadius: "12px", border: "1px solid var(--border)", marginBottom: "0.85rem" }}><summary style={{ fontWeight: 600, cursor: "pointer", color: "var(--foreground)", fontSize: "1rem" }}>{f.question}</summary><div style={{ marginTop: "1rem", color: "var(--muted-foreground)", lineHeight: 1.75, fontSize: "0.95rem" }}>{f.answer}</div></details>))}</section>
                </article>
                <aside aria-label="Quick links" style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <section style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}><h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.5rem" }}>Landed Cost Calculator</h3><p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", marginBottom: "1.25rem", lineHeight: 1.5 }}>See how FOB vs CIF affects your total cost.</p><Link href="/calculate/" style={{ display: "block", textAlign: "center", background: "var(--accent)", color: "#fff", fontWeight: 600, padding: "0.85rem 1rem", borderRadius: "8px", textDecoration: "none", fontSize: "0.95rem" }}>Open Calculator →</Link></section>
                    <nav aria-label="Related" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem" }}><h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "1rem" }}>Related Guides</h3><ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}><li><Link href="/import-duty/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Import Duty Guide</Link></li><li><Link href="/import-documents/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Import Documents</Link></li><li><Link href="/customs-clearance/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Customs Clearance</Link></li><li><Link href="/tariff-rates/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Tariff Rates</Link></li><li><Link href="/customs-broker/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Customs Broker Guide</Link></li></ul></nav>
                    <nav aria-label="Official" style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "12px", padding: "1.25rem" }}><h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>Official Sources</h3><ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}><li><a href="https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>ICC Incoterms 2020 ↗</a></li><li><a href="https://www.trade.gov/know-your-incoterms" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>US Trade.gov Guide ↗</a></li></ul></nav>
                    <nav aria-label="TOC" style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}><h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>On This Page</h3><ul style={{ listStyle: "none", padding: 0, margin: 0 }}>{sections.map((s, i) => (<li key={`t-${i}`} style={{ marginBottom: "0.4rem" }}><a href={`#${s.id}`} style={{ color: "var(--muted-foreground)", textDecoration: "none", fontSize: "0.85rem" }}>{s.heading}</a></li>))}<li style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}><a href="#faq" style={{ color: "var(--foreground)", fontWeight: 500, textDecoration: "none", fontSize: "0.85rem" }}>FAQs</a></li></ul></nav>
                </aside>
            </div>
        </main>
    </>);
}
