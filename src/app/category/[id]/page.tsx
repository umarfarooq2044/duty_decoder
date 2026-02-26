import { getServerSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

// Force dynamic but cache for 24h
export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
    return [
        { id: "medical" },
        { id: "electronics" },
        { id: "energy" },
        { id: "textiles" },
        { id: "food" },
        { id: "automotive" },
        { id: "industrial" },
        { id: "chemicals" },
    ];
}

// Full category metadata for all 8 categories
const CATEGORY_META: Record<string, {
    title: string;
    subtitle: string;
    icon: string;
    desc: string;
    keywords: string[];
    seoTitle: string;
    seoDescription: string;
}> = {
    medical: {
        title: "Medical & Dental Compliance",
        subtitle: "FDA, CE Marks, and Sterilization Regulations",
        icon: "🏥",
        desc: "Navigate complex regulatory frameworks for importing class I-III medical devices, surgical instruments, and PPE. Ensure your supply chain meets international health standards.",
        keywords: ["surgery", "medical", "dental", "x-ray", "syringe", "implant", "stethoscope", "catheter", "prosthetic", "wheelchair", "bandage", "pharmaceutical", "vaccine", "diagnostic", "scalpel"],
        seoTitle: "Medical & Dental Import Duty Calculator | DutyDecoder",
        seoDescription: "Calculate import duties and landed costs for medical devices, dental equipment, and healthcare products. FDA, CE Mark, and WHO compliance tools."
    },
    electronics: {
        title: "Consumer Electronics & IT",
        subtitle: "FCC, RoHS, and Battery Directives",
        icon: "⚡",
        desc: "Understand the intricate compliance landscape for consumer hardware, from lithium-ion transport requirements to e-waste directives across the US and EU.",
        keywords: ["computer", "phone", "laptop", "circuit", "battery", "led", "screen", "camera", "headphone", "earbuds", "charger", "cable", "tablet", "monitor", "keyboard", "mouse", "printer", "router"],
        seoTitle: "Electronics Import Duty Calculator | DutyDecoder",
        seoDescription: "Calculate import duties for electronics, phones, laptops, and IT hardware. FCC, RoHS, and WEEE compliance covered."
    },
    energy: {
        title: "Solar & Renewables",
        subtitle: "Section 301 Tariffs, AD/CVD Compliance",
        icon: "☀️",
        desc: "Manage the volatile tariff landscape surrounding solar panels, inverters, and heavy energy infrastructure. Stay ahead of Anti-Dumping and Countervailing Duties.",
        keywords: ["solar", "inverter", "turbine", "generator", "panel", "wind", "transformer", "motor", "pump", "compressor", "photovoltaic"],
        seoTitle: "Solar & Energy Import Duty Calculator | DutyDecoder",
        seoDescription: "Calculate import duties for solar panels, inverters, turbines, and energy equipment. Section 301 and AD/CVD compliance tools."
    },
    textiles: {
        title: "Textiles, Apparel & Footwear",
        subtitle: "Quota Limits & CPSC Standards",
        icon: "👕",
        desc: "Master the complexities of fabric classification, origin marking requirements, and safety standards for wearing apparel in global markets.",
        keywords: ["shirt", "shoe", "cotton", "leather", "silk", "jacket", "dress", "jeans", "fabric", "wool", "polyester", "trouser", "coat", "sweater", "sock", "underwear", "scarf", "glove", "hat", "bag", "handbag"],
        seoTitle: "Textiles & Apparel Import Duty Calculator | DutyDecoder",
        seoDescription: "Calculate import duties for clothing, shoes, leather goods, and fabrics. Quota limits and CPSC compliance included."
    },
    food: {
        title: "Food, Beverages & Agriculture",
        subtitle: "USDA, FDA & Phytosanitary Certificates",
        icon: "🌾",
        desc: "Navigate food safety regulations, phytosanitary certificates, and agricultural trade barriers. Calculate exact duties for raw commodities, processed foods, and beverages.",
        keywords: ["food", "grain", "rice", "wheat", "fruit", "vegetable", "meat", "fish", "dairy", "cheese", "milk", "chocolate", "coffee", "tea", "spice", "sugar", "flour", "oil", "honey", "wine", "beer", "juice", "seed", "fertilizer"],
        seoTitle: "Food & Agriculture Import Duty Calculator | DutyDecoder",
        seoDescription: "Calculate import duties for food products, agricultural goods, and beverages. USDA and phytosanitary compliance covered."
    },
    automotive: {
        title: "Automotive & Vehicle Parts",
        subtitle: "NHTSA, EU Type Approval & FMVSS",
        icon: "🚗",
        desc: "Calculate import duties for vehicles, spare parts, and automotive components. Understand emissions standards, safety certifications, and country-specific vehicle import rules.",
        keywords: ["car", "vehicle", "tire", "brake", "engine", "automotive", "truck", "motorcycle", "bicycle", "wheel", "exhaust", "bumper", "windshield", "spark plug", "transmission", "clutch"],
        seoTitle: "Automotive Import Duty Calculator | DutyDecoder",
        seoDescription: "Calculate import duties for cars, auto parts, tires, and vehicle components. NHTSA and EU type approval compliance."
    },
    industrial: {
        title: "Industrial Machinery & Equipment",
        subtitle: "CE Marking, UL Certification & Pressure Vessel Codes",
        icon: "⚙️",
        desc: "Calculate exact import costs for heavy machinery, industrial tools, metal products, and manufacturing equipment. Understand certification requirements across global markets.",
        keywords: ["machine", "machinery", "valve", "pipe", "steel", "iron", "metal", "aluminum", "copper", "bearing", "bolt", "nut", "screw", "welding", "crane", "forklift", "conveyor", "hydraulic", "pneumatic", "tool"],
        seoTitle: "Industrial Machinery Import Duty Calculator | DutyDecoder",
        seoDescription: "Calculate import duties for industrial machinery, steel, metals, and manufacturing equipment. CE marking and UL certification covered."
    },
    chemicals: {
        title: "Chemicals, Plastics & Cosmetics",
        subtitle: "REACH, GHS Classification & TSCA",
        icon: "🧪",
        desc: "Navigate hazardous materials regulations, REACH registration, and cosmetics safety data for chemical imports. Calculate duties for polymers, resins, paints, and specialty chemicals.",
        keywords: ["chemical", "plastic", "resin", "polymer", "adhesive", "paint", "coating", "solvent", "acid", "rubber", "silicone", "pigment", "ink", "detergent", "soap", "cosmetic", "fragrance", "perfume"],
        seoTitle: "Chemicals & Plastics Import Duty Calculator | DutyDecoder",
        seoDescription: "Calculate import duties for chemicals, plastics, resins, and cosmetics. REACH and TSCA compliance tools."
    }
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const meta = CATEGORY_META[id];
    if (!meta) return { title: `${id} Import Duty Calculator | Duty Decoder` };
    return {
        title: meta.seoTitle,
        description: meta.seoDescription,
        alternates: { canonical: `/category/${id}/` },
        openGraph: {
            title: meta.seoTitle,
            description: meta.seoDescription,
            url: `/category/${id}`,
            type: "website",
        }
    };
}

