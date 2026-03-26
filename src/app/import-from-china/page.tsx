import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: { absolute: "How to Import from China — Step-by-Step Guide with Duties & Tariffs 2026" },
    description: "Complete guide to importing from China: sourcing suppliers, Section 301 tariffs, HS code classification, shipping logistics, quality inspections, customs clearance, and total landed cost calculation.",
    alternates: { canonical: "/import-from-china/" },
    keywords: [
        "how to import from China", "importing from China to USA", "China import duty",
        "Section 301 tariffs China", "sourcing from China", "Alibaba import guide",
        "China import tax", "import from China to UK", "China customs clearance",
        "Chinese supplier verification", "import from China cost", "China tariff rates 2026",
        "import goods from China", "China trade war tariffs",
    ],
    openGraph: {
        title: "How to Import from China — Complete 2026 Guide",
        description: "Everything you need to import from China: sourcing, Section 301 tariffs, shipping, inspections, customs clearance, and duty calculation.",
        url: "/import-from-china",
        type: "article",
    },
};

export default function ImportFromChinaPage() {
    const sS: React.CSSProperties = { marginBottom: "2.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid var(--border)" };
    const h2: React.CSSProperties = { fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" };
    const body: React.CSSProperties = { color: "var(--muted-foreground)", lineHeight: 1.85, fontSize: "1.05rem" };

    const sections = [
        {
            id: "why-import-china", heading: "Why Import from China?",
            content: `China remains the world's <strong>largest exporter</strong>, accounting for approximately <strong>14% of global merchandise exports</strong> in 2025. Despite trade tensions, Section 301 tariffs, and diversification to Vietnam and India, China's manufacturing ecosystem offers unmatched advantages:
            <ul style="padding-left:1.5rem;margin-top:1rem;">
                <li style="margin-bottom:0.75rem;"><strong>Scale and price:</strong> China's vast factory base produces everything from electronics to textiles at volumes and prices no other country matches</li>
                <li style="margin-bottom:0.75rem;"><strong>Supply chain depth:</strong> Complete vertical supply chains — raw materials, components, assembly, and packaging — all within a few hundred kilometers</li>
                <li style="margin-bottom:0.75rem;"><strong>Infrastructure:</strong> World-class ports (Shanghai, Shenzhen, Ningbo), extensive road/rail networks, and mature export logistics</li>
                <li><strong>Speed:</strong> Fast prototyping, short lead times, and rapid iteration — especially for consumer electronics, apparel, and consumer goods</li>
            </ul>
            <div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.2);border-radius:12px;padding:1.25rem;margin-top:1.5rem;">
                <strong style="color:var(--foreground);">⚠️ 2026 Reality Check:</strong>
                <p style="margin:0.5rem 0 0;font-size:0.95rem;">US importers face <strong>Section 301 tariffs of 7.5–25%</strong> on most Chinese goods, in addition to regular MFN duties. This significantly increases landed costs. Always <a href="/calculate/">calculate your total landed cost</a> before committing to Chinese suppliers vs. alternatives in Vietnam, India, or Mexico.</p>
            </div>`
        },
        {
            id: "step-by-step", heading: "Step-by-Step Import Process",
            content: `<ol style="padding-left:1.5rem;">
                <li style="margin-bottom:1.25rem;">
                    <strong style="font-size:1.05rem;">Research & Product Selection</strong>
                    <p style="margin:0.5rem 0 0;">Define your product specifications, target price, MOQ (minimum order quantity), and quality standards. Research <a href="/import-restrictions/">import restrictions</a> for your destination country — some Chinese products face anti-dumping duties or import bans.</p>
                </li>
                <li style="margin-bottom:1.25rem;">
                    <strong style="font-size:1.05rem;">Find & Verify Suppliers</strong>
                    <p style="margin:0.5rem 0 0;">Source through Alibaba, Global Sources, Made-in-China, or attend Canton Fair (Guangzhou). Always verify suppliers: request business licenses, check factory audits, order samples, and use third-party verification services like Sourcify or InTouch Quality.</p>
                </li>
                <li style="margin-bottom:1.25rem;">
                    <strong style="font-size:1.05rem;">Negotiate Terms</strong>
                    <p style="margin:0.5rem 0 0;">Agree on price, MOQ, payment terms (30% deposit + 70% before shipment is common), <a href="/incoterms/">Incoterm</a> (FOB Shenzhen/Shanghai is standard), lead time, and quality specifications. Get everything in a written purchase order.</p>
                </li>
                <li style="margin-bottom:1.25rem;">
                    <strong style="font-size:1.05rem;">Classify Your Product (HS Code)</strong>
                    <p style="margin:0.5rem 0 0;">Determine the correct <a href="/hs-code-lookup/">HS code</a> for your product. This determines your duty rate, whether Section 301 tariffs apply, and any regulatory requirements. Use our <a href="/hs-code-finder/">AI HS Code Finder</a> for instant classification.</p>
                </li>
                <li style="margin-bottom:1.25rem;">
                    <strong style="font-size:1.05rem;">Pre-Shipment Inspection</strong>
                    <p style="margin:0.5rem 0 0;">Hire a third-party QC company (SGS, Bureau Veritas, AsiaInspection/QIMA) to inspect goods <strong>before they leave China</strong>. Standard inspection: random sample from 80% completed production. Cost: $300–$500 per man-day.</p>
                </li>
                <li style="margin-bottom:1.25rem;">
                    <strong style="font-size:1.05rem;">Arrange Shipping</strong>
                    <p style="margin:0.5rem 0 0;">Choose between ocean (20–40 days, cheapest) and air freight (5–10 days, fastest). Work with a <a href="/customs-broker/">freight forwarder</a> to book container space. FCL (Full Container Load) is cheaper per unit; LCL (Less than Container Load) for smaller shipments.</p>
                </li>
                <li style="margin-bottom:1.25rem;">
                    <strong style="font-size:1.05rem;">Prepare Import Documents</strong>
                    <p style="margin:0.5rem 0 0;">Ensure you have: commercial invoice, packing list, bill of lading, and any required certificates. For US imports: file ISF 24 hours before loading. See our complete <a href="/import-documents/">import documents guide</a>.</p>
                </li>
                <li>
                    <strong style="font-size:1.05rem;">Customs Clearance & Delivery</strong>
                    <p style="margin:0.5rem 0 0;">Your <a href="/customs-broker/">customs broker</a> files the entry, pays duties (including Section 301 if applicable), and arranges <a href="/customs-clearance/">customs clearance</a>. Once released, arrange last-mile delivery to your warehouse.</p>
                </li>
            </ol>`
        },
        {
            id: "section-301", heading: "Section 301 Tariffs on Chinese Goods (2026 Update)",
            content: `<p>Since 2018, the United States has imposed additional tariffs on Chinese goods under <a href="https://ustr.gov/issue-areas/enforcement/section-301-investigations" target="_blank" rel="dofollow">Section 301 of the Trade Act of 1974</a>. These tariffs are <strong>in addition to</strong> regular MFN duty rates and significantly increase the cost of importing from China.</p>
            <div style="overflow-x:auto;margin:1.5rem 0;">
                <table style="width:100%;border-collapse:collapse;font-size:0.95rem;">
                    <thead><tr style="border-bottom:2px solid var(--border);">
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">List</th>
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Additional Tariff</th>
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Products Affected</th>
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Status 2026</th>
                    </tr></thead>
                    <tbody>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">List 1</td><td style="padding:0.75rem;"><strong>25%</strong></td><td style="padding:0.75rem;">$34B — industrial machinery, electronics components</td><td style="padding:0.75rem;color:#ef4444;">Active</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">List 2</td><td style="padding:0.75rem;"><strong>25%</strong></td><td style="padding:0.75rem;">$16B — semiconductors, plastics, chemicals</td><td style="padding:0.75rem;color:#ef4444;">Active</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">List 3</td><td style="padding:0.75rem;"><strong>25%</strong></td><td style="padding:0.75rem;">$200B — furniture, electronics, auto parts, consumer goods</td><td style="padding:0.75rem;color:#ef4444;">Active</td></tr>
                        <tr><td style="padding:0.75rem;font-weight:600;">List 4A</td><td style="padding:0.75rem;"><strong>7.5%</strong></td><td style="padding:0.75rem;">$120B — consumer electronics, apparel, footwear</td><td style="padding:0.75rem;color:#ef4444;">Active</td></tr>
                    </tbody>
                </table>
            </div>
            <div style="background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.15);border-radius:12px;padding:1.25rem;margin-top:1rem;">
                <strong style="color:var(--foreground);">Impact Example:</strong>
                <p style="margin:0.5rem 0 0;font-size:0.95rem;">A $10,000 FOB shipment of furniture (List 3) with a 3.5% MFN duty faces: $350 MFN duty + $2,500 Section 301 (25%) = <strong>$2,850 total duty (28.5%)</strong>. The same furniture from Vietnam would only incur the $350 MFN duty.</p>
            </div>
            <p style="margin-top:1rem;">Check if your product is affected using the <a href="https://hts.usitc.gov/" target="_blank" rel="dofollow">USITC HTS database</a> — Section 301 tariffs are marked in the "Special" column with "9903.88" subheadings.</p>`
        },
        {
            id: "finding-suppliers", heading: "Finding & Verifying Chinese Suppliers",
            content: `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;margin:1rem 0;">
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:var(--accent);margin-bottom:0.5rem;">Alibaba / 1688.com</strong>
                    <p style="font-size:0.9rem;margin:0;">Largest B2B marketplace. Look for "Gold Supplier" and "Verified" badges. 1688.com is the domestic Chinese version — lower prices but requires a sourcing agent. Always order samples before bulk.</p>
                </div>
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:var(--accent);margin-bottom:0.5rem;">Canton Fair (Guangzhou)</strong>
                    <p style="font-size:0.9rem;margin:0;">World's largest trade fair. Held biannually (spring & autumn) in Guangzhou. Phases cover electronics, consumer goods, textiles, and industrial products. Best for meeting manufacturers face-to-face.</p>
                </div>
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:var(--accent);margin-bottom:0.5rem;">Global Sources</strong>
                    <p style="font-size:0.9rem;margin:0;">Higher-quality supplier vetting than Alibaba. Based in Hong Kong. Better for electronics, fashion, and home products. Operates trade shows in Hong Kong.</p>
                </div>
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:var(--accent);margin-bottom:0.5rem;">Sourcing Agents</strong>
                    <p style="font-size:0.9rem;margin:0;">Local agents in Yiwu, Shenzhen, or Guangzhou who find suppliers, negotiate prices, manage QC, and coordinate shipping. Commission: 3–10% of order value. Essential for complex or multi-supplier orders.</p>
                </div>
            </div>
            <h3 style="font-size:1.1rem;font-weight:700;margin:1.5rem 0 0.75rem;">Supplier Verification Checklist:</h3>
            <ul style="padding-left:1.5rem;">
                <li style="margin-bottom:0.75rem;">✅ Request business license (营业执照) and verify on China's <a href="https://www.gsxt.gov.cn/" target="_blank" rel="dofollow">National Enterprise Credit Information System</a></li>
                <li style="margin-bottom:0.75rem;">✅ Order samples (pay for shipping — free samples often mean trading companies, not manufacturers)</li>
                <li style="margin-bottom:0.75rem;">✅ Request factory photos/videos or commission a factory audit (BSCI, ISO 9001)</li>
                <li style="margin-bottom:0.75rem;">✅ Check export history on <a href="https://www.importgenius.com/" target="_blank" rel="dofollow">ImportGenius</a> or Panjiva</li>
                <li>✅ Start with a small trial order before committing to large MOQs</li>
            </ul>`
        },
        {
            id: "shipping-logistics", heading: "Shipping from China — Options & Costs",
            content: `<div style="overflow-x:auto;margin:1rem 0;">
                <table style="width:100%;border-collapse:collapse;font-size:0.95rem;">
                    <thead><tr style="border-bottom:2px solid var(--border);">
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Method</th>
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Transit Time</th>
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Cost (China→US West Coast)</th>
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Best For</th>
                    </tr></thead>
                    <tbody>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">Ocean FCL (20ft)</td><td style="padding:0.75rem;">18–25 days</td><td style="padding:0.75rem;">$2,000–$4,000</td><td style="padding:0.75rem;">Large shipments (10+ CBM)</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">Ocean FCL (40ft)</td><td style="padding:0.75rem;">18–25 days</td><td style="padding:0.75rem;">$3,500–$6,000</td><td style="padding:0.75rem;">Full container loads</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">Ocean LCL</td><td style="padding:0.75rem;">25–35 days</td><td style="padding:0.75rem;">$50–$80/CBM</td><td style="padding:0.75rem;">Small shipments (1–10 CBM)</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">Air Freight</td><td style="padding:0.75rem;">5–10 days</td><td style="padding:0.75rem;">$4–$8/kg</td><td style="padding:0.75rem;">Urgent, lightweight, high-value</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;font-weight:600;">Express (DHL/FedEx/UPS)</td><td style="padding:0.75rem;">3–5 days</td><td style="padding:0.75rem;">$6–$15/kg</td><td style="padding:0.75rem;">Samples, small parcels (<100kg)</td></tr>
                        <tr><td style="padding:0.75rem;font-weight:600;">China→EU Rail</td><td style="padding:0.75rem;">14–18 days</td><td style="padding:0.75rem;">$4,000–$8,000/container</td><td style="padding:0.75rem;">EU-bound cargo, speed vs cost balance</td></tr>
                    </tbody>
                </table>
            </div>
            <p><strong>Key ports:</strong> Shanghai (Yangshan), Shenzhen (Yantian/Shekou), Ningbo-Zhoushan, Guangzhou (Nansha), Xiamen. Choose based on your supplier's factory location to minimize inland transport costs.</p>`
        },
        {
            id: "quality-control", heading: "Quality Control & Inspections",
            content: `<p>Quality issues are the <strong>#1 risk</strong> when importing from China. Mitigate them with a structured QC process:</p>
            <div style="display:flex;flex-direction:column;gap:1rem;margin-top:1rem;">
                <div style="border-left:4px solid var(--accent);padding-left:1.5rem;">
                    <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:0.5rem;">Pre-Production Inspection (PPI)</h3>
                    <p style="color:var(--muted-foreground);font-size:0.95rem;margin:0;">Verify raw materials and components <strong>before production starts</strong>. Catches issues early when changes are cheap. Cost: $300–$500/day.</p>
                </div>
                <div style="border-left:4px solid var(--accent);padding-left:1.5rem;">
                    <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:0.5rem;">During Production Inspection (DUPRO)</h3>
                    <p style="color:var(--muted-foreground);font-size:0.95rem;margin:0;">Inspect when 30–50% of production is complete. Checks consistency, workmanship, and adherence to specs. Cost: $300–$500/day.</p>
                </div>
                <div style="border-left:4px solid var(--accent);padding-left:1.5rem;">
                    <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:0.5rem;">Pre-Shipment Inspection (PSI)</h3>
                    <p style="color:var(--muted-foreground);font-size:0.95rem;margin:0;">The most common inspection. Conducted when <strong>80%+ of production is complete</strong> and packed. Uses AQL (Acceptable Quality Level) sampling — typically AQL 2.5 for major defects. <strong>This is your last chance to catch problems.</strong></p>
                </div>
                <div style="border-left:4px solid var(--accent);padding-left:1.5rem;">
                    <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:0.5rem;">Container Loading Inspection (CLI)</h3>
                    <p style="color:var(--muted-foreground);font-size:0.95rem;margin:0;">Verifies the right goods are loaded into the container, quantities match, and packaging meets shipping standards. Prevents last-minute substitutions.</p>
                </div>
            </div>
            <p style="margin-top:1.5rem;"><strong>Inspection providers:</strong> <a href="https://www.sgs.com/" target="_blank" rel="dofollow">SGS</a>, <a href="https://www.qima.com/" target="_blank" rel="dofollow">QIMA (AsiaInspection)</a>, <a href="https://www.bureauveritas.com/" target="_blank" rel="dofollow">Bureau Veritas</a>, <a href="https://www.intertek.com/" target="_blank" rel="dofollow">Intertek</a>, and V-Trust. Prices range from $250–$500 per man-day depending on location and complexity.</p>`
        },
        {
            id: "landed-cost", heading: "Total Landed Cost — What You'll Actually Pay",
            content: `<p>The "factory price" from your Chinese supplier is just the starting point. Your <strong>true landed cost</strong> includes:</p>
            <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:12px;padding:1.5rem;font-size:0.95rem;line-height:1.8;margin:1.5rem 0;">
                <div><strong>Product cost (FOB):</strong> $10,000</div>
                <div><strong>+ Ocean freight:</strong> $2,500</div>
                <div><strong>+ Insurance:</strong> $150</div>
                <div style="border-top:1px solid var(--border);padding-top:0.5rem;margin-top:0.5rem;"><strong>= CIF Value:</strong> $12,650</div>
                <div><strong>+ MFN Duty (5%):</strong> $632</div>
                <div><strong>+ Section 301 (25%):</strong> $2,500 (on FOB value)</div>
                <div><strong>+ Customs broker:</strong> $175</div>
                <div><strong>+ Port/handling fees:</strong> $500</div>
                <div><strong>+ Inland trucking:</strong> $800</div>
                <div style="border-top:2px solid var(--accent);padding-top:0.75rem;margin-top:0.75rem;font-size:1.05rem;"><strong>= Total Landed Cost: $17,257</strong> (72.6% markup on FOB price)</div>
            </div>
            <p>This is why calculating your <strong>total landed cost</strong> — not just the factory price — is critical before committing to a Chinese supplier. Use our <a href="/calculate/">landed cost calculator</a> for an instant breakdown.</p>`
        },
    ];

    const faqs = [
        { question: "How do I import goods from China to the USA?", answer: "The key steps are: (1) find and verify a Chinese supplier, (2) negotiate terms and place order, (3) classify your product with the correct HS code, (4) arrange pre-shipment inspection, (5) book freight via forwarder, (6) file ISF 24 hours before loading, (7) customs broker files entry and pays duties, (8) receive goods after customs clearance." },
        { question: "What is the import duty rate from China to the USA?", answer: "China pays standard MFN duty rates (0–25% depending on product). Plus, most products face additional Section 301 tariffs of 7.5–25%. Total duty can range from 0% (exempt items) to 50%+ (heavily tariffed goods like steel or aluminum)." },
        { question: "Are Section 301 tariffs on China still active in 2026?", answer: "Yes, Section 301 tariffs remain active across all four lists. Some product exclusions have been granted and extended, but the vast majority of Chinese goods still face the additional 7.5–25% tariff on top of regular MFN duty rates." },
        { question: "How long does shipping from China take?", answer: "Ocean freight to US West Coast: 18–25 days. To US East Coast: 25–35 days (via Suez/Panama). Air freight: 5–10 days. Express courier: 3–5 days. Add 2–5 days for customs clearance and inland delivery." },
        { question: "How do I verify a Chinese supplier is legitimate?", answer: "Verify their business license on China's GSXT system, check export history on ImportGenius/Panjiva, order product samples, commission a factory audit (BSCI, ISO 9001), request references from other international buyers, and always start with a small trial order." },
        { question: "What is the minimum order quantity (MOQ) from China?", answer: "MOQs vary by product. Consumer goods on Alibaba typically start at 100–500 units. Direct factory orders for customized products may require 1,000–5,000+ units. Trading companies often offer lower MOQs at slightly higher prices." },
    ];

    const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) };
    const bcJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com" }, { "@type": "ListItem", "position": 2, "name": "Import from China" }] };

    return (<>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bcJsonLd) }} />
        <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(1rem, 4vw, 1.5rem)" }} role="main">
            <header style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(59,130,246,0.04))", border: "1px solid var(--border)", borderRadius: "16px", padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 3rem)", marginBottom: "2rem", textAlign: "center" }}>
                <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}><Link href="/" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Home</Link><span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>›</span><span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Import from China</span></nav>
                <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800, margin: "0 0 1rem", color: "var(--foreground)", lineHeight: 1.2 }}>How to Import from China — Complete 2026 Guide</h1>
                <p style={{ fontSize: "1.1rem", color: "var(--muted-foreground)", lineHeight: 1.6, margin: "0 auto", maxWidth: "800px" }}>Step-by-step guide covering sourcing, Section 301 tariffs, supplier verification, quality inspections, shipping logistics, and total landed cost calculation.</p>
            </header>
            <div className="content-sidebar-grid">
                <article aria-label="Import from China guide">
                    {sections.map((s, i) => (<section key={`s-${i}`} id={s.id} style={{ ...sS, borderBottom: i < sections.length - 1 ? "1px solid var(--border)" : "none" }}><h2 style={h2}>{s.heading}</h2><div style={{ ...body, maxWidth: "100%", overflowWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: s.content }} /></section>))}
                    <div role="banner" style={{ margin: "3rem 0", background: "linear-gradient(135deg, var(--accent), #6366f1)", borderRadius: "16px", padding: "clamp(1.5rem, 4vw, 2.5rem)", textAlign: "center", boxShadow: "0 10px 30px rgba(99,102,241,0.15)" }}>
                        <h2 style={{ fontSize: "clamp(1.25rem, 3.5vw, 1.75rem)", fontWeight: 800, color: "#fff", margin: "0 0 0.75rem" }}>Calculate Your China Import Costs</h2>
                        <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.85)", margin: "0 0 1.5rem" }}>Instant duty calculation including Section 301 tariffs for 50+ countries.</p>
                        <Link href="/calculate/" style={{ display: "inline-block", background: "#fff", color: "var(--accent)", fontWeight: 700, padding: "1rem 2.5rem", borderRadius: "8px", textDecoration: "none", fontSize: "1.1rem" }}>Open Calculator →</Link>
                    </div>
                    <section id="faq" aria-label="FAQ" style={{ marginBottom: "3rem" }}><h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--foreground)" }}>Frequently Asked Questions</h2>{faqs.map((f, i) => (<details key={`faq-${i}`} style={{ background: "var(--card)", padding: "1.25rem 1.5rem", borderRadius: "12px", border: "1px solid var(--border)", marginBottom: "0.85rem" }}><summary style={{ fontWeight: 600, cursor: "pointer", color: "var(--foreground)", fontSize: "1rem" }}>{f.question}</summary><div style={{ marginTop: "1rem", color: "var(--muted-foreground)", lineHeight: 1.75, fontSize: "0.95rem" }}>{f.answer}</div></details>))}</section>
                </article>
                <aside aria-label="Quick links" style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <section style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}><h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.5rem" }}>China Duty Calculator</h3><p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", marginBottom: "1.25rem", lineHeight: 1.5 }}>Calculate duties + Section 301 tariffs instantly.</p><Link href="/china/import-duty-calculator/" style={{ display: "block", textAlign: "center", background: "var(--accent)", color: "#fff", fontWeight: 600, padding: "0.85rem 1rem", borderRadius: "8px", textDecoration: "none", fontSize: "0.95rem" }}>China Calculator →</Link></section>
                    <nav aria-label="Related" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem" }}><h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "1rem" }}>Related Guides</h3><ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}><li><Link href="/incoterms/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Incoterms 2020 Guide</Link></li><li><Link href="/customs-broker/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Customs Broker Guide</Link></li><li><Link href="/import-documents/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Import Documents</Link></li><li><Link href="/trade-finance/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Trade Finance</Link></li><li><Link href="/tariff-rates/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Tariff Rates</Link></li></ul></nav>
                    <nav aria-label="Official" style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "12px", padding: "1.25rem" }}><h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>Official Sources</h3><ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}><li><a href="https://ustr.gov/issue-areas/enforcement/section-301-investigations" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>USTR Section 301 Info ↗</a></li><li><a href="https://hts.usitc.gov/" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>USITC HTS Lookup ↗</a></li><li><a href="https://www.cbp.gov/trade" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>US CBP Trade ↗</a></li></ul></nav>
                    <nav aria-label="TOC" style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}><h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>On This Page</h3><ul style={{ listStyle: "none", padding: 0, margin: 0 }}>{sections.map((s, i) => (<li key={`t-${i}`} style={{ marginBottom: "0.4rem" }}><a href={`#${s.id}`} style={{ color: "var(--muted-foreground)", textDecoration: "none", fontSize: "0.85rem" }}>{s.heading}</a></li>))}<li style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}><a href="#faq" style={{ color: "var(--foreground)", fontWeight: 500, textDecoration: "none", fontSize: "0.85rem" }}>FAQs</a></li></ul></nav>
                </aside>
            </div>
        </main>
    </>);
}
