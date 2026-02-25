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
    const { data } = await supabase.from("country_hubs").select("import_tax_page").eq("country_slug", slug).maybeSingle();
    const pageData = data?.import_tax_page as any;

    return { title: pageData?.title, description: pageData?.meta_description };
}

export default async function Page({ params }: any) {
    const { "country-slug": slug } = await params;
    const { data } = await getServerSupabase().from("country_hubs").select("import_tax_page").eq("country_slug", slug).maybeSingle();
    return <CountrySupportPage slug={slug} pageType="import_tax_page" data={data?.import_tax_page} />;
}
