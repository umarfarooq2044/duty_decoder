import { MetadataRoute } from "next";
import { getServerSupabase } from "@/lib/supabase/server";
import { COUNTRIES } from "@/lib/countries";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://dutydecoder.com";
    const now = new Date();

    // ── 1. Static routes ──
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
        { url: `${baseUrl}/import-duty/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/customs-duty/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/import-tax/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/tariff-rates/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/calculate/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/hs-code-lookup/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/hs-code-finder/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/import-documents/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/import-restrictions/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/customs-clearance/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/category/medical/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/electronics/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/energy/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/textiles/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/food/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/automotive/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/industrial/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/chemicals/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/methodology/`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
        { url: `${baseUrl}/privacy/`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
        { url: `${baseUrl}/terms/`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
        { url: `${baseUrl}/disclaimer/`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
        { url: `${baseUrl}/contact/`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
        { url: `${baseUrl}/about/`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
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
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.9,
        });
        for (const sp of supportPages) {
            countryRoutes.push({
                url: `${baseUrl}/${country.slug}/${sp}/`,
                lastModified: now,
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
