import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    compress: true,
    poweredByHeader: false,
    trailingSlash: true,
    experimental: {
        optimizePackageImports: ["lucide-react", "decimal.js"],
    },
    async redirects() {
        return [
            {
                source: "/:path*",
                has: [{ type: "host", value: "www.dutydecoder.com" }],
                destination: "https://dutydecoder.com/:path*",
                permanent: true,
            },
        ];
    },
    headers: async () => [
        {
            source: "/:path*",
            headers: [
                {
                    key: "Strict-Transport-Security",
                    value: "max-age=63072000; includeSubDomains; preload",
                },
                {
                    key: "Content-Security-Policy",
                    value: "upgrade-insecure-requests",
                },
            ],
        },
        {
            source: "/calculate/:slug*",
            headers: [
                {
                    key: "x-robots-tag",
                    value: "noarchive",
                },
            ],
        },
    ],
};

export default nextConfig;
