import { z } from "zod";

const envSchema = z.object({
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().default(""),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default(""),
    SUPABASE_SERVICE_ROLE_KEY: z.string().default(""),

    // Groq AI
    GROQ_API_KEY: z.string().default(""),

    // App
    NEXT_PUBLIC_BASE_URL: z.string().default("https://dutydecoder.com"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Safe environment validation — NEVER throws.
 * Returns validated env or raw process.env fallbacks.
 */
function validateEnv(): Env {
    const result = envSchema.safeParse(process.env);

    if (result.success) {
        return result.data;
    }

    // Validation failed — log warning, return raw process.env with safe fallbacks
    console.warn("[env] Validation issue — using raw process.env fallbacks");

    return {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
        GROQ_API_KEY: process.env.GROQ_API_KEY ?? "",
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ?? "https://dutydecoder.com",
        NODE_ENV: (process.env.NODE_ENV as "development" | "production" | "test") ?? "production",
    };
}

export const env = validateEnv();
