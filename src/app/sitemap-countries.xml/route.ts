import { COUNTRIES } from "@/lib/countries";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com";
    const lastContentUpdate = "2026-03-26T00:00:00Z";

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

    const urls: Array<{ loc: string; priority: string; changefreq: string }> = [];

    for (const country of COUNTRIES) {
        // Country Hub
        urls.push({
            loc: `${baseUrl}/${country.slug}/`,
            priority: "0.9",
            changefreq: "weekly",
        });

        // Country Support Pages
        for (const sp of supportPages) {
            urls.push({
                loc: `${baseUrl}/${country.slug}/${sp}/`,
                priority: sp === "import-duty-calculator" ? "0.85" : "0.65",
                changefreq: sp === "import-duty-calculator" ? "weekly" : "monthly",
            });
        }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
        (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastContentUpdate}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
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
