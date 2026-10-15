"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Check, X, Sliders, ChevronDown, ChevronUp } from "lucide-react";

declare global {
    interface Window {
        dataLayer: any[];
        gtag?: (...args: any[]) => void;
    }
}

interface ConsentState {
    necessary: boolean;
    analytics: boolean;
    advertising: boolean;
    timestamp: string;
}

const STORAGE_KEY = "dutydecoder_consent_v1";

export function CookieConsentBanner() {
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showCustomize, setShowCustomize] = useState(false);
    const [analyticsChecked, setAnalyticsChecked] = useState(true);
    const [advertisingChecked, setAdvertisingChecked] = useState(true);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
            setIsVisible(true);
        } else {
            try {
                const parsed: ConsentState = JSON.parse(saved);
                applyConsentMode(parsed.analytics, parsed.advertising);
            } catch {
                setIsVisible(true);
            }
        }

        // Listener to allow reopening preferences from footer "Privacy Settings" link
        const handleOpenSettings = () => {
            setIsVisible(true);
            setShowCustomize(true);
        };
        window.addEventListener("open-cookie-settings", handleOpenSettings);
        return () => window.removeEventListener("open-cookie-settings", handleOpenSettings);
    }, []);

    const applyConsentMode = (analytics: boolean, advertising: boolean) => {
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
            window.gtag("consent", "update", {
                analytics_storage: analytics ? "granted" : "denied",
                ad_storage: advertising ? "granted" : "denied",
                ad_user_data: advertising ? "granted" : "denied",
                ad_personalization: advertising ? "granted" : "denied",
            });
        }
    };

    const saveConsent = (analytics: boolean, advertising: boolean) => {
        const state: ConsentState = {
            necessary: true,
            analytics,
            advertising,
            timestamp: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        applyConsentMode(analytics, advertising);
        setIsVisible(false);
        setShowCustomize(false);
    };

    const handleAcceptAll = () => saveConsent(true, true);
    const handleRejectAll = () => saveConsent(false, false);
    const handleSaveCustom = () => saveConsent(analyticsChecked, advertisingChecked);

    if (!mounted || !isVisible) return null;

    return (
        <div
            role="region"
            aria-label="Cookie and Privacy Consent"
            style={{
                position: "fixed",
                bottom: "12px",
                left: "12px",
                right: "12px",
                maxWidth: "960px",
                margin: "0 auto",
                zIndex: 9999,
                background: "#FFFFFF",
                border: "1px solid var(--border, #E3E8EF)",
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgba(11, 31, 58, 0.12), 0 4px 6px -2px rgba(11, 31, 58, 0.05)",
                padding: "0.55rem 0.9rem",
            }}
        >
            <div style={{ width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.85rem", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, minWidth: "260px" }}>
                        <Shield size={16} style={{ color: "var(--teal-700, #0F766E)", flexShrink: 0 }} />
                        <p style={{ fontSize: "0.78rem", color: "var(--text-body, #475569)", lineHeight: 1.4, margin: 0 }}>
                            We use cookies for analytics and advertising (Google AdSense). Review our{" "}
                            <Link href="/privacy/" style={{ color: "var(--teal-700, #0F766E)", fontWeight: 600, textDecoration: "underline" }}>
                                Privacy Policy
                            </Link>.
                        </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexShrink: 0, flexWrap: "wrap" }}>
                        <button
                            onClick={() => setShowCustomize(!showCustomize)}
                            style={{
                                padding: "0.32rem 0.65rem",
                                background: "var(--bg, #F7F9FC)",
                                border: "1px solid var(--border, #E3E8EF)",
                                borderRadius: "6px",
                                fontSize: "0.76rem",
                                fontWeight: 600,
                                color: "var(--foreground)",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                            }}
                        >
                            <Sliders size={12} />
                            <span>Customize</span>
                            {showCustomize ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>

                        <button
                            onClick={handleRejectAll}
                            style={{
                                padding: "0.32rem 0.75rem",
                                background: "#FFFFFF",
                                border: "1px solid var(--border, #E3E8EF)",
                                borderRadius: "6px",
                                fontSize: "0.76rem",
                                fontWeight: 600,
                                color: "var(--foreground)",
                                cursor: "pointer",
                            }}
                        >
                            Reject Non-Essential
                        </button>

                        <button
                            onClick={handleAcceptAll}
                            style={{
                                padding: "0.32rem 0.9rem",
                                background: "var(--teal-700, #0F766E)",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "0.76rem",
                                fontWeight: 600,
                                color: "#FFFFFF",
                                cursor: "pointer",
                            }}
                        >
                            Accept All
                        </button>
                    </div>
                </div>

                {/* Granular Preference Drawer */}
                {showCustomize && (
                    <div
                        style={{
                            marginTop: "0.75rem",
                            paddingTop: "0.75rem",
                            borderTop: "1px solid var(--border, #E3E8EF)",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: "0.6rem",
                        }}
                    >
                        <div style={{ padding: "0.6rem 0.75rem", background: "var(--bg, #F7F9FC)", borderRadius: "6px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                                <strong style={{ fontSize: "0.8rem", color: "var(--foreground)" }}>Strictly Necessary</strong>
                                <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--teal-700, #0F766E)" }}>Always Active</span>
                            </div>
                            <p style={{ fontSize: "0.74rem", color: "var(--muted-foreground)", margin: 0 }}>
                                Essential for page delivery, security, calculation session tokens, and privacy consent records.
                            </p>
                        </div>

                        <div style={{ padding: "0.6rem 0.75rem", background: "var(--bg, #F7F9FC)", borderRadius: "6px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                                <strong style={{ fontSize: "0.8rem", color: "var(--foreground)" }}>Analytics (GA4)</strong>
                                <input
                                    type="checkbox"
                                    checked={analyticsChecked}
                                    onChange={(e) => setAnalyticsChecked(e.target.checked)}
                                    style={{ width: "15px", height: "15px", accentColor: "var(--teal-700, #0F766E)" }}
                                />
                            </div>
                            <p style={{ fontSize: "0.74rem", color: "var(--muted-foreground)", margin: 0 }}>
                                Aggregated anonymous traffic telemetry to evaluate calculator performance and usability.
                            </p>
                        </div>

                        <div style={{ padding: "0.6rem 0.75rem", background: "var(--bg, #F7F9FC)", borderRadius: "6px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                                <strong style={{ fontSize: "0.8rem", color: "var(--foreground)" }}>Advertising (AdSense)</strong>
                                <input
                                    type="checkbox"
                                    checked={advertisingChecked}
                                    onChange={(e) => setAdvertisingChecked(e.target.checked)}
                                    style={{ width: "15px", height: "15px", accentColor: "var(--teal-700, #0F766E)" }}
                                />
                            </div>
                            <p style={{ fontSize: "0.74rem", color: "var(--muted-foreground)", margin: 0 }}>
                                Third-party advertising measurement cookies deployed by Google and partners.
                            </p>
                        </div>

                        <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
                            <button
                                onClick={handleSaveCustom}
                                style={{
                                    padding: "0.35rem 0.9rem",
                                    background: "var(--teal-700, #0F766E)",
                                    color: "#FFFFFF",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontSize: "0.76rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                Save Preferences
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Helper button component for footer to reopen privacy preferences modal at any time
 */
export function PrivacySettingsButton() {
    return (
        <button
            onClick={() => {
                if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event("open-cookie-settings"));
                }
            }}
            style={{
                background: "none",
                border: "none",
                padding: 0,
                color: "#94A3B8",
                fontSize: "0.8rem",
                cursor: "pointer",
                textDecoration: "underline",
            }}
        >
            Privacy Settings
        </button>
    );
}
