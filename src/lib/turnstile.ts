/**
 * Server-side Cloudflare Turnstile token verification.
 * Calls Cloudflare's siteverify endpoint.
 */

interface TurnstileVerifyResult {
    success: boolean;
    errorCodes: string[];
}

/** Tokens that indicate client-side bypass (localhost, timeout, load error) */
const BYPASS_TOKENS = [
    "dev-mode-no-turnstile",
    "localhost-turnstile-bypass",
    "turnstile-timeout-bypass",
    "turnstile-load-error-bypass",
];

/**
 * Verify a Turnstile token with Cloudflare.
 * Returns { success, errorCodes }.
 *
 * Bypass conditions (returns success automatically):
 * - No TURNSTILE_SECRET_KEY configured (development)
 * - NODE_ENV === "development"
 * - Using Cloudflare's dummy test keys
 * - Token is a known client-side bypass token (localhost, timeout, etc.)
 */
export async function verifyTurnstileToken(
    token: string,
    remoteIp?: string
): Promise<TurnstileVerifyResult> {
    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    // Fail-open if Turnstile is not configured (development)
    if (!secretKey) {
        console.warn("[Turnstile] No TURNSTILE_SECRET_KEY configured — skipping verification");
        return { success: true, errorCodes: [] };
    }

    // Skip verification in development mode or when using Cloudflare's dummy test keys
    if (
        process.env.NODE_ENV === "development" ||
        secretKey.startsWith("1x000000000000000000000000000000")
    ) {
        return { success: true, errorCodes: [] };
    }

    // Accept known bypass tokens from the client (localhost, script errors, timeouts)
    if (BYPASS_TOKENS.includes(token)) {
        console.info(`[Turnstile] Accepted bypass token: ${token}`);
        return { success: true, errorCodes: [] };
    }

    // Missing token → fail
    if (!token) {
        return { success: false, errorCodes: ["missing-input-response"] };
    }

    try {
        const formData = new URLSearchParams();
        formData.append("secret", secretKey);
        formData.append("response", token);
        if (remoteIp) {
            formData.append("remoteip", remoteIp);
        }

        const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString(),
        });

        if (!res.ok) {
            console.error(`[Turnstile] HTTP ${res.status} from siteverify`);
            // Fail-open on HTTP errors to avoid blocking legitimate users
            return { success: true, errorCodes: [`http-${res.status}`] };
        }

        const data = await res.json();
        return {
            success: !!data.success,
            errorCodes: data["error-codes"] || [],
        };
    } catch (err) {
        console.error("[Turnstile] Verification error:", err);
        // Fail-open on network errors to avoid blocking legitimate users
        return { success: true, errorCodes: ["network-error"] };
    }
}
