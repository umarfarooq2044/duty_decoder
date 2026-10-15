"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
    placement: "results-below-summary" | "guide-mid-article" | "guide-sidebar" | "footer-above";
    format?: "auto" | "rectangle" | "horizontal" | "vertical";
    minHeight?: number;
    noAds?: boolean;
    className?: string;
}

export function AdSlot({
    placement,
    format = "auto",
    minHeight = 280,
    noAds = false,
    className = "",
}: AdSlotProps) {
    const isAdsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
    const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-6219371790903754";
    const adRef = useRef<HTMLModElement | null>(null);

    useEffect(() => {
        if (!isAdsEnabled || noAds) return;

        try {
            if (typeof window !== "undefined") {
                const adsbygoogle = (window as any).adsbygoogle || [];
                adsbygoogle.push({});
            }
        } catch (err) {
            console.error("[AdSlot] Error pushing adsbygoogle:", err);
        }
    }, [isAdsEnabled, noAds]);

    // Safety Policy Guard: If ads are disabled or page is exempt, render nothing
    if (!isAdsEnabled || noAds) {
        return null;
    }

    return (
        <aside
            aria-label="Advertisement"
            className={`ad-container ad-placement-${placement} ${className}`}
            style={{
                width: "100%",
                minHeight: `${minHeight}px`,
                margin: "2rem auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(247, 249, 252, 0.6)",
                border: "1px dashed #E3E8EF",
                borderRadius: "10px",
                overflow: "hidden",
            }}
        >
            <span
                style={{
                    display: "block",
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    color: "#94A3B8",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.5rem",
                    userSelect: "none",
                }}
            >
                Advertisement
            </span>

            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{
                    display: "block",
                    width: "100%",
                    minHeight: `${minHeight - 30}px`,
                }}
                data-ad-client={adClient}
                data-ad-format={format}
                data-full-width-responsive="true"
            />
        </aside>
    );
}
