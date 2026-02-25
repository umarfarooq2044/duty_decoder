import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://dutydecoder.com";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/_next/", "/cdn-cgi/"],
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
            // Block aggressive AI scrapers from stealing content
            {
                userAgent: "GPTBot",
                disallow: ["/"],
            },
            {
                userAgent: "ChatGPT-User",
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
