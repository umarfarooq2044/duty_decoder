export const dynamic = "force-dynamic";
export const revalidate = 86400;

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com";
    const lastContentUpdate = "2026-03-26T00:00:00Z";

    const guides = [
        `${baseUrl}/import-duty/`,
        `${baseUrl}/customs-duty/`,
        `${baseUrl}/import-tax/`,
        `${baseUrl}/tariff-rates/`,
        `${baseUrl}/incoterms/`,
        `${baseUrl}/customs-broker/`,
        `${baseUrl}/export-documents/`,
        `${baseUrl}/trade-finance/`,
        `${baseUrl}/import-from-china/`,
        `${baseUrl}/hs-code-lookup/`,
        `${baseUrl}/import-documents/`,
        `${baseUrl}/import-restrictions/`,
        `${baseUrl}/customs-clearance/`,
        `${baseUrl}/category/medical/`,
        `${baseUrl}/category/electronics/`,
        `${baseUrl}/category/energy/`,
        `${baseUrl}/category/textiles/`,
        `${baseUrl}/category/food/`,
        `${baseUrl}/category/automotive/`,
        `${baseUrl}/category/industrial/`,
        `${baseUrl}/category/chemicals/`,
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${guides
    .map(
        (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastContentUpdate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
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
