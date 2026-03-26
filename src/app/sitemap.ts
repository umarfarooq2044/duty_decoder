import { MetadataRoute } from "next";
import { getServerSupabase } from "@/lib/supabase/server";
import { COUNTRIES } from "@/lib/countries";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://dutydecoder.com";

    // Use a fixed "last content update" date for static pages — update this when you
    // actually modify content on these pages (prevents Google seeing every page as
    // "modified" on every deploy, which wastes crawl budget).
    const lastContentUpdate = new Date("2026-03-26");
    const lastPolicyUpdate  = new Date("2026-01-15");

    // ── 1. Static routes ──
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${baseUrl}/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 1.0 },
        { url: `${baseUrl}/import-duty/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/customs-duty/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/import-tax/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/tariff-rates/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/calculate/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/incoterms/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/customs-broker/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/export-documents/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/trade-finance/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/import-from-china/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/hs-code-lookup/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/hs-code-finder/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/import-documents/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/import-restrictions/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/customs-clearance/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/category/medical/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/electronics/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/energy/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/textiles/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/food/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/automotive/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/industrial/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/chemicals/`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/methodology/`, lastModified: lastContentUpdate, changeFrequency: "monthly", priority: 0.5 },
        { url: `${baseUrl}/privacy/`, lastModified: lastPolicyUpdate, changeFrequency: "monthly", priority: 0.3 },
        { url: `${baseUrl}/terms/`, lastModified: lastPolicyUpdate, changeFrequency: "monthly", priority: 0.3 },
        { url: `${baseUrl}/disclaimer/`, lastModified: lastPolicyUpdate, changeFrequency: "monthly", priority: 0.3 },
        { url: `${baseUrl}/contact/`, lastModified: lastPolicyUpdate, changeFrequency: "monthly", priority: 0.4 },
        { url: `${baseUrl}/about/`, lastModified: lastContentUpdate, changeFrequency: "monthly", priority: 0.4 },
    ];

    // ── 2. Country pages ──
    const supportPages = [
        "import-duty-calculator", "import-duty", "import-tax", "hs-code-lookup",
        "duty-free-threshold", "customs-clearance", "import-restrictions",
        "import-documents", "shipping-customs-fees",
    ];

    const countryRoutes: MetadataRoute.Sitemap = [];
    for (const country of COUNTRIES) {
        countryRoutes.push({
            url: `${baseUrl}/${country.slug}/`,
            lastModified: lastContentUpdate,
            changeFrequency: "weekly",
            priority: 0.9,
        });
        for (const sp of supportPages) {
            countryRoutes.push({
                url: `${baseUrl}/${country.slug}/${sp}/`,
                lastModified: lastContentUpdate,
                changeFrequency: sp === "import-duty-calculator" ? "weekly" : "monthly",
                priority: sp === "import-duty-calculator" ? 0.85 : 0.6,
            });
        }
    }

    // ── 3. Dynamic calculation pages ──
    let dynamicRoutes: MetadataRoute.Sitemap = [];
    try {
        const supabase = getServerSupabase();
        const BATCH = 1000;
        let offset = 0;

        while (true) {
            const { data: pages, error } = await supabase
                .from("landed_costs")
                .select("slug, created_at")
                .not("slug", "is", null)
                .order("created_at", { ascending: false })
                .range(offset, offset + BATCH - 1);

            if (error || !pages || pages.length === 0) break;

            for (const p of pages) {
                dynamicRoutes.push({
                    url: `${baseUrl}/calculate/${p.slug}/`,
                    lastModified: new Date(p.created_at),
                    changeFrequency: "monthly" as const,
                    priority: 0.7,
                });
            }

            if (pages.length < BATCH) break;
            offset += BATCH;
        }
    } catch {
        // Non-fatal
    }

    return [...staticRoutes, ...countryRoutes, ...dynamicRoutes];
}
