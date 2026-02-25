"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface TurnstileWidgetProps {
    /** Called when Turnstile produces a token */
    onToken: (token: string) => void;
    /** Called when the token expires (user needs to re-verify) */
    onExpire?: () => void;
    /** Called on error */
    onError?: (error: string) => void;
    /** Widget size: managed (shows when needed), invisible, normal, or compact */
    size?: "managed" | "invisible" | "normal" | "compact";
}

declare global {
    interface Window {
        turnstile?: {
            render: (container: HTMLElement, options: Record<string, unknown>) => string;
            reset: (widgetId: string) => void;
            remove: (widgetId: string) => void;
        };
        onTurnstileLoad?: () => void;
    }
}

/**
 * Cloudflare Turnstile CAPTCHA widget.
 * Loads the Turnstile script dynamically and renders a managed challenge.
 * Falls back gracefully on localhost / when keys aren't configured.
 */
export function TurnstileWidget({
    onToken,
    onExpire,
    onError,
    size = "managed",
}: TurnstileWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const scriptLoadedRef = useRef(false);
    const [status, setStatus] = useState<"loading" | "ready" | "verified" | "error" | "dev">("loading");

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    // Detect if running on localhost
    const isLocalhost = typeof window !== "undefined" && (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "0.0.0.0"
    );

    const renderWidget = useCallback(() => {
        if (!containerRef.current || !window.turnstile || !siteKey) return;
        if (widgetIdRef.current) return; // Already rendered

        try {
            widgetIdRef.current = window.turnstile.render(containerRef.current, {
                sitekey: siteKey,
                size,
                callback: (token: string) => {
                    setStatus("verified");
                    onToken(token);
                },
                "expired-callback": () => {
                    widgetIdRef.current = null;
                    setStatus("ready");
                    onExpire?.();
                },
                "error-callback": (code: string) => {
                    console.warn("[Turnstile] Widget error:", code);
                    setStatus("error");
                    // On error, provide a bypass token so the form still works
                    // The server will also bypass on localhost
                    if (isLocalhost) {
                        onToken("localhost-turnstile-bypass");
                    }
                    onError?.(code);
                },
                theme: "dark",
                appearance: "always",
            });
            setStatus("ready");
        } catch (err) {
            console.warn("[Turnstile] Render failed:", err);
            setStatus("error");
            // Graceful fallback
            if (isLocalhost) {
                onToken("localhost-turnstile-bypass");
            }
        }
    }, [siteKey, size, onToken, onExpire, onError, isLocalhost]);

    useEffect(() => {
        // No site key OR localhost → skip Turnstile entirely
        if (!siteKey || isLocalhost) {
            if (isLocalhost) {
                console.info("[Turnstile] Localhost detected — CAPTCHA bypassed for development");
            } else {
                console.warn("[Turnstile] No NEXT_PUBLIC_TURNSTILE_SITE_KEY — widget disabled");
            }
            setStatus("dev");
            onToken("dev-mode-no-turnstile");
            return;
        }

        // Load the Turnstile script if not already loaded
        if (!scriptLoadedRef.current && !document.querySelector('script[src*="turnstile"]')) {
            const script = document.createElement("script");
            script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit";
            script.async = true;
            script.defer = true;

            // Timeout: if script doesn't load within 5s, bypass
            const timeout = setTimeout(() => {
                if (!scriptLoadedRef.current) {
                    console.warn("[Turnstile] Script load timeout — bypassing CAPTCHA");
                    setStatus("error");
                    onToken("turnstile-timeout-bypass");
                }
            }, 5000);

            window.onTurnstileLoad = () => {
                clearTimeout(timeout);
                scriptLoadedRef.current = true;
                renderWidget();
            };

            script.onerror = () => {
                clearTimeout(timeout);
                console.warn("[Turnstile] Script failed to load — bypassing CAPTCHA");
                setStatus("error");
                onToken("turnstile-load-error-bypass");
            };

            document.head.appendChild(script);
        } else if (window.turnstile) {
            // Script already loaded
            scriptLoadedRef.current = true;
            renderWidget();
        }

        return () => {
            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, [siteKey, renderWidget, onToken, isLocalhost]);

    // Dev/localhost bypass — show a small badge instead of nothing
    if (status === "dev") {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.75rem",
                background: "rgba(34, 197, 94, 0.08)",
                borderRadius: "6px",
                fontSize: "0.8rem",
                color: "var(--muted-foreground)",
                margin: "0.5rem 0",
            }}>
                <span style={{ color: "#22c55e" }}>✓</span> CAPTCHA bypassed (development)
            </div>
        );
    }

    // Error state — show retry info
    if (status === "error") {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.75rem",
                background: "rgba(245, 158, 11, 0.08)",
                borderRadius: "6px",
                fontSize: "0.8rem",
                color: "var(--muted-foreground)",
                margin: "0.5rem 0",
            }}>
                <span style={{ color: "#f59e0b" }}>⚠</span> CAPTCHA unavailable — proceeding without verification
            </div>
        );
    }

    // Verified state
    if (status === "verified") {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.75rem",
                background: "rgba(34, 197, 94, 0.08)",
                borderRadius: "6px",
                fontSize: "0.8rem",
                color: "var(--muted-foreground)",
                margin: "0.5rem 0",
            }}>
                <span style={{ color: "#22c55e" }}>✓</span> Verified
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="turnstile-container"
            style={{ margin: "0.5rem 0", minHeight: "65px" }}
        />
    );
}
