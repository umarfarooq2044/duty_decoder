import { notFound } from "next/navigation";
import { COUNTRY_BY_SLUG } from "@/lib/countries";
import Link from "next/link";

interface SupportPageProps {
    slug: string;
    pageType: | "import_duty_page" | "import_tax_page" | "hs_code_page" | "threshold_page" | "clearance_page" | "restrictions_page" | "documents_page" | "shipping_fees_page";
    data: any;
}

export function CountrySupportPage({ slug, pageType, data }: SupportPageProps) {
    const country = COUNTRY_BY_SLUG[slug];
    if (!country || !data || !data.sections) notFound();

    const sections: Array<{ id: string; heading: string; content: string }> = data.sections || [];
    const faqs: Array<{ question: string; answer: string }> = data.faq || [];

    const uniqueSections = sections.filter((s, i, arr) => arr.findIndex(x => x.heading === s.heading) === i);
    const uniqueFaqs = faqs.filter((f, i, arr) => arr.findIndex(x => x.question === f.question) === i);

    const pageTitle = data.title?.split('|')[0]?.trim() || "Guide";

    const faqJsonLd = uniqueFaqs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": uniqueFaqs.map(f => ({
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
            { "@type": "ListItem", "position": 2, "name": country.name, "item": `${process.env.NEXT_PUBLIC_BASE_URL || "https://duty-decoder.com"}/${slug}` },
            { "@type": "ListItem", "position": 3, "name": pageTitle, "item": `${process.env.NEXT_PUBLIC_BASE_URL || "https://duty-decoder.com"}${data.url}` }
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

            <main style={{ maxWidth: "1100px", margin: "0 auto" }} role="main">
                {/* ───── Hero Banner ───── */}
                <header style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(59,130,246,0.04))",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "2rem 2.5rem",
                    marginBottom: "2rem",
                }}>
                    <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                        <Link href={`/${slug}/`} style={{ fontSize: "0.8rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
                            {country.name}
                        </Link>
                        <span aria-hidden="true" style={{ color: "var(--muted-foreground)", fontSize: "0.8rem" }}>›</span>
                        <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>{pageTitle}</span>
                    </nav>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 0.5rem", color: "var(--foreground)", lineHeight: 1.3 }}>
                        {data.seo_h1 || pageTitle}
                    </h1>
                    <p style={{ fontSize: "1rem", color: "var(--muted-foreground)", lineHeight: 1.6, margin: 0, maxWidth: "750px" }}>
                        {data.meta_description}
                    </p>
                </header>

                {/* ───── Two Column Layout ───── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "start" }}>

                    {/* LEFT: Content */}
                    <article aria-label={`${pageTitle} for ${country.name}`}>
                        {uniqueSections.map((section, i) => (
                            <section key={`sec-${i}`} id={section.id} style={{
                                marginBottom: "2.25rem",
                                paddingBottom: "2.25rem",
                                borderBottom: i < uniqueSections.length - 1 ? "1px solid var(--border)" : "none",
                            }}>
                                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.85rem", color: "var(--foreground)" }}>
                                    {section.heading}
                                </h2>
                                <div
                                    style={{ color: "var(--muted-foreground)", lineHeight: 1.85, fontSize: "1rem" }}
                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                />
                            </section>
                        ))}

                        {/* Mid-Content CTA to Calculator */}
                        <div role="banner" style={{
                            margin: "3rem 0",
                            background: "linear-gradient(135deg, var(--accent), #6366f1)",
                            borderRadius: "16px",
                            padding: "2rem",
                            textAlign: "center",
                            boxShadow: "0 10px 30px rgba(99,102,241,0.15)",
                        }}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", margin: "0 0 0.5rem" }}>
                                Calculate 2026 Landed Cost for {country.name}
                            </h2>
                            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.85)", margin: "0 0 1.5rem" }}>
                                Get instant estimates for duties, {country.vatLabel}, and customs fees.
                            </p>
                            <Link href={`/${slug}/import-duty-calculator`} aria-label={`Open ${country.name} import duty calculator`} style={{
                                display: "inline-block",
                                background: "#fff",
                                color: "var(--accent)",
                                fontWeight: 700,
                                padding: "0.85rem 2rem",
                                borderRadius: "8px",
                                textDecoration: "none",
                                fontSize: "1.05rem",
                            }}>
                                Open Free Calculator →
                            </Link>
                        </div>

                        {/* FAQs */}
                        {uniqueFaqs.length > 0 && (
                            <section id="faq" aria-label="Frequently asked questions" style={{ marginBottom: "3rem" }}>
                                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.25rem", color: "var(--foreground)" }}>
                                    Frequently Asked Questions
                                </h2>
                                {uniqueFaqs.map((faq, i) => (
                                    <details key={`faq-${i}`} style={{
                                        background: "var(--card)",
                                        padding: "1rem 1.25rem",
                                        borderRadius: "10px",
                                        border: "1px solid var(--border)",
                                        marginBottom: "0.75rem",
                                    }}>
                                        <summary style={{ fontWeight: 600, cursor: "pointer", color: "var(--foreground)", fontSize: "0.95rem" }}>
                                            {faq.question}
                                        </summary>
                                        <div style={{ marginTop: "0.75rem", color: "var(--muted-foreground)", lineHeight: 1.75, fontSize: "0.95rem" }}
                                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                                        />
                                    </details>
                                ))}
                            </section>
                        )}
                    </article>

                    {/* RIGHT: Sticky Sidebar */}
                    <aside aria-label="Quick links and navigation" style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "1rem" }}>

                        {/* Calculator Link */}
                        <section aria-label="Calculator" style={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            padding: "1.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                        }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.5rem" }}>
                                Full Calculator
                            </h3>
                            <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginBottom: "1rem", lineHeight: 1.5 }}>
                                Accurately estimate your 2026 import duties and taxes for {country.name}.
                            </p>
                            <Link href={`/${slug}/import-duty-calculator`} style={{
                                display: "block",
                                textAlign: "center",
                                background: "var(--accent)",
                                color: "#fff",
                                fontWeight: 600,
                                padding: "0.75rem 1rem",
                                borderRadius: "6px",
                                textDecoration: "none",
                                fontSize: "0.9rem",
                            }}>
                                Open Calculator
                            </Link>
                        </section>

                        {/* Table of Contents */}
                        {uniqueSections.length > 0 && (
                            <nav aria-label="Table of contents" style={{
                                background: "var(--card)",
                                border: "1px solid var(--border)",
                                borderRadius: "12px",
                                padding: "1.25rem",
                            }}>
                                <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>
                                    On This Page
                                </h3>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                    {uniqueSections.map((s, i) => (
                                        <li key={`toc-${i}`} style={{ marginBottom: "0.4rem" }}>
                                            <a href={`#${s.id}`} style={{ color: "var(--muted-foreground)", textDecoration: "none", fontSize: "0.85rem", lineHeight: 1.4, display: "block" }}>
                                                {s.heading}
                                            </a>
                                        </li>
                                    ))}
                                    {uniqueFaqs.length > 0 && (
                                        <li style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
                                            <a href="#faq" style={{ color: "var(--foreground)", fontWeight: 500, textDecoration: "none", fontSize: "0.85rem" }}>
                                                FAQs
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </nav>
                        )}

                        {/* Related Guides Links */}
                        <nav aria-label={`More ${country.name} guides`} style={{ padding: "0.5rem 0.25rem" }}>
                            <h3 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.5rem" }}>
                                More {country.name} Guides
                            </h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                <li><Link href={`/${slug}/import-duty` as any} style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>Import Duties</Link></li>
                                <li><Link href={`/${slug}/import-tax` as any} style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>{country.vatLabel} on Imports</Link></li>
                                <li><Link href={`/${slug}/hs-code-lookup` as any} style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>HS Code Lookup</Link></li>
                                <li><Link href={`/${slug}/customs-clearance` as any} style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>Customs Clearance</Link></li>
                            </ul>
                        </nav>
                    </aside>
                </div>
            </main>
        </>
    );
}
