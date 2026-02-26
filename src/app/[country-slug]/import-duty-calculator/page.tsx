import { notFound } from "next/navigation";
import { COUNTRY_BY_SLUG, ALL_COUNTRY_SLUGS } from "@/lib/countries";
import { getServerSupabase } from "@/lib/supabase/server";
import { CountryCalculatorForm } from "@/components/calculator/CountryCalculatorForm";
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
        .select("calculator_page")
        .eq("country_slug", slug)
        .maybeSingle();

    const calc = data?.calculator_page as any;

    return {
        title: calc?.title || `${country.name} Import Duty Calculator — Free 2026 Rates & Landed Cost`,
        description: calc?.meta_description || `Calculate exact 2026 import duties, ${country.vatLabel}, customs tariffs, and total landed costs for ${country.name}. AI-powered HS code classification with real-time ${country.currency} conversion.`,
        alternates: { canonical: `/${slug}/import-duty-calculator/` },
        keywords: [
            `${country.name} import duty calculator`,
            `calculate customs duty ${country.name}`,
            `${country.name} landed cost calculator`,
            `import tax ${country.name}`,
            `${country.vatLabel} calculator ${country.name}`,
            `${country.name} tariff calculator 2026`,
            `HS code ${country.name}`,
            `customs fees ${country.name}`,
        ],
        openGraph: {
            title: calc?.title || `${country.name} Import Duty Calculator — Free 2026 Rates`,
            description: calc?.meta_description || `Calculate 2026 import duties, ${country.vatLabel}, and landed costs for ${country.name}. Free AI-powered tariff classification.`,
            url: `/${slug}/import-duty-calculator`,
            type: "website",
        }
    };
}

// ============================================================
// Built-in fallback SEO content for all countries
// Renders when Supabase calculator_page has no sections
// ============================================================

