import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: { absolute: "Customs Broker vs Freight Forwarder — Roles, Costs & When You Need One" },
    description: "Understand the difference between a customs broker and freight forwarder. Learn when you need a licensed customs broker, typical fees, and how to choose the right one for your imports.",
    alternates: { canonical: "/customs-broker/" },
    keywords: [
        "customs broker", "customs broker vs freight forwarder", "do I need a customs broker",
        "licensed customs broker", "customs broker fees", "customs clearance agent",
        "freight forwarder", "customs brokerage", "import broker", "customs broker near me",
        "how to choose customs broker", "customs broker license",
    ],
    openGraph: {
        title: "Customs Broker vs Freight Forwarder — Complete Guide",
        description: "When do you need a customs broker? How much do they charge? What's the difference from a freight forwarder? Expert answers for importers.",
        url: "/customs-broker",
        type: "article",
    },
};

export default function CustomsBrokerPage() {
    const sS: React.CSSProperties = { marginBottom: "2.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid var(--border)" };
    const h2: React.CSSProperties = { fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" };
    const body: React.CSSProperties = { color: "var(--muted-foreground)", lineHeight: 1.85, fontSize: "1.05rem" };

    const sections = [
        {
            id: "what-is-customs-broker", heading: "What Is a Customs Broker?",
            content: `A <strong>customs broker</strong> (also called a customs house agent or customs clearance agent) is a licensed professional authorized to act on behalf of importers to clear goods through customs. In the United States, customs brokers must hold a <a href="https://www.cbp.gov/trade/programs-administration/customs-brokers" target="_blank" rel="dofollow">license issued by U.S. Customs and Border Protection (CBP)</a> after passing a rigorous exam with a ~15% pass rate.
            <p style="margin-top:1rem;">A customs broker's core responsibilities include:</p>
            <ul style="padding-left:1.5rem;margin-top:0.75rem;">
                <li><strong>Filing customs entries</strong> — submitting the Entry Summary (CBP Form 7501) and supporting documents electronically through ACE</li>
                <li><strong>Classifying goods</strong> — determining the correct <a href="/hs-code-lookup/">HS code</a> to ensure proper <a href="/import-duty/">duty rates</a> are applied</li>
                <li><strong>Calculating and paying duties</strong> — computing duties, taxes, and fees and making payment to customs on behalf of the importer</li>
                <li><strong>Ensuring compliance</strong> — advising on <a href="/import-restrictions/">import restrictions</a>, required licenses, partner government agency requirements (FDA, USDA, EPA, CPSC), and trade agreement eligibility</li>
                <li><strong>Handling customs holds and exams</strong> — resolving issues when shipments are flagged for inspection or documentation review</li>
            </ul>`
        },
        {
            id: "what-is-freight-forwarder", heading: "What Is a Freight Forwarder?",
            content: `A <strong>freight forwarder</strong> is a logistics company that organizes the physical transportation of goods from origin to destination. They are the architects of your supply chain — coordinating carriers, routes, documentation, and warehousing to move your cargo efficiently.
            <p style="margin-top:1rem;">Freight forwarders handle:</p>
            <ul style="padding-left:1.5rem;margin-top:0.75rem;">
                <li><strong>Booking cargo space</strong> — negotiating rates with ocean carriers, airlines, and trucking companies</li>
                <li><strong>Multimodal coordination</strong> — combining sea, air, rail, and road transport into a seamless door-to-door solution</li>
                <li><strong>Documentation</strong> — preparing <a href="/import-documents/">shipping documents</a> (bills of lading, air waybills, packing lists)</li>
                <li><strong>Cargo insurance</strong> — arranging transit insurance coverage</li>
                <li><strong>Warehousing and consolidation</strong> — grouping small shipments (LCL) into full containers for cost efficiency</li>
                <li><strong>Tracking and visibility</strong> — providing real-time shipment status updates</li>
            </ul>
            <div style="background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.15);border-radius:12px;padding:1.25rem;margin-top:1.5rem;">
                <strong style="color:var(--foreground);">Key Distinction:</strong>
                <p style="margin:0.5rem 0 0;font-size:0.95rem;">Many large freight forwarders also offer customs brokerage services (employing licensed brokers in-house). However, a standalone freight forwarder without a broker license <strong>cannot</strong> file customs entries on your behalf.</p>
            </div>`
        },
        {
            id: "key-differences", heading: "Customs Broker vs Freight Forwarder — Key Differences",
            content: `<div style="overflow-x:auto;margin:1rem 0;">
                <table style="width:100%;border-collapse:collapse;font-size:0.95rem;">
                    <thead><tr style="border-bottom:2px solid var(--border);">
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Factor</th>
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Customs Broker</th>
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Freight Forwarder</th>
                    </tr></thead>
                    <tbody>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">Primary Role</td><td style="padding:0.75rem;">Customs compliance & entry filing</td><td style="padding:0.75rem;">Physical transportation & logistics</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">License Required</td><td style="padding:0.75rem;">Yes — CBP license (US), CFICA (Canada), etc.</td><td style="padding:0.75rem;">FMC license for ocean (US), no uniform global standard</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">Files Customs Entries</td><td style="padding:0.75rem;"><strong>Yes</strong> — authorized to file electronically</td><td style="padding:0.75rem;">Only if they employ licensed brokers</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">Calculates Duties</td><td style="padding:0.75rem;"><strong>Yes</strong> — classification & duty computation</td><td style="padding:0.75rem;">No (estimates only)</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">Moves Cargo</td><td style="padding:0.75rem;">No — handles paperwork only</td><td style="padding:0.75rem;"><strong>Yes</strong> — arranges all transport</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">Compliance Advice</td><td style="padding:0.75rem;"><strong>Expert</strong> — regulatory, PGA, FTA</td><td style="padding:0.75rem;">Basic logistics compliance</td></tr>
                        <tr><td style="padding:0.75rem;font-weight:600;">Typical Fees</td><td style="padding:0.75rem;">$100–$250/entry + duty disbursement</td><td style="padding:0.75rem;">Varies by shipment size & mode</td></tr>
                    </tbody>
                </table>
            </div>`
        },
        {
            id: "when-you-need-broker", heading: "When Do You Need a Customs Broker?",
            content: `<p>Legally, you can clear your own imports in most countries (called "self-filing" or "direct entry"). However, a customs broker is <strong>strongly recommended</strong> (or effectively required) in these situations:</p>
            <ul style="padding-left:1.5rem;margin-top:1rem;">
                <li style="margin-bottom:1rem;"><strong>Commercial imports over $2,500 (US):</strong> While not legally required, the complexity of ISF filing, ACE entry submission, customs bonds, and compliance requirements makes professional help essential.</li>
                <li style="margin-bottom:1rem;"><strong>Regulated goods:</strong> Products controlled by FDA (food, drugs, medical devices), USDA (agriculture), EPA (chemicals), CPSC (consumer safety), or ATF (alcohol, tobacco, firearms) require specialized knowledge of partner government agency procedures.</li>
                <li style="margin-bottom:1rem;"><strong>FTA duty optimization:</strong> Claiming preferential rates under <a href="/tariff-rates/">trade agreements</a> requires correct origin determination and certificate of origin management — errors can result in penalties.</li>
                <li style="margin-bottom:1rem;"><strong>High-volume importing:</strong> Regular importers benefit from a broker's continuous bond management, ACE reporting, and compliance monitoring.</li>
                <li><strong>Anti-dumping/CVD goods:</strong> Products subject to anti-dumping or countervailing duties require complex bond calculations and cash deposit management.</li>
            </ul>`
        },
        {
            id: "broker-fees", heading: "Customs Broker Fees — What You'll Pay",
            content: `<p>Customs broker fees vary by complexity, value, and location. Here's what to expect:</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem;margin:1.5rem 0;">
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:var(--accent);margin-bottom:0.5rem;">Entry Filing Fee</strong>
                    <p style="font-size:0.9rem;margin:0;"><strong>$100–$250 per entry</strong> for standard commercial entries. Complex entries (PGA-regulated, AD/CVD) may be $300–$500+.</p>
                </div>
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:var(--accent);margin-bottom:0.5rem;">ISF Filing (US)</strong>
                    <p style="font-size:0.9rem;margin:0;"><strong>$25–$75 per filing</strong> — Importer Security Filing required 24 hours before ocean cargo is loaded.</p>
                </div>
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:var(--accent);margin-bottom:0.5rem;">Duty Disbursement</strong>
                    <p style="font-size:0.9rem;margin:0;">Brokers pay duties on your behalf. A <strong>disbursement fee</strong> of 2–5% of duty amount may apply if they front the payment.</p>
                </div>
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:var(--accent);margin-bottom:0.5rem;">Customs Bond</strong>
                    <p style="font-size:0.9rem;margin:0;"><strong>$300–$600/year</strong> for a continuous bond (required for regular importers). Single-entry bonds are cheaper but add up quickly.</p>
                </div>
            </div>
            <p><strong>Pro tip:</strong> Many freight forwarders bundle brokerage services into their per-shipment quotes. Compare the total cost rather than line items.</p>`
        },
        {
            id: "how-to-choose", heading: "How to Choose the Right Customs Broker",
            content: `<ol style="padding-left:1.5rem;">
                <li style="margin-bottom:1rem;"><strong>Verify the license:</strong> In the US, search the <a href="https://www.cbp.gov/trade/programs-administration/customs-brokers/search-customs-broker" target="_blank" rel="dofollow">CBP Broker Database</a> to confirm active license status. In Canada, check CFICA membership.</li>
                <li style="margin-bottom:1rem;"><strong>Industry specialization:</strong> Choose a broker experienced with your product type. Food/pharmaceutical imports need brokers familiar with FDA processes. Textiles require quota/visa expertise.</li>
                <li style="margin-bottom:1rem;"><strong>Port coverage:</strong> Ensure the broker operates at your port of entry. National brokers with port agents may have delays vs. brokers physically at your port.</li>
                <li style="margin-bottom:1rem;"><strong>Technology integration:</strong> Modern brokers offer ACE portal access, automated tracking, duty payment visibility, and integration with your ERP/accounting software.</li>
                <li style="margin-bottom:1rem;"><strong>FTA expertise:</strong> If you import from FTA partner countries, your broker should proactively identify duty savings opportunities under USMCA, CPTPP, RCEP, and other agreements.</li>
                <li><strong>References and volume:</strong> Ask for references from importers with similar products. Higher-volume brokers often have better relationships with customs officers and faster clearance times.</li>
            </ol>`
        },
    ];

    const faqs = [
        { question: "Do I need a customs broker to import?", answer: "Legally, no — you can self-file in most countries. However, for commercial imports over $2,500 (US), regulated goods, or regular importing, a licensed customs broker is strongly recommended due to the complexity of compliance requirements." },
        { question: "What's the difference between a customs broker and customs agent?", answer: "In most contexts, they are the same. 'Customs broker' is used in North America, while 'customs agent' or 'customs house agent' is common in UK, Australia, and Asia. Both refer to licensed professionals who clear goods through customs." },
        { question: "How much does a customs broker charge?", answer: "Typical fees range from $100–$250 per customs entry for standard commercial shipments. Additional fees apply for ISF filing ($25–$75), customs bonds ($300–$600/year), and complex entries with regulatory requirements ($300–$500+)." },
        { question: "Can a freight forwarder clear customs?", answer: "Only if they employ licensed customs brokers. Many large freight forwarders (DHL, Kuehne + Nagel, DB Schenker) have in-house brokerage divisions. Smaller forwarders typically partner with independent brokers." },
        { question: "What is a customs bond and do I need one?", answer: "A customs bond is a financial guarantee to CBP that duties and fees will be paid. Required for all US commercial imports. A continuous bond ($300–$600/year) covers unlimited entries; a single-entry bond covers one shipment." },
    ];

    const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) };
    const bcJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com" }, { "@type": "ListItem", "position": 2, "name": "Customs Broker Guide" }] };

    return (<>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bcJsonLd) }} />
        <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(1rem, 4vw, 1.5rem)" }} role="main">
            <header style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(59,130,246,0.04))", border: "1px solid var(--border)", borderRadius: "16px", padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 3rem)", marginBottom: "2rem", textAlign: "center" }}>
                <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}><Link href="/" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Home</Link><span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>›</span><span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Customs Broker Guide</span></nav>
                <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800, margin: "0 0 1rem", color: "var(--foreground)", lineHeight: 1.2 }}>Customs Broker vs Freight Forwarder — What You Need to Know</h1>
                <p style={{ fontSize: "1.1rem", color: "var(--muted-foreground)", lineHeight: 1.6, margin: "0 auto", maxWidth: "800px" }}>Understand the critical differences, when you need a licensed customs broker, how much they cost, and how to choose the right one for your imports.</p>
            </header>
            <div className="content-sidebar-grid">
                <article aria-label="Customs broker guide">
                    {sections.map((s, i) => (<section key={`s-${i}`} id={s.id} style={{ ...sS, borderBottom: i < sections.length - 1 ? "1px solid var(--border)" : "none" }}><h2 style={h2}>{s.heading}</h2><div style={{ ...body, maxWidth: "100%", overflowWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: s.content }} /></section>))}
                    <div role="banner" style={{ margin: "3rem 0", background: "linear-gradient(135deg, var(--accent), #6366f1)", borderRadius: "16px", padding: "clamp(1.5rem, 4vw, 2.5rem)", textAlign: "center", boxShadow: "0 10px 30px rgba(99,102,241,0.15)" }}>
                        <h2 style={{ fontSize: "clamp(1.25rem, 3.5vw, 1.75rem)", fontWeight: 800, color: "#fff", margin: "0 0 0.75rem" }}>Know Your Duties Before Hiring a Broker</h2>
                        <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.85)", margin: "0 0 1.5rem" }}>Get instant duty estimates to discuss informed rates with your broker.</p>
                        <Link href="/calculate/" style={{ display: "inline-block", background: "#fff", color: "var(--accent)", fontWeight: 700, padding: "1rem 2.5rem", borderRadius: "8px", textDecoration: "none", fontSize: "1.1rem" }}>Open Calculator →</Link>
                    </div>
                    <section id="faq" aria-label="FAQ" style={{ marginBottom: "3rem" }}><h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--foreground)" }}>Frequently Asked Questions</h2>{faqs.map((f, i) => (<details key={`faq-${i}`} style={{ background: "var(--card)", padding: "1.25rem 1.5rem", borderRadius: "12px", border: "1px solid var(--border)", marginBottom: "0.85rem" }}><summary style={{ fontWeight: 600, cursor: "pointer", color: "var(--foreground)", fontSize: "1rem" }}>{f.question}</summary><div style={{ marginTop: "1rem", color: "var(--muted-foreground)", lineHeight: 1.75, fontSize: "0.95rem" }}>{f.answer}</div></details>))}</section>
                </article>
                <aside aria-label="Quick links" style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <section style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}><h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.5rem" }}>Duty Calculator</h3><p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", marginBottom: "1.25rem", lineHeight: 1.5 }}>Know your duty costs before hiring a broker.</p><Link href="/calculate/" style={{ display: "block", textAlign: "center", background: "var(--accent)", color: "#fff", fontWeight: 600, padding: "0.85rem 1rem", borderRadius: "8px", textDecoration: "none", fontSize: "0.95rem" }}>Open Calculator →</Link></section>
                    <nav aria-label="Related" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem" }}><h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "1rem" }}>Related Guides</h3><ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}><li><Link href="/customs-clearance/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Customs Clearance</Link></li><li><Link href="/import-documents/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Import Documents</Link></li><li><Link href="/incoterms/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Incoterms 2020 Guide</Link></li><li><Link href="/import-duty/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Import Duty Guide</Link></li><li><Link href="/tariff-rates/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Tariff Rates</Link></li></ul></nav>
                    <nav aria-label="TOC" style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}><h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>On This Page</h3><ul style={{ listStyle: "none", padding: 0, margin: 0 }}>{sections.map((s, i) => (<li key={`t-${i}`} style={{ marginBottom: "0.4rem" }}><a href={`#${s.id}`} style={{ color: "var(--muted-foreground)", textDecoration: "none", fontSize: "0.85rem" }}>{s.heading}</a></li>))}<li style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}><a href="#faq" style={{ color: "var(--foreground)", fontWeight: 500, textDecoration: "none", fontSize: "0.85rem" }}>FAQs</a></li></ul></nav>
                </aside>
            </div>
        </main>
    </>);
}
