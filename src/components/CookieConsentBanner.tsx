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
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                background: "var(--surface, #FFFFFF)",
                borderTop: "1px solid var(--border, #E3E8EF)",
                boxShadow: "0 -8px 30px rgba(11, 31, 58, 0.12)",
                padding: "1.25rem 1rem",
            }}
        >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "280px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                            <Shield size={18} style={{ color: "var(--teal-700, #0F766E)" }} />
                            <strong style={{ fontSize: "0.95rem", color: "var(--navy-900, #0B1F3A)" }}>
                                Privacy &amp; Cookie Choices
                            </strong>
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-body, #475569)", lineHeight: 1.6, margin: 0 }}>
                            We use cookies to maintain security, measure audience analytics, and serve contextual advertising (Google AdSense). You can customize your preferences or withdraw consent at any time. Review our{" "}
                            <Link href="/privacy/" style={{ color: "var(--teal-700, #0F766E)", fontWeight: 600, textDecoration: "underline" }}>
                                Privacy Policy
                            </Link>{" "}
                            to learn how Google and its partners process data.
                        </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                        <button
                            onClick={() => setShowCustomize(!showCustomize)}
                            style={{
                                padding: "0.6rem 1rem",
                                background: "var(--bg, #F7F9FC)",
                                border: "1px solid var(--border, #E3E8EF)",
                                borderRadius: "8px",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                color: "var(--foreground)",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.4rem",
                            }}
                        >
                            <Sliders size={14} />
                            <span>Customize</span>
                            {showCustomize ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>

                        <button
                            onClick={handleRejectAll}
                            style={{
                                padding: "0.6rem 1.1rem",
                                background: "#FFFFFF",
                                border: "1px solid var(--border, #E3E8EF)",
                                borderRadius: "8px",
                                fontSize: "0.85rem",
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
                                padding: "0.6rem 1.25rem",
                                background: "var(--teal-700, #0F766E)",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "0.85rem",
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
                            marginTop: "1.25rem",
                            paddingTop: "1.25rem",
                            borderTop: "1px solid var(--border, #E3E8EF)",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                            gap: "1rem",
                        }}
                    >
                        <div style={{ padding: "0.85rem", background: "var(--bg, #F7F9FC)", borderRadius: "8px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                                <strong style={{ fontSize: "0.85rem", color: "var(--foreground)" }}>Strictly Necessary</strong>
                                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--teal-700, #0F766E)" }}>Always Active</span>
                            </div>
                            <p style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", margin: 0 }}>
                                Essential for page delivery, security, calculation session tokens, and privacy consent records.
                            </p>
                        </div>

                        <div style={{ padding: "0.85rem", background: "var(--bg, #F7F9FC)", borderRadius: "8px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                                <strong style={{ fontSize: "0.85rem", color: "var(--foreground)" }}>Analytics (GA4)</strong>
                                <input
                                    type="checkbox"
                                    checked={analyticsChecked}
                                    onChange={(e) => setAnalyticsChecked(e.target.checked)}
                                    style={{ width: "16px", height: "16px", accentColor: "var(--teal-700, #0F766E)" }}
                                />
                            </div>
                            <p style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", margin: 0 }}>
                                Aggregated, anonymous traffic telemetry to evaluate calculator performance and usability.
                            </p>
                        </div>

                        <div style={{ padding: "0.85rem", background: "var(--bg, #F7F9FC)", borderRadius: "8px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                                <strong style={{ fontSize: "0.85rem", color: "var(--foreground)" }}>Advertising (AdSense)</strong>
                                <input
                                    type="checkbox"
                                    checked={advertisingChecked}
                                    onChange={(e) => setAdvertisingChecked(e.target.checked)}
                                    style={{ width: "16px", height: "16px", accentColor: "var(--teal-700, #0F766E)" }}
                                />
                            </div>
                            <p style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", margin: 0 }}>
                                Third-party advertising measurement and personalization cookies deployed by Google and partners.
                            </p>
                        </div>

                        <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
                            <button
                                onClick={handleSaveCustom}
                                style={{
                                    padding: "0.5rem 1.25rem",
                                    background: "var(--teal-700, #0F766E)",
                                    color: "#FFFFFF",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontSize: "0.85rem",
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