function getFallbackSections(countryName: string, vatLabel: string, vatRate: number, currency: string, code: string) {
    return [
        {
            id: "how-it-works",
            heading: `How the ${countryName} Import Duty Calculator Works`,
            content: `<p>Our <strong>${countryName} import duty calculator</strong> uses AI-powered HS code classification to determine the exact tariff rate for your product. Simply enter a product description, and the system will:</p>
<p><strong>1. Classify your product</strong> — Our AI analyzes your description and matches it to the correct Harmonized System (HS) code used by ${countryName} customs authorities.</p>
<p><strong>2. Look up the duty rate</strong> — Once classified, the calculator retrieves the current 2026 MFN (Most Favoured Nation) duty rate from ${countryName}'s tariff schedule.</p>
<p><strong>3. Calculate your total landed cost</strong> — The calculator computes customs duty, ${vatLabel}${vatRate > 0 ? ` (${vatRate}%)` : ""}, processing fees, and any additional charges to give you the <strong>total cost of importing</strong> your goods to ${countryName}.</p>`
        },
        {
            id: "what-is-landed-cost",
            heading: `Understanding Landed Cost for ${countryName} Imports`,
            content: `<p><strong>Landed cost</strong> is the total price of a product once it arrives at the buyer's door in ${countryName}. It includes the original product cost plus all expenses incurred during shipping, customs clearance, and delivery.</p>
<p>The key components of landed cost for ${countryName} are:</p>
<table><thead><tr><th>Component</th><th>Description</th></tr></thead><tbody>
<tr><td><strong>Product Value</strong></td><td>FOB price of the goods</td></tr>
<tr><td><strong>Shipping</strong></td><td>Freight cost to ${countryName}</td></tr>
<tr><td><strong>Insurance</strong></td><td>Cargo insurance during transit</td></tr>
<tr><td><strong>CIF Value</strong></td><td>Product + Shipping + Insurance (duty base)</td></tr>
<tr><td><strong>Customs Duty</strong></td><td>Tariff applied based on HS code classification</td></tr>
<tr><td><strong>${vatLabel}</strong></td><td>${vatRate > 0 ? `${vatRate}% applied on CIF + Duty` : "Not applicable / varies by state"}</td></tr>
<tr><td><strong>Total Landed Cost</strong></td><td>Sum of all components above</td></tr>
</tbody></table>
<p>In ${countryName}, customs duty is typically assessed on the <strong>CIF value</strong> (Cost, Insurance, and Freight). The ${vatLabel} is then calculated on the combined CIF value plus customs duty.</p>`
        },
        {
            id: "duty-rates",
            heading: `${countryName} Import Duty Rates in 2026`,
            content: `<p>${countryName} applies <strong>ad valorem duty rates</strong> (percentage-based) to most imported goods. The rate depends on the product's HS code classification and the country of origin.</p>
<p>Key facts about ${countryName} duty rates:</p>
<p>• <strong>MFN rates</strong> apply to imports from WTO member countries without a preferential trade agreement<br/>
• <strong>Preferential rates</strong> may apply if ${countryName} has a Free Trade Agreement (FTA) with the exporting country<br/>
• <strong>Zero-duty</strong> applies to certain goods under special programs or trade agreements<br/>
• Rates range from <strong>0% to over 30%</strong> depending on the product category</p>
<p>Common product categories and typical ${countryName} duty rate ranges:</p>
<table><thead><tr><th>Product Category</th><th>Typical Duty Range</th></tr></thead><tbody>
<tr><td>Electronics & Machinery</td><td>0% – 8%</td></tr>
<tr><td>Textiles & Apparel</td><td>8% – 25%</td></tr>
<tr><td>Food & Agriculture</td><td>5% – 30%</td></tr>
<tr><td>Chemicals</td><td>0% – 12%</td></tr>
<tr><td>Vehicles & Parts</td><td>2.5% – 25%</td></tr>
<tr><td>Footwear</td><td>5% – 20%</td></tr>
</tbody></table>`
        },
        {
            id: "vat-gst",
            heading: `${vatLabel} on Imports to ${countryName}`,
            content: vatRate > 0
                ? `<p>${countryName} charges <strong>${vatLabel} at ${vatRate}%</strong> on imported goods. The ${vatLabel} is calculated on the <strong>assessable value</strong>, which equals: CIF Value + Customs Duty + Any Additional Duties.</p>
<p>This means ${vatLabel} is charged not only on the product value, but also <strong>on the duty itself</strong>. For high-duty products, this can significantly increase the total import cost.</p>
<p><strong>Example:</strong> If you import a $1,000 product to ${countryName} with 10% customs duty:</p>
<table><thead><tr><th>Component</th><th>Amount (${currency})</th></tr></thead><tbody>
<tr><td>CIF Value</td><td>$1,000</td></tr>
<tr><td>Customs Duty (10%)</td><td>$100</td></tr>
<tr><td>${vatLabel} Base</td><td>$1,100</td></tr>
<tr><td>${vatLabel} (${vatRate}%)</td><td>$${(1100 * vatRate / 100).toFixed(0)}</td></tr>
<tr><td><strong>Total Landed Cost</strong></td><td><strong>$${(1100 + 1100 * vatRate / 100).toFixed(0)}</strong></td></tr>
</tbody></table>`
                : `<p>${countryName} does not apply a standard national ${vatLabel} to imported goods at the federal level. However, individual states or provinces may apply their own sales taxes or consumption taxes at varying rates.</p>
<p>Always check the specific local tax requirements for your destination within ${countryName}, as additional state-level taxes may apply after customs clearance.</p>`
        },
        {
            id: "documents-needed",
            heading: `Documents Required for ${countryName} Customs Clearance`,
            content: `<p>To successfully clear customs in ${countryName}, you'll typically need the following documents:</p>
<p><strong>Core Documents:</strong></p>
<p>• <strong>Commercial Invoice</strong> — Issued by the seller, showing product description, quantity, value, and Incoterms<br/>
• <strong>Bill of Lading / Airway Bill</strong> — Transport document proving shipment ownership<br/>
• <strong>Packing List</strong> — Detailed list of package contents, weights, and dimensions<br/>
• <strong>Certificate of Origin</strong> — Proves where goods were manufactured (required for FTA preferential rates)<br/>
• <strong>Customs Declaration</strong> — Official form filed with ${countryName} customs authorities</p>
<p><strong>Additional Documents (when applicable):</strong></p>
<p>• Import License — Required for restricted goods (pharmaceuticals, chemicals, firearms)<br/>
• Phytosanitary Certificate — Required for food and agricultural products<br/>
• Conformity Certificate — Required for electronics and safety-regulated products<br/>
• Insurance Certificate — Proof of cargo insurance</p>`
        },
        {
            id: "tips-reduce-costs",
            heading: `Tips to Reduce Import Costs to ${countryName}`,
            content: `<p>There are several legal strategies to minimize your total landed cost when importing to ${countryName}:</p>
<p><strong>1. Accurate HS Code Classification</strong> — Ensure your product is classified under the correct HS code. Misclassification can result in overpaying duties or facing penalties. Our calculator uses AI to find the optimal classification.</p>
<p><strong>2. Leverage Free Trade Agreements</strong> — If your goods originate from a country with an FTA with ${countryName}, you may qualify for reduced or zero duty rates. Always obtain a Certificate of Origin.</p>
<p><strong>3. Use Bonded Warehouses</strong> — Store goods in bonded facilities to defer duty payment until goods enter domestic commerce. Useful for re-export or distribution operations.</p>
<p><strong>4. Accurate Valuation</strong> — Report the correct transaction value. Over-declaring increases duty; under-declaring risks fines and seizure.</p>
<p><strong>5. Consolidate Shipments</strong> — Combining multiple orders into one shipment can reduce per-unit processing fees and shipping costs.</p>
<p><strong>6. Check De Minimis Thresholds</strong> — Low-value shipments may be exempt from duties. Check ${countryName}'s current de minimis threshold before importing.</p>`
        },
    ];
}