export default async function CategoryPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { id } = await params;
    const search = await searchParams;
    const pageStr = typeof search.page === 'string' ? search.page : '1';
    const page = parseInt(pageStr, 10) || 1;
    const pageSize = 50;

    const meta = CATEGORY_META[id];
    if (!meta) notFound();

    const supabase = getServerSupabase();

    // Build ilike-based OR query for the category keywords
    const patterns = meta.keywords.slice(0, 8).map(kw => `product_description.ilike.%${kw}%`);

    const { data: products, count } = await supabase
        .from("landed_costs")
        .select("slug, product_description, origin_country, destination_country, seo_title", { count: "exact" })
        .not("slug", "is", null)
        .or(patterns.join(","))
        .order("created_at", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

    const items = products || [];
    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    const collectionJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": meta.title,
        "description": meta.seoDescription,
        "numberOfItems": totalItems
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": process.env.NEXT_PUBLIC_BASE_URL || "https://duty-decoder.com" },
            { "@type": "ListItem", "position": 2, "name": "Categories", "item": `${process.env.NEXT_PUBLIC_BASE_URL || "https://duty-decoder.com"}/calculate` },
            { "@type": "ListItem", "position": 3, "name": meta.title, "item": `${process.env.NEXT_PUBLIC_BASE_URL || "https://duty-decoder.com"}/category/${id}` }
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

            <main style={{ maxWidth: "1100px", margin: "0 auto" }} role="main">
                {/* Header */}
                <header style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(59,130,246,0.04))",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "2.5rem 3rem",
                    marginBottom: "3rem",
                }}>
                    <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                        <Link href="/" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Home</Link>
                        <span aria-hidden="true" style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>›</span>
                        <Link href="/calculate/" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Calculator</Link>
                        <span aria-hidden="true" style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>›</span>
                        <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>{meta.title}</span>
                    </nav>

                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
                        <div style={{ fontSize: "3.5rem", background: "rgba(99, 102, 241, 0.1)", borderRadius: "14px", padding: "0.75rem", lineHeight: 1 }}>
                            {meta.icon}
                        </div>
                        <div>
                            <h1 style={{ fontSize: "2.25rem", fontWeight: 800, margin: "0 0 0.5rem", color: "var(--foreground)", lineHeight: 1.2 }}>
                                {meta.title}
                            </h1>
                            <p style={{ fontSize: "1.1rem", color: "var(--accent)", margin: 0, fontWeight: 600 }}>
                                {meta.subtitle}
                            </p>
                        </div>
                    </div>
                    <p style={{ fontSize: "1.05rem", color: "var(--muted-foreground)", lineHeight: 1.7, margin: 0, maxWidth: "800px" }}>
                        {meta.desc}
                    </p>
                </header>

                {/* Two Column Layout */}
                <div className="content-sidebar-grid">
                    {/* Main: Product Grid */}
                    <section>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                                {meta.icon} Duty Calculations ({totalItems.toLocaleString()} products)
                            </h2>
                        </div>

                        {items.length > 0 ? (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
                                {items.map((product) => {
                                    let originName = product.origin_country || "N/A";
                                    let destName = product.destination_country || "N/A";
                                    try { originName = new Intl.DisplayNames(['en'], { type: 'region' }).of(product.origin_country?.toUpperCase()) || originName; } catch { }
                                    try { destName = new Intl.DisplayNames(['en'], { type: 'region' }).of(product.destination_country?.toUpperCase()) || destName; } catch { }

                                    return (
                                        <Link
                                            key={product.slug}
                                            href={`/calculate/${product.slug}`}
                                            style={{
                                                background: "var(--card)",
                                                border: "1px solid var(--border)",
                                                padding: "1.25rem",
                                                borderRadius: "10px",
                                                textDecoration: "none",
                                                transition: "border-color 0.2s ease",
                                            }}
                                        >
                                            <h3 style={{ fontSize: "0.95rem", color: "var(--accent)", marginBottom: "0.5rem", lineHeight: 1.4, fontWeight: 600 }}>
                                                {product.seo_title || `Import Duty: ${product.product_description}`}
                                            </h3>
                                            <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", display: "flex", justifyContent: "space-between", alignItems: "center", margin: 0 }}>
                                                <span>{originName} → {destName}</span>
                                                <span style={{ color: "#22c55e", fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.5rem", background: "rgba(34,197,94,0.1)", borderRadius: "4px" }}>
                                                    2026 Data
                                                </span>
                                            </p>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{ textAlign: "center", padding: "4rem 2rem", background: "var(--card)", borderRadius: "12px", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
                                <p style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>No duty calculations found for {meta.title} yet.</p>
                                <Link href="/calculate/" style={{ display: "inline-block", background: "var(--accent)", color: "#fff", padding: "0.85rem 2rem", borderRadius: "8px", textDecoration: "none", fontWeight: 600 }}>
                                    Calculate a Route →
                                </Link>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav aria-label="Pagination" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.75rem", marginTop: "3rem", flexWrap: "wrap" }}>
                                {page > 1 && (
                                    <Link href={`/category/${id}?page=${page - 1}`} style={{ padding: "0.5rem 1rem", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--foreground)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600, background: "var(--card)" }}>
                                        ← Previous
                                    </Link>
                                )}
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const startPage = Math.max(1, Math.min(page - 2, totalPages - 4));
                                    const p = startPage + i;
                                    if (p > totalPages) return null;
                                    return (
                                        <Link key={p} href={`/category/${id}?page=${p}`} style={{
                                            padding: "0.5rem 0.85rem", border: "1px solid var(--border)", borderRadius: "8px",
                                            textDecoration: "none", fontSize: "0.9rem", fontWeight: 600,
                                            background: p === page ? "var(--accent)" : "var(--card)",
                                            color: p === page ? "#fff" : "var(--foreground)",
                                        }}>{p}</Link>
                                    );
                                })}
                                {page < totalPages && (
                                    <Link href={`/category/${id}?page=${page + 1}`} style={{ padding: "0.5rem 1rem", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--foreground)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600, background: "var(--card)" }}>
                                        Next →
                                    </Link>
                                )}
                                <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>
                                    Page {page}/{totalPages}
                                </span>
                            </nav>
                        )}
                    </section>

                    {/* Sidebar */}
                    <aside style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {/* Calculator CTA */}
                        <section style={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            padding: "1.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                        }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.5rem" }}>
                                Calculate Your Duty
                            </h3>
                            <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginBottom: "1rem", lineHeight: 1.5 }}>
                                Get exact landing costs for your {meta.title.toLowerCase()} imports.
                            </p>
                            <Link href="/calculate/" style={{
                                display: "block", textAlign: "center", background: "var(--accent)", color: "#fff",
                                fontWeight: 600, padding: "0.75rem 1rem", borderRadius: "8px", textDecoration: "none", fontSize: "0.9rem",
                            }}>
                                Open Calculator →
                            </Link>
                        </section>

                        {/* Other Categories */}
                        <nav aria-label="Other Categories" style={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            padding: "1.25rem",
                        }}>
                            <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>
                                Other Industries
                            </h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {Object.entries(CATEGORY_META)
                                    .filter(([key]) => key !== id)
                                    .map(([key, val]) => (
                                        <li key={key}>
                                            <Link href={`/category/${key}`} style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                                <span>{val.icon}</span> <span>{val.title}</span>
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </nav>

                        {/* Trade Guides */}
                        <nav aria-label="Trade Guides" style={{ padding: "0.5rem 0.25rem" }}>
                            <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "0.75rem" }}>
                                Trade Guides
                            </h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <li><Link href="/import-duty/" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>What is Import Duty?</Link></li>
                                <li><Link href="/hs-code-finder/" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>AI HS Code Finder</Link></li>
                                <li><Link href="/tariff-rates/" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>Global Tariff Rates</Link></li>
                                <li><Link href="/customs-clearance/" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>Customs Clearance</Link></li>
                                <li><Link href="/import-documents/" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>Import Documents</Link></li>
                            </ul>
                        </nav>
                    </aside>
                </div>
            </main>
        </>
    );
}
