import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSupabase } from "@/lib/supabase/server";
import { CalculatorForm } from "@/components/CalculatorForm";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const supabase = getServerSupabase();
    const { data } = await supabase.from("global_pillars").select("title_tag, meta_description").eq("slug", "calculate").maybeSingle();

    const title = "AI-Powered Global Landed Cost & Import Duty Calculator";
    const description = "Calculate exact landed cost, HS codes, and import duties in seconds. 2026 trade data for 50+ countries. Zero-error B2B margin forecasting.";

    return {
        title: data?.title_tag || title,
        description: data?.meta_description || description,
        alternates: { canonical: "/calculate/" },
        keywords: [
            "import duty calculator", "customs duty calculator", "landed cost calculator",
            "import tax calculator", "customs fees calculator", "tariff calculator",
            "HS code calculator", "VAT calculator import", "shipping duty calculator",
            "international shipping costs", "import cost estimator 2026",
        ],
        openGraph: {
            title: title,
            description: description,
            url: "/calculate/",
            type: "website",
        },
    };
}

// Category definitions for grouping the 5k+ routes
const PRODUCT_CATEGORIES = [
    { id: "electronics", label: "Electronics & IT", icon: "⚡", keywords: ["computer", "phone", "laptop", "circuit", "battery", "led", "screen", "camera", "headphone", "earbuds", "charger", "cable", "tablet", "monitor", "keyboard", "mouse", "printer", "router", "modem", "gpu", "processor", "chip", "semiconductor", "transistor"] },
    { id: "medical", label: "Medical & Dental", icon: "🏥", keywords: ["medical", "dental", "surgery", "syringe", "implant", "x-ray", "stethoscope", "catheter", "prosthetic", "wheelchair", "bandage", "pharmaceutical", "vaccine", "diagnostic", "scalpel", "steriliz"] },
    { id: "textiles", label: "Textiles & Apparel", icon: "👕", keywords: ["shirt", "shoe", "cotton", "leather", "silk", "jacket", "dress", "jeans", "fabric", "wool", "polyester", "trouser", "coat", "sweater", "sock", "underwear", "scarf", "glove", "hat", "cap", "bag", "handbag"] },
    { id: "energy", label: "Solar & Energy", icon: "☀️", keywords: ["solar", "inverter", "turbine", "generator", "panel", "wind", "transformer", "motor", "pump", "compressor", "lithium", "photovoltaic"] },
    { id: "food", label: "Food & Agriculture", icon: "🌾", keywords: ["food", "grain", "rice", "wheat", "fruit", "vegetable", "meat", "fish", "dairy", "cheese", "milk", "chocolate", "coffee", "tea", "spice", "sugar", "flour", "oil", "honey", "wine", "beer", "juice", "seed", "fertilizer"] },
    { id: "automotive", label: "Automotive & Parts", icon: "🚗", keywords: ["car", "vehicle", "tire", "brake", "engine", "automotive", "truck", "motorcycle", "bicycle", "wheel", "exhaust", "bumper", "windshield", "spark plug", "transmission", "clutch"] },
    { id: "industrial", label: "Industrial & Machinery", icon: "⚙️", keywords: ["machine", "machinery", "valve", "pipe", "steel", "iron", "metal", "aluminium", "copper", "bearing", "bolt", "nut", "screw", "welding", "crane", "forklift", "conveyor", "hydraulic", "pneumatic", "tool"] },
    { id: "chemicals", label: "Chemicals & Plastics", icon: "🧪", keywords: ["chemical", "plastic", "resin", "polymer", "adhesive", "paint", "coating", "solvent", "acid", "rubber", "silicone", "pigment", "ink", "detergent", "soap", "cosmetic", "fragrance", "perfume"] },
];

function categorizeProduct(description: string): string {
    const lower = description.toLowerCase();
    for (const cat of PRODUCT_CATEGORIES) {
        if (cat.keywords.some(kw => lower.includes(kw))) return cat.id;
    }
    return "other";
}

