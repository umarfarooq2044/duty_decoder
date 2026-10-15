import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com";
    const lastmod = new Date("2026-03-26T00:00:00Z").toISOString();

    const sitemaps = [
        `${baseUrl}/sitemap-pages.xml`,
        `${baseUrl}/sitemap-guides.xml`,
        `${baseUrl}/sitemap-countries.xml`,
        `${baseUrl}/sitemap-routes.xml`,
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
    .map(
        (url) => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
    )
    .join("\n")}
</sitemapindex>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
        },
    });
}
