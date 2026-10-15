import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { Manrope, Inter, JetBrains_Mono } from "next/font/google";
import { MegaMenu } from "@/components/MegaMenu";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NavigationProgress } from "@/components/NavigationProgress";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import "./globals.css";

/* ── Self-hosted Google Fonts via next/font (eliminates render-blocking CSS) ── */
const heading = Manrope({
    subsets: ["latin"],
    weight: ["700", "800"],
    display: "swap",
    variable: "--font-heading",
});

const body = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    display: "swap",
    variable: "--font-body",
});

const mono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["500"],
    display: "swap",
    variable: "--font-mono",
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
    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
        other: {
            ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : {}),
        },
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${heading.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
            <head>

                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="max-image-preview:large" />
                <meta name="google-adsense-account" content={process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-6219371790903754"} />
                <link rel="alternate" hrefLang="en" href="https://dutydecoder.com/" />
                <link rel="alternate" hrefLang="x-default" href="https://dutydecoder.com/" />

                {/* ── Resource Preconnects for Faster Mobile First Contentful Paint ── */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
                <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

                {/* ── Google Consent Mode v2 Default (denied until user explicit choice) ── */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{'ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','analytics_storage':'denied','wait_for_update':500});`,
                    }}
                />
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
                <CookieConsentBanner />

                {/* ── GA4 & AdSense — loaded during idle time via lazyOnload so mobile main-thread stays free ── */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-G74QF4WDSL"
                    strategy="lazyOnload"
                />
                <Script id="gtag-init" strategy="lazyOnload">
                    {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-G74QF4WDSL');`}
                </Script>
                <Script
                    id="adsense-loader"
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-6219371790903754"}`}
                    strategy="lazyOnload"
                    crossOrigin="anonymous"
                />
            </body>
        </html>
    );
}
