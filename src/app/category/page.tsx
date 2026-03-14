import { Metadata } from "next";
import Link from "next/link";

// We duplicate CATEGORY_META here to avoid complex refactoring of category/[id]/page.tsx
// Ideally, this would be extracted to a shared constants file later.

const CATEGORIES = [
    {
        id: "medical",
        title: "Medical & Dental Compliance",
        subtitle: "FDA, CE Marks, and Sterilization Regulations",
        icon: "🏥",
        desc: "Navigate complex regulatory frameworks for importing class I-III medical devices, surgical instruments, and PPE. Ensure your supply chain meets international health standards.",
    },
    {
        id: "electronics",
        title: "Consumer Electronics & IT",
        subtitle: "FCC, RoHS, and Battery Directives",
        icon: "⚡",
        desc: "Understand the intricate compliance landscape for consumer hardware, from lithium-ion transport requirements to e-waste directives across the US and EU.",
    },
    {
        id: "energy",
        title: "Solar & Renewables",
        subtitle: "Section 301 Tariffs, AD/CVD Compliance",
        icon: "☀️",
        desc: "Manage the volatile tariff landscape surrounding solar panels, inverters, and heavy energy infrastructure. Stay ahead of Anti-Dumping and Countervailing Duties.",
    },
    {
        id: "textiles",
        title: "Textiles, Apparel & Footwear",
        subtitle: "Quota Limits & CPSC Standards",
        icon: "👕",
        desc: "Master the complexities of fabric classification, origin marking requirements, and safety standards for wearing apparel in global markets.",
    },
    {
        id: "food",
        title: "Food, Beverages & Agriculture",
        subtitle: "USDA, FDA & Phytosanitary Certificates",
        icon: "🌾",
        desc: "Navigate food safety regulations, phytosanitary certificates, and agricultural trade barriers. Calculate exact duties for raw commodities, processed foods, and beverages.",
    },
    {
        id: "automotive",
        title: "Automotive & Vehicle Parts",
        subtitle: "NHTSA, EU Type Approval & FMVSS",
        icon: "🚗",
        desc: "Calculate import duties for vehicles, spare parts, and automotive components. Understand emissions standards, safety certifications, and country-specific vehicle import rules.",
    },
    {
        id: "industrial",
        title: "Industrial Machinery & Equipment",
        subtitle: "CE Marking, UL Certification & Pressure Vessel Codes",
        icon: "⚙️",
        desc: "Calculate exact import costs for heavy machinery, industrial tools, metal products, and manufacturing equipment. Understand certification requirements across global markets.",
    },
    {
        id: "chemicals",
        title: "Chemicals, Plastics & Cosmetics",
        subtitle: "REACH, GHS Classification & TSCA",
        icon: "🧪",
        desc: "Navigate hazardous materials regulations, REACH registration, and cosmetics safety data for chemical imports. Calculate duties for polymers, resins, paints, and specialty chemicals.",
    },
    {
        id: "luxury",
        title: "Jewellery, Watches & Luxury Goods",
        subtitle: "Hallmarking, Precious Metals & Customs Valuation",
        icon: "💎",
        desc: "Calculate import duties for precious metals, gemstones, fine jewellery, and luxury watches. Navigate hallmarking requirements, customs valuation rules, and country-specific luxury taxes.",
    },
    {
        id: "home",
        title: "Home, Garden & Lifestyle",
        subtitle: "Product Safety, Labeling & Consumer Standards",
        icon: "🏠",
        desc: "Calculate import duties for home goods, furniture, kitchenware, toys, and lifestyle products. Understand product safety standards, labeling requirements, and consumer protection regulations.",
    }
];

export const metadata: Metadata = {
    title: "Import Categories & HS Code Classification 2026",
    description: "Browse import duty categories including medical, electronics, textiles, and automotive. Find exact landed costs, HS code classifications, and trade compliance rules for 50+ countries.",
    alternates: { canonical: "/category/" },
    openGraph: {
        title: "Import Categories & HS Code Classification 2026",
        description: "Browse our comprehensive list of import product categories to calculate exact landed costs and duties.",
        url: "/category/",
        type: "website",
    }
};

export default function CategoryIndexPage() {
    const collectionJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "DutyDecoder Import Categories",
        "description": metadata.description,
        "numberOfItems": CATEGORIES.length
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com" },
            { "@type": "ListItem", "position": 2, "name": "Categories", "item": `${process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com"}/category` }
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

            <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }} role="main">

                {/* Header Section with SEO context */}
                <header style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(59,130,246,0.04))",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "3rem 2rem",
                    marginBottom: "3rem",
                    textAlign: "center"
                }}>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 800, margin: "0 0 1rem", color: "var(--foreground)", lineHeight: 1.2 }}>
                        Import Categories & Duty Classifications
                    </h1>
                    <h2 style={{ fontSize: "1.25rem", color: "var(--accent)", margin: "0 0 1.5rem", fontWeight: 600 }}>
                        Find Exact Landed Costs and HS Codes Across 50+ Countries
                    </h2>
                    <p style={{ fontSize: "1.1rem", color: "var(--muted-foreground)", lineHeight: 1.7, margin: "0 auto", maxWidth: "800px" }}>
                        Select a product category below to explore specific import regulations, <strong>HS code classifications</strong>, and <strong>trade compliance requirements</strong>. DutyDecoder provides accurate, up-to-date 2026 tariff data, enabling you to calculate <strong>import taxes</strong>, <strong>VAT</strong>, and total landed costs instantly. Whether you are importing medical devices requiring FDA approval, textiles subject to quota limits, or consumer electronics needing RoHS certification, our AI-powered platform decodes global customs limits effortlessly.
                    </p>
                </header>

                {/* Category Grid List */}
                <section>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/category/${cat.id}`}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    background: "var(--card)",
                                    border: "1px solid var(--border)",
                                    padding: "1.75rem",
                                    borderRadius: "12px",
                                    textDecoration: "none",
                                    transition: "all 0.2s ease",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                                }}
                                className="hover:border-accent hover:shadow-md"
                            >
                                <div style={{ fontSize: "3rem", marginBottom: "1rem", lineHeight: 1 }}>
                                    {cat.icon}
                                </div>
                                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.5rem" }}>
                                    {cat.title}
                                </h3>
                                <p style={{ fontSize: "0.9rem", color: "var(--accent)", fontWeight: 600, marginBottom: "0.75rem" }}>
                                    {cat.subtitle}
                                </p>
                                <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", lineHeight: 1.5, flex: 1, margin: 0 }}>
                                    {cat.desc}
                                </p>
                                <div style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--accent)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    View Category Calculations <span>→</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

            </main>
        </>
    );
}
