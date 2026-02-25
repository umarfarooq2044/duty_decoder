import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSupabase } from "@/lib/supabase/server";

interface GlobalPillarPageProps {
    slug: string;
}

export async function GlobalPillarPage({ slug }: GlobalPillarPageProps) {
    const supabase = getServerSupabase();
    const { data } = await supabase
        .from("global_pillars")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

    if (!data) notFound();

    const sections: Array<{ id: string; heading: string; content: string }> = data.sections || [];
    const faqs: Array<{ question: string; answer: string }> = data.faq || [];
    const internalLinks: Array<{ url: string; text: string; type: string }> = data.internal_links || [];

    const countryHubLinks = internalLinks.filter(l => l.type === "country_hub");
    const otherPillarLinks = internalLinks.filter(l => l.type === "pillar");

    const faqJsonLd = faqs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer }
        }))
    } : null;

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": process.env.NEXT_PUBLIC_BASE_URL || "https://duty-decoder.com" },
            { "@type": "ListItem", "position": 2, "name": data.h1, "item": `${process.env.NEXT_PUBLIC_BASE_URL || "https://duty-decoder.com"}/${slug}` }
        ]
    };

    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": data.seo_title || data.h1,
        "description": data.meta_description,
        "author": { "@type": "Organization", "name": "Duty Decoder" },
        "publisher": { "@type": "Organization", "name": "Duty Decoder" },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${process.env.NEXT_PUBLIC_BASE_URL || "https://duty-decoder.com"}/${slug}`
        }
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

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
                        <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>{data.h1}</span>
                    </nav>
                    <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800, margin: "0 0 1rem", color: "var(--foreground)", lineHeight: 1.2 }}>
                        {data.h1}
                    </h1>
                    <p style={{ fontSize: "1.1rem", color: "var(--muted-foreground)", lineHeight: 1.6, margin: "0 auto", maxWidth: "800px" }}>
                        {data.meta_description}
                    </p>
                </header>

                {/* ───── Two Column Layout ───── */}
                <div className="content-sidebar-grid">

                    {/* LEFT: Content */}
                    <article aria-label={`${data.h1} content guide`}>
                        {sections.map((section, i) => (
                            <section key={`sec-${i}`} id={section.id} style={{
                                marginBottom: "2.5rem",
                                paddingBottom: "2.5rem",
                                borderBottom: i < sections.length - 1 ? "1px solid var(--border)" : "none",
                            }}>
                                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>
                                    {section.heading}
                                </h2>
                                <div
                                    style={{ color: "var(--muted-foreground)", lineHeight: 1.85, fontSize: "1.05rem" }}
                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                />
                            </section>
                        ))}

                        {/* Mid-Content CTA to Calculator */}
                        <div role="banner" style={{
                            margin: "3.5rem 0",
                            background: "linear-gradient(135deg, var(--accent), #6366f1)",
                            borderRadius: "16px",
                            padding: "2.5rem",
                            textAlign: "center",
                            boxShadow: "0 10px 30px rgba(99,102,241,0.15)",
                        }}>
                            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", margin: "0 0 0.75rem" }}>
                                Global Landed Cost Calculator
                            </h2>
                            <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.85)", margin: "0 0 1.5rem" }}>
                                Instantly calculate import duties, taxes, and customs fees for any route globally.
                            </p>
                            <Link href="/calculate/" aria-label="Open global landed cost calculator" style={{
                                display: "inline-block",
                                background: "#fff",
                                color: "var(--accent)",
                                fontWeight: 700,
                                padding: "1rem 2.5rem",
                                borderRadius: "8px",
                                textDecoration: "none",
                                fontSize: "1.1rem",
                            }}>
                                Calculate Now →
                            </Link>
                        </div>

                        {/* FAQs */}
                        {faqs.length > 0 && (
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
                        )}
                    </article>

                    {/* RIGHT: Sticky Sidebar */}
                    <aside aria-label="Global navigation and quick links" style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                        {/* Calculator CTA Card */}
                        <section aria-label="Calculator CTA" style={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            padding: "1.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                        }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.5rem" }}>
                                Find Your True Cost
                            </h3>
                            <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
                                Avoid surprise customs bills. Get an exact breakdown of duties, taxes, and fees.
                            </p>
                            <Link href="/calculate/" style={{
                                display: "block",
                                textAlign: "center",
                                background: "var(--accent)",
                                color: "#fff",
                                fontWeight: 600,
                                padding: "0.85rem 1rem",
                                borderRadius: "8px",
                                textDecoration: "none",
                                fontSize: "0.95rem",
                            }}>
                                Open Calculator →
                            </Link>
                        </section>

                        {/* Top Country Hubs */}
                        {countryHubLinks.length > 0 && (
                            <nav aria-label="Top Country Guides" style={{
                                background: "var(--card)",
                                border: "1px solid var(--border)",
                                borderRadius: "12px",
                                padding: "1.25rem",
                            }}>
                                <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "1rem" }}>
                                    Top Import Markets
                                </h3>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                    {countryHubLinks.map((link, i) => (
                                        <li key={`country-${i}`}>
                                            <Link href={link.url as any} style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                <span>{link.text.replace(' IMPORT GUIDE', '')} Guides</span>
                                                <span aria-hidden="true" style={{ fontSize: "0.75rem", opacity: 0.5 }}>→</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}

                        {/* Other Global Pillars */}
                        {otherPillarLinks.length > 0 && (
                            <nav aria-label="Related Topics" style={{ padding: "0.5rem 0.25rem" }}>
                                <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>
                                    Related Topics
                                </h3>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    {otherPillarLinks.map((link, i) => (
                                        <li key={`pillar-link-${i}`}>
                                            <Link href={link.url as any} style={{ fontSize: "0.9rem", color: "var(--foreground)", textDecoration: "none" }}>
                                                {link.text}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}

                        {/* Table of Contents */}
                        {sections.length > 0 && (
                            <nav aria-label="Table of contents" style={{ padding: "0.5rem 0.25rem", borderTop: "1px solid var(--border)" }}>
                                <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem", marginTop: "1rem" }}>
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
                                    {faqs.length > 0 && (
                                        <li style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
                                            <a href="#faq" style={{ color: "var(--foreground)", fontWeight: 500, textDecoration: "none", fontSize: "0.85rem" }}>
                                                FAQs
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </nav>
                        )}

                        {/* Official Sources — E-E-A-T Outbound Links */}
                        <nav aria-label="Official trade sources" style={{
                            background: "rgba(34,197,94,0.04)",
                            border: "1px solid rgba(34,197,94,0.15)",
                            borderRadius: "12px",
                            padding: "1.25rem",
                        }}>
                            <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>
                                Official Sources
                            </h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <li><a href="https://www.wcoomd.org/en/topics/nomenclature/overview/what-is-the-harmonized-system.aspx" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>WCO Harmonized System ↗</a></li>
                                <li><a href="https://hts.usitc.gov/" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>USITC Tariff Schedule ↗</a></li>
                                <li><a href="https://www.trade-tariff.service.gov.uk/" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>UK Global Tariff (HMRC) ↗</a></li>
                                <li><a href="https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>EU TARIC Database ↗</a></li>
                                <li><a href="https://www.cbp.gov/trade" target="_blank" rel="dofollow" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>U.S. CBP Trade ↗</a></li>
                            </ul>
                        </nav>
                    </aside>
                </div>
            </main>
        </>
    );
}
