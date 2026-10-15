export const dynamic = "force-dynamic";
export const revalidate = 86400;

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com";
    const lastContentUpdate = "2026-03-26T00:00:00Z";
    const lastPolicyUpdate = "2026-03-26T00:00:00Z";

    const pages = [
        { loc: `${baseUrl}/`, lastmod: lastContentUpdate, changefreq: "weekly", priority: "1.0" },
        { loc: `${baseUrl}/calculate/`, lastmod: lastContentUpdate, changefreq: "weekly", priority: "0.9" },
        { loc: `${baseUrl}/hs-code-finder/`, lastmod: lastContentUpdate, changefreq: "weekly", priority: "0.9" },
        { loc: `${baseUrl}/sitemap/`, lastmod: lastContentUpdate, changefreq: "monthly", priority: "0.5" },
        { loc: `${baseUrl}/about/`, lastmod: lastContentUpdate, changefreq: "monthly", priority: "0.6" },
        { loc: `${baseUrl}/contact/`, lastmod: lastPolicyUpdate, changefreq: "monthly", priority: "0.5" },
        { loc: `${baseUrl}/privacy/`, lastmod: lastPolicyUpdate, changefreq: "monthly", priority: "0.4" },
        { loc: `${baseUrl}/terms/`, lastmod: lastPolicyUpdate, changefreq: "monthly", priority: "0.4" },
        { loc: `${baseUrl}/disclaimer/`, lastmod: lastPolicyUpdate, changefreq: "monthly", priority: "0.4" },
        { loc: `${baseUrl}/methodology/`, lastmod: lastContentUpdate, changefreq: "monthly", priority: "0.7" },
        { loc: `${baseUrl}/data-sources/`, lastmod: lastContentUpdate, changefreq: "monthly", priority: "0.6" },
        { loc: `${baseUrl}/editorial-policy/`, lastmod: lastContentUpdate, changefreq: "monthly", priority: "0.6" },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
    .map(
        (p) => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
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
