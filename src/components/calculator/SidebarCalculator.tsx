"use client";

import React, { useEffect, useState } from "react";
import { useCalculatorStore } from "@/store/calculator";
import { RefreshCw, ShieldCheck } from "lucide-react";

export function SidebarCalculator({ initialData, exemptions, destinationCountry }: {
    initialData: any;
    exemptions?: string[];
    destinationCountry?: string;
}) {
    const store = useCalculatorStore();
    const [isHydrated, setIsHydrated] = useState(false);

    // Initial Hydration from Server Component Props
    useEffect(() => {
        const pVal = initialData.productValue?.amount ?? 0;
        const sCost = initialData.shippingCost?.amount ?? 0;
        const iCost = initialData.insuranceCost?.amount ?? 0;
        const totalCost = initialData.totalLandedCost?.amount ?? 0;

        // Extract additional duties from cost items if present
        const additionalDuties: Record<string, { rate_pct?: number; description?: string }> = {};
        if (initialData.costItems && Array.isArray(initialData.costItems)) {
            for (const item of initialData.costItems) {
                const label = item.label?.toLowerCase() || "";
                // Identify additional duties (Section 301, AD/CVD, etc.)
                if (
                    (label.includes("section 301") || label.includes("anti-dumping") ||
                        label.includes("countervailing") || label.includes("additional duty") ||
                        label.includes("ad/cvd")) &&
                    item.rate
                ) {
                    additionalDuties[item.label] = {
                        rate_pct: parseFloat(item.rate) || 0,
                        description: item.label,
                    };
                }
            }
        }

        store.hydrate({
            originalValue: typeof pVal === 'string' ? parseFloat(pVal) : pVal,
            originalShipping: typeof sCost === 'string' ? parseFloat(sCost) : sCost,
            originalInsurance: typeof iCost === 'string' ? parseFloat(iCost) : iCost,
            originalTotal: typeof totalCost === 'string' ? parseFloat(totalCost) : totalCost,
            currency: initialData.productValue?.currency ?? 'USD',

            dutyRatePct: initialData.customsDuty?.rate ? parseFloat(initialData.customsDuty.rate) : null,
            vatRatePct: initialData.vatGst?.rate ? parseFloat(initialData.vatGst.rate) : null,
            nationalHandlingFee: initialData.nationalHandling?.amount ? parseFloat(initialData.nationalHandling.amount) : 0,
            nationalHandlingCurrency: initialData.nationalHandling?.currency ?? 'USD',
            destinationCountry: destinationCountry?.toUpperCase() || '',
            additionalDuties,
        });
        setIsHydrated(true);
    }, [initialData, destinationCountry]);

    if (!isHydrated) return null;

    const hasChanges =
        store.productValue !== store.originalValue ||
        store.shippingCost !== store.originalShipping ||
        store.insuranceCost !== store.originalInsurance;

    const activeExemptions = exemptions?.filter(e => e && e.length > 0) || [];
    const alternativeHts = initialData?.alternativeHts || [];

    // Display flags
    const showProcessingFees = store.liveProcessingFees > 0;
    const showAdditionalDuties = store.liveAdditionalDuties > 0;

    return (
        <div className="glass-panel" style={{ padding: "1.5rem", position: "sticky", top: "100px", borderRadius: "var(--radius)", border: "1px solid var(--color-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--foreground)" }}>Live Calculator</h3>
                {hasChanges && (
                    <button
                        onClick={store.resetToOriginal}
                        title="Reset to Original Values"
                        style={{
                            background: "transparent", border: "none", cursor: "pointer",
                            color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem"
                        }}
                    >
                        <RefreshCw size={14} /> Reset
                    </button>
                )}
            </div>

            {/* Tax Exemption Alert (Research-Driven) */}
            {activeExemptions.length > 0 && (
                <div style={{
                    background: "rgba(34, 197, 94, 0.08)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.75rem 1rem",
                    marginBottom: "1.25rem",
                    fontSize: "0.8rem",
                    lineHeight: "1.5",
                    color: "var(--color-success)"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                        <ShieldCheck size={16} /> Potential Exemptions
                    </div>
                    <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--foreground)", opacity: 0.85 }}>
                        {activeExemptions.map((ex, i) => (
                            <li key={i} style={{ marginBottom: "0.25rem" }}>{ex}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Savings Opportunities (Alternative HTS) */}
            {alternativeHts.length > 0 && (
                <div style={{
                    background: "rgba(59, 130, 246, 0.08)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "var(--radius-sm)",
                    padding: "1rem",
                    marginBottom: "1.5rem"
                }}>
                    <h4 style={{ fontSize: "0.9rem", color: "var(--color-primary)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600" }}>
                        💡 Savings Opportunities
                    </h4>
                    <p style={{ fontSize: "0.8rem", color: "var(--foreground)", opacity: 0.85, marginBottom: "0.75rem", lineHeight: "1.4" }}>
                        We identified similar HTS classifications in this chapter with lower duty rates:
                    </p>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {alternativeHts.map((ex: any, i: number) => (
                            <li key={i} style={{ fontSize: "0.8rem", background: "var(--color-bg-base)", padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--color-border)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                                    <strong>HTS {ex.hts_code}</strong>
                                    <span style={{ color: "var(--color-success)", fontWeight: "600" }}>{ex.duty_rate_pct}% Duty</span>
                                </div>
                                <div style={{ color: "var(--muted-foreground)", fontSize: "0.75rem", lineHeight: "1.3" }}>
                                    {ex.description.length > 80 ? ex.description.substring(0, 80) + "..." : ex.description}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="input-group">
                    <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem", color: "var(--muted-foreground)" }}>
                        Product Value ({store.currency})
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={store.productValue === 0 ? "" : store.productValue}
                        onChange={(e) => store.updateProductValue(parseFloat(e.target.value) || 0)}
                        style={{
                            width: "100%", padding: "0.75rem", borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--color-border)", background: "var(--color-bg-base)",
                            color: "var(--foreground)", fontSize: "1rem"
                        }}
                    />
                </div>

                <div className="input-group">
                    <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem", color: "var(--muted-foreground)" }}>
                        Shipping Cost ({store.currency})
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={store.shippingCost === 0 ? "" : store.shippingCost}
                        onChange={(e) => store.updateShippingCost(parseFloat(e.target.value) || 0)}
                        style={{
                            width: "100%", padding: "0.75rem", borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--color-border)", background: "var(--color-bg-base)",
                            color: "var(--foreground)", fontSize: "1rem"
                        }}
                    />
                </div>

                <div className="input-group">
                    <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem", color: "var(--muted-foreground)" }}>
                        Insurance Cost ({store.currency})
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={store.insuranceCost === 0 ? "" : store.insuranceCost}
                        onChange={(e) => store.updateInsuranceCost(parseFloat(e.target.value) || 0)}
                        style={{
                            width: "100%", padding: "0.75rem", borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--color-border)", background: "var(--color-bg-base)",
                            color: "var(--foreground)", fontSize: "1rem"
                        }}
                    />
                </div>
            </div>

            {/* Cost Breakdown */}
            <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--color-border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.875rem" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>Est. Duty</span>
                    <span style={{ color: "var(--foreground)", fontWeight: "500" }}>{store.currency} {store.liveCustomsDutyAmount.toFixed(2)}</span>
                </div>

                {showProcessingFees && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.875rem" }}>
                        <span style={{ color: "var(--muted-foreground)" }}>Processing Fees</span>
                        <span style={{ color: "var(--foreground)", fontWeight: "500" }}>{store.currency} {store.liveProcessingFees.toFixed(2)}</span>
                    </div>
                )}

                {showAdditionalDuties && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.875rem" }}>
                        <span style={{ color: "var(--muted-foreground)" }}>Additional Duties</span>
                        <span style={{ color: "var(--foreground)", fontWeight: "500" }}>{store.currency} {store.liveAdditionalDuties.toFixed(2)}</span>
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.875rem" }}>
                    <span style={{ color: "var(--muted-foreground)" }}>Est. VAT/GST</span>
                    <span style={{ color: "var(--foreground)", fontWeight: "500" }}>{store.currency} {store.liveVatAmount.toFixed(2)}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px dashed var(--color-border)" }}>
                    <span style={{ fontWeight: "600", color: "var(--foreground)" }}>Total Landed</span>
                    <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--color-success)" }}>
                        {store.currency} {store.liveTotalLandedCost.toFixed(2)}
                    </span>
                </div>
            </div>

            {hasChanges && (
                <div style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--color-warning)", textAlign: "center", opacity: 0.8 }}>
                    ⚠️ Showing user-modified estimates.
                </div>
            )}
        </div>
    );
}
