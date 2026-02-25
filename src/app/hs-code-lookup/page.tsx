import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "HS Code Lookup — Understand & Search Harmonized System Codes 2026 | Duty Decoder",
    description: "Everything you need to know about HS code lookup: code structure, GRI classification rules, country-specific extensions, common mistakes, and free lookup tools. Updated for 2026.",
    alternates: { canonical: "/hs-code-lookup/" },
    keywords: [
        "HS code lookup", "harmonized system code", "HTS code search", "customs tariff code",
        "HS code structure", "how to find HS code", "HS code classification",
        "tariff classification", "commodity code lookup", "trade code search 2026"
    ],
    openGraph: {
        title: "HS Code Lookup Guide — Harmonized System Classification 2026",
        description: "Master HS code classification: understand the 6-digit structure, GRI rules, country extensions, and common mistakes. Free lookup tool included.",
        url: "/hs-code-lookup",
        type: "article",
    },
};

export default function HSCodeLookupPage() {
    const sectionStyle: React.CSSProperties = {
        marginBottom: "2.5rem",
        paddingBottom: "2.5rem",
        borderBottom: "1px solid var(--border)",
    };

    const h2Style: React.CSSProperties = {
        fontSize: "1.5rem",
        fontWeight: 700,
        marginBottom: "1rem",
        color: "var(--foreground)",
    };

    const bodyStyle: React.CSSProperties = {
        color: "var(--muted-foreground)",
        lineHeight: 1.85,
        fontSize: "1.05rem",
    };

    const sections = [
        {
            id: "what-is-hs-code",
            heading: "What Is an HS Code?",
            content: `The <strong>Harmonized System (HS)</strong> is an internationally standardized system of names and numbers to classify traded products. Developed and maintained by the <a href="https://www.wcoomd.org/en/topics/nomenclature/overview/what-is-the-harmonized-system.aspx" target="_blank" rel="dofollow">World Customs Organization (WCO)</a>, it is used by <strong>over 200 countries and economies</strong> covering more than 98% of world trade. The HS assigns a unique 6-digit code to every commodity — from raw cotton to satellites — and serves as the universal language of customs authorities worldwide.`
        },
        {
            id: "hs-code-structure",
            heading: "How HS Codes Are Structured",
            content: `Every HS code follows a hierarchical 6-digit structure. Understanding this anatomy is essential for accurate lookup:
            <div style="background: rgba(99,102,241,0.06); border: 1px solid rgba(99,102,241,0.15); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; font-family: monospace;">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center;">
                    <div>
                        <strong style="display: block; font-size: 2rem; color: var(--accent);">62</strong>
                        <span style="font-size: 0.85rem; color: var(--muted-foreground);">Chapter</span><br/>
                        <span style="font-size: 0.8rem;">Articles of apparel,<br/>not knitted/crocheted</span>
                    </div>
                    <div>
                        <strong style="display: block; font-size: 2rem; color: var(--accent);">05</strong>
                        <span style="font-size: 0.85rem; color: var(--muted-foreground);">Heading</span><br/>
                        <span style="font-size: 0.8rem;">Men's or boys' shirts</span>
                    </div>
                    <div>
                        <strong style="display: block; font-size: 2rem; color: var(--accent);">20</strong>
                        <span style="font-size: 0.85rem; color: var(--muted-foreground);">Subheading</span><br/>
                        <span style="font-size: 0.8rem;">Of cotton</span>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
                    <strong style="font-size: 1.1rem; color: var(--foreground);">HS 6205.20</strong> = Men's cotton shirt (woven, not knitted)
                </div>
            </div>
            <ul style="padding-left: 1.5rem; margin-top: 1rem;">
                <li><strong>Chapters 01–97:</strong> The HS divides all goods into 97 chapters grouped within 21 sections. Chapter 01 starts with live animals; Chapter 97 covers works of art.</li>
                <li><strong>Headings (4 digits):</strong> Each chapter contains multiple headings that narrow the classification. For example, Chapter 62 has headings for suits (6203), dresses (6204), shirts (6205), and more.</li>
                <li><strong>Subheadings (6 digits):</strong> The subheading level adds material or attribute specificity. The first 6 digits are <strong>internationally harmonized</strong> — meaning HS 6205.20 is "men's cotton shirt" everywhere in the world.</li>
                <li><strong>National Extensions (8-10+ digits):</strong> Countries add additional digits beyond the 6-digit HS core. The US uses 10-digit <a href="https://hts.usitc.gov/" target="_blank" rel="dofollow">HTS codes</a>, the EU uses 8-digit <a href="https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp" target="_blank" rel="dofollow">TARIC codes</a>, and the UK uses 10-digit <a href="https://www.trade-tariff.service.gov.uk/" target="_blank" rel="dofollow">commodity codes</a>.</li>
            </ul>`
        },
        {
            id: "why-hs-code-matters",
            heading: "Why Getting Your HS Code Right Matters",
            content: `Your HS code isn't just an administrative formality — it is the <strong>single most important variable</strong> in determining your import costs. Here's what hinges on correct classification:
            <ul style="padding-left: 1.5rem; margin-top: 1rem;">
                <li><strong>Duty Rate:</strong> A one-digit difference can mean 0% duty vs. 25%. For example, HS 8471.30 (laptops) carries 0% duty in the US, while HS 8528.72 (monitors) attracts up to 5%.</li>
                <li><strong>FTA Eligibility:</strong> Free Trade Agreement preferential rates only apply to specific HS codes. Using the wrong code means you lose access to reduced or zero-duty rates under agreements like USMCA, CPTPP, or the EU-UK TCA.</li>
                <li><strong>Anti-Dumping Duties:</strong> Certain HS codes trigger AD/CVD (Anti-Dumping/Countervailing Duty) orders that can add 50%–250% to your landed cost.</li>
                <li><strong>Import Licensing:</strong> Some HS chapters require special permits — Chapter 93 (arms), Chapter 28/29 (chemicals), and Chapter 30 (pharmaceuticals) often need regulatory clearance.</li>
                <li><strong>Customs Penalties:</strong> Intentional or negligent misclassification can result in fines of up to <strong>4x the underpaid duty</strong> in the US, and criminal prosecution in extreme cases.</li>
            </ul>`
        },
        {
            id: "gri-rules",
            heading: "The General Rules of Interpretation (GRI)",
            content: `When looking up an HS code, customs brokers worldwide apply the <a href="https://www.wcoomd.org/en/topics/nomenclature/instrument-and-tools/tools-to-assist-with-the-classification-in-the-hs/general-rules-of-interpretation-gri.aspx" target="_blank" rel="dofollow">WCO General Rules of Interpretation (GRI)</a> — a set of 6 legal principles that determine how any product should be classified:
            <ol style="padding-left: 1.5rem; margin-top: 1rem;">
                <li><strong>GRI 1:</strong> Classification is determined first by the terms of the headings and any relative section or chapter notes. This is the primary rule — always start here.</li>
                <li><strong>GRI 2(a):</strong> Incomplete or unfinished articles are classified as if they were complete, provided they have the essential character of the finished product.</li>
                <li><strong>GRI 2(b):</strong> Mixtures and combinations of materials are classified in the heading covering the component that gives the product its essential character.</li>
                <li><strong>GRI 3:</strong> When goods could fall under two or more headings, classify under the heading that provides the <strong>most specific description</strong>.</li>
                <li><strong>GRI 4:</strong> Goods that cannot be classified under GRI 1-3 are classified under the heading for goods most akin to them.</li>
                <li><strong>GRI 5-6:</strong> Rules for packaging materials and subheading-level classification.</li>
            </ol>
            <p style="margin-top: 1rem;">Understanding these rules is critical because they override intuitive classification. For example, a <strong>stainless steel water bottle</strong> might seem like a "drinking vessel" (Chapter 69/70), but GRI 1 and the chapter notes classify it under <strong>Chapter 73 (steel articles)</strong> based on material composition.</p>`
        },
        {
            id: "hs-vs-hts",
            heading: "HS Code vs. HTS Code vs. Schedule B — What's the Difference?",
            content: `These terms are often confused. Here's the distinction:
            <div style="overflow-x: auto; margin: 1.5rem 0;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--border);">
                            <th style="text-align: left; padding: 0.75rem; color: var(--foreground); font-weight: 700;">Code</th>
                            <th style="text-align: left; padding: 0.75rem; color: var(--foreground); font-weight: 700;">Digits</th>
                            <th style="text-align: left; padding: 0.75rem; color: var(--foreground); font-weight: 700;">Used For</th>
                            <th style="text-align: left; padding: 0.75rem; color: var(--foreground); font-weight: 700;">Maintained By</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 0.75rem;"><strong>HS Code</strong></td>
                            <td style="padding: 0.75rem;">6 digits</td>
                            <td style="padding: 0.75rem;">International standard (200+ countries)</td>
                            <td style="padding: 0.75rem;"><a href="https://www.wcoomd.org/" target="_blank" rel="dofollow">WCO</a></td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 0.75rem;"><strong>HTS Code</strong></td>
                            <td style="padding: 0.75rem;">10 digits</td>
                            <td style="padding: 0.75rem;">US imports (duty assessment)</td>
                            <td style="padding: 0.75rem;"><a href="https://hts.usitc.gov/" target="_blank" rel="dofollow">USITC</a></td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 0.75rem;"><strong>Schedule B</strong></td>
                            <td style="padding: 0.75rem;">10 digits</td>
                            <td style="padding: 0.75rem;">US exports (statistical reporting)</td>
                            <td style="padding: 0.75rem;"><a href="https://www.census.gov/foreign-trade/schedules/b/index.html" target="_blank" rel="dofollow" style="color: var(--accent);">Census Bureau</a></td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 0.75rem;"><strong>CN Code</strong></td>
                            <td style="padding: 0.75rem;">8 digits</td>
                            <td style="padding: 0.75rem;">EU imports/exports</td>
                            <td style="padding: 0.75rem;"><a href="https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp" target="_blank" rel="dofollow">EU TARIC</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 0.75rem;"><strong>Commodity Code</strong></td>
                            <td style="padding: 0.75rem;">10 digits</td>
                            <td style="padding: 0.75rem;">UK imports</td>
                            <td style="padding: 0.75rem;"><a href="https://www.trade-tariff.service.gov.uk/" target="_blank" rel="dofollow">HMRC</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>The first 6 digits are always the same internationally. For example, HS 8471.30 means "portable data processing machines" everywhere. But the US extends this to 8471.30.0100 (with battery) vs. 8471.30.0150 (without battery), and each carries a different statistical suffix.</p>`
        },
        {
            id: "how-to-lookup",
            heading: "How to Look Up an HS Code (Step-by-Step)",
            content: `<ol style="padding-left: 1.5rem;">
                <li style="margin-bottom: 1rem;"><strong>Identify the product's essential character:</strong> What is it made of? What does it do? Who uses it? A "Bluetooth speaker shaped like a rubber duck" is classified by its function (sound reproduction → Chapter 85), not its shape.</li>
                <li style="margin-bottom: 1rem;"><strong>Find the HS Chapter (2-digit):</strong> Browse the <a href="https://www.wcoomd.org/en/topics/nomenclature/overview/what-is-the-harmonized-system.aspx" target="_blank" rel="dofollow">21 HS sections</a>, starting with the section that best matches the product's primary material or function.</li>
                <li style="margin-bottom: 1rem;"><strong>Narrow to the Heading (4-digit):</strong> Within the chapter, read the heading descriptions and chapter notes. Some headings have legal exclusions — always check the "does not include" notes.</li>
                <li style="margin-bottom: 1rem;"><strong>Select the Subheading (6-digit):</strong> Drill down by material composition, intended use, or manufacturing process. This is where most classification disputes occur.</li>
                <li style="margin-bottom: 1rem;"><strong>Add country-specific digits:</strong> Use your destination country's tariff tool to find the full national code. For the US, use the <a href="https://hts.usitc.gov/" target="_blank" rel="dofollow">USITC search</a>. For the EU, use <a href="https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp" target="_blank" rel="dofollow">TARIC</a>.</li>
                <li><strong>Validate with our AI tool:</strong> Use our <a href="/hs-code-finder/">AI-Powered HS Code Finder</a> to cross-check your classification with confidence scoring and alternative suggestions.</li>
            </ol>`
        },
        {
            id: "common-mistakes",
            heading: "5 Common HS Code Lookup Mistakes",
            content: `<ol style="padding-left: 1.5rem;">
                <li style="margin-bottom: 1rem;"><strong>Classifying by end-use instead of material:</strong> A stainless steel thermos flask classifies under Chapter 73 (steel articles), NOT Chapter 96 (miscellaneous goods) — even though it's used for drinking.</li>
                <li style="margin-bottom: 1rem;"><strong>Ignoring chapter notes:</strong> Chapter notes legally override heading descriptions. Chapter 85 Note 5 specifies exactly what counts as an "automatic data processing machine" — many electronics are misclassified by ignoring this.</li>
                <li style="margin-bottom: 1rem;"><strong>Using outdated codes:</strong> The WCO revises the HS every 5 years (latest: HS 2022). Codes from 2017 or earlier may no longer exist or may have been re-numbered.</li>
                <li style="margin-bottom: 1rem;"><strong>Assuming the same code works everywhere:</strong> While the first 6 digits are global, national extensions differ. HS 8471.30 is universal, but the 10-digit US HTS code differs from the 8-digit EU CN code.</li>
                <li><strong>Classifying multi-component goods by the most expensive part:</strong> GRI 3(b) says you classify by <strong>essential character</strong>, not by value. A $200 leather case containing a $5 pen set classifies under the pen heading, because the pen gives the product its essential character as a "writing set."</li>
            </ol>`
        },
        {
            id: "hs-code-updates",
            heading: "How Often Are HS Codes Updated?",
            content: `The WCO updates the Harmonized System approximately <strong>every 5 years</strong>. The most recent edition is <strong>HS 2022</strong>, which became effective on January 1, 2022, and is currently in force through 2026.
            <p style="margin-top: 1rem;">Each revision adds new subheadings for emerging products (e.g., drones, e-cigarettes, 3D printers were added in recent revisions), splits existing codes for better statistical tracking, and removes obsolete classifications. Countries typically have a transition period of 6-12 months to adopt new versions into their national tariff schedules.</p>
            <p style="margin-top: 1rem;">Between major revisions, individual countries frequently update their <strong>national extensions</strong> (digits 7-10) and duty rates through budget announcements, SROs, or Federal Register notices — sometimes multiple times per year.</p>`
        },
    ];

    const faqs = [
        { question: "What is the difference between HS code and HTS code?", answer: "An HS code is the international 6-digit classification standard maintained by the WCO. An HTS code is the US-specific 10-digit extension used by the USITC for import duty assessment. The first 6 digits of an HTS code are always the HS code." },
        { question: "How do I find the HS code for my product?", answer: "Start by identifying your product's material composition and primary function. Then browse the HS chapter list (1-97) to find the right chapter, narrow to the heading, and select the subheading. Or use our <a href='/hs-code-finder'>AI HS Code Finder</a> for instant results." },
        { question: "Are HS codes the same in every country?", answer: "The first 6 digits (Chapter + Heading + Subheading) are internationally standardized across 200+ countries. However, countries add additional digits (7-10) for national tariff specificity. So the HS code is globally consistent, but the full tariff code varies by destination." },
        { question: "How often do HS codes change?", answer: "The WCO revises the full Harmonized System approximately every 5 years. The current edition is HS 2022. Individual countries may update their national extensions and duty rates more frequently through legislative changes." },
        { question: "What happens if I use the wrong HS code?", answer: "Using an incorrect HS code can result in overpaying or underpaying customs duties, denial of FTA preferential rates, customs penalties (up to 4x underpaid duty in the US), shipment delays, and in severe cases, seizure of goods or criminal prosecution." },
        { question: "Can I look up HS codes for free?", answer: "Yes. Official government tools include <a href='https://hts.usitc.gov/' target='_blank' rel='dofollow'>USITC HTS Search</a> (US), <a href='https://www.trade-tariff.service.gov.uk/' target='_blank' rel='dofollow'>UK Trade Tariff</a>, and <a href='https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp' target='_blank' rel='dofollow'>EU TARIC</a>. Our <a href='/hs-code-finder'>AI HS Code Finder</a> provides free AI-powered classification across all countries." },
    ];

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer.replace(/<[^>]*>/g, '') }
        }))
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": process.env.NEXT_PUBLIC_BASE_URL || "https://duty-decoder.com" },
            { "@type": "ListItem", "position": 2, "name": "HS Code Lookup", "item": `${process.env.NEXT_PUBLIC_BASE_URL || "https://duty-decoder.com"}/hs-code-lookup` }
        ]
    };

    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "HS Code Lookup — Complete Guide to Harmonized System Classification",
        "description": metadata.description,
        "author": { "@type": "Organization", "name": "Duty Decoder" },
        "publisher": { "@type": "Organization", "name": "Duty Decoder" },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${process.env.NEXT_PUBLIC_BASE_URL || "https://duty-decoder.com"}/hs-code-lookup`
        }
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

            <main style={{ maxWidth: "1100px", margin: "0 auto" }} role="main">
                {/* ───── Hero Banner ───── */}
                <header style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(59,130,246,0.04))",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 3rem)",
                    marginBottom: "2rem",
                    textAlign: "center"
                }}>
                    <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                        <Link href="/" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Home</Link>
                        <span aria-hidden="true" style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>›</span>
                        <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>HS Code Lookup</span>
                    </nav>
                    <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800, margin: "0 0 1rem", color: "var(--foreground)", lineHeight: 1.2 }}>
                        HS Code Lookup — Complete Classification Guide
                    </h1>
                    <p style={{ fontSize: "1.1rem", color: "var(--muted-foreground)", lineHeight: 1.6, margin: "0 auto", maxWidth: "800px" }}>
                        Master the Harmonized System: understand code structure, classification rules, country-specific extensions, and how to avoid costly misclassification errors.
                    </p>
                </header>

                {/* ───── Two Column Layout ───── */}
                <div className="content-sidebar-grid">

                    {/* LEFT: Content */}
                    <article aria-label="HS Code Lookup guide">
                        {sections.map((section, i) => (
                            <section key={`sec-${i}`} id={section.id} style={{
                                ...sectionStyle,
                                borderBottom: i < sections.length - 1 ? "1px solid var(--border)" : "none",
                            }}>
                                <h2 style={h2Style}>{section.heading}</h2>
                                <div style={bodyStyle} dangerouslySetInnerHTML={{ __html: section.content }} />
                            </section>
                        ))}

                        {/* Mid-Content CTA */}
                        <div role="banner" style={{
                            margin: "3rem 0",
                            background: "linear-gradient(135deg, var(--accent), #6366f1)",
                            borderRadius: "16px",
                            padding: "2.5rem",
                            textAlign: "center",
                            boxShadow: "0 10px 30px rgba(99,102,241,0.15)",
                        }}>
                            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", margin: "0 0 0.75rem" }}>
                                Find Your HS Code Instantly
                            </h2>
                            <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.85)", margin: "0 0 1.5rem" }}>
                                Describe your product in plain English and our AI will classify it with confidence scores.
                            </p>
                            <Link href="/hs-code-finder/" aria-label="Open AI HS Code Finder" style={{
                                display: "inline-block",
                                background: "#fff",
                                color: "var(--accent)",
                                fontWeight: 700,
                                padding: "1rem 2.5rem",
                                borderRadius: "8px",
                                textDecoration: "none",
                                fontSize: "1.1rem",
                            }}>
                                Open HS Code Finder →
                            </Link>
                        </div>

                        {/* FAQs */}
                        <section id="faq" aria-label="Frequently asked questions" style={{ marginBottom: "3rem" }}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--foreground)" }}>
                                Frequently Asked Questions
                            </h2>
                            {faqs.map((faq, i) => (
                                <details key={`faq-${i}`} style={{
                                    background: "var(--card)",
                                    padding: "1.25rem 1.5rem",
                                    borderRadius: "12px",
                                    border: "1px solid var(--border)",
                                    marginBottom: "0.85rem",
                                }}>
                                    <summary style={{ fontWeight: 600, cursor: "pointer", color: "var(--foreground)", fontSize: "1rem" }}>
                                        {faq.question}
                                    </summary>
                                    <div style={{ marginTop: "1rem", color: "var(--muted-foreground)", lineHeight: 1.75, fontSize: "0.95rem" }}
                                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                                    />
                                </details>
                            ))}
                        </section>
                    </article>

                    {/* RIGHT: Sticky Sidebar */}
                    <aside aria-label="Quick links and navigation" style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                        {/* HS Code Finder CTA */}
                        <section aria-label="HS Code Finder" style={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            padding: "1.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                        }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.5rem" }}>
                                AI HS Code Finder
                            </h3>
                            <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
                                Don&apos;t know your HS code? Describe your product and our AI will classify it instantly.
                            </p>
                            <Link href="/hs-code-finder/" style={{
                                display: "block", textAlign: "center",
                                background: "var(--accent)", color: "#fff",
                                fontWeight: 600, padding: "0.85rem 1rem",
                                borderRadius: "8px", textDecoration: "none", fontSize: "0.95rem",
                            }}>
                                Find My HS Code →
                            </Link>
                        </section>

                        {/* Calculator CTA */}
                        <Link href="/calculate/" style={{
                            display: "block",
                            background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(59,130,246,0.05))",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            padding: "1.25rem",
                            textDecoration: "none",
                        }}>
                            <strong style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)", display: "block", marginBottom: "0.25rem" }}>
                                Landed Cost Calculator →
                            </strong>
                            <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
                                Know your HS code? Calculate total import duties, VAT, and fees.
                            </span>
                        </Link>

                        {/* Related Guides */}
                        <nav aria-label="Related Trade Topics" style={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            padding: "1.25rem",
                        }}>
                            <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "1rem" }}>
                                Related Guides
                            </h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                <li><Link href="/hs-code-finder/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>AI HS Code Finder</Link></li>
                                <li><Link href="/import-duty/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>What Is Import Duty?</Link></li>
                                <li><Link href="/tariff-rates/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Global Tariff Rates</Link></li>
                                <li><Link href="/customs-clearance/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Customs Clearance Guide</Link></li>
                                <li><Link href="/import-documents/" style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none" }}>Required Import Documents</Link></li>
                            </ul>
                        </nav>

                        {/* Official Resources */}
                        <nav aria-label="Official tariff resources" style={{
                            background: "rgba(34,197,94,0.04)",
                            border: "1px solid rgba(34,197,94,0.15)",
                            borderRadius: "12px",
                            padding: "1.25rem",
                        }}>
                            <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>
                                Official Lookup Tools
                            </h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <li><a href="https://www.wcoomd.org/en/topics/nomenclature/overview/what-is-the-harmonized-system.aspx" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>WCO Harmonized System ↗</a></li>
                                <li><a href="https://hts.usitc.gov/" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>USITC HTS Search ↗</a></li>
                                <li><a href="https://www.trade-tariff.service.gov.uk/" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>UK Trade Tariff ↗</a></li>
                                <li><a href="https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>EU TARIC Database ↗</a></li>
                                <li><a href="https://www.census.gov/foreign-trade/schedules/b/index.html" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>US Schedule B (Exports) ↗</a></li>
                            </ul>
                        </nav>

                        {/* Table of Contents */}
                        <nav aria-label="Table of contents" style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                            <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>
                                On This Page
                            </h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {sections.map((s, i) => (
                                    <li key={`toc-${i}`} style={{ marginBottom: "0.4rem" }}>
                                        <a href={`#${s.id}`} style={{ color: "var(--muted-foreground)", textDecoration: "none", fontSize: "0.85rem", lineHeight: 1.4, display: "block" }}>
                                            {s.heading}
                                        </a>
                                    </li>
                                ))}
                                <li style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
                                    <a href="#faq" style={{ color: "var(--foreground)", fontWeight: 500, textDecoration: "none", fontSize: "0.85rem" }}>FAQs</a>
                                </li>
                            </ul>
                        </nav>
                    </aside>
                </div>
            </main>
        </>
    );
}
