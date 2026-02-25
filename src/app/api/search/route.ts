import { getServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
        return NextResponse.json({ results: [] });
    }

    try {
        const supabase = getServerSupabase();

        // Perform a flexible text search against the newly generated routes for instant discovery
        // We look for matches in the product description
        const { data, error } = await supabase
            .from("landed_costs")
            .select("slug, product_description, origin_country, destination_country")
            .ilike("product_description", `%${query}%`)
            .limit(5);

        if (error) throw error;

        return NextResponse.json({ results: data || [] });
    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json({ results: [], error: "Search failed" }, { status: 500 });
    }
}
