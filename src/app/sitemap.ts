import { MetadataRoute } from "next";
import { getServerSupabase } from "@/lib/supabase/server";
import { COUNTRIES } from "@/lib/countries";

export const dynamic = "force-dynamic";
export const revalidate = 86400; // Cache for 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = getServerSupabase();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://duty-decoder.com";
    const now = new Date();

    // ── 1. Static / Global routes ──────────────────────────────────────────
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
        { url: `${baseUrl}/import-duty`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/customs-duty`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/import-tax`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/tariff-rates`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/calculate`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/hs-code-lookup`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/hs-code-finder`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/import-documents`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/import-restrictions`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/customs-clearance`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        // Category pages
        { url: `${baseUrl}/category/medical`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/electronics`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/energy`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/textiles`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/food`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/automotive`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/industrial`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/category/chemicals`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        // Legal / Info
        { url: `${baseUrl}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
        { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
        { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
        { url: `${baseUrl}/disclaimer`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    ];

    // ── 2. Country hub + sub-pages (guaranteed from COUNTRIES array) ────────
    const supportPages = [
        "import-duty-calculator",
        "import-duty",
        "import-tax",
        "hs-code-lookup",
        "duty-free-threshold",
        "customs-clearance",
        "import-restrictions",
        "import-documents",
        "shipping-customs-fees",
    ];

    // Try to get accurate lastModified from Supabase; fall back to now
    let hubUpdatedAt: Record<string, Date> = {};
    try {
        const { data: hubs } = await supabase
            .from("country_hubs")
            .select("country_slug, updated_at");
        if (hubs) {
            for (const h of hubs) {
                hubUpdatedAt[h.country_slug] = new Date(h.updated_at);
            }
        }
    } catch {
        // Non-fatal: fall back to current date
    }

    const countryRoutes: MetadataRoute.Sitemap = [];
    for (const country of COUNTRIES) {
        const lastMod = hubUpdatedAt[country.slug] ?? now;
        countryRoutes.push({
            url: `${baseUrl}/${country.slug}`,
            lastModified: lastMod,
            changeFrequency: "weekly",
            priority: 0.9,
        });
        for (const sp of supportPages) {
            countryRoutes.push({
                url: `${baseUrl}/${country.slug}/${sp}`,
                lastModified: lastMod,
                changeFrequency: sp === "import-duty-calculator" ? "weekly" : "monthly",
                priority: sp === "import-duty-calculator" ? 0.85 : 0.6,
            });
        }
    }

    // ── 3. Dynamic calculation pages (/calculate/[slug]) ─────────────────
    // Paginate in batches of 1000 — Supabase caps each request at 1000 rows
    let dynamicRoutes: MetadataRoute.Sitemap = [];
    try {
        const BATCH = 1000;
        let offset = 0;
        let fetchedAll = false;

        while (!fetchedAll) {
            const { data: pages, error } = await supabase
                .from("landed_costs")
                .select("slug, created_at")
                .not("slug", "is", null)
                .order("created_at", { ascending: false })
                .range(offset, offset + BATCH - 1);

            if (error || !pages || pages.length === 0) {
                fetchedAll = true;
            } else {
                for (const p of pages) {
                    dynamicRoutes.push({
                        url: `${baseUrl}/calculate/${p.slug}/`,
                        lastModified: new Date(p.created_at),
                        changeFrequency: "monthly" as const,
                        priority: 0.7,
                    });
                }
                // If fewer than BATCH rows returned, we've reached the end
                fetchedAll = pages.length < BATCH;
                offset += BATCH;
            }
        }
    } catch {
        // Non-fatal — sitemap still returns static + country routes
    }

    return [...staticRoutes, ...countryRoutes, ...dynamicRoutes];
}
