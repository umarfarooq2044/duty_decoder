"use client";

import React, { useEffect } from 'react';
import { Download } from 'lucide-react';

export function PrintReportButton() {
    return (
        <button
            onClick={() => window.print()}
            className="print-report-btn"
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--color-primary)",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "var(--radius)",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.2)"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "var(--color-primary-dark)"}
            onMouseOut={(e) => e.currentTarget.style.background = "var(--color-primary)"}
        >
            <Download size={18} />
            Download B2B PDF Report
        </button>
    );
}
