/**
 * In-memory sliding window rate limiter.
 * Tracks requests per IP with configurable limits.
 * Auto-cleans expired entries to prevent memory leaks.
 */

interface RateLimitEntry {
    timestamps: number[];
}

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    retryAfterMs: number;
    total: number;
}

interface RateLimiterConfig {
    /** Max requests allowed in the window */
    maxRequests: number;
    /** Time window in milliseconds */
    windowMs: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

// Clean up expired entries every 5 minutes
let cleanupInterval: NodeJS.Timeout | null = null;

function ensureCleanup() {
    if (cleanupInterval) return;
    cleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const [, store] of stores) {
            for (const [key, entry] of store) {
                // Remove timestamps older than 10 minutes
                entry.timestamps = entry.timestamps.filter(t => now - t < 600_000);
                if (entry.timestamps.length === 0) {
                    store.delete(key);
                }
            }
        }
    }, 300_000); // every 5 min
    // Don't prevent Node from exiting
    if (cleanupInterval.unref) cleanupInterval.unref();
}

/**
 * Create a rate limiter with the given config.
 * Each limiter has its own store keyed by a unique name.
 */
export function createRateLimiter(name: string, config: RateLimiterConfig) {
    if (!stores.has(name)) {
        stores.set(name, new Map());
    }
    ensureCleanup();

    const store = stores.get(name)!;

    return {
        /**
         * Check and consume a rate limit token for the given key (usually an IP).
         */
        check(key: string): RateLimitResult {
            const now = Date.now();
            const windowStart = now - config.windowMs;

            let entry = store.get(key);
            if (!entry) {
                entry = { timestamps: [] };
                store.set(key, entry);
            }

            // Remove expired timestamps
            entry.timestamps = entry.timestamps.filter(t => t > windowStart);

            if (entry.timestamps.length >= config.maxRequests) {
                // Rate limited
                const oldestInWindow = entry.timestamps[0] ?? now;
                const retryAfterMs = oldestInWindow + config.windowMs - now;
                return {
                    allowed: false,
                    remaining: 0,
                    retryAfterMs: Math.max(retryAfterMs, 1000),
                    total: config.maxRequests,
                };
            }

            // Allow and record
            entry.timestamps.push(now);
            return {
                allowed: true,
                remaining: config.maxRequests - entry.timestamps.length,
                retryAfterMs: 0,
                total: config.maxRequests,
            };
        },

        /**
         * Get current count without consuming a token.
         */
        peek(key: string): number {
            const entry = store.get(key);
            if (!entry) return 0;
            const windowStart = Date.now() - config.windowMs;
            return entry.timestamps.filter(t => t > windowStart).length;
        },
    };
}

// ─── Pre-configured rate limiters for our APIs ───

/** Calculator: 5 requests per 60 seconds per IP */
export const calculatorLimiter = createRateLimiter("calculator", {
    maxRequests: 5,
    windowMs: 60_000,
});

/** HS Code Finder: 10 requests per 60 seconds per IP */
export const hsFinderLimiter = createRateLimiter("hs-finder", {
    maxRequests: 10,
    windowMs: 60_000,
});

/**
 * Extract the client IP from a Next.js request.
 * Checks x-forwarded-for, x-real-ip, then falls back to 'unknown'.
 */
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        const first = forwarded.split(",")[0];
        if (first) return first.trim();
    }
    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp.trim();
    return "unknown";
}

/**
 * Quick bot signal detection.
 * Returns true if the request looks suspicious.
 */
export function isSuspiciousRequest(request: Request): boolean {
    // No user agent → likely a bot
    const ua = request.headers.get("user-agent");
    if (!ua || ua.length < 10) return true;

    // Known bot patterns
    const botPatterns = [
        /bot\b/i, /crawl/i, /spider/i, /scrape/i,
        /curl/i, /wget/i, /python-requests/i, /go-http/i,
        /node-fetch/i, /axios/i, /httpie/i,
    ];
    if (botPatterns.some(p => p.test(ua))) return true;

    // Missing common browser headers
    const accept = request.headers.get("accept");
    if (!accept) return true;

    return false;
}
