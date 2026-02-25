import { NextResponse, type NextRequest } from "next/server";

// ============================================================
// Rate Limiting Middleware (Sliding Window)
// ============================================================

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

function getRateLimitKey(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
    return ip;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetAt) {
        // New window
        rateLimitMap.set(key, { count: 1, resetAt: now + WINDOW_MS });
        return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt: now + WINDOW_MS };
    }

    entry.count++;
    const remaining = Math.max(0, MAX_REQUESTS - entry.count);
    return { allowed: entry.count <= MAX_REQUESTS, remaining, resetAt: entry.resetAt };
}

// Clean up expired entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
        if (now > entry.resetAt) {
            rateLimitMap.delete(key);
        }
    }
}, 60_000);

// ============================================================
// Middleware
// ============================================================

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Temporarily disabled rate limiting for live deployment
    if (pathname.startsWith("/api/")) {
        return NextResponse.next();

        /*
        const key = getRateLimitKey(request);
        const { allowed, remaining, resetAt } = checkRateLimit(key);

        if (!allowed) {
            return NextResponse.json(
                {
                    error: {
                        code: "RATE_LIMIT_EXCEEDED",
                        message: "Too many requests. Please try again later.",
                    },
                },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
                        "X-RateLimit-Limit": String(MAX_REQUESTS),
                        "X-RateLimit-Remaining": "0",
                        "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
                    },
                }
            );
        }

        // Add rate limit headers to response
        const response = NextResponse.next();
        response.headers.set("X-RateLimit-Limit", String(MAX_REQUESTS));
        response.headers.set("X-RateLimit-Remaining", String(remaining));
        response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));

        return response;
        */
    }

    // AEO & SEO Redirects on calculation pages
    if (pathname.startsWith("/calculate/")) {
        const pathParts = pathname.split('/');
        if (pathParts.length >= 3) {
            const slug = pathParts[2];
            // Match trailing -uuid or -timestamp to catch legacy routes
            const legacySlugMatch = slug?.match(/^(.*)-[a-f0-9]{8,}$|^(.*)-\d{10,}$/);

            if (legacySlugMatch) {
                const cleanBase = legacySlugMatch[1] || legacySlugMatch[2];
                if (cleanBase) {
                    const url = request.nextUrl.clone();
                    url.pathname = `/calculate/${cleanBase}`;
                    return NextResponse.redirect(url, 301); // 301 Permanent Redirect
                }
            }
        }

        const response = NextResponse.next();
        response.headers.set("x-robots-tag", "noarchive");
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/:path*", "/calculate/:path*"],
};