function getFallbackFaqs(countryName: string, vatLabel: string, vatRate: number, currency: string) {
    return [
        {
            question: `How do I calculate import duty for ${countryName}?`,
            answer: `Enter your product description, origin country, and product value in the calculator above. Our AI will classify the product under the correct HS code, look up the ${countryName} duty rate, and calculate the total landed cost including customs duty, ${vatLabel}, and processing fees.`
        },
        {
            question: `What is the ${vatLabel} rate on imports to ${countryName}?`,
            answer: vatRate > 0
                ? `${countryName} applies ${vatLabel} at ${vatRate}% on imported goods. This is calculated on the CIF value plus customs duty, meaning you pay ${vatLabel} on the duty amount itself.`
                : `${countryName} does not have a standard national import ${vatLabel}. However, state or regional taxes may apply depending on the destination.`
        },
        {
            question: `What documents do I need to import goods to ${countryName}?`,
            answer: `The core documents required for ${countryName} customs clearance are: Commercial Invoice, Bill of Lading or Airway Bill, Packing List, Certificate of Origin (if claiming preferential rates), and the Customs Declaration form.`
        },
        {
            question: `How long does customs clearance take in ${countryName}?`,
            answer: `Standard customs clearance in ${countryName} typically takes 1-3 business days for straightforward shipments. However, inspections, missing documents, or restricted goods can extend this to 5-10 days. Pre-filing declarations electronically can speed up the process.`
        },
        {
            question: `Are there duty-free thresholds for ${countryName}?`,
            answer: `Yes, most countries including ${countryName} have a de minimis threshold below which goods are exempt from customs duties. The exact threshold varies — use our calculator to check whether your shipment qualifies for duty exemption.`
        },
    ];
}