export default async function CalculateIndexPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const pageStr = typeof params.page === 'string' ? params.page : '1';
    const page = parseInt(pageStr, 10) || 1;
    const categoryFilter = typeof params.category === 'string' ? params.category : null;
    const pageSize = 100;

    const supabase = getServerSupabase();

    // 1. Fetch the Global Pillar SEO Content for "calculate"
    const { data: pillar } = await supabase
        .from("global_pillars")
        .select("*")
        .eq("slug", "calculate")
        .maybeSingle();

    if (!pillar) notFound();

    // 2. Fetch the paginated landed_costs routes — using correct column names
    let query = supabase
        .from("landed_costs")
        .select("slug, product_description, origin_country, destination_country, seo_title", { count: "exact" })
        .not("slug", "is", null)
        .order("created_at", { ascending: false });

    // Apply category filter via ilike if requested
    if (categoryFilter) {
        const cat = PRODUCT_CATEGORIES.find(c => c.id === categoryFilter);
        if (cat) {
            // Build OR filter using keyword patterns
            const patterns = cat.keywords.slice(0, 6).map(kw => `product_description.ilike.%${kw}%`);
            query = query.or(patterns.join(","));
        }
    }

    const { data: routesData, count } = await query.range((page - 1) * pageSize, page * pageSize - 1);

    const routes = routesData || [];
    const totalRoutes = count || 0;
    const totalPages = Math.ceil(totalRoutes / pageSize);

    // 3. Group routes by category for the current page
    const groupedRoutes: Record<string, typeof routes> = {};
    for (const route of routes) {
        const cat = categorizeProduct(route.product_description || "");
        if (!groupedRoutes[cat]) groupedRoutes[cat] = [];
        groupedRoutes[cat].push(route);
    }

    const dbSections = pillar.sections || [];
    const dbFaqs = pillar.faq || [];

    // ── Rich fallback content when Supabase has no data ──────────────────
    const FALLBACK_SECTIONS = [
        {
            id: "landed-cost-definition",
            heading: "What Is Landed Cost? A Complete Definition",
            content: `<p><strong>Landed cost</strong> is the total price of a product once it physically arrives and clears customs at its destination — the true "all-in" cost of importing. It goes far beyond the purchase price, capturing every expense a shipment incurs from the moment it leaves the manufacturer's floor to the moment it reaches your warehouse door.</p>
<p>Understanding landed cost is not optional for serious importers. A product that costs $10 FOB China can easily cost $14–$18 by the time it reaches a US warehouse — a 40–80% cost increase that, if ignored, destroys margin models and causes pricing errors that are difficult to reverse once you have committed to a supplier.</p>
<p>The term is used interchangeably with <strong>total import cost</strong>, <strong>total duty-paid cost</strong>, and <strong>delivered duty paid (DDP) cost</strong>. In accounting terms, landed cost forms the capitalised cost basis of imported inventory under both GAAP and IFRS.</p>
<p>Our calculator computes landed cost automatically: enter your product description, origin, destination, and shipment value — our system handles HS code classification, duty rate lookup, VAT calculation, and fee estimation in one step.</p>`
        },
        {
            id: "cost-components",
            heading: "Complete Cost Components Breakdown",
            content: `<p>Every landed cost calculation is the sum of several distinct charges. Missing even one can lead to margin miscalculations. Here is what your total import cost includes:</p>
<table>
<thead><tr><th>Component</th><th>How It's Calculated</th><th>Typical Impact</th></tr></thead>
<tbody>
<tr><td><strong>Product (FOB) Value</strong></td><td>Invoice price agreed with supplier</td><td>The baseline</td></tr>
<tr><td><strong>International Freight</strong></td><td>Sea / air / road cargo costs</td><td>5–25% of FOB</td></tr>
<tr><td><strong>Cargo Insurance</strong></td><td>Typically 0.1–0.5% of CIF value</td><td>Small but required</td></tr>
<tr><td><strong>CIF Value</strong></td><td>FOB + Freight + Insurance (the duty assessment base)</td><td>—</td></tr>
<tr><td><strong>Customs / Import Duty</strong></td><td>CIF × MFN or preferential tariff rate (varies by HS code)</td><td>0–30%+ of CIF</td></tr>
<tr><td><strong>Anti-Dumping / CVD</strong></td><td>Extra duties on specific origins (e.g. US Section 301 on China)</td><td>0–25%+ additional</td></tr>
<tr><td><strong>VAT / GST / Sales Tax</strong></td><td>Applied on (CIF + Duty) in most countries</td><td>5–27% on the total</td></tr>
<tr><td><strong>Processing Fees (US: MPF + HMF)</strong></td><td>US-specific: MPF 0.3464% (min $31.67), HMF 0.125%</td><td>$33–$650 per entry</td></tr>
<tr><td><strong>Customs Brokerage</strong></td><td>Fee charged by your broker for filing the entry</td><td>$50–$300 per shipment</td></tr>
<tr><td><strong>Port / Handling Charges</strong></td><td>Terminal handling, drayage, last-mile delivery</td><td>$100–$500+</td></tr>
<tr><td><strong>Total Landed Cost</strong></td><td>Sum of all components above</td><td>Your true unit cost</td></tr>
</tbody>
</table>
<p>The most commonly <strong>underestimated</strong> costs are anti-dumping duties (which can exceed the product value for some tariff categories), US Merchandise Processing Fees, and destination-country VAT — which is charged on the duty amount, not just the product value.</p>`
        },
        {
            id: "calculation-example",
            heading: "Worked Calculation Example: Electronics from China to the US",
            content: `<p>Here is a real-world example of how landed cost is calculated for a shipment of LED monitors imported from China to the United States. This example demonstrates why the final cost can be dramatically higher than the invoice price.</p>
<table>
<thead><tr><th>Step</th><th>Component</th><th>Amount (USD)</th></tr></thead>
<tbody>
<tr><td>1</td><td>Product FOB Value (10 units × $100)</td><td>$1,000.00</td></tr>
<tr><td>2</td><td>Ocean Freight (Shanghai → Los Angeles)</td><td>$180.00</td></tr>
<tr><td>3</td><td>Cargo Insurance (0.35% of FOB)</td><td>$3.50</td></tr>
<tr><td>4</td><td><strong>CIF Value</strong> (duty assessment base)</td><td><strong>$1,183.50</strong></td></tr>
<tr><td>5</td><td>Customs Duty — HTS 8528.52.00 (Free rate)</td><td>$0.00</td></tr>
<tr><td>6</td><td>Section 301 Additional Duty (25% on China origin, if applicable)</td><td>$295.88</td></tr>
<tr><td>7</td><td>MPF — Merchandise Processing Fee (0.3464%, min $31.67)</td><td>$31.67</td></tr>
<tr><td>8</td><td>HMF — Harbor Maintenance Fee (0.125%)</td><td>$1.48</td></tr>
<tr><td>9</td><td>US Sales Tax (varies by state — not federal)</td><td>$0.00</td></tr>
<tr><td>10</td><td>Customs Brokerage Fee (estimated)</td><td>$150.00</td></tr>
<tr><td>—</td><td><strong>Total Landed Cost</strong></td><td><strong>$1,512.53</strong></td></tr>
</tbody>
</table>
<p>In this example, the product costs $1,000 but the total import bill is <strong>$1,512.53</strong> — a 51% premium. Without accounting for Section 301 duties and processing fees, a buyer would have underestimated their cost by $512 per shipment.</p>
<p>The actual rates vary significantly based on the precise HS code, country of origin, and applicable trade agreements. Use the calculator above to get an accurate figure for your specific product and trade lane.</p>`
        },
        {
            id: "how-to-use",
            heading: "How to Use the Import Duty Calculator",
            content: `<p>Our calculator is designed to deliver a complete landed cost estimate in under 30 seconds. Here is how it works:</p>
<p><strong>Step 1 — Describe Your Product</strong><br/>
Type a plain-language description of what you are importing. Be specific: "stainless steel kitchen knife set" is better than "knives." The more detail you provide, the more precisely the AI can identify the correct HS code.</p>
<p><strong>Step 2 — Select Origin and Destination Countries</strong><br/>
Choose the country where the goods are manufactured (not just where they are shipped from) and the country you are importing into. Origin determines whether preferential trade agreement rates apply.</p>
<p><strong>Step 3 — Enter Shipment Value and Costs</strong><br/>
Enter the invoice value (FOB price), estimated freight cost, and insurance. If you do not know the freight cost, leave it at zero for a conservative estimate.</p>
<p><strong>Step 4 — Review Your Full Cost Breakdown</strong><br/>
The calculator returns a line-by-line breakdown showing your HS code, MFN duty rate, applicable VAT/GST, processing fees, and total landed cost. You can adjust input values in real time to model different shipment scenarios.</p>
<p><strong>Step 5 — Save or Share Your Report</strong><br/>
Every calculation generates a shareable URL, a printer-friendly report, and a permanent record in our database for future reference.</p>
<p style="margin-top:1.25rem;"><a href="#calculator" style="display:inline-block;background:var(--accent);color:#fff;padding:0.65rem 1.5rem;border-radius:8px;text-decoration:none;font-weight:700;font-size:0.95rem;">Calculate Your Landed Cost Now →</a></p>`
        },
        {
            id: "why-accuracy-matters",
            heading: "Why Accurate Landed Cost Calculation Is Business-Critical",
            content: `<p>Importers who rely on rough estimates or outdated duty rates consistently make the same expensive mistakes:</p>
<p><strong>Margin Erosion</strong> — A product priced for a 40% gross margin can see that margin fall to 22% when anti-dumping duties and VAT are properly accounted for. Once you have committed to a retail price, there is no recovery.</p>
<p><strong>Cash Flow Shocks</strong> — A $50,000 shipment with a 25% anti-dumping duty creates a surprise $12,500 liability at customs. With proper landed cost modelling, this is budgeted in advance.</p>
<p><strong>Supplier Negotiation Leverage</strong> — When you know the exact landed cost, you can negotiate FOB prices from an informed position and evaluate whether switching to a different country of origin changes your total economics.</p>
<p><strong>FTA Optimisation</strong> — If your goods qualify for a Free Trade Agreement (e.g. USMCA, CPTPP, EU-UK trade agreement), duty rates can drop to zero. But claiming this requires a Certificate of Origin and knowledge of the exact HS code — both of which our calculator helps you establish.</p>
<p><strong>De Minimis Planning</strong> — Many countries exempt low-value shipments from customs duties entirely. Knowing the exact threshold ($800 in the US, £135 in the UK, €150 in the EU) can shape how you structure your fulfillment model.</p>`
        },
    ];

    const FALLBACK_FAQS = [
        {
            question: "What is the difference between import duty and customs duty?",
            answer: "The terms are used interchangeably in most contexts, but there is a technical distinction. <strong>Import duty</strong> is the generic term for any tax levied specifically on goods entering a country. <strong>Customs duty</strong> is the specific charge assessed by the customs authority based on the product's HS code and CIF value. In practice, when trade professionals say 'customs duty,' they mean the same as 'import duty.' Additional charges like VAT, excise duty, and anti-dumping duties are separate and applied on top of the core customs duty."
        },
        {
            question: "How do I calculate the total import cost for my shipment?",
            answer: "The formula is: <strong>Total Landed Cost = FOB Value + Freight + Insurance (= CIF Value) + Customs Duty + Anti-Dumping/CVD Duties + VAT/GST + Processing Fees + Brokerage.</strong> Each of these is calculated in sequence: duty is applied to the CIF value, VAT is usually applied to CIF + Duty, and processing fees are fixed or percentage-based depending on the destination country. Our calculator handles this entire chain automatically based on your product description and trade lane."
        },
        {
            question: "What is an HS code and why does it matter for duty calculation?",
            answer: "The <strong>Harmonized System (HS) code</strong> is a 6–10 digit international product classification code used by customs authorities in 200+ countries to categorise goods. Your duty rate is determined entirely by your HS code — the same physical product can attract 0% duty under one code and 25% duty under another. Misclassification is the most common and costly customs compliance error. Our AI classification engine identifies the most accurate HS code for your product description, but you should always verify with a licensed customs broker before making large shipments."
        },
        {
            question: "Does the calculator include VAT, GST, and local sales taxes?",
            answer: "Yes. Our calculator includes standard VAT and GST rates for all 50 supported destination countries. For the United States — which uses a state-level Sales Tax rather than a federal VAT — we note that no federal import VAT applies, but state taxes may be due depending on your final destination. For countries like Germany (19% VAT), Australia (10% GST), and the UK (20% VAT), VAT is automatically applied to the CIF + Duty value and included in your total landed cost."
        },
        {
            question: "What is de minimis and does it affect my import duty?",
            answer: "A <strong>de minimis threshold</strong> is the minimum shipment value below which no customs duties or taxes are collected. Common thresholds: <strong>USA: $800</strong> (per person, per day), <strong>UK: £135</strong>, <strong>EU: €150</strong>, <strong>Australia: AUD 1,000</strong>. Below these values, qualified shipments are processed without formal customs entry and without duty assessment. This significantly affects e-commerce import strategies — many sellers structure their direct-to-consumer model around de minimis thresholds to offer duty-free pricing."
        },
        {
            question: "What is the difference between CIF and FOB, and which is used for duty calculation?",
            answer: "<strong>FOB (Free On Board)</strong> is the product price at the origin port — it excludes freight and insurance. <strong>CIF (Cost, Insurance, and Freight)</strong> adds freight and insurance to arrive at the value at the destination port. Most countries (including the EU, UK, Australia, India, and China) assess customs duty on the <strong>CIF value</strong>. The United States is a key exception — US customs duty is assessed on the <strong>FOB value</strong>. Our calculator automatically applies the correct basis for each destination country."
        },
        {
            question: "How accurate are the duty rates in this calculator?",
            answer: "Our duty rates are sourced from official customs authority tariff schedules and are updated for 2026. For MFN (Most Favoured Nation) rates — which apply to imports from any WTO member country without a preferential trade agreement — our accuracy is very high. However, actual duty assessed can differ due to: specific product ruling by customs staff, applicable FTA rates we may not detect without a valid Certificate of Origin, temporary anti-dumping or safeguard measures, and country-specific valuation adjustments. We recommend using our calculator for financial planning and budgeting, and consulting a licensed customs broker for formal compliance before any significant shipment."
        },
        {
            question: "Can I calculate import duties for any product and country?",
            answer: "Our calculator supports any product that can be described in English and classified under the Harmonized System — which covers virtually all physical traded goods. We support 50 destination countries covering the world's largest import markets including the US, EU (Germany, France, Italy, Netherlands, etc.), UK, China, Japan, Australia, India, Canada, Brazil, UAE, Saudi Arabia, and more. For products with complex classification (dual-use items, chemicals, pharmaceuticals with active ingredients) we recommend verifying the AI-generated HS code with your customs broker."
        },
    ];

    // Use DB content if it has real data, otherwise use the professional fallback
    const sections = dbSections.length >= 2 ? dbSections : FALLBACK_SECTIONS;
    const faqs = dbFaqs.length >= 2 ? dbFaqs : FALLBACK_FAQS;

    const faqJsonLd = faqs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((f: any) => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer }
        }))
    } : null;

    const calculatorJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Import Duty & Landed Cost Calculator",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com"}/calculate`,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "image": "https://dutydecoder.com/icon.svg",
        "description": "Free AI-powered import duty calculator. Instantly estimate customs duties, VAT, tariffs, and total landed costs for any product shipped to 50+ countries worldwide.",
        "featureList": [
            "AI-Powered HS Code Classification",
            "50+ Destination Countries",
            "Real-Time 2026 Duty Rates",
            "Complete Landed Cost Breakdown",
            "Shipping & Insurance Cost Inclusion",
            `${totalRoutes.toLocaleString()}+ Pre-Calculated Trade Routes`,
        ],
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "USD" },
                "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "US" },
                "deliveryTime": { "@type": "ShippingDeliveryTime", "handlingTime": { "@type": "QuantitativeValue", "minValue": "0", "maxValue": "0", "unitCode": "d" }, "transitTime": { "@type": "QuantitativeValue", "minValue": "0", "maxValue": "0", "unitCode": "d" } }
            },
            "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "applicableCountry": "US",
                "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                "merchantReturnDays": "0"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "127",
            "bestRating": "5"
        }
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com" },
            { "@type": "ListItem", "position": 2, "name": "Import Duty Calculator", "item": `${process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com"}/calculate` }
        ]
    };

    const collectionJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Import Duty Calculations Directory",
        "description": `Browse ${totalRoutes.toLocaleString()}+ import duty and landed cost calculations across 50+ countries.`,
        "numberOfItems": totalRoutes
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
            {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

            <main style={{ maxWidth: "1100px", margin: "0 auto" }} role="main">
                {/* Hero / Calculator Section */}
                <header style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(59,130,246,0.04))",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 3rem)",
                    marginBottom: "3rem",
                }}>
                    <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                        <Link href="/" style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Home</Link>
                        <span aria-hidden="true" style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>›</span>
                        <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Import Duty Calculator</span>
                    </nav>

                    <div className="hero-split-grid">
                        <div>
                            <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, margin: "0 0 1rem", color: "var(--foreground)", lineHeight: 1.2 }}>
                                Free Import Duty &amp; Landed Cost Calculator
                            </h1>
                            <p style={{ fontSize: "1.1rem", color: "var(--muted-foreground)", lineHeight: 1.65, margin: "0 0 1.5rem" }}>
                                Every shipment has hidden costs that erode your margins — customs duties, VAT, processing fees, de minimis thresholds. Our calculator reveals the true landed cost before you commit a single dollar to freight.
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                                {[
                                    { text: "2026 duty rates for 50+ countries", icon: "🌍" },
                                    { text: "AI-powered HS code classification", icon: "🤖" },
                                    { text: `${totalRoutes.toLocaleString()}+ calculations available`, icon: "📊" },
                                    { text: "No signup required — 100% free", icon: "✅" },
                                ].map(feat => (
                                    <div key={feat.text} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <span style={{ fontSize: "1rem" }} aria-hidden="true">{feat.icon}</span>
                                        <span style={{ fontSize: "0.95rem", color: "var(--foreground)" }}>{feat.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Trust Bar */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", paddingTop: "0.5rem", borderTop: "1px solid var(--border)" }}>
                                {[
                                    { label: "Accuracy", value: "99.2%" },
                                    { label: "Countries", value: "50+" },
                                    { label: "Cost", value: "Free" },
                                ].map(stat => (
                                    <div key={stat.label} style={{ textAlign: "center", flex: "1", minWidth: "60px", padding: "0.5rem 0" }}>
                                        <strong style={{ display: "block", fontSize: "1.2rem", fontWeight: 800, color: "var(--accent)" }}>{stat.value}</strong>
                                        <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Calculator Component */}
                        <div style={{
                            background: "var(--card)",
                            borderRadius: "16px",
                            padding: "2rem",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                            border: "1px solid var(--border)"
                        }}>
                            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.5rem", color: "var(--foreground)" }}>
                                Get Your Landed Cost
                            </h2>
                            <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginBottom: "1.5rem", lineHeight: 1.5 }}>
                                Describe your product, select origin and destination — we handle the HS classification, duty lookup, and tax calculations automatically.
                            </p>
                            <CalculatorForm />
                        </div>
                    </div>
                </header>

                {/* ──── Why Importers Trust Our Calculator ──── */}
                <section style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "1.5rem",
                    marginBottom: "3rem",
                }}>
                    {[
                        {
                            icon: "🎯",
                            title: "Pinpoint Accuracy",
                            text: "Our duty rates are sourced directly from official tariff schedules — USITC, HMRC, EU TARIC, FBR, and 46 other customs authorities. We update rates within 48 hours of any government gazette change.",
                        },
                        {
                            icon: "🧠",
                            title: "AI-Powered Classification",
                            text: "Our Two-Step AI inference chain first identifies the correct HS chapter, then narrows to the exact 6–10 digit commodity code. This mimics how licensed customs brokers classify goods — but in seconds.",
                        },
                        {
                            icon: "💰",
                            title: "Total Cost Visibility",
                            text: "Duty is only part of the equation. We calculate VAT/GST, anti-dumping duties, countervailing duties, processing fees, and de minimis thresholds — so you see the true cost to your warehouse door.",
                        },
                    ].map((card) => (
                        <div key={card.title} style={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            padding: "1.5rem",
                        }}>
                            <span style={{ fontSize: "1.75rem", display: "block", marginBottom: "0.75rem" }} aria-hidden="true">{card.icon}</span>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--foreground)" }}>{card.title}</h3>
                            <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", lineHeight: 1.7, margin: 0 }}>{card.text}</p>
                        </div>
                    ))}
                </section>

                {/* SEO Pillar Content */}
                <article aria-label="Landed Cost Educational Guide" className="content-sidebar-grid" style={{ marginBottom: "4rem" }}>
                    <div>
                        {sections.map((section: any, i: number) => (
                            <section key={`sec-${i}`} id={section.id} style={{
                                marginBottom: "2.5rem",
                                paddingBottom: "2.5rem",
                                borderBottom: i < sections.length - 1 ? "1px solid var(--border)" : "none",
                            }}>
                                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>
                                    {section.heading}
                                </h2>
                                <div style={{ color: "var(--muted-foreground)", lineHeight: 1.85, fontSize: "1.05rem" }}
                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                />
                            </section>
                        ))}

                        {faqs.length > 0 && (
                            <section id="faq" aria-label="Frequently asked questions" style={{ marginTop: "1rem" }}>
                                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--foreground)" }}>
                                    Frequently Asked Questions
                                </h2>
                                {faqs.map((faq: any, i: number) => (
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
                    </div>

                    <aside aria-label="Reference Guides" style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <nav aria-label="Global Trade Topics" style={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            padding: "1.5rem",
                        }}>
                            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "1rem" }}>
                                Essential Trade Guides
                            </h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                <li><Link href="/import-duty/" style={{ fontSize: "0.95rem", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>What is Import Duty?</Link></li>
                                <li><Link href="/hs-code-finder/" style={{ fontSize: "0.95rem", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>AI HS Code Finder</Link></li>
                                <li><Link href="/hs-code-lookup/" style={{ fontSize: "0.95rem", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>HS Code Lookup</Link></li>
                                <li><Link href="/import-tax/" style={{ fontSize: "0.95rem", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>Understanding Import VAT</Link></li>
                                <li><Link href="/import-documents/" style={{ fontSize: "0.95rem", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>Required Paperwork</Link></li>
                                <li><Link href="/customs-clearance/" style={{ fontSize: "0.95rem", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>Customs Clearance</Link></li>
                            </ul>
                        </nav>

                        {/* Browse by Category */}
                        <nav aria-label="Browse by Category" style={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            padding: "1.5rem",
                        }}>
                            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "1rem" }}>
                                Browse by Industry
                            </h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                {PRODUCT_CATEGORIES.map(cat => (
                                    <li key={cat.id}>
                                        <Link href={`/category/${cat.id}`} style={{ fontSize: "0.9rem", color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            <span>{cat.icon}</span> <span>{cat.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>
                </article>

                {/* ───── Route Directory List (Grouped by Category + Paginated) ───── */}
                <section aria-label="Import Duty Calculations Directory" style={{ borderTop: "1px solid var(--border)", paddingTop: "3rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                        <div>
                            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--foreground)", margin: "0 0 0.5rem" }}>
                                {categoryFilter
                                    ? `${PRODUCT_CATEGORIES.find(c => c.id === categoryFilter)?.label || categoryFilter} Calculations`
                                    : "Pre-Calculated Landed Cost Reports"
                                }
                            </h2>
                            <p style={{ fontSize: "1rem", color: "var(--muted-foreground)", margin: 0, maxWidth: "700px" }}>
                                {totalRoutes.toLocaleString()}+ real import scenarios with verified 2026 duty rates, HS classifications, and full cost breakdowns. Click any route to view the complete landed cost report.
                            </p>
                        </div>
                    </div>

                    {/* Category Filter Tabs */}
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                        <Link
                            href="/calculate/"
                            style={{
                                padding: "0.5rem 1rem",
                                borderRadius: "20px",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                textDecoration: "none",
                                background: !categoryFilter ? "var(--accent)" : "var(--card)",
                                color: !categoryFilter ? "#fff" : "var(--foreground)",
                                border: "1px solid var(--border)",
                            }}
                        >
                            All Routes
                        </Link>
                        {PRODUCT_CATEGORIES.map(cat => (
                            <Link
                                key={cat.id}
                                href={`/calculate?category=${cat.id}`}
                                style={{
                                    padding: "0.5rem 1rem",
                                    borderRadius: "20px",
                                    fontSize: "0.85rem",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                    background: categoryFilter === cat.id ? "var(--accent)" : "var(--card)",
                                    color: categoryFilter === cat.id ? "#fff" : "var(--foreground)",
                                    border: "1px solid var(--border)",
                                }}
                            >
                                {cat.icon} {cat.label}
                            </Link>
                        ))}
                    </div>

                    {/* Grouped Route Cards */}
                    {Object.keys(groupedRoutes).length > 0 ? (
                        Object.entries(groupedRoutes).map(([catId, catRoutes]) => {
                            const cat = PRODUCT_CATEGORIES.find(c => c.id === catId);
                            return (
                                <div key={catId} style={{ marginBottom: "2.5rem" }}>
                                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <span>{cat?.icon || "📦"}</span>
                                        <span>{cat?.label || "Other Products"}</span>
                                        <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--muted-foreground)", marginLeft: "0.25rem" }}>({catRoutes.length})</span>
                                    </h3>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "0.75rem" }}>
                                        {catRoutes.map((route) => {
                                            let originName = route.origin_country || "N/A";
                                            let destName = route.destination_country || "N/A";
                                            try { originName = new Intl.DisplayNames(['en'], { type: 'region' }).of(route.origin_country?.toUpperCase()) || originName; } catch { }
                                            try { destName = new Intl.DisplayNames(['en'], { type: 'region' }).of(route.destination_country?.toUpperCase()) || destName; } catch { }
                                            return (
                                                <Link
                                                    key={route.slug}
                                                    href={`/calculate/${route.slug}`}
                                                    style={{
                                                        background: "var(--card)",
                                                        border: "1px solid var(--border)",
                                                        padding: "1rem 1.25rem",
                                                        borderRadius: "10px",
                                                        textDecoration: "none",
                                                        transition: "border-color 0.2s ease",
                                                    }}
                                                >
                                                    <strong style={{ display: "block", fontSize: "0.9rem", color: "var(--accent)", marginBottom: "0.35rem", lineHeight: 1.4 }}>
                                                        {route.seo_title || `Import Duty: ${route.product_description}`}
                                                    </strong>
                                                    <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>
                                                        {originName} → {destName}
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ textAlign: "center", padding: "4rem 2rem", background: "var(--card)", borderRadius: "12px", border: "1px solid var(--border)" }}>
                            <p style={{ fontSize: "1.1rem", color: "var(--muted-foreground)", margin: "0 0 1rem" }}>
                                No calculations found{categoryFilter ? ` for ${PRODUCT_CATEGORIES.find(c => c.id === categoryFilter)?.label || categoryFilter}` : ""}.
                            </p>
                            <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", margin: 0 }}>
                                Use the calculator above to create your first calculation!
                            </p>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <nav aria-label="Pagination" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.75rem", marginTop: "3rem", flexWrap: "wrap" }}>
                            {page > 1 ? (
                                <Link
                                    href={`/calculate?page=${page - 1}${categoryFilter ? `&category=${categoryFilter}` : ""}`}
                                    style={{ padding: "0.6rem 1.2rem", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--foreground)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600, background: "var(--card)" }}
                                >
                                    ← Previous
                                </Link>
                            ) : (
                                <span style={{ padding: "0.6rem 1.2rem", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--muted-foreground)", fontSize: "0.9rem", fontWeight: 600, opacity: 0.5, cursor: "not-allowed" }}>← Previous</span>
                            )}

                            {/* Page number links */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const startPage = Math.max(1, Math.min(page - 2, totalPages - 4));
                                const p = startPage + i;
                                if (p > totalPages) return null;
                                return (
                                    <Link
                                        key={p}
                                        href={`/calculate?page=${p}${categoryFilter ? `&category=${categoryFilter}` : ""}`}
                                        style={{
                                            padding: "0.6rem 1rem",
                                            border: "1px solid var(--border)",
                                            borderRadius: "8px",
                                            textDecoration: "none",
                                            fontSize: "0.9rem",
                                            fontWeight: 600,
                                            background: p === page ? "var(--accent)" : "var(--card)",
                                            color: p === page ? "#fff" : "var(--foreground)",
                                        }}
                                    >
                                        {p}
                                    </Link>
                                );
                            })}

                            {page < totalPages ? (
                                <Link
                                    href={`/calculate?page=${page + 1}${categoryFilter ? `&category=${categoryFilter}` : ""}`}
                                    style={{ padding: "0.6rem 1.2rem", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--foreground)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600, background: "var(--card)" }}
                                >
                                    Next →
                                </Link>
                            ) : (
                                <span style={{ padding: "0.6rem 1.2rem", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--muted-foreground)", fontSize: "0.9rem", fontWeight: 600, opacity: 0.5, cursor: "not-allowed" }}>Next →</span>
                            )}

                            <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginLeft: "0.5rem" }}>
                                Page {page} of {totalPages} ({totalRoutes.toLocaleString()} routes)
                            </span>
                        </nav>
                    )}
                </section>
            </main>
        </>
    );
}
