import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

let serverClient: SupabaseClient | null = null;

/**
 * Server-side Supabase client using service-role key.
 * Bypasses RLS — use only in API routes and server components.
 * Singleton to avoid creating multiple connections.
 */
export function getServerSupabase(): SupabaseClient {
    if (serverClient) return serverClient;

    serverClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
        db: {
            schema: "public",
        },
    });

    return serverClient;
}
