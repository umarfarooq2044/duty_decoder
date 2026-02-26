import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    headers: async () => [
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
