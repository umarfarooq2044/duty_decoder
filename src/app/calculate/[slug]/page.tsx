import { notFound } from "next/navigation";
import { getCachedLandedCostBySlug, getCachedComplianceRules } from "@/lib/cache";
import { generateProductJsonLd, generateFaqJsonLd } from "@/lib/seo/json-ld";
import type { LandedCostBreakdown, CostLineItem } from "@/schemas/landed-cost";
import { TableOfContents } from "@/components/TableOfContents";
import { SidebarCalculator } from "@/components/calculator/SidebarCalculator";
import { DataIntegrityBadge } from "@/components/DataIntegrityBadge";
import { PrintReportButton } from "@/components/calculator/PrintReportButton";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{ slug: string }>;
}

// Safe country name lookup — never throws
function getCountryName(code: string | undefined): string {
    if (!code) return "Unknown";
    try {
        return new Intl.DisplayNames(['en'], { type: 'region' }).of(code.toUpperCase()) || code;
    } catch {
        return code;
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    try {
        const { slug } = await params;
        const data = await getCachedLandedCostBySlug(slug) as any;

        if (!data) return {};

        const originName = getCountryName(data.origin_country);
        const destName = getCountryName(data.destination_country);

        return {
            title: data.seo_title || `Import Duty & Landed Cost: ${data.product_description}`,
            description: data.seo_description || `Calculate landed cost and customs duty for importing ${data.product_description} from ${originName} to ${destName}.`,
            alternates: { canonical: `/calculate/${slug}/` },
            keywords: [
                `${data.product_description} import duty`,
                `HS code for ${data.product_description}`,
                `calculate duty from ${originName} to ${destName}`,
                `${destName} import tax`,
                "landed cost calculator"
            ],
            openGraph: {
                title: data.seo_title || `Import Duty & Landed Cost: ${data.product_description}`,
                description: data.seo_description || `Calculate landed cost and customs duty for importing ${data.product_description} from ${originName} to ${destName}.`,
                url: `/calculate/${slug}`,
                type: "article",
            }
        };
    } catch (err) {
        console.error("[generateMetadata] Error:", err);
        return {};
    }
}

export default async function CalculatePage({ params }: PageProps) {
    const { slug } = await params;

    const data = await getCachedLandedCostBySlug(slug);
    if (!data) notFound();

    const calculation = data as {
        id: string;
        product_description: string;
        destination_country: string;
        origin_country: string;
        calculation_json: LandedCostBreakdown;
        slug: string;
        created_at: string;
        seo_title?: string;
        seo_description?: string;
        seo_h1?: string;
        seo_h2_intent?: string;
        seo_h3_technical?: string;
        seo_blueprint?: { primary_keyword?: string; high_intent_keywords?: string[]; lsi_terms?: string[]; search_intent_questions?: string[]; tax_exemptions?: string[] };
        needs_human_review?: boolean;
        market_insight?: string;
        semantic_h2_problem?: string;
        semantic_h2_solution?: string;
        faqs_json?: Array<{ question: string, answer: string }>;
        hts_codes?: { hts_code: string; description: string; country_code: string };
    };

    const breakdown = calculation.calculation_json;
    const rawHts = calculation.hts_codes;
    const joinedHts = Array.isArray(rawHts) ? rawHts[0] : rawHts;

    // Fallback: if the foreign-key join to hts_codes returned null,
    // extract the HS code from calculation_json.raw.htsId (present on most rows)
    const rawCalcJson = breakdown as any;
    const hts = joinedHts || (rawCalcJson?.raw?.htsId ? {
        hts_code: rawCalcJson.raw.htsId,
        description: calculation.product_description,
        country_code: calculation.destination_country,
    } : null);

    // Also expose the customsDuty rate from the stored breakdown for HS code section
    const dutyRate = (breakdown as any)?.customsDuty?.rate || '';

    // Get disclaimer
    const disclaimerRules = await getCachedComplianceRules(calculation.destination_country, "disclaimer");
    const disclaimer = disclaimerRules.length > 0
        ? ((disclaimerRules[0]?.rule_value as { text?: string })?.text ?? "Estimates are for informational purposes only.")
        : "Estimates are for informational purposes only.";

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://duty-decoder.com";
    const canonicalUrl = `${baseUrl}/calculate/${slug}/`;

    // JSON-LD
    const productJsonLd = hts
        ? generateProductJsonLd({
            name: calculation.product_description,
            description: hts.description,
            htsCode: hts.hts_code,
            countryCode: hts.country_code,
            url: canonicalUrl,
            keywords: calculation.seo_blueprint?.high_intent_keywords,
        })
        : null;

    // Use the AI-generated FAQs if available, otherwise fallback to standard generated ones
    let faqJsonLd = null;

    if (calculation.faqs_json && calculation.faqs_json.length > 0) {
        faqJsonLd = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": calculation.faqs_json.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        };
    } else if (hts) {
        // Fallback to legacy generator
        faqJsonLd = generateFaqJsonLd({
            productDescription: calculation.product_description,
            htsCode: hts.hts_code,
            countryCode: calculation.destination_country,
            breakdown,
            disclaimer,
        });
    }

    const originLabel = getCountryName(calculation.origin_country);
    const countryLabel = getCountryName(calculation.destination_country);

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": "Calculators", "item": `${baseUrl}/calculate` },
            { "@type": "ListItem", "position": 3, "name": countryLabel, "item": `${baseUrl}/${calculation.destination_country?.toLowerCase()}` },
            { "@type": "ListItem", "position": 4, "name": calculation.product_description, "item": canonicalUrl }
        ]
    };

    return (
        <div className="calculate-page-wrapper">
            {/* JSON-LD Structured Data */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            {productJsonLd ? (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
                />
            ) : null}
            {faqJsonLd ? (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            ) : null}

            <main className="calculate-page" style={{ padding: "0" }}>
                <div className="calculate-container" style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "clamp(1rem, 3vw, 2rem) clamp(0.75rem, 2vw, 1.5rem) 4rem",
                }}>

                    {/* ─── Header: H1 FIRST ─── */}
                    <header className="calculate-header" style={{ marginBottom: "2rem", textAlign: "left" }}>
                        <DataIntegrityBadge countryLabel={countryLabel} />

                        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", lineHeight: "1.25", color: "var(--foreground)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 0.75rem" }}>
                            {calculation.seo_h1 || `Import Duty & Landed Cost for ${calculation.product_description} from ${originLabel} to ${countryLabel}`}
                        </h1>
                        <p className="calculate-subtitle" style={{ fontSize: "clamp(0.9rem, 2vw, 1.1rem)", marginTop: "0.5rem", maxWidth: "700px" }}>
                            Full 2026 tariff breakdown, customs duty calculations, and compliance alerts for importing into {countryLabel}.
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
                            {hts && (
                                <div className="hts-badge">
                                    <span className="hts-label">HTS Code</span>
                                    <span className="hts-code">{hts.hts_code}</span>
                                </div>
                            )}
                            <PrintReportButton />
                        </div>
                    </header>

                    {/* ─── 2-Column Grid: Main + Sidebar ─── */}
                    <div className="report-grid">
                        <div>

                            {/* Semantic H2 Problem (SEO Injection) */}
                            {calculation.semantic_h2_problem && (
                                <section className="semantic-content-section glass-panel" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
                                    <h2 style={{ fontSize: "1.1rem", color: "var(--accent)", marginBottom: "0.75rem", fontWeight: 700 }}>
                                        Why Customs Classification Matters for {calculation.product_description}
                                    </h2>
                                    <div style={{ color: "var(--muted-foreground)", lineHeight: "1.7", fontSize: "0.88rem", fontWeight: 400 }} dangerouslySetInnerHTML={{ __html: calculation.semantic_h2_problem.replace(/\n\n/g, '<br/><br/>') }} />
                                </section>
                            )}

                            {/* Cost Breakdown Table */}
                            <section className="breakdown-section" style={{ marginTop: "2rem" }}>
                                <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "var(--accent)" }}>
                                    Cost Breakdown
                                </h2>
                                <table className="breakdown-table">
                                    <thead>
                                        <tr>
                                            <th>Component</th>
                                            <th>Rate</th>
                                            <th className="amount-col">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <CostRow item={breakdown.productValue} />
                                        <CostRow item={breakdown.shippingCost} />
                                        <CostRow item={breakdown.insuranceCost} />
                                        <CostRow item={breakdown.cifValue} isSubtotal />
                                        <CostRow item={breakdown.customsDuty} />
                                        {breakdown.additionalDuties.map((item, i) => (
                                            <CostRow key={`add-${i}`} item={item} />
                                        ))}
                                        {breakdown.processingFees.map((item, i) => (
                                            <CostRow key={`fee-${i}`} item={item} />
                                        ))}
                                        {breakdown.nationalHandling && (
                                            <CostRow item={breakdown.nationalHandling} />
                                        )}
                                        <CostRow item={breakdown.vatGst} />
                                        <CostRow item={breakdown.totalLandedCost} isTotal />
                                    </tbody>
                                </table>
                            </section>

                            {/* Semantic H2 Solution (SEO Injection) */}
                            {calculation.semantic_h2_solution && (
                                <section className="semantic-content-section glass-panel" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
                                    <h2 style={{ fontSize: "1.1rem", color: "var(--accent)", marginBottom: "0.75rem", fontWeight: 700 }}>
                                        Step-by-Step Import & Compliance Guide
                                    </h2>
                                    <div style={{ color: "var(--muted-foreground)", lineHeight: "1.7", fontSize: "0.88rem", fontWeight: 400 }} dangerouslySetInnerHTML={{ __html: calculation.semantic_h2_solution.replace(/\n\n/g, '<br/><br/>') }} />
                                </section>
                            )}

                            {/* H2 Intent Section (Research-Driven) */}
                            {calculation.seo_h2_intent && (
                                <section className="semantic-content-section glass-panel" style={{ padding: "2rem", marginBottom: "3rem" }}>
                                    <h2 style={{ fontSize: "1.2rem", color: "var(--accent)", marginBottom: "1rem" }}>
                                        {calculation.seo_h2_intent}
                                    </h2>
                                    <p style={{ color: "var(--foreground)", lineHeight: "1.8", fontSize: "0.95rem" }}>
                                        When importing <strong>{calculation.product_description}</strong> from {originLabel} to {countryLabel}, the applicable customs duty rate is <strong>{dutyRate || 'the standard rate'}</strong> on the CIF value (Cost + Insurance + Freight).
                                        {breakdown.vatGst?.rate ? ` Additionally, a VAT/GST of ${breakdown.vatGst.rate} is applied on the dutiable value.` : ''}
                                        {' '}The total landed cost depends on your specific product value, shipping method, and insurance — use the calculator above to get an exact breakdown for your shipment.
                                    </p>
                                    <p style={{ color: "var(--muted-foreground)", lineHeight: "1.8", fontSize: "0.9rem", marginTop: "0.75rem" }}>
                                        These rates are based on 2026 tariff schedules and may vary depending on the precise HS code finalization by customs and any applicable trade agreements between {originLabel} and {countryLabel}.
                                    </p>
                                </section>
                            )}

                            {/* H3 Technical Compliance Breakdown (Research-Driven) */}
                            {calculation.seo_h3_technical && (
                                <section className="semantic-content-section glass-panel" style={{ padding: "2rem", marginBottom: "3rem", borderLeft: "3px solid var(--color-success)" }}>
                                    <h3 style={{ fontSize: "1.1rem", color: "var(--color-success)", marginBottom: "1rem" }}>
                                        {calculation.seo_h3_technical}
                                    </h3>
                                    <p style={{ color: "var(--foreground)", lineHeight: "1.8", fontSize: "0.9rem" }}>
                                        <strong>{calculation.product_description}</strong> is typically classified under HS Code <strong>{hts?.hts_code || 'various classifications'}</strong> when imported into {countryLabel}.
                                        At this classification, the customs duty rate is <strong>{dutyRate || 'the applicable rate'}</strong>.
                                        Accurate classification is critical — ensure your commercial invoice and packing list explicitly reference this HS code.
                                    </p>
                                    <p style={{ color: "var(--muted-foreground)", lineHeight: "1.8", fontSize: "0.9rem", marginTop: "0.75rem" }}>
                                        Misclassification can result in shipment delays, penalties, or overpayment of duties. If trade agreements exist between {originLabel} and {countryLabel}, a certificate of origin may qualify your goods for preferential (reduced) duty rates.
                                    </p>
                                </section>
                            )}

                            {/* De Minimis Info */}
                            {breakdown.deMinimisDetails && (
                                <section className="de-minimis-section">
                                    <h3>De Minimis Status</h3>
                                    <p className={breakdown.deMinimisApplied ? "exempt" : "not-exempt"}>
                                        {breakdown.deMinimisApplied ? "✅ Exemption Applied" : "❌ No Exemption"}
                                    </p>
                                    <p className="de-minimis-detail">{breakdown.deMinimisDetails}</p>
                                </section>
                            )}

                            {/* Exchange Rate */}
                            {breakdown.exchangeRate && (
                                <p className="exchange-rate">
                                    Exchange Rate: {breakdown.exchangeRate}
                                </p>
                            )}

                            {/* Disclaimer */}
                            <footer className="disclaimer">
                                <p>{disclaimer}</p>
                                <time dateTime={breakdown.calculatedAt}>
                                    Calculated: {new Date(breakdown.calculatedAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </time>
                            </footer>

                            {/* SGE-Shield Section */}
                            {calculation.market_insight && (
                                <aside className="compliance-insight glass-panel" style={{ marginTop: "3rem" }}>
                                    <h2 style={{ fontSize: "1.25rem", color: "var(--accent)", marginBottom: "1rem" }}>
                                        🛡️ 2026 Import Compliance Insights
                                    </h2>
                                    <p className="insight-text">{calculation.market_insight}</p>
                                </aside>
                            )}

                            {/* Visible FAQs */}
                            {breakdown && calculation && (
                                <section className="faq-section" style={{ marginTop: "4rem", marginBottom: "2rem" }}>
                                    <h2 style={{ fontSize: "1.5rem", color: "var(--foreground)", marginBottom: "2rem" }}>
                                        Frequently Asked Questions
                                    </h2>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                        {calculation.faqs_json && calculation.faqs_json.length > 0 ? (
                                            calculation.faqs_json.map((faq, index) => (
                                                <div key={index} className="faq-box glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius)" }}>
                                                    <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{faq.question}</h3>
                                                    <div style={{ color: "var(--muted-foreground)", lineHeight: "1.6" }} dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                                </div>
                                            ))
                                        ) : hts ? (
                                            <>
                                                <div className="faq-box glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius)" }}>
                                                    <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                                                        What is the HTS code for {calculation?.product_description} importing to {countryLabel}?
                                                    </h3>
                                                    <p style={{ color: "var(--muted-foreground)", lineHeight: "1.6" }}>
                                                        The most likely HTS/commodity code is <strong>{hts?.hts_code}</strong>. This classification determines the applicable customs duty rate for imports into {countryLabel}.
                                                    </p>
                                                </div>
                                                <div className="faq-box glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius)" }}>
                                                    <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                                                        What is the total landed cost for {calculation.product_description} shipped to {countryLabel}?
                                                    </h3>
                                                    <p style={{ color: "var(--muted-foreground)", lineHeight: "1.6" }}>
                                                        The estimated total landed cost is <strong>{breakdown.totalLandedCost.amount} {breakdown.totalLandedCost.currency}</strong>, including customs duty of {breakdown.customsDuty.amount} {breakdown.customsDuty.currency} and VAT/GST of {breakdown.vatGst.amount} {breakdown.vatGst.currency}.
                                                    </p>
                                                </div>
                                                <div className="faq-box glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius)" }}>
                                                    <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                                                        What customs duties apply to HTS code {hts?.hts_code}?
                                                    </h3>
                                                    <p style={{ color: "var(--muted-foreground)", lineHeight: "1.6" }}>
                                                        The customs duty for HTS {hts?.hts_code} is <strong>{breakdown?.customsDuty?.rate ?? "variable"}</strong>. {breakdown?.deMinimisApplied ? "De minimis exemption was applied. " : ""}{breakdown?.deMinimisDetails ?? ""}
                                                    </p>
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                </section>
                            )}
                        </div>

                        <aside className="report-sidebar">
                            <div style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                <TableOfContents />
                                <SidebarCalculator
                                    initialData={breakdown}
                                    exemptions={calculation.seo_blueprint?.tax_exemptions}
                                    destinationCountry={calculation.destination_country}
                                />
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}

// ============================================================
// Cost Row Component
// ============================================================

function CostRow({
    item,
    isSubtotal = false,
    isTotal = false,
}: {
    item: CostLineItem;
    isSubtotal?: boolean;
    isTotal?: boolean;
}) {
    const className = isTotal ? "total-row" : isSubtotal ? "subtotal-row" : "";
    return (
        <tr className={className}>
            <td>
                {item.label}
                {item.notes && <span className="cost-note">{item.notes}</span>}
            </td>
            <td className="rate-col">{item.rate ?? "—"}</td>
            <td className="amount-col">
                {item.currency} {item.amount}
            </td>
        </tr>
    );
}
