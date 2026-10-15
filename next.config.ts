import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    trailingSlash: true,
    // skipTrailingSlashRedirect: true,
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
