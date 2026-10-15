"use client";

import React, { useState } from 'react';
import { Download, Share2, Check } from 'lucide-react';

export function PrintReportButton() {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            if (typeof window !== "undefined") {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch {
            // Non-fatal clipboard fallback
        }
    };

    return (
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
                onClick={() => window.print()}
                className="print-report-btn"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "var(--accent, #6366f1)",
                    color: "white",
                    border: "none",
                    padding: "0.65rem 1.25rem",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 10px rgba(99, 102, 241, 0.25)",
                }}
            >
                <Download size={16} />
                Download PDF Report
            </button>

            <button
                onClick={handleCopy}
                type="button"
                className="share-report-btn"
                aria-label="Copy report link"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    background: "rgba(255, 255, 255, 0.06)",
                    color: "var(--foreground, #fff)",
                    border: "1px solid var(--border, rgba(255, 255, 255, 0.15))",
                    padding: "0.65rem 1rem",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                }}
            >
                {copied ? (
                    <>
                        <Check size={16} style={{ color: "#22c55e" }} />
                        <span style={{ color: "#22c55e" }}>Copied!</span>
                    </>
                ) : (
                    <>
                        <Share2 size={16} />
                        <span>Share Report</span>
                    </>
                )}
            </button>
        </div>
    );
}

