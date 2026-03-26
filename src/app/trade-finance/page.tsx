import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: { absolute: "Trade Finance — Letters of Credit, Bank Guarantees & Payment Methods 2026" },
    description: "Complete guide to trade finance instruments: letters of credit (LC), documentary collections, bank guarantees, trade credit insurance, and payment risk mitigation for international trade.",
    alternates: { canonical: "/trade-finance/" },
    keywords: [
        "trade finance", "letter of credit", "LC international trade", "bank guarantee trade",
        "documentary collection", "trade credit insurance", "payment terms international trade",
        "sight letter of credit", "standby letter of credit", "trade finance instruments",
        "supply chain finance", "open account trade", "advance payment trade",
    ],
    openGraph: {
        title: "Trade Finance — Letters of Credit & Payment Methods Guide",
        description: "How to secure payments in international trade: LCs, bank guarantees, documentary collections, and trade credit insurance explained.",
        url: "/trade-finance",
        type: "article",
    },
};

export default function TradeFinancePage() {
    const sS: React.CSSProperties = { marginBottom: "2.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid var(--border)" };
    const h2: React.CSSProperties = { fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" };
    const body: React.CSSProperties = { color: "var(--muted-foreground)", lineHeight: 1.85, fontSize: "1.05rem" };

    const sections = [
        {
            id: "what-is-trade-finance", heading: "What Is Trade Finance?",
            content: `<strong>Trade finance</strong> refers to the financial instruments, products, and techniques that facilitate international trade and commerce. It bridges the fundamental tension in cross-border transactions: <strong>exporters want payment before shipping</strong>, while <strong>importers want delivery before paying</strong>.
            <p style="margin-top:1rem;">The World Trade Organization estimates that <strong>80–90% of global trade relies on trade finance</strong> in some form. Without these instruments, many international transactions — particularly between unfamiliar trading partners or in high-risk markets — would simply not occur.</p>
            <div style="background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.15);border-radius:12px;padding:1.25rem;margin-top:1.5rem;">
                <strong style="color:var(--foreground);">The Core Problem Trade Finance Solves:</strong>
                <p style="margin:0.5rem 0 0;font-size:0.95rem;">When a manufacturer in Shenzhen ships $500,000 of electronics to a buyer in São Paulo, how do both parties ensure they won't get scammed? A <strong>letter of credit</strong> from the buyer's bank guarantees payment once shipment documents prove delivery. Both parties are protected.</p>
            </div>`
        },
        {
            id: "payment-methods", heading: "International Payment Methods — Risk Spectrum",
            content: `<p>International trade payments exist on a risk spectrum from safest for the exporter to safest for the importer:</p>
            <div style="overflow-x:auto;margin:1.5rem 0;">
                <table style="width:100%;border-collapse:collapse;font-size:0.95rem;">
                    <thead><tr style="border-bottom:2px solid var(--border);">
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Method</th>
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Risk for Exporter</th>
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Risk for Importer</th>
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">When to Use</th>
                    </tr></thead>
                    <tbody>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">Cash in Advance</td><td style="padding:0.75rem;color:#22c55e;">Lowest</td><td style="padding:0.75rem;color:#ef4444;">Highest</td><td style="padding:0.75rem;">Small orders, new/untrusted suppliers</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">Letter of Credit (LC)</td><td style="padding:0.75rem;color:#22c55e;">Low</td><td style="padding:0.75rem;color:#f59e0b;">Low-Medium</td><td style="padding:0.75rem;">Large orders, new relationships, high-risk markets</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">Documentary Collection</td><td style="padding:0.75rem;color:#f59e0b;">Medium</td><td style="padding:0.75rem;color:#f59e0b;">Medium</td><td style="padding:0.75rem;">Established relationships, moderate value</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">Open Account</td><td style="padding:0.75rem;color:#ef4444;">Highest</td><td style="padding:0.75rem;color:#22c55e;">Lowest</td><td style="padding:0.75rem;">Trusted, long-term relationships</td></tr>
                        <tr><td style="padding:0.75rem;font-weight:600;">Consignment</td><td style="padding:0.75rem;color:#ef4444;">Very High</td><td style="padding:0.75rem;color:#22c55e;">Very Low</td><td style="padding:0.75rem;">Distributor agreements, established markets</td></tr>
                    </tbody>
                </table>
            </div>`
        },
        {
            id: "letters-of-credit", heading: "Letters of Credit (LC) — The Gold Standard",
            content: `<p>A <strong>Letter of Credit (LC)</strong> is a bank guarantee that the importer's bank will pay the exporter once specified <a href="/import-documents/">shipping documents</a> are presented proving the goods were shipped as agreed. LCs are governed by <a href="https://iccwbo.org/business-solutions/uniform-rules/" target="_blank" rel="dofollow">UCP 600</a> (ICC Uniform Customs and Practice for Documentary Credits).</p>
            <h3 style="font-size:1.1rem;font-weight:700;margin:1.5rem 0 1rem;">How an LC Works (Step by Step):</h3>
            <ol style="padding-left:1.5rem;">
                <li style="margin-bottom:0.75rem;">Buyer and seller agree on terms including <a href="/incoterms/">Incoterm</a>, price, and shipping deadline</li>
                <li style="margin-bottom:0.75rem;">Buyer applies for an LC from their bank (<strong>issuing bank</strong>)</li>
                <li style="margin-bottom:0.75rem;">Issuing bank sends LC to the seller's bank (<strong>advising bank</strong>)</li>
                <li style="margin-bottom:0.75rem;">Seller ships goods and presents compliant documents (invoice, B/L, COO, etc.) to advising bank</li>
                <li style="margin-bottom:0.75rem;">Advising bank sends documents to issuing bank for verification</li>
                <li style="margin-bottom:0.75rem;">Issuing bank pays (or accepts/defers payment) upon document compliance</li>
                <li>Buyer uses documents to clear goods through <a href="/customs-clearance/">customs</a></li>
            </ol>
            <h3 style="font-size:1.1rem;font-weight:700;margin:1.5rem 0 1rem;">Types of Letters of Credit:</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem;">
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1rem;color:var(--accent);margin-bottom:0.5rem;">Sight LC</strong>
                    <p style="font-size:0.9rem;margin:0;">Payment upon document presentation. The fastest — typically 5 business days after document submission.</p>
                </div>
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1rem;color:var(--accent);margin-bottom:0.5rem;">Usance / Deferred LC</strong>
                    <p style="font-size:0.9rem;margin:0;">Payment after a specified period (30, 60, 90, 180 days). Gives buyer time to sell goods before paying.</p>
                </div>
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1rem;color:var(--accent);margin-bottom:0.5rem;">Confirmed LC</strong>
                    <p style="font-size:0.9rem;margin:0;">A second bank (confirming bank, usually in seller's country) adds its guarantee. Eliminates country risk — essential for <strong>high-risk markets</strong>.</p>
                </div>
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1rem;color:var(--accent);margin-bottom:0.5rem;">Standby LC (SBLC)</strong>
                    <p style="font-size:0.9rem;margin:0;">Acts as a safety net — only activated if the buyer <strong>fails to pay</strong> under open account terms. Combines LC security with open account convenience.</p>
                </div>
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1rem;color:var(--accent);margin-bottom:0.5rem;">Revolving LC</strong>
                    <p style="font-size:0.9rem;margin:0;">Automatically reinstates after each draw. Efficient for <strong>repeat orders</strong> — avoids issuing new LCs for every shipment.</p>
                </div>
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1rem;color:var(--accent);margin-bottom:0.5rem;">Transferable LC</strong>
                    <p style="font-size:0.9rem;margin:0;">The original beneficiary (middleman/trader) can transfer all or part of the LC to a second beneficiary (actual manufacturer).</p>
                </div>
            </div>`
        },
        {
            id: "other-instruments", heading: "Other Trade Finance Instruments",
            content: `<div style="display:flex;flex-direction:column;gap:1.5rem;margin-top:0.5rem;">
                <div style="border-left:4px solid var(--accent);padding-left:1.5rem;">
                    <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem;">Documentary Collection (D/P & D/A)</h3>
                    <p style="color:var(--muted-foreground);font-size:0.95rem;">Banks act as intermediaries but <strong>do not guarantee payment</strong>. Documents against Payment (D/P): buyer pays to receive documents. Documents against Acceptance (D/A): buyer accepts a time draft. Cheaper than LCs (~0.1–0.25% fees) but with less security.</p>
                </div>
                <div style="border-left:4px solid var(--accent);padding-left:1.5rem;">
                    <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem;">Bank Guarantee</h3>
                    <p style="color:var(--muted-foreground);font-size:0.95rem;">A bank promises to pay if the applicant fails to fulfill a contractual obligation. Types include: <strong>performance guarantee</strong> (ensures project completion), <strong>bid bond</strong> (ensures serious tender participation), and <strong>advance payment guarantee</strong> (protects buyer's down payment).</p>
                </div>
                <div style="border-left:4px solid var(--accent);padding-left:1.5rem;">
                    <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem;">Trade Credit Insurance</h3>
                    <p style="color:var(--muted-foreground);font-size:0.95rem;">Protects exporters against buyer default (commercial risk) and country risk (war, sanctions, currency inconvertibility). Providers include <a href="https://www.coface.com/" target="_blank" rel="dofollow">Coface</a>, <a href="https://www.eulerhermes.com/" target="_blank" rel="dofollow">Allianz Trade</a>, and <a href="https://www.atradius.com/" target="_blank" rel="dofollow">Atradius</a>. Typically covers 80–95% of invoice value. Premiums: 0.1–1% of insured turnover.</p>
                </div>
                <div style="border-left:4px solid var(--accent);padding-left:1.5rem;">
                    <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem;">Supply Chain Finance (Reverse Factoring)</h3>
                    <p style="color:var(--muted-foreground);font-size:0.95rem;">A buyer-led financing program where the buyer's bank pays suppliers early (at a discount based on the <strong>buyer's</strong> credit rating). Suppliers get faster payment; buyers extend their payment terms. Growing rapidly in global trade.</p>
                </div>
                <div style="border-left:4px solid var(--accent);padding-left:1.5rem;">
                    <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem;">Factoring & Forfaiting</h3>
                    <p style="color:var(--muted-foreground);font-size:0.95rem;"><strong>Factoring:</strong> Selling receivables to a factor at a discount for immediate cash (short-term). <strong>Forfaiting:</strong> Selling medium/long-term receivables (typically backed by LCs or bank guarantees) without recourse. Common for capital goods and project exports.</p>
                </div>
            </div>`
        },
        {
            id: "lc-costs", heading: "Trade Finance Costs — What You'll Pay",
            content: `<div style="overflow-x:auto;margin:1rem 0;">
                <table style="width:100%;border-collapse:collapse;font-size:0.95rem;">
                    <thead><tr style="border-bottom:2px solid var(--border);">
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Instrument</th>
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Typical Cost</th>
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Who Pays</th>
                    </tr></thead>
                    <tbody>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;">Letter of Credit (issuing)</td><td style="padding:0.75rem;"><strong>0.75–1.5%</strong> of LC value</td><td style="padding:0.75rem;">Buyer (applicant)</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;">LC Confirmation</td><td style="padding:0.75rem;"><strong>0.1–2%</strong> (higher for risky countries)</td><td style="padding:0.75rem;">Seller (beneficiary)</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;">LC Amendment</td><td style="padding:0.75rem;"><strong>$50–$150</strong> per amendment</td><td style="padding:0.75rem;">Party requesting change</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;">Documentary Collection</td><td style="padding:0.75rem;"><strong>0.1–0.25%</strong> of value</td><td style="padding:0.75rem;">Usually seller</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;">Bank Guarantee</td><td style="padding:0.75rem;"><strong>1–2.5%</strong> per year</td><td style="padding:0.75rem;">Applicant</td></tr>
                        <tr><td style="padding:0.75rem;">Trade Credit Insurance</td><td style="padding:0.75rem;"><strong>0.1–1%</strong> of insured turnover</td><td style="padding:0.75rem;">Exporter</td></tr>
                    </tbody>
                </table>
            </div>
            <p><strong>Pro tip:</strong> LC costs are often negotiable. For regular importers, banks offer <strong>reduced fees</strong> and revolving LC structures that significantly lower per-transaction costs.</p>`
        },
        {
            id: "choosing-method", heading: "Choosing the Right Payment Method",
            content: `<p>Your choice depends on four factors: <strong>relationship trust level</strong>, <strong>transaction value</strong>, <strong>country risk</strong>, and <strong>cash flow needs</strong>.</p>
            <ul style="padding-left:1.5rem;margin-top:1rem;">
                <li style="margin-bottom:1rem;"><strong>New supplier in a high-risk country:</strong> Use a <strong>confirmed letter of credit</strong>. The confirmation eliminates both buyer default risk and country/bank risk.</li>
                <li style="margin-bottom:1rem;"><strong>Established supplier with good history:</strong> Move to <strong>documentary collection (D/P)</strong> or <strong>open account with SBLC backup</strong>. Lower costs while maintaining a safety net.</li>
                <li style="margin-bottom:1rem;"><strong>Long-term trusted partner:</strong> <strong>Open account</strong> (net 30/60/90) with <strong>trade credit insurance</strong> for catastrophic protection. Lowest transaction costs.</li>
                <li style="margin-bottom:1rem;"><strong>Testing a new market:</strong> Start with <strong>cash in advance</strong> for small trial orders, then transition to LC as you build trust.</li>
                <li><strong>Large capital goods / project exports:</strong> <strong>Forfaiting</strong> or <strong>export credit agency (ECA)-backed financing</strong> for medium/long-term payment structures (2–10 years).</li>
            </ul>`
        },
    ];

    const faqs = [
        { question: "What is a letter of credit in international trade?", answer: "A letter of credit (LC) is a bank guarantee to pay the exporter once specified shipping documents are presented proving goods were shipped as agreed. It protects both parties: the seller is guaranteed payment, and the buyer ensures goods are shipped before payment is released." },
        { question: "How much does a letter of credit cost?", answer: "LC issuance fees typically range from 0.75–1.5% of the LC value. Additional costs include advising fees (0.1%), confirmation fees (0.1–2%), amendment fees ($50–$150), and document handling charges. Total LC costs are usually 1–3% of the transaction value." },
        { question: "What is the difference between a letter of credit and bank guarantee?", answer: "An LC is a payment mechanism — it pays the seller upon document presentation. A bank guarantee is a safety net — it only activates if one party fails to meet a contractual obligation. LCs are used for payment; guarantees are used for performance assurance." },
        { question: "When should I use a letter of credit vs open account?", answer: "Use an LC when trading with new partners, dealing in high-value shipments, or operating in high-risk markets. Use open account for trusted, long-term relationships where you have trade credit insurance or a standby LC as backup." },
        { question: "What is trade credit insurance and do I need it?", answer: "Trade credit insurance protects exporters against buyer non-payment and country risk. You need it if selling on open account terms, especially to multiple buyers. It typically covers 80–95% of invoice value at premiums of 0.1–1% of insured turnover." },
        { question: "What is supply chain finance?", answer: "Supply chain finance (reverse factoring) is a buyer-led program where the buyer's bank pays suppliers early at a discount based on the buyer's stronger credit rating. Suppliers get faster cash flow; buyers can extend their payment terms. It's growing rapidly in global trade." },
    ];

    const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) };
    const bcJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com" }, { "@type": "ListItem", "position": 2, "name": "Trade Finance" }] };

    return (<>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bcJsonLd) }} />
        <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(1rem, 4vw, 1.5rem)" }} role="main">
            <header style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(59,130,246,0.04))", border: "1px solid var(--border)", borderRadius: "16px", padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 3rem)", marginBottom: "2rem", textAlign: "center" }}>
                <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}><Link href="/" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Home</Link><span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>›</span><span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Trade Finance</span></nav>
                <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800, margin: "0 0 1rem", color: "var(--foreground)", lineHeight: 1.2 }}>Trade Finance — Letters of Credit, Guarantees & Payment Methods</h1>
                <p style={{ fontSize: "1.1rem", color: "var(--muted-foreground)", lineHeight: 1.6, margin: "0 auto", maxWidth: "800px" }}>How to secure payments in international trade: LCs, bank guarantees, documentary collections, trade credit insurance, and supply chain finance explained.</p>
            </header>
            <div className="content-sidebar-grid">
                <article aria-label="Trade finance guide">
                    {sections.map((s, i) => (<section key={`s-${i}`} id={s.id} style={{ ...sS, borderBottom: i < sections.length - 1 ? "1px solid var(--border)" : "none" }}><h2 style={h2}>{s.heading}</h2><div style={{ ...body, maxWidth: "100%", overflowWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: s.content }} /></section>))}
                    <div role="banner" style={{ margin: "3rem 0", background: "linear-gradient(135deg, var(--accent), #6366f1)", borderRadius: "16px", padding: "clamp(1.5rem, 4vw, 2.5rem)", textAlign: "center", boxShadow: "0 10px 30px rgba(99,102,241,0.15)" }}>
                        <h2 style={{ fontSize: "clamp(1.25rem, 3.5vw, 1.75rem)", fontWeight: 800, color: "#fff", margin: "0 0 0.75rem" }}>Know Your Total Landed Cost</h2>
                        <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.85)", margin: "0 0 1.5rem" }}>Calculate duties, taxes, and total import costs before negotiating payment terms.</p>
                        <Link href="/calculate/" style={{ display: "inline-block", background: "#fff", color: "var(--accent)", fontWeight: 700, padding: "1rem 2.5rem", borderRadius: "8px", textDecoration: "none", fontSize: "1.1rem" }}>Open Calculator →</Link>
                    </div>
                    <section id="faq" aria-label="FAQ" style={{ marginBottom: "3rem" }}><h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--foreground)" }}>Frequently Asked Questions</h2>{faqs.map((f, i) => (<details key={`faq-${i}`} style={{ background: "var(--card)", padding: "1.25rem 1.5rem", borderRadius: "12px", border: "1px solid var(--border)", marginBottom: "0.85rem" }}><summary style={{ fontWeight: 600, cursor: "pointer", color: "var(--foreground)", fontSize: "1rem" }}>{f.question}</summary><div style={{ marginTop: "1rem", color: "var(--muted-foreground)", lineHeight: 1.75, fontSize: "0.95rem" }}>{f.answer}</div></details>))}</section>
                </article>
                <aside aria-label="Quick links" style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <section style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}><h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.5rem" }}>Landed Cost Calculator</h3><p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", marginBottom: "1.25rem", lineHeight: 1.5 }}>Know total costs before setting payment terms.</p><Link href="/calculate/" style={{ display: "block", textAlign: "center", background: "var(--accent)", color: "#fff", fontWeight: 600, padding: "0.85rem 1rem", borderRadius: "8px", textDecoration: "none", fontSize: "0.95rem" }}>Open Calculator →</Link></section>
                    <nav aria-label="Related" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem" }}><h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "1rem" }}>Related Guides</h3><ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}><li><Link href="/incoterms/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Incoterms 2020 Guide</Link></li><li><Link href="/import-documents/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Import Documents</Link></li><li><Link href="/export-documents/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Export Documents</Link></li><li><Link href="/customs-broker/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Customs Broker Guide</Link></li><li><Link href="/import-from-china/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Import from China</Link></li></ul></nav>
                    <nav aria-label="Official" style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "12px", padding: "1.25rem" }}><h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>Official Sources</h3><ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}><li><a href="https://iccwbo.org/business-solutions/uniform-rules/" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>ICC UCP 600 Rules ↗</a></li><li><a href="https://www.trade.gov/trade-finance-guide" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>Trade.gov Finance Guide ↗</a></li></ul></nav>
                    <nav aria-label="TOC" style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}><h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>On This Page</h3><ul style={{ listStyle: "none", padding: 0, margin: 0 }}>{sections.map((s, i) => (<li key={`t-${i}`} style={{ marginBottom: "0.4rem" }}><a href={`#${s.id}`} style={{ color: "var(--muted-foreground)", textDecoration: "none", fontSize: "0.85rem" }}>{s.heading}</a></li>))}<li style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}><a href="#faq" style={{ color: "var(--foreground)", fontWeight: 500, textDecoration: "none", fontSize: "0.85rem" }}>FAQs</a></li></ul></nav>
                </aside>
            </div>
        </main>
    </>);
}
