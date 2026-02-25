import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

/**
 * Browser-side Supabase client using anon key.
 * Respects RLS policies. Singleton for the browser session.
 */
export function getBrowserSupabase(): SupabaseClient {
    if (browserClient) return browserClient;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }

    browserClient = createClient(url, anonKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
        },
    });

    return browserClient;
}
