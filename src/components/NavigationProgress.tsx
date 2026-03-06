"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * NavigationProgress — a slim top-of-page progress bar that ONLY shows
 * during client-side (soft) navigation. It does NOT appear on direct
 * page loads from Google or URL bar entry.
 *
 * How it works:
 *  - Listens for pathname/searchParams changes via Next.js hooks
 *  - On change, starts an animated progress bar (0% → 90% quickly)
 *  - When the new page finishes rendering, completes to 100% and fades out
 */
export function NavigationProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);

    // Track the current URL to detect changes
    const url = `${pathname}?${searchParams.toString()}`;

    const startProgress = useCallback(() => {
        setVisible(true);
        setProgress(0);

        // Animate progress: quick to 30%, slower to 70%, then hold at 90%
        let frame: number;
        let current = 0;

        const tick = () => {
            if (current < 30) {
                current += 8;
            } else if (current < 70) {
                current += 3;
            } else if (current < 90) {
                current += 0.5;
            }
            current = Math.min(current, 90);
            setProgress(current);

            if (current < 90) {
                frame = requestAnimationFrame(tick);
            }
        };

        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);
    }, []);

    const completeProgress = useCallback(() => {
        setProgress(100);
        setTimeout(() => {
            setVisible(false);
            setProgress(0);
        }, 300);
    }, []);

    useEffect(() => {
        // Skip the very first render (direct page load / SSR)
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }

        // This fires when the URL changes (client-side navigation complete)
        completeProgress();
    }, [url, isFirstRender, completeProgress]);

    // Listen for link clicks to START the progress bar
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest("a");
            if (!target) return;

            const href = target.getAttribute("href");
            if (!href) return;

            // Only handle internal navigation
            if (href.startsWith("/") || href.startsWith(window.location.origin)) {
                // Don't trigger for same-page anchors or external links
                const targetUrl = new URL(href, window.location.origin);
                if (targetUrl.pathname !== pathname || targetUrl.search !== window.location.search) {
                    startProgress();
                }
            }
        };

        document.addEventListener("click", handleClick, true);
        return () => document.removeEventListener("click", handleClick, true);
    }, [pathname, startProgress]);

    if (!visible) return null;

    return (
        <div
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                height: "3px",
                pointerEvents: "none",
            }}
        >
            <div
                style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #6366f1, #818cf8, #a78bfa)",
                    boxShadow: "0 0 10px rgba(99, 102, 241, 0.7), 0 0 5px rgba(99, 102, 241, 0.5)",
                    transition: progress === 0
                        ? "none"
                        : progress === 100
                            ? "width 200ms ease-out"
                            : "width 400ms ease-out",
                    borderRadius: "0 2px 2px 0",
                }}
            />
        </div>
    );
}
