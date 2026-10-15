import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://dutydecoder.com";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/"],
            },
            // Explicitly allow Google AdSense review crawler
            {
                userAgent: "Mediapartners-Google",
                allow: "/",
            },
            // Allow search engine bots explicitly for maximum crawl budget
            {
                userAgent: "Googlebot",
                allow: "/",
                disallow: ["/api/"],
            },
            {
                userAgent: "Bingbot",
                allow: "/",
                disallow: ["/api/"],
            },
            // Allow AI Search indexers to cite DutyDecoder in generative answers (GEO)
            {
                userAgent: "ChatGPT-User",
                allow: "/",
                disallow: ["/api/"],
            },
            {
                userAgent: "PerplexityBot",
                allow: "/",
                disallow: ["/api/"],
            },
            // Block raw AI scrapers from mass-scraping database
            {
                userAgent: "GPTBot",
                disallow: ["/"],
            },
            {
                userAgent: "CCBot",
                disallow: ["/"],
            },

            {
                userAgent: "anthropic-ai",
                disallow: ["/"],
            },
            {
                userAgent: "Claude-Web",
                disallow: ["/"],
            },
            {
                userAgent: "Omgilibot",
                disallow: ["/"],
            },
            {
                userAgent: "Bytespider",
                disallow: ["/"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