export default async function CountryCalculatorPage({ params }: PageProps) {
    const { "country-slug": slug } = await params;
    const country = COUNTRY_BY_SLUG[slug];
    if (!country) notFound();

    const supabase = getServerSupabase();
    const { data } = await supabase
        .from("country_hubs")
        .select("calculator_page")
        .eq("country_slug", slug)
        .maybeSingle();

    const calc = (data?.calculator_page || {}) as any;

    // Use Supabase content if available, otherwise use rich embedded fallback
    const dbSections: Array<{ id: string; heading: string; content: string }> = calc.sections || [];
    const dbFaqs: Array<{ question: string; answer: string }> = calc.faq || [];

    const fallbackSections = getFallbackSections(country.name, country.vatLabel, country.vatRate, country.currency, country.code);
    const fallbackFaqs = getFallbackFaqs(country.name, country.vatLabel, country.vatRate, country.currency);

    // Use DB content if it has at least 2 sections, otherwise use fallback
    const sections = dbSections.length >= 2 ? dbSections : fallbackSections;
    const faqs = dbFaqs.length >= 2 ? dbFaqs : fallbackFaqs;

    const uniqueSections = sections.filter((s, i, arr) => arr.findIndex(x => x.heading === s.heading) === i);
    const uniqueFaqs = faqs.filter((f, i, arr) => arr.findIndex(x => x.question === f.question) === i);

    // Structured data
    const calculatorJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": `${country.name} Import Duty Calculator`,
        "url": `${process.env.NEXT_PUBLIC_BASE_URL || "https://duty-decoder.com"}/${slug}/import-duty-calculator`,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": `Calculate exact 2026 import duties, ${country.vatLabel}, and total landed costs for goods imported to ${country.name}.`,
        "featureList": [
            "AI HS Code Classification",
            `${country.name} Specific Tariff Data`,
            `Auto-calculated ${country.vatLabel}`,
            "De Minimis Threshold Checks",
            "Real-time Currency Conversion"
        ],
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
    };

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
            { "@type": "ListItem", "position": 1, "name": "Home", "item": `${process.env.NEXT_PUBLIC_BASE_URL || "https://duty-decoder.com"}` },
            { "@type": "ListItem", "position": 2, "name": country.name, "item": `${process.env.NEXT_PUBLIC_BASE_URL || "https://duty-decoder.com"}/${slug}` },
            { "@type": "ListItem", "position": 3, "name": "Import Duty Calculator" },
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorJsonLd) }} />
            {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

            <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1rem" }} role="main">

                {/* Hero Banner */}
                <header className="calc-page-hero">
                    <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                        <Link href="/" style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", textDecoration: "none" }}>
                            Home
                        </Link>
                        <span aria-hidden="true" style={{ color: "var(--muted-foreground)", fontSize: "0.8rem" }}>›</span>
                        <Link href={`/${slug}/` as any} style={{ fontSize: "0.8rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
                            {country.name}
                        </Link>
                        <span aria-hidden="true" style={{ color: "var(--muted-foreground)", fontSize: "0.8rem" }}>›</span>
                        <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>Import Duty Calculator</span>
                    </nav>
                    <h1 style={{ fontSize: "1.85rem", fontWeight: 800, margin: "0 0 0.5rem", color: "var(--foreground)", lineHeight: 1.3 }}>
                        {calc.seo_h1 || `${country.name} Import Duty Calculator`}
                    </h1>
                    <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)", lineHeight: 1.6, margin: 0, maxWidth: "700px" }}>
                        {calc.meta_description || `Calculate exact 2026 import duties, ${country.vatLabel}${country.vatRate > 0 ? ` (${country.vatRate}%)` : ""}, and total landed costs for goods imported to ${country.name}. AI-powered HS code classification with real-time ${country.currency} conversion.`}
                    </p>
                </header>

                {/* Main Grid: Calculator + Sidebar */}
                <div className="content-sidebar-grid">

                    {/* LEFT: Calculator Card */}
                    <section aria-label={`${country.name} duty calculator`} style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "16px",
                        padding: "2rem",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                            <span aria-hidden="true" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                            <span style={{ fontSize: "0.75rem", color: "#22c55e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Live Calculator
                            </span>
                        </div>
                        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0.25rem 0 0.15rem", color: "var(--foreground)" }}>
                            Calculate Import Duty to {country.name}
                        </h2>
                        <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", margin: "0 0 1.25rem" }}>
                            Destination auto-set to {country.name} ({country.code}) • {country.currency}
                        </p>
                        <CountryCalculatorForm
                            defaultDestination={country.code}
                            countryName={country.name}
                        />
                    </section>

                    {/* RIGHT: Sidebar */}
                    <aside aria-label="Quick reference and navigation" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                        {/* Country Quick Facts */}
                        <section aria-label={`${country.name} quick facts`} className="calc-sidebar-card">
                            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "1rem" }}>
                                {country.name} Quick Facts
                            </h3>
                            <dl style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: 0 }}>
                                {[
                                    { label: "Currency", value: country.currency },
                                    { label: country.vatLabel + " Rate", value: country.vatRate > 0 ? country.vatRate + "%" : "N/A" },
                                    { label: "Duty Basis", value: "CIF Value" },
                                    { label: "HS System", value: "Harmonized (6-digit)" },
                                    { label: "Region", value: country.region },
                                ].map((item) => (
                                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <dt style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>{item.label}</dt>
                                        <dd style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent)", margin: 0 }}>{item.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </section>

                        {/* Hub Link */}
                        <Link href={`/${slug}/` as any} aria-label={`${country.name} full import guide`} style={{
                            display: "block",
                            background: "linear-gradient(135deg, var(--accent), #6366f1)",
                            borderRadius: "12px",
                            padding: "1.25rem",
                            textDecoration: "none",
                        }}>
                            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>Full Country Guide</span>
                            <strong style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginTop: "0.25rem", display: "block" }}>
                                {country.name} Import Duty Guide →
                            </strong>
                            <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", marginTop: "0.25rem", display: "block" }}>
                                Thresholds, documents, restrictions & more
                            </span>
                        </Link>

                        {/* Table of Contents */}
                        <nav aria-label="Page sections" className="calc-sidebar-card">
                            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>
                                On This Page
                            </h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {uniqueSections.map((s, i) => (
                                    <li key={`toc-${i}`} style={{ marginBottom: "0.35rem" }}>
                                        <a href={`#${s.id}`} style={{ color: "var(--muted-foreground)", textDecoration: "none", fontSize: "0.82rem" }}>
                                            {s.heading}
                                        </a>
                                    </li>
                                ))}
                                <li style={{ marginBottom: "0.35rem" }}>
                                    <a href="#faq" style={{ color: "var(--muted-foreground)", textDecoration: "none", fontSize: "0.82rem" }}>
                                        Frequently Asked Questions
                                    </a>
                                </li>
                            </ul>
                        </nav>

                        {/* More Guides */}
                        <nav aria-label={`More ${country.name} guides`} className="calc-sidebar-card">
                            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>
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
                    </aside>
                </div>

                {/* Content Sections — Full width below the grid */}
                <article aria-label={`${country.name} import duty information`} className="calc-content-article">
                    {uniqueSections.map((section, i) => (
                        <section key={`sec-${i}`} id={section.id} style={{
                            marginBottom: "2.25rem",
                            paddingBottom: "2.25rem",
                            borderBottom: i < uniqueSections.length - 1 ? "1px solid var(--border)" : "none",
                        }}>
                            <h2>{section.heading}</h2>
                            <div
                                className="section-body"
                                dangerouslySetInnerHTML={{ __html: section.content }}
                            />
                        </section>
                    ))}

                    {/* Mid-content CTA */}
                    <div style={{
                        background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(59,130,246,0.08))",
                        border: "1px solid rgba(99,102,241,0.2)",
                        borderRadius: "12px",
                        padding: "1.5rem 2rem",
                        marginBottom: "2.5rem",
                        textAlign: "center",
                    }}>
                        <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", margin: "0 0 0.5rem" }}>
                            Ready to calculate your import costs?
                        </p>
                        <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", margin: "0 0 1rem" }}>
                            Use the calculator above or try our global calculator for any trade lane.
                        </p>
                        <Link href="/" style={{
                            display: "inline-block",
                            background: "var(--accent)",
                            color: "#fff",
                            padding: "0.65rem 1.5rem",
                            borderRadius: "8px",
                            textDecoration: "none",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                        }}>
                            Open Global Calculator →
                        </Link>
                    </div>

                    {/* FAQs */}
                    <section id="faq" aria-label="Frequently asked questions" style={{ marginBottom: "3rem" }}>
                        <h2>Frequently Asked Questions</h2>
                        {uniqueFaqs.map((faq, i) => (
                            <details key={`faq-${i}`} style={{
                                background: "var(--card)",
                                padding: "1rem 1.25rem",
                                borderRadius: "10px",
                                border: "1px solid var(--border)",
                                marginBottom: "0.6rem",
                            }}>
                                <summary style={{ fontWeight: 600, cursor: "pointer", color: "var(--foreground)", fontSize: "0.95rem" }}>
                                    {faq.question}
                                </summary>
                                <div style={{ marginTop: "0.75rem", color: "var(--muted-foreground)", lineHeight: 1.75, fontSize: "0.9rem" }}
                                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                                />
                            </details>
                        ))}
                    </section>
                </article>
            </main>
        </>
    );
}
