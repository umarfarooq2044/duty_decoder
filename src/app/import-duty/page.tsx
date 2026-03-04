import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Import Duty Explained — Types, Rates & How to Calculate 2026",
    description: "Understand import duty: ad valorem, specific, and compound duty types, MFN rates, FTA reductions, de minimis thresholds, and how to legally minimize customs charges in 2026.",
    alternates: { canonical: "/import-duty/" },
    keywords: [
        "import duty", "customs duty rates", "ad valorem duty", "specific duty",
        "how to calculate import duty", "import duty calculator", "MFN duty rate",
        "free trade agreement duty", "de minimis threshold", "import duty 2026"
    ],
    openGraph: {
        title: "Import Duty — Complete Guide to Customs Duty Rates & Calculation",
        description: "Everything importers need to know: duty types, rate structures, FTA savings, and penalties for misclassification. Updated for 2026.",
        url: "/import-duty",
        type: "article",
    },
};

export default function ImportDutyPage() {
    const sS: React.CSSProperties = { marginBottom: "2.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid var(--border)" };
    const h2: React.CSSProperties = { fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" };
    const body: React.CSSProperties = { color: "var(--muted-foreground)", lineHeight: 1.85, fontSize: "1.05rem" };

    const sections = [
        {
            id: "what-is-import-duty", heading: "What Is Import Duty?",
            content: `<strong>Import duty</strong> (also called customs duty) is a tax levied by a country's government on goods entering its borders. It is collected by the national customs authority — <a href="https://www.cbp.gov/trade" target="_blank" rel="dofollow">U.S. Customs and Border Protection (CBP)</a>, <a href="https://www.gov.uk/government/organisations/hm-revenue-customs" target="_blank" rel="dofollow">UK HMRC</a>, or equivalent — at the point of importation. Import duty serves three purposes: <strong>revenue generation</strong> for the government, <strong>protection of domestic industries</strong> from foreign competition, and <strong>regulation of trade flows</strong> through economic incentives and penalties.<p style="margin-top:1rem;">The amount of duty you pay depends on three factors: (1) the <strong>HS code classification</strong> of your goods, (2) the <strong>customs value</strong> (typically CIF — Cost + Insurance + Freight), and (3) the <strong>country of origin</strong>, which determines whether preferential rates under Free Trade Agreements apply.</p>`
        },
        {
            id: "duty-types", heading: "Types of Import Duty",
            content: `Not all duties are calculated the same way. Understanding duty types prevents costly estimation errors:
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;margin:1.5rem 0;">
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:var(--accent);margin-bottom:0.5rem;">Ad Valorem Duty</strong>
                    <p style="font-size:0.9rem;margin:0;">Charged as a <strong>percentage of the goods' customs value</strong>. Most common worldwide. Example: 5% duty on a $10,000 shipment = $500 duty.</p>
                </div>
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:var(--accent);margin-bottom:0.5rem;">Specific Duty</strong>
                    <p style="font-size:0.9rem;margin:0;">Charged as a <strong>fixed amount per unit of quantity</strong> (weight, volume, or count). Example: $0.15 per kilogram regardless of value. Common for agricultural goods and commodities.</p>
                </div>
                <div style="background:rgba(99,102,241,0.05);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
                    <strong style="display:block;font-size:1.1rem;color:var(--accent);margin-bottom:0.5rem;">Compound Duty</strong>
                    <p style="font-size:0.9rem;margin:0;">Combines both: an ad valorem percentage <strong>plus</strong> a specific rate. Example: 10% + $2.00/kg. The higher of the two calculations typically applies.</p>
                </div>
            </div>
            <p>Additionally, countries impose <strong>special duties</strong> beyond the standard tariff:</p>
            <ul style="padding-left:1.5rem;margin-top:0.75rem;">
                <li><strong>Anti-Dumping Duties (AD):</strong> Imposed when a foreign manufacturer sells goods below fair market value. Can add 50%–250% to landed cost.</li>
                <li><strong>Countervailing Duties (CVD):</strong> Applied to offset foreign government subsidies that give exporters an unfair price advantage.</li>
                <li><strong>Safeguard Duties:</strong> Temporary tariffs imposed to protect domestic industries from a surge in imports (e.g., US Section 201 tariffs on solar panels).</li>
                <li><strong>Retaliatory/Section 301 Tariffs:</strong> Punitive tariffs imposed in trade disputes (e.g., US-China Section 301 tariffs adding 25% on $250B+ of goods).</li>
            </ul>`
        },
        {
            id: "how-calculated", heading: "How Import Duty Is Calculated",
            content: `<p>The duty calculation follows a standard formula used by customs authorities worldwide:</p>
            <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:12px;padding:1.5rem;font-family:monospace;font-size:0.9rem;line-height:1.8;margin:1.5rem 0;">
                <div><strong>Step 1:</strong> Determine the <strong>Customs Value</strong> (CIF or FOB depending on country)</div>
                <div><strong>Step 2:</strong> Classify the goods with the correct <a href="/hs-code-lookup/" style="color:var(--accent);">HS code</a></div>
                <div><strong>Step 3:</strong> Look up the <strong>applicable duty rate</strong> in the tariff schedule</div>
                <div><strong>Step 4:</strong> Apply: Customs Value × Duty Rate % = <strong>Duty Payable</strong></div>
                <div style="border-top:1px solid var(--border);padding-top:0.5rem;margin-top:0.5rem;">
                    <strong>Example:</strong> $10,000 CIF × 5% duty rate = <strong>$500 customs duty</strong>
                </div>
            </div>
            <p><strong>Important:</strong> Most countries use CIF (Cost, Insurance, Freight) as the customs value — meaning shipping and insurance costs are included in the dutiable amount. The US is a notable exception: it uses <strong>FOB (Free on Board)</strong> value, which excludes international shipping and insurance.</p>`
        },
        {
            id: "mfn-rates", heading: "MFN Rates vs. Preferential Rates",
            content: `<p>Every country's tariff schedule has a <strong>default duty rate</strong> that applies to all WTO member nations. This is called the <strong>MFN (Most Favoured Nation)</strong> rate — a baseline that ensures no WTO member is treated worse than any other.</p>
            <p style="margin-top:1rem;">However, countries that sign <strong>Free Trade Agreements (FTAs)</strong> enjoy reduced or zero duty rates on qualifying goods. Some key agreements:</p>
            <ul style="padding-left:1.5rem;margin-top:0.75rem;">
                <li><strong><a href="https://ustr.gov/trade-agreements/free-trade-agreements/united-states-mexico-canada-agreement" target="_blank" rel="dofollow">USMCA</a>:</strong> US-Mexico-Canada — 0% duty on qualifying goods between the three countries.</li>
                <li><strong><a href="https://www.dfat.gov.au/trade/agreements/in-force/cptpp" target="_blank" rel="dofollow">CPTPP</a>:</strong> 11-nation Pacific Rim agreement covering UK, Japan, Australia, Canada, and others.</li>
                <li><strong>EU Single Market:</strong> Zero internal tariffs between 27 EU member states.</li>
                <li><strong>RCEP:</strong> World's largest FTA covering 15 Asia-Pacific economies including China, Japan, South Korea, Australia, and ASEAN nations.</li>
            </ul>
            <p style="margin-top:1rem;"><strong>To claim preferential rates,</strong> importers must provide a valid <strong>Certificate of Origin (COO)</strong> proving the goods were manufactured in the FTA partner country and meet the agreement's <strong>Rules of Origin</strong> (minimum local content thresholds).</p>`
        },
        {
            id: "de-minimis", heading: "De Minimis Thresholds — Duty-Free Imports",
            content: `<p>Most countries exempt low-value shipments from customs duty below a specified threshold — the <strong>de minimis value</strong>. This is critical for e-commerce and sample shipments:</p>
            <div style="overflow-x:auto;margin:1.5rem 0;">
                <table style="width:100%;border-collapse:collapse;font-size:0.95rem;">
                    <thead><tr style="border-bottom:2px solid var(--border);">
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Country</th>
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">De Minimis</th>
                        <th style="text-align:left;padding:0.75rem;color:var(--foreground);font-weight:700;">Notes</th>
                    </tr></thead>
                    <tbody>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;">🇺🇸 United States</td><td style="padding:0.75rem;"><strong>$800</strong></td><td style="padding:0.75rem;">Highest in the world. Under review for 2026 reform.</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;">🇬🇧 United Kingdom</td><td style="padding:0.75rem;"><strong>£135</strong></td><td style="padding:0.75rem;">VAT still due on all imports; only duty is waived below threshold.</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;">🇪🇺 European Union</td><td style="padding:0.75rem;"><strong>€150</strong></td><td style="padding:0.75rem;">VAT applies from €0 since IOSS reform (July 2021).</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;">🇦🇺 Australia</td><td style="padding:0.75rem;"><strong>A$1,000</strong></td><td style="padding:0.75rem;">One of the highest globally. GST applies from A$0.</td></tr>
                        <tr style="border-bottom:1px solid var(--border);"><td style="padding:0.75rem;">🇨🇦 Canada</td><td style="padding:0.75rem;"><strong>C$150</strong></td><td style="padding:0.75rem;">Recently raised from C$20 under CUSMA implementation.</td></tr>
                        <tr><td style="padding:0.75rem;">🇵🇰 Pakistan</td><td style="padding:0.75rem;"><strong>$0</strong></td><td style="padding:0.75rem;">No de minimis; duties apply on all imports.</td></tr>
                    </tbody>
                </table>
            </div>`
        },
        {
            id: "reduce-duty", heading: "How to Legally Reduce Import Duty",
            content: `<p>Experienced importers use several legitimate strategies to minimize duty costs:</p>
            <ul style="padding-left:1.5rem;margin-top:0.75rem;">
                <li><strong>FTA Utilization:</strong> If your goods qualify under an FTA, claim the preferential rate. This alone can reduce duty from 12% to 0% on many goods.</li>
                <li><strong>Tariff Engineering:</strong> Designing or modifying products to classify under a lower-duty HS code. Legal when done transparently — for example, importing garments with certain compositions that attract lower rates.</li>
                <li><strong>Foreign Trade Zones (FTZs):</strong> Importing goods into a designated FTZ allows you to defer duties until goods enter domestic commerce, or re-export without paying duty at all.</li>
                <li><strong>Temporary Import Bonds:</strong> Goods imported temporarily (exhibitions, testing) can be imported duty-free under <strong>ATA Carnet</strong> or temporary importation bonds.</li>
                <li><strong>Duty Drawback:</strong> If you import goods and then re-export them (processed or unprocessed), you can claim a refund of up to 99% of duties paid.</li>
                <li><strong>First Sale Valuation:</strong> For multi-tiered transactions, you can value goods at the price of the first sale (manufacturer to middleman) rather than the higher price paid to the middleman — reducing the dutiable value.</li>
            </ul>
            <p style="margin-top:1rem;"><strong>Warning:</strong> Intentional misclassification, undervaluation, or false origin claims constitute customs fraud and can result in fines of up to <strong>4× the underpaid duty</strong>, seizure of goods, and criminal prosecution.</p>`
        },
        {
            id: "penalties", heading: "Penalties for Getting Import Duty Wrong",
            content: `<p>Customs authorities worldwide take classification and valuation seriously. If you underpay duty — whether intentionally or through negligence — the consequences can be severe:</p>
            <ul style="padding-left:1.5rem;margin-top:0.75rem;">
                <li><strong>US (CBP):</strong> Penalties range from 2× to 4× the unpaid duty for negligence, and up to the <strong>domestic value of the goods</strong> for fraud. <a href="https://www.cbp.gov/trade/priority-issues/penalties" target="_blank" rel="dofollow">CBP publishes penalty guidelines</a> under 19 USC §1592.</li>
                <li><strong>EU:</strong> Member states each set penalty levels. Fines typically range from 1× to 3× the evaded duty, plus interest on late payments.</li>
                <li><strong>UK (HMRC):</strong> Penalties of up to 100% of the underpaid duty for deliberate errors. Careless errors attract lower penalties (30-70%).</li>
                <li><strong>Criminal Prosecution:</strong> In extreme cases of organized fraud, customs authorities can pursue criminal charges, asset forfeiture, and imprisonment.</li>
            </ul>
            <p style="margin-top:1rem;">The easiest way to avoid penalties is to <strong>classify goods correctly from the start</strong>. Use our <a href="/hs-code-finder/">AI HS Code Finder</a> to validate your classification before shipping.</p>`
        },
    ];

    const faqs = [
        { question: "What is the difference between import duty and import tax?", answer: "Import duty is a tariff charged specifically on goods entering a country, based on their HS code classification. Import tax typically refers to broader taxes like VAT/GST that apply to both domestic and imported goods. You'll usually pay both: duty first, then VAT calculated on the duty-inclusive value." },
        { question: "How do I find the import duty rate for my product?", answer: "Look up your product's HS code using our <a href='/hs-code-finder'>AI HS Code Finder</a>, then check the corresponding duty rate in your destination country's tariff schedule. Or use our <a href='/calculate'>Landed Cost Calculator</a> which does both steps automatically." },
        { question: "Can I avoid paying import duty?", answer: "You can legally reduce or eliminate duty through Free Trade Agreement preferential rates, de minimis thresholds for low-value shipments, Foreign Trade Zones, duty drawback on re-exports, and temporary import bonds. You cannot legally avoid duty through misclassification or undervaluation." },
        { question: "Who pays import duty — the buyer or seller?", answer: "Under most international trade terms (Incoterms), the buyer/importer pays import duties. Under DDP (Delivered Duty Paid), the seller assumes all costs including duty. The specific arrangement depends on the Incoterms agreed in the sales contract." },
        { question: "What happens if I don't pay import duty?", answer: "Your goods will be held at customs and not released until duties are paid. Extended non-payment can lead to goods being auctioned, destroyed, or returned to origin at your cost. Deliberate duty evasion can result in significant fines and criminal charges." },
    ];

    const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer.replace(/<[^>]*>/g, '') } })) };
    const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": process.env.NEXT_PUBLIC_BASE_URL || "https://duty-decoder.com" }, { "@type": "ListItem", "position": 2, "name": "Import Duty", "item": `${process.env.NEXT_PUBLIC_BASE_URL || "https://duty-decoder.com"}/import-duty` }] };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            <main style={{ maxWidth: "1100px", margin: "0 auto" }} role="main">
                <header style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(59,130,246,0.04))", border: "1px solid var(--border)", borderRadius: "16px", padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 3rem)", marginBottom: "2rem", textAlign: "center" }}>
                    <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                        <Link href="/" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Home</Link>
                        <span aria-hidden="true" style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>›</span>
                        <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Import Duty</span>
                    </nav>
                    <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800, margin: "0 0 1rem", color: "var(--foreground)", lineHeight: 1.2 }}>Import Duty — The Complete Guide for Importers</h1>
                    <p style={{ fontSize: "1.1rem", color: "var(--muted-foreground)", lineHeight: 1.6, margin: "0 auto", maxWidth: "800px" }}>Understand how customs duty works, what determines your rate, and proven strategies to legally minimize what you pay — from ad valorem calculations to FTA utilization.</p>
                </header>

                <div className="content-sidebar-grid">
                    <article aria-label="Import duty guide">
                        {sections.map((s, i) => (
                            <section key={`s-${i}`} id={s.id} style={{ ...sS, borderBottom: i < sections.length - 1 ? "1px solid var(--border)" : "none" }}>
                                <h2 style={h2}>{s.heading}</h2>
                                <div style={body} dangerouslySetInnerHTML={{ __html: s.content }} />
                            </section>
                        ))}

                        <div role="banner" style={{ margin: "3rem 0", background: "linear-gradient(135deg, var(--accent), #6366f1)", borderRadius: "16px", padding: "2.5rem", textAlign: "center", boxShadow: "0 10px 30px rgba(99,102,241,0.15)" }}>
                            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", margin: "0 0 0.75rem" }}>Calculate Your Import Duty Now</h2>
                            <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.85)", margin: "0 0 1.5rem" }}>Get an exact breakdown of duties, taxes, and fees for any product across 50+ countries.</p>
                            <Link href="/calculate/" style={{ display: "inline-block", background: "white", color: "black", fontWeight: 700, padding: "1rem 2.5rem", borderRadius: "8px", textDecoration: "none", fontSize: "1.1rem" }}>Open Calculator →</Link>
                        </div>

                        <section id="faq" aria-label="FAQ" style={{ marginBottom: "3rem" }}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--foreground)" }}>Frequently Asked Questions</h2>
                            {faqs.map((f, i) => (
                                <details key={`faq-${i}`} style={{ background: "var(--card)", padding: "1.25rem 1.5rem", borderRadius: "12px", border: "1px solid var(--border)", marginBottom: "0.85rem" }}>
                                    <summary style={{ fontWeight: 600, cursor: "pointer", color: "var(--foreground)", fontSize: "1rem" }}>{f.question}</summary>
                                    <div style={{ marginTop: "1rem", color: "var(--muted-foreground)", lineHeight: 1.75, fontSize: "0.95rem" }} dangerouslySetInnerHTML={{ __html: f.answer }} />
                                </details>
                            ))}
                        </section>
                    </article>

                    <aside aria-label="Quick links" style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <section style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.5rem" }}>Import Duty Calculator</h3>
                            <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", marginBottom: "1.25rem", lineHeight: 1.5 }}>Calculate exact duties, taxes, and landed costs for your products.</p>
                            <Link href="/calculate/" style={{ display: "block", textAlign: "center", background: "var(--accent)", color: "#fff", fontWeight: 600, padding: "0.85rem 1rem", borderRadius: "8px", textDecoration: "none", fontSize: "0.95rem" }}>Open Calculator →</Link>
                        </section>
                        <Link href="/hs-code-finder/" style={{ display: "block", background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(59,130,246,0.05))", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem", textDecoration: "none" }}>
                            <strong style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)", display: "block", marginBottom: "0.25rem" }}>HS Code Finder →</strong>
                            <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Find the right tariff code for your product with AI</span>
                        </Link>
                        <nav aria-label="Related" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem" }}>
                            <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "1rem" }}>Related Guides</h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                <li><Link href="/import-tax/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Import Tax (VAT/GST)</Link></li>
                                <li><Link href="/customs-duty/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Customs Duty Guide</Link></li>
                                <li><Link href="/tariff-rates/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Global Tariff Rates</Link></li>
                                <li><Link href="/hs-code-lookup/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>HS Code Lookup</Link></li>
                                <li><Link href="/customs-clearance/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Customs Clearance</Link></li>
                            </ul>
                        </nav>
                        <nav aria-label="Official sources" style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "12px", padding: "1.25rem" }}>
                            <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>Official Sources</h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <li><a href="https://www.cbp.gov/trade" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>U.S. CBP Trade ↗</a></li>
                                <li><a href="https://hts.usitc.gov/" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>USITC Tariff Schedule ↗</a></li>
                                <li><a href="https://www.trade-tariff.service.gov.uk/" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>UK Global Tariff ↗</a></li>
                                <li><a href="https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>EU TARIC Database ↗</a></li>
                            </ul>
                        </nav>
                        <nav aria-label="TOC" style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                            <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>On This Page</h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {sections.map((s, i) => (<li key={`t-${i}`} style={{ marginBottom: "0.4rem" }}><a href={`#${s.id}`} style={{ color: "var(--muted-foreground)", textDecoration: "none", fontSize: "0.85rem", lineHeight: 1.4, display: "block" }}>{s.heading}</a></li>))}
                                <li style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}><a href="#faq" style={{ color: "var(--foreground)", fontWeight: 500, textDecoration: "none", fontSize: "0.85rem" }}>FAQs</a></li>
                            </ul>
                        </nav>
                    </aside>
                </div>
            </main>
        </>
    );
}
