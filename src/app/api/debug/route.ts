import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";

/**
 * Diagnostic endpoint — hit /api/debug/ to check what's wrong on the server.
 * DELETE THIS AFTER DEBUGGING.
 */
export async function GET() {
    const checks: Record<string, string> = {};

    // 1. Environment variables
    checks["NODE_ENV"] = process.env.NODE_ENV || "NOT SET";
    checks["NEXT_PUBLIC_SUPABASE_URL"] = process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ SET" : "❌ MISSING";
    checks["NEXT_PUBLIC_SUPABASE_ANON_KEY"] = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ SET" : "❌ MISSING";
    checks["SUPABASE_SERVICE_ROLE_KEY"] = process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ SET" : "❌ MISSING";
    checks["GROQ_API_KEY"] = process.env.GROQ_API_KEY ? "✅ SET" : "❌ MISSING";
    checks["NEXT_PUBLIC_BASE_URL"] = process.env.NEXT_PUBLIC_BASE_URL || "NOT SET";

    // 2. Node.js version
    checks["node_version"] = process.version;

    // 3. Supabase connection test
    try {
        const supabase = getServerSupabase();
        const { data, error } = await supabase
            .from("landed_costs")
            .select("slug")
            .limit(1);

        if (error) {
            checks["supabase_connection"] = `❌ ERROR: ${error.message}`;
        } else if (data && data.length > 0) {
            checks["supabase_connection"] = `✅ Connected - found slug: ${data[0]?.slug}`;
        } else {
            checks["supabase_connection"] = "✅ Connected but no data found";
        }
    } catch (err: any) {
        checks["supabase_connection"] = `❌ CRASH: ${err.message}`;
    }

    // 4. Test Intl.DisplayNames
    try {
        const name = new Intl.DisplayNames(['en'], { type: 'region' }).of("US");
        checks["intl_display_names"] = `✅ Working (US = ${name})`;
    } catch (err: any) {
        checks["intl_display_names"] = `❌ CRASH: ${err.message}`;
    }

    // 5. Test a specific slug lookup
    try {
        const supabase = getServerSupabase();
        const { data, error } = await supabase
            .from("landed_costs")
            .select("id, slug, product_description, destination_country, origin_country")
            .eq("slug", "singapore-to-pakistan-textiles-quotas")
            .single();

        if (error) {
            checks["slug_lookup"] = `❌ ERROR: ${error.message}`;
        } else if (data) {
            checks["slug_lookup"] = `✅ Found: ${data.product_description} (${data.origin_country} → ${data.destination_country})`;
        } else {
            checks["slug_lookup"] = "❌ No data returned";
        }
    } catch (err: any) {
        checks["slug_lookup"] = `❌ CRASH: ${err.message}`;
    }

    return NextResponse.json(checks, {
        headers: { "Cache-Control": "no-store" },
    });
}
