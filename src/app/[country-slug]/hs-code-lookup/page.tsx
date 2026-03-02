import { COUNTRY_BY_SLUG, ALL_COUNTRY_SLUGS } from "@/lib/countries";
import { getServerSupabase } from "@/lib/supabase/server";
import { CountrySupportPage } from "@/components/CountrySupportPage";
import type { Metadata } from "next";

export async function generateStaticParams() {
    return ALL_COUNTRY_SLUGS.map(slug => ({ "country-slug": slug }));
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
    const { "country-slug": slug } = await params;
    const country = COUNTRY_BY_SLUG[slug];
    if (!country) return {};

    const supabase = getServerSupabase();
    const { data } = await supabase.from("country_hubs").select("hs_code_page").eq("country_slug", slug).maybeSingle();
    const pageData = data?.hs_code_page as any;

    const title = pageData?.title || `${country.name} hs code lookup`;
    const description = pageData?.meta_description || `Comprehensive hs code lookup guide for ${country.name}.`;

    return {
        title,
        description,
        alternates: { canonical: `/${slug}/hs-code-lookup/` },
        openGraph: {
            title,
            description,
            url: `/${slug}/hs-code-lookup`,
            type: "article",
        }
    };
}

export default async function Page({ params }: any) {
    const { "country-slug": slug } = await params;
    const { data } = await getServerSupabase().from("country_hubs").select("hs_code_page").eq("country_slug", slug).maybeSingle();
    return <CountrySupportPage slug={slug} pageType="hs_code_page" data={data?.hs_code_page} />;
}
