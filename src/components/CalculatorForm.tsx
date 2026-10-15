"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { CountryCombobox } from "@/components/ui/CountryCombobox";
import { ChevronDown, ChevronRight, ArrowLeftRight, Sparkles, ShieldCheck } from "lucide-react";

const EXAMPLE_PRODUCTS = [
    "Ceramic tableware set",
    "Printed circuit boards",
    "Solid wooden dining chairs",
    "Cotton knit polo shirts",
    "Lithium-ion solar batteries",
];

export function CalculatorForm() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string>("");

    const [productDesc, setProductDesc] = useState("");
    const [originCountry, setOriginCountry] = useState("CN");
    const [destCountry, setDestCountry] = useState("US");
    const [currency, setCurrency] = useState("USD");

    const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);

    // Load saved currency preference from localStorage
    useEffect(() => {
        const savedCurrency = localStorage.getItem("dutydecoder_currency");
        if (savedCurrency) {
            setCurrency(savedCurrency);
        } else if (destCountry === "US") setCurrency("USD");
        else if (destCountry === "GB") setCurrency("GBP");
        else if (["EU", "DE", "FR", "IT", "ES", "NL"].includes(destCountry)) setCurrency("EUR");
        else if (destCountry === "PK") setCurrency("PKR");
        else if (destCountry === "AU") setCurrency("AUD");
        else if (destCountry === "CA") setCurrency("CAD");
        else if (destCountry === "AE") setCurrency("AED");
        else if (destCountry === "JP") setCurrency("JPY");
        else if (destCountry === "SG") setCurrency("SGD");
        else if (destCountry === "IN") setCurrency("INR");
    }, [destCountry]);

    const handleCurrencyChange = (newCurr: string) => {
        setCurrency(newCurr);
        try {
            localStorage.setItem("dutydecoder_currency", newCurr);
        } catch {}
    };

    // Swap Origin and Destination
    const handleSwapCountries = () => {
        const temp = originCountry;
        setOriginCountry(destCountry);
        setDestCountry(temp);
    };

    // Multi-step loading messages
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLoading) {
            setLoadingStep(0);
            interval = setInterval(() => {
                setLoadingStep((prev) => (prev < 2 ? prev + 1 : prev));
            }, 1400);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const getLoadingMessage = () => {
        switch (loadingStep) {
            case 0:
                return "Classifying your product…";
            case 1:
                return "Matching 2026 customs duty rates…";
            case 2:
                return "Building your landed cost report…";
            default:
                return "Calculating…";
        }
    };

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        const data = {
            productDescription: productDesc || (formData.get("productDescription") as string),
            originCountry: originCountry || (formData.get("originCountry") as string),
            destinationCountry: destCountry || (formData.get("destinationCountry") as string),
            productValue: parseFloat(formData.get("productValue") as string),
            currency: currency || (formData.get("currency") as string),
            shippingCost: parseFloat(formData.get("shippingCost") as string) || 0,
            insuranceCost: parseFloat(formData.get("insuranceCost") as string) || 0,
            quantity: parseInt(formData.get("quantity") as string) || 1,
            ...(formData.get("weight") ? { weight: parseFloat(formData.get("weight") as string) } : {}),
            turnstileToken,
        };

        try {
            const res = await fetch("/api/landed-cost/calculate/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                const errorMessage = errorData.error?.message || errorData.error || "Failed to calculate landed cost";
                throw new Error(typeof errorMessage === "string" ? errorMessage : "Failed to calculate landed cost");
            }

            const result = await res.json();
            router.push(`/calculate/${result.slug}/`);
        } catch (err: any) {
            const msg = err.message || "An unexpected error occurred";
            if (msg.includes("does not appear to be") || msg.includes("VALIDATION")) {
                console.warn("[Calculator] Validation:", msg);
            } else {
                console.error("Calculation Error:", err);
            }
            setError(msg);
            setIsLoading(false);
        }
    }

    return (
        <div
            className="calculator-card-wrapper"
            style={{
                background: "var(--surface, #FFFFFF)",
                borderRadius: "var(--r-lg, 16px)",
                border: "1px solid var(--border, #E3E8EF)",
                borderTop: "4px solid var(--teal-700, #0F766E)",
                boxShadow: "var(--sh-2, 0 4px 12px rgba(11,31,58,.08))",
                padding: "clamp(1.25rem, 3vw, 2rem)",
                position: "relative",
            }}
        >
            <form onSubmit={onSubmit} className="calculator-form" style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                {error && (
                    <div
                        className="error-alert"
                        role="alert"
                        style={{
                            background: "var(--warning-bg, #FEF3C7)",
                            border: "1px solid rgba(180, 83, 9, 0.25)",
                            color: "var(--warning-text, #B45309)",
                            padding: "0.75rem 1rem",
                            borderRadius: "var(--r-md, 10px)",
                            fontSize: "0.88rem",
                            fontWeight: 500,
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* 1. Product Description */}
                <div className="form-group full-width">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.35rem" }}>
                        <label htmlFor="productDescription" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--navy-900, #0B1F3A)" }}>
                            Product Description <span style={{ color: "var(--danger, #B91C1C)" }} aria-hidden="true">*</span>
                        </label>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted, #64748B)" }}>
                            Tip: specify material + intended use
                        </span>
                    </div>

                    <input
                        type="text"
                        id="productDescription"
                        name="productDescription"
                        required
                        aria-required="true"
                        value={productDesc}
                        onChange={(e) => setProductDesc(e.target.value)}
                        placeholder="e.g. Stainless steel kitchen cutlery set"
                        className="form-control"
                        disabled={isLoading}
                        style={{
                            width: "100%",
                            height: "48px",
                            padding: "0.75rem 1rem",
                            background: "var(--surface, #FFFFFF)",
                            border: "1px solid var(--border, #E3E8EF)",
                            borderRadius: "var(--r-md, 10px)",
                            fontSize: "0.95rem",
                            color: "var(--text, #0B1F3A)",
                        }}
                    />

                    {/* Example Suggestion Chips */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted, #64748B)", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                            <Sparkles size={12} style={{ color: "var(--teal-700, #0F766E)" }} /> Try:
                        </span>
                        {EXAMPLE_PRODUCTS.map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setProductDesc(p)}
                                style={{
                                    background: "var(--teal-50, #F0FDFA)",
                                    border: "1px solid rgba(15, 118, 110, 0.15)",
                                    color: "var(--teal-800, #115E59)",
                                    padding: "0.2rem 0.55rem",
                                    borderRadius: "var(--r-pill, 999px)",
                                    fontSize: "0.75rem",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    transition: "all 0.15s ease",
                                }}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Origin & Destination with Swap Button */}
                <div className="calculator-route-selector">
                    <div className="calculator-route-col">
                        <CountryCombobox
                            id="originCountry"
                            name="originCountry"
                            label="Exporting From"
                            required
                            value={originCountry}
                            onChange={(code) => setOriginCountry(code)}
                            placeholder="Select origin"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Swap Button */}
                    <div className="calculator-swap-wrapper">
                        <button
                            type="button"
                            onClick={handleSwapCountries}
                            aria-label="Swap origin and destination"
                            title="Swap countries"
                            className="calculator-swap-btn"
                        >
                            <ArrowLeftRight size={16} />
                        </button>
                    </div>

                    <div className="calculator-route-col">
                        <CountryCombobox
                            id="destinationCountry"
                            name="destinationCountry"
                            label="Importing Into"
                            required
                            value={destCountry}
                            onChange={(code) => setDestCountry(code)}
                            placeholder="Select destination"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* 3. Product Value & Currency */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.75rem" }}>
                    <div className="form-group">
                        <label htmlFor="productValue" style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--navy-900, #0B1F3A)" }}>
                            Product Value <span style={{ color: "var(--danger, #B91C1C)" }} aria-hidden="true">*</span>
                        </label>
                        <input
                            type="number"
                            id="productValue"
                            name="productValue"
                            required
                            aria-required="true"
                            min="0.01"
                            step="0.01"
                            inputMode="decimal"
                            placeholder="1,500.00"
                            className="form-control"
                            disabled={isLoading}
                            style={{
                                width: "100%",
                                height: "48px",
                                padding: "0.75rem 1rem",
                                background: "var(--surface, #FFFFFF)",
                                border: "1px solid var(--border, #E3E8EF)",
                                borderRadius: "var(--r-md, 10px)",
                                fontSize: "0.95rem",
                                color: "var(--text, #0B1F3A)",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="currency" style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--navy-900, #0B1F3A)" }}>
                            Currency <span style={{ color: "var(--danger, #B91C1C)" }} aria-hidden="true">*</span>
                        </label>
                        <select
                            id="currency"
                            name="currency"
                            required
                            className="form-control"
                            disabled={isLoading}
                            value={currency}
                            onChange={(e) => handleCurrencyChange(e.target.value)}
                            style={{
                                width: "100%",
                                height: "48px",
                                padding: "0.5rem 0.85rem",
                                background: "var(--surface, #FFFFFF)",
                                border: "1px solid var(--border, #E3E8EF)",
                                borderRadius: "var(--r-md, 10px)",
                                fontSize: "0.95rem",
                                fontWeight: 500,
                                color: "var(--text, #0B1F3A)",
                            }}
                        >
                            <option value="USD">USD ($)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="PKR">PKR (Rs)</option>
                            <option value="CAD">CAD ($)</option>
                            <option value="AUD">AUD ($)</option>
                            <option value="AED">AED (د.إ)</option>
                            <option value="JPY">JPY (¥)</option>
                            <option value="SGD">SGD ($)</option>
                            <option value="INR">INR (₹)</option>
                            <option value="CNY">CNY (¥)</option>
                        </select>
                    </div>
                </div>

                {/* 4. Optional Shipping & Insurance Disclosure */}
                <div>
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        style={{
                            background: "none",
                            border: "none",
                            color: "var(--teal-700, #0F766E)",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            padding: "0.25rem 0",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                        }}
                    >
                        {showAdvanced ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        <span>{showAdvanced ? "Hide Shipping & Insurance Details" : "Shipping, Insurance & Quantity (Optional)"}</span>
                    </button>
                </div>

                {showAdvanced && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", padding: "0.85rem", background: "var(--bg, #F7F9FC)", borderRadius: "var(--r-md, 10px)", border: "1px solid var(--border, #E3E8EF)" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                            <div className="form-group">
                                <label htmlFor="shippingCost" style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body, #475569)" }}>
                                    Shipping / Freight Cost
                                </label>
                                <input
                                    type="number"
                                    id="shippingCost"
                                    name="shippingCost"
                                    min="0"
                                    step="0.01"
                                    defaultValue="0"
                                    placeholder="0.00"
                                    className="form-control"
                                    disabled={isLoading}
                                    style={{ height: "42px", padding: "0.5rem 0.75rem" }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="insuranceCost" style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body, #475569)" }}>
                                    Cargo Insurance Cost
                                </label>
                                <input
                                    type="number"
                                    id="insuranceCost"
                                    name="insuranceCost"
                                    min="0"
                                    step="0.01"
                                    defaultValue="0"
                                    placeholder="0.00"
                                    className="form-control"
                                    disabled={isLoading}
                                    style={{ height: "42px", padding: "0.5rem 0.75rem" }}
                                />
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                            <div className="form-group">
                                <label htmlFor="quantity" style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body, #475569)" }}>
                                    Quantity (Units)
                                </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    min="1"
                                    step="1"
                                    defaultValue="1"
                                    className="form-control"
                                    disabled={isLoading}
                                    style={{ height: "42px", padding: "0.5rem 0.75rem" }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="weight" style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-body, #475569)" }}>
                                    Weight (kg, optional)
                                </label>
                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    min="0"
                                    step="0.01"
                                    placeholder="e.g. 2.5"
                                    className="form-control"
                                    disabled={isLoading}
                                    style={{ height: "42px", padding: "0.5rem 0.75rem" }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {!showAdvanced && <input type="hidden" name="quantity" value="1" />}

                {/* Cloudflare Turnstile CAPTCHA */}
                <TurnstileWidget onToken={handleTurnstileToken} size="managed" />

                {/* 5. Submit Button */}
                <div style={{ marginTop: "0.25rem" }}>
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isLoading}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            height: "48px",
                            background: "var(--teal-700, #0F766E)",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: "var(--r-md, 10px)",
                            fontSize: "1rem",
                            fontWeight: 700,
                            fontFamily: "var(--font-heading)",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            transition: "background 0.2s ease, transform 0.1s ease",
                            boxShadow: "0 4px 14px rgba(15, 118, 110, 0.25)",
                        }}
                    >
                        {isLoading ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                                <span className="spinner" style={{ width: "16px", height: "16px", border: "2px solid #FFF", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                                {getLoadingMessage()}
                            </span>
                        ) : (
                            <span>Calculate Landed Cost</span>
                        )}
                    </button>

                    {/* Trust Microcopy */}
                    <div style={{ textAlign: "center", marginTop: "0.6rem", fontSize: "0.78rem", color: "var(--text-muted, #64748B)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }}>
                        <ShieldCheck size={14} style={{ color: "var(--teal-700, #0F766E)" }} />
                        <span>Free · No signup · Uses official 2026 tariff data</span>
                    </div>
                </div>
            </form>
        </div>
    );
}
