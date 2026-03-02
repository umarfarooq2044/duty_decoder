import type { Metadata } from "next";
import { MegaMenu } from "@/components/MegaMenu";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://duty-decoder.com"),
    title: {
        default: "DutyDecoder — Free Import Duty & Landed Cost Calculator 2026",
        template: "%s | DutyDecoder",
    },
    description:
        "Calculate landed costs, classify HS codes, and decode customs duties for 50+ countries. Free AI-powered tariff classification with real-time 2026 duty calculations.",
    keywords: [
        "landed cost calculator",
        "import duty calculator",
        "HS code lookup",
        "customs duty calculator",
        "import duty",
        "tariff classification",
        "de minimis",
        "trade compliance",
        "import tax calculator",
        "2026 tariff rates",
    ],
    openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "DutyDecoder",
        title: "DutyDecoder — Free Import Duty & Landed Cost Calculator",
        description: "Calculate import duties, VAT, and total landed costs for 50+ countries. Free AI-powered tariff classification.",
    },
    twitter: {
        card: "summary_large_image",
        title: "DutyDecoder — Free Import Duty Calculator",
        description: "AI-powered import duty calculator covering 50+ countries with 2026 tariff data.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    // Uncomment and replace with your actual Google Search Console verification code:
    // verification: {
    //     google: "your-google-verification-code",
    // },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
                    rel="stylesheet"
                />
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6219371790903754"
                    crossOrigin="anonymous"
                ></script>
            </head>
            <body className="bg-background text-foreground min-h-screen flex flex-col" suppressHydrationWarning>
                <MegaMenu />

                <div className="page-content" style={{ flex: 1, paddingTop: "80px" }}>
                    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
                        <Breadcrumbs />
                    </div>
                    {children}
                </div>

                <Footer />
            </body>
        </html>
    );
}
