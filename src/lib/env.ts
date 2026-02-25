import { z } from "zod";

const envSchema = z.object({
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),

    // Groq AI
    GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required"),

    // App
    NEXT_PUBLIC_BASE_URL: z.string().url("NEXT_PUBLIC_BASE_URL must be a valid URL"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        const formatted = result.error.format();
        const messages = Object.entries(formatted)
            .filter(([key]) => key !== "_errors")
            .map(([key, value]) => {
                const errors = (value as { _errors: string[] })._errors;
                return `  ⚠️  ${key}: ${errors.join(", ")}`;
            })
            .join("\n");

        // In production, log a warning but don't crash the server
        // In development, throw so developers fix it immediately
        if (process.env.NODE_ENV === "production") {
            console.warn(
                `\n⚠️  Environment validation warnings:\n${messages}\n\nSome features may not work correctly.\n`
            );
            // Return partial env with safe fallbacks
            return {
                NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
                NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
                SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
                GROQ_API_KEY: process.env.GROQ_API_KEY || "",
                NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "https://dutydecoder.com",
                NODE_ENV: (process.env.NODE_ENV as "development" | "production" | "test") || "production",
            };
        }

        throw new Error(
            `\n🚨 Environment validation failed:\n${messages}\n\nPlease check your .env.local file.\n`
        );
    }

    return result.data;
}

export const env = validateEnv();
