import type { Metadata } from "next";
import { getCachedLandedCostBySlug } from "@/lib/cache";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const data = await getCachedLandedCostBySlug(slug);

        if (!data) {
            return {
                title: "Calculation Not Found | Duty Decoder",
                description: "The requested landed cost calculation was not found.",
            };
        }

        const calculation = data as {
            product_description: string;
            destination_country: string;
            total_landed_cost: number;
            currency: string;
            hts_codes?: { hts_code: string; description: string };
        };

        const countryLabel =
            calculation.destination_country === "US" ? "United States" :
                calculation.destination_country === "GB" ? "United Kingdom" :
                    calculation.destination_country === "EU" ? "European Union" :
                        calculation.destination_country === "PK" ? "Pakistan" :
                            calculation.destination_country;

        const title = `Landed Cost: ${calculation.product_description} → ${countryLabel} | Duty Decoder`;
        const description = `Total landed cost for "${calculation.product_description}" imported to ${countryLabel}: ${calculation.total_landed_cost} ${calculation.currency}. Includes customs duty, VAT, and fees.`;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://dutydecoder.com";
        const canonicalUrl = `${baseUrl}/calculate/${slug}/`;

        return {
            title,
            description,
            alternates: {
                canonical: canonicalUrl,
                languages: {
                    "en-US": `${baseUrl}/calculate/${slug}?region=us`,
                    "en-GB": `${baseUrl}/calculate/${slug}?region=gb`,
                    "en-PK": `${baseUrl}/calculate/${slug}?region=pk`,
                },
            },
            openGraph: {
                title,
                description,
                url: canonicalUrl,
                siteName: "Duty Decoder",
                type: "website",
                locale: "en_US",
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
            },
            robots: {
                index: true,
                follow: true,
                noarchive: true, // AEO: prevent AI scraping full DB
            },
        };
    } catch {
        return {
            title: "Landed Cost Calculator | Duty Decoder",
            description: "Calculate landed costs for international trade with real-time HTS classification and duty calculations.",
        };
    }
}

export default function CalculateLayout({ children }: LayoutProps) {
    return <>{children}</>;
}
