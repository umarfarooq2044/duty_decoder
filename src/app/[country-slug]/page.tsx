import { notFound } from "next/navigation";
import { COUNTRY_BY_SLUG, ALL_COUNTRY_SLUGS } from "@/lib/countries";
import { getServerSupabase } from "@/lib/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";

interface PageProps {
    params: Promise<{ "country-slug": string }>;
}

export async function generateStaticParams() {
    return ALL_COUNTRY_SLUGS.map(slug => ({ "country-slug": slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { "country-slug": slug } = await params;
    const country = COUNTRY_BY_SLUG[slug];
    if (!country) return {};

    const supabase = getServerSupabase();
    const { data } = await supabase
        .from("country_hubs")
        .select("hub_page")
        .eq("country_slug", slug)
        .maybeSingle();

    const hub = data?.hub_page as any;

    return {
        title: hub?.title || `Import Duty & Customs Guide for ${country.name} | 2026`,
        description: hub?.meta_description || `Complete 2026 guide to import duties, ${country.vatLabel}, HS codes, and customs clearance for ${country.name}.`,
        alternates: { canonical: `/${slug}/` },
        keywords: [
            `${country.name} import duty`,
            `${country.name} customs`,
            `import to ${country.name}`,
            `${country.vatLabel} rate ${country.name}`,
            "shipping customs fees",
        ],
        openGraph: {
            title: hub?.title || `Import Duty & Customs Guide for ${country.name} | 2026`,
            description: hub?.meta_description || `Complete 2026 guide to import duties, ${country.vatLabel}, HS codes, and customs clearance for ${country.name}.`,
            url: `/${slug}/`,
            type: "article",
        }
    };
}

export default async function CountryHubPage({ params }: PageProps) {
    const { "country-slug": slug } = await params;
    const country = COUNTRY_BY_SLUG[slug];
    if (!country) notFound();

    const supabase = getServerSupabase();
    const { data } = await supabase
        .from("country_hubs")
        .select("hub_page")
        .eq("country_slug", slug)
        .maybeSingle();

    const hub = (data?.hub_page || {}) as any;
    const rawSections: Array<{ id: string; heading: string; content: string }> = hub.sections || [];
    const rawFaqs: Array<{ question: string; answer: string }> = hub.faq || [];

    const sections = rawSections.filter((s, i, arr) => arr.findIndex(x => x.heading === s.heading) === i);
    const faqs = rawFaqs.filter((f, i, arr) => arr.findIndex(x => x.question === f.question) === i);

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
            { "@type": "ListItem", "position": 2, "name": country.name, "item": `${process.env.NEXT_PUBLIC_BASE_URL || "https://duty-decoder.com"}/${slug}` }
        ]
    };

    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": hub.seo_h1 || `Import Duty & Customs Guide for ${country.name}`,
        "description": hub.meta_description || `Everything you need to know about importing goods to ${country.name}: duty rates, ${country.vatLabel}, HS codes, and customs clearance.`,
        "author": { "@type": "Organization", "name": "DutyDecoder" },
        "publisher": { "@type": "Organization", "name": "DutyDecoder" },
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
                    background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(59,130,246,0.06))",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "clamp(1.5rem, 4vw, 2.5rem)",
                    marginBottom: "2rem",
                    position: "relative",
                    overflow: "hidden",
                }}>
                    <div aria-hidden="true" style={{
                        position: "absolute", top: "-60px", right: "-40px",
                        width: "200px", height: "200px",
                        background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
                        borderRadius: "50%", pointerEvents: "none",
                    }} />
                    <span style={{ fontSize: "0.75rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                        {country.region} • {country.code}
                    </span>
                    <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 800, margin: "0.5rem 0 0.6rem", color: "var(--foreground)", lineHeight: 1.3 }}>
                        {hub.seo_h1 || `Import Duty & Customs Guide for ${country.name}`}
                    </h1>
                    <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)", lineHeight: 1.65, margin: 0, maxWidth: "700px" }}>
                        {hub.meta_description || `Everything you need to know about importing goods to ${country.name}: duty rates, ${country.vatLabel}, HS codes, and customs clearance.`}
                    </p>

                    {/* Quick Stats Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", marginTop: "1.5rem" }} role="list" aria-label={`${country.name} import quick facts`}>
                        {[
                            { label: "Currency", value: country.currency, icon: "💱" },
                            { label: `${country.vatLabel} Rate`, value: `${country.vatRate}%`, icon: "📊" },
                            { label: "Duty Basis", value: "CIF Value", icon: "📦" },
                            { label: "Calculator", value: "Open →", icon: "🧮", link: `/${slug}/import-duty-calculator` },
                        ].map((item) => (
                            <div key={item.label} role="listitem" style={{
                                background: "rgba(255,255,255,0.05)",
                                backdropFilter: "blur(4px)",
                                border: "1px solid var(--border)",
                                borderRadius: "10px",
                                padding: "0.85rem 1rem",
                            }}>
                                <div style={{ fontSize: "0.7rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>
                                    <span aria-hidden="true">{item.icon}</span> {item.label}
                                </div>
                                {item.link ? (
                                    <Link href={item.link as any} style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--accent)", textDecoration: "none" }}>
                                        {item.value}
                                    </Link>
                                ) : (
                                    <strong style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--foreground)", display: "block" }}>{item.value}</strong>
                                )}
                            </div>
                        ))}
                    </div>
                </header>

                {/* ───── Two Column Layout ───── */}
                <div className="content-sidebar-grid" style={{ gap: "2rem" }}>

                    {/* LEFT: Content */}
                    <article aria-label={`${country.name} import guide content`}>
                        {sections.map((section, i) => (
                            <section key={`sec-${i}`} id={section.id} style={{
                                background: "var(--card)",
                                border: "1px solid var(--border)",
                                borderRadius: "12px",
                                padding: "1.5rem 1.75rem",
                                marginBottom: "1rem",
                            }}>
                                <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.6rem", color: "var(--foreground)" }}>
                                    {section.heading}
                                </h2>
                                <div
                                    style={{ color: "var(--muted-foreground)", lineHeight: 1.85, fontSize: "0.92rem" }}
                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                />
                            </section>
                        ))}

                        {/* FAQs */}
                        {faqs.length > 0 && (
                            <section id="faq" aria-label="Frequently asked questions" style={{
                                background: "var(--card)",
                                border: "1px solid var(--border)",
                                borderRadius: "12px",
                                padding: "1.5rem 1.75rem",
                                marginBottom: "1rem",
                            }}>
                                <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>
                                    Frequently Asked Questions
                                </h2>
                                {faqs.map((faq, i) => (
                                    <details key={`faq-${i}`} style={{
                                        padding: "0.85rem 0",
                                        borderBottom: i < faqs.length - 1 ? "1px solid var(--border)" : "none",
                                    }}>
                                        <summary style={{ fontWeight: 600, cursor: "pointer", color: "var(--foreground)", fontSize: "0.92rem" }}>
                                            {faq.question}
                                        </summary>
                                        <div style={{ marginTop: "0.65rem", color: "var(--muted-foreground)", lineHeight: 1.75, fontSize: "0.88rem" }}
                                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                                        />
                                    </details>
                                ))}
                            </section>
                        )}
                    </article>

                    {/* RIGHT: Sticky Sidebar */}
                    <aside aria-label="Quick links and navigation" style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "1rem" }}>

                        {/* CTA Card */}
                        <Link href={`/${slug}/import-duty-calculator`} aria-label={`Open ${country.name} import duty calculator`} style={{
                            display: "block",
                            background: "linear-gradient(135deg, var(--accent), #6366f1)",
                            borderRadius: "12px",
                            padding: "1.5rem",
                            textDecoration: "none",
                            boxShadow: "0 4px 20px rgba(99,102,241,0.25)",
                        }}>
                            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.35rem" }}>
                                <span aria-hidden="true">🧮</span> Free Calculator
                            </span>
                            <strong style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", display: "block", marginBottom: "0.35rem" }}>
                                Calculate Duty to {country.name}
                            </strong>
                            <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.75)", display: "block" }}>
                                Instant {country.vatLabel}, HS codes & landed cost →
                            </span>
                        </Link>

                        {/* Table of Contents */}
                        {sections.length > 0 && (
                            <nav aria-label="Table of contents" style={{
                                background: "var(--card)",
                                border: "1px solid var(--border)",
                                borderRadius: "12px",
                                padding: "1.25rem",
                            }}>
                                <h3 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>
                                    On This Page
                                </h3>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                    {sections.map((s, i) => (
                                        <li key={`toc-${i}`} style={{ marginBottom: "0.3rem" }}>
                                            <a href={`#${s.id}`} style={{ color: "var(--muted-foreground)", textDecoration: "none", fontSize: "0.82rem", lineHeight: 1.5 }}>
                                                {s.heading}
                                            </a>
                                        </li>
                                    ))}
                                    {faqs.length > 0 && (
                                        <li style={{ marginBottom: "0.3rem" }}>
                                            <a href="#faq" style={{ color: "var(--muted-foreground)", textDecoration: "none", fontSize: "0.82rem" }}>
                                                Frequently Asked Questions
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </nav>
                        )}

                        {/* More Guides */}
                        <nav aria-label={`More ${country.name} import guides`} style={{ padding: "0.5rem 0.25rem" }}>
                            <h3 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>
                                More {country.name} Guides
                            </h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                <li><Link href={`/${slug}/import-duty/` as any} style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>Import Duties</Link></li>
                                <li><Link href={`/${slug}/import-tax/` as any} style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>{country.vatLabel} on Imports</Link></li>
                                <li><Link href={`/${slug}/hs-code-lookup/` as any} style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>HS Code Lookup</Link></li>
                                <li><Link href={`/${slug}/duty-free-threshold/` as any} style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>De Minimis Threshold</Link></li>
                                <li><Link href={`/${slug}/customs-clearance/` as any} style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>Customs Clearance</Link></li>
                                <li><Link href={`/${slug}/import-restrictions/` as any} style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>Import Restrictions</Link></li>
                                <li><Link href={`/${slug}/import-documents/` as any} style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>Required Documents</Link></li>
                                <li><Link href={`/${slug}/shipping-customs-fees/` as any} style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>Shipping & Customs Fees</Link></li>
                            </ul>
                        </nav>

                        {/* Back to Home */}
                        <Link href="/" aria-label="Back to global calculator" style={{
                            display: "flex", alignItems: "center", gap: "0.5rem",
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            padding: "1rem 1.25rem",
                            textDecoration: "none",
                            fontSize: "0.85rem",
                            color: "var(--muted-foreground)",
                        }}>
                            ← Global Import Duty Calculator
                        </Link>
                    </aside>
                </div>
            </main>
        </>
    );
}
