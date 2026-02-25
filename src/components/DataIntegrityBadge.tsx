import React from 'react';

interface DataIntegrityBadgeProps {
    countryLabel: string;
}

export function DataIntegrityBadge({ countryLabel }: DataIntegrityBadgeProps) {
    return (
        <div className="data-integrity-badge" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(34, 197, 94, 0.1)",
            border: "1px solid rgba(34, 197, 94, 0.2)",
            padding: "0.5rem 1rem",
            borderRadius: "var(--radius-full)",
            color: "var(--color-success)",
            fontSize: "0.875rem",
            fontWeight: "600",
            marginBottom: "1.5rem"
        }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
            </svg>
            <span>Verified 2026 {countryLabel} Customs Data</span>
            <a
                href="/methodology/"
                style={{
                    color: "inherit",
                    textDecoration: "underline",
                    textUnderlineOffset: "2px",
                    marginLeft: "0.25rem",
                    opacity: 0.8
                }}
            >
                (View Sources)
            </a>
        </div>
    );
}
