import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import { MegaMenu } from "@/components/MegaMenu";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NavigationProgress } from "@/components/NavigationProgress";
import "./globals.css";

/* ── Self-hosted Google Fonts via next/font (eliminates render-blocking CSS) ── */
const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    display: "swap",
    variable: "--font-jetbrains",
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com"),
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
    alternates: {
        languages: {
            "en": "/",
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
        <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="alternate" hrefLang="en" href="https://dutydecoder.com/" />
                <link rel="alternate" hrefLang="x-default" href="https://dutydecoder.com/" />
            </head>
            <body className="bg-background text-foreground min-h-screen flex flex-col" suppressHydrationWarning>
                <Suspense fallback={null}>
                    <NavigationProgress />
                </Suspense>
                <MegaMenu />

                <div className="page-content" style={{ flex: 1, paddingTop: "80px" }}>
                    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
                        <Breadcrumbs />
                    </div>
                    {children}
                </div>

                <Footer />

                {/* ── GA4 — loads after page is interactive (no longer render-blocking) ── */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-G74QF4WDSL"
                    strategy="afterInteractive"
                />
                <Script id="gtag-init" strategy="afterInteractive">
                    {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-G74QF4WDSL');`}
                </Script>

                {/* ── AdSense — loads after page is interactive (no longer render-blocking) ── */}
                <Script
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6219371790903754"
                    strategy="afterInteractive"
                    crossOrigin="anonymous"
                />
            </body>
        </html>
    );
}
