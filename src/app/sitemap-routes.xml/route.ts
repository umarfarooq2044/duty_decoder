import { getServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com";
    const defaultDate = "2026-03-26T00:00:00Z";

    // Top verified high-value trade corridors as reliable fallback
    const CURATED_DEFAULT_SLUGS = [
        "graphics-card-from-cn-to-de",
        "medical-blood-pressure-monitors-from-tr-to-sa",
        "medical-endoscopic-cameras-from-vn-to-sg",
        "solar-panels-from-cn-to-gb",
        "lithium-batteries-from-cn-to-us",
        "electric-vehicles-from-cn-to-eu",
        "cotton-t-shirts-from-in-to-us",
        "leather-shoes-from-it-to-us",
        "automotive-parts-from-mx-to-us",
        "cnc-milling-from-jp-to-de",
    ];

    let routeUrls: Array<{ loc: string; lastmod: string }> = [];

    try {
        const supabase = getServerSupabase();
        // Fetch only routes with rich editorial guides (Quality Gate compliant)
        const { data: pages } = await supabase
            .from("landed_costs")
            .select("slug, created_at")
            .not("slug", "is", null)
            .not("guide_html", "is", null)
            .eq("needs_human_review", false)
            .order("created_at", { ascending: false })
            .limit(300);

        if (pages && pages.length > 0) {
            routeUrls = pages.map((p) => ({
                loc: `${baseUrl}/calculate/${p.slug}/`,
                lastmod: p.created_at ? new Date(p.created_at).toISOString() : defaultDate,
            }));
        }
    } catch {
        // Fallback to curated default corridors if database query times out
    }

    if (routeUrls.length === 0) {
        routeUrls = CURATED_DEFAULT_SLUGS.map((slug) => ({
            loc: `${baseUrl}/calculate/${slug}/`,
            lastmod: defaultDate,
        }));
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routeUrls
    .map(
        (r) => `  <url>
    <loc>${r.loc}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join("\n")}
</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
        },
    });
}
