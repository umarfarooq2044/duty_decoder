import React from "react";
import type { LandedCostBreakdown } from "@/schemas/landed-cost";
import { TrendingUp, DollarSign, ShieldCheck, Percent } from "lucide-react";

interface LandedCostSummaryCardProps {
    breakdown: LandedCostBreakdown;
    countryLabel: string;
}

export function LandedCostSummaryCard({ breakdown, countryLabel }: LandedCostSummaryCardProps) {
    const productVal = Number(breakdown.productValue?.amount) || 0;
    const totalVal = Number(breakdown.totalLandedCost?.amount) || 0;
    const dutyVal = Number(breakdown.customsDuty?.amount) || 0;
    const vatVal = Number(breakdown.vatGst?.amount) || 0;
    const currency = breakdown.totalLandedCost?.currency || breakdown.productValue?.currency || "USD";

    // Effective import surcharge markup over initial product cost
    const surchargeVal = Math.max(0, totalVal - productVal);
    const markupPct = productVal > 0 ? ((surchargeVal / productVal) * 100).toFixed(1) : "0";

    // Cost distribution percentages for visual bar
    const prodPct = totalVal > 0 ? Math.max(5, Math.round((productVal / totalVal) * 100)) : 100;
    const dutyPct = totalVal > 0 ? Math.round((dutyVal / totalVal) * 100) : 0;
    const vatPct = totalVal > 0 ? Math.round((vatVal / totalVal) * 100) : 0;
    const feesPct = Math.max(0, 100 - prodPct - dutyPct - vatPct);

    const fmt = (num: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num);

    return (
        <div
            className="landed-cost-summary-card"
            style={{
                background: "linear-gradient(145deg, rgba(30, 34, 53, 0.95), rgba(18, 20, 28, 0.98))",
                border: "1px solid var(--border, #2a2e42)",
                borderRadius: "16px",
                padding: "clamp(1.25rem, 3vw, 1.75rem)",
                marginBottom: "2rem",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
            }}
        >
            {/* Top row: Label + 2026 Gazette badge */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent, #6366f1)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Total Landed Cost Summary
                </span>
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        fontSize: "0.75rem",
                        padding: "0.25rem 0.65rem",
                        borderRadius: "9999px",
                        background: "rgba(34, 197, 94, 0.12)",
                        color: "#22c55e",
                        border: "1px solid rgba(34, 197, 94, 0.25)",
                        fontWeight: 600,
                    }}
                >
                    <ShieldCheck size={14} /> 2026 Gazette Verified
                </span>
            </div>

            {/* Main Total Highlight */}
            <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: 900, color: "var(--foreground, #fff)", lineHeight: 1 }}>
                    {fmt(totalVal)}
                </div>
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        background: "rgba(99, 102, 241, 0.15)",
                        color: "#818cf8",
                        padding: "0.3rem 0.65rem",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                    }}
                >
                    <TrendingUp size={14} />
                    +{markupPct}% Landed Markup
                </div>
            </div>

            {/* Visual Distribution Bar */}
            <div style={{ marginBottom: "1.5rem" }}>
                <div
                    style={{
                        display: "flex",
                        height: "10px",
                        borderRadius: "6px",
                        overflow: "hidden",
                        background: "rgba(255, 255, 255, 0.08)",
                        marginBottom: "0.6rem",
                    }}
                    role="progressbar"
                    aria-label="Cost distribution"
                >
                    <div style={{ width: `${prodPct}%`, background: "#3b82f6", transition: "width 0.4s ease" }} title={`Product: ${prodPct}%`} />
                    <div style={{ width: `${dutyPct}%`, background: "#a855f7", transition: "width 0.4s ease" }} title={`Customs Duty: ${dutyPct}%`} />
                    <div style={{ width: `${vatPct}%`, background: "#f59e0b", transition: "width 0.4s ease" }} title={`VAT/GST: ${vatPct}%`} />
                    <div style={{ width: `${feesPct}%`, background: "#10b981", transition: "width 0.4s ease" }} title={`Freight & Fees: ${feesPct}%`} />
                </div>

                {/* Distribution Legend */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", fontSize: "0.78rem", color: "var(--color-text-secondary, #8b8fa8)" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6" }} /> Product ({prodPct}%)
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#a855f7" }} /> Duty ({dutyPct}%)
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }} /> VAT/GST ({vatPct}%)
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} /> Freight/Fees ({feesPct}%)
                    </span>
                </div>
            </div>

            {/* 4 Mini Stat Metrics */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                    gap: "0.75rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                }}
            >
                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.65rem 0.85rem", borderRadius: "8px" }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted, #5d6180)", display: "block", marginBottom: "0.2rem" }}>
                        FOB Product Value
                    </span>
                    <strong style={{ fontSize: "0.95rem", color: "var(--foreground, #fff)" }}>
                        {fmt(productVal)}
                    </strong>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.65rem 0.85rem", borderRadius: "8px" }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted, #5d6180)", display: "block", marginBottom: "0.2rem" }}>
                        Customs Duty ({breakdown.customsDuty?.rate || "Standard"})
                    </span>
                    <strong style={{ fontSize: "0.95rem", color: "#c084fc" }}>
                        {fmt(dutyVal)}
                    </strong>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.65rem 0.85rem", borderRadius: "8px" }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted, #5d6180)", display: "block", marginBottom: "0.2rem" }}>
                        VAT / GST ({breakdown.vatGst?.rate || "Standard"})
                    </span>
                    <strong style={{ fontSize: "0.95rem", color: "#fbbf24" }}>
                        {fmt(vatVal)}
                    </strong>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.65rem 0.85rem", borderRadius: "8px" }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted, #5d6180)", display: "block", marginBottom: "0.2rem" }}>
                        Total Surcharges
                    </span>
                    <strong style={{ fontSize: "0.95rem", color: "#34d399" }}>
                        {fmt(surchargeVal)}
                    </strong>
                </div>
            </div>
        </div>
    );
}
