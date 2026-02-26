"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CountryCalculatorFormProps {
    defaultDestination: string;  // ISO code, e.g., "US"
    countryName: string;         // Display name, e.g., "United States"
}

export function CountryCalculatorForm({ defaultDestination, countryName }: CountryCalculatorFormProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [destCountry, setDestCountry] = useState(defaultDestination);
    const [currency, setCurrency] = useState("USD");

    useEffect(() => {
        const currencyMap: Record<string, string> = {
            US: "USD", GB: "GBP", EU: "EUR", DE: "EUR", FR: "EUR", IT: "EUR",
            NL: "EUR", BE: "EUR", ES: "EUR", AT: "EUR", IE: "EUR", PT: "EUR",
            FI: "EUR", GR: "EUR", SK: "EUR", LU: "EUR", PK: "PKR", AU: "AUD",
            CA: "CAD", AE: "AED", JP: "JPY", SG: "SGD", CN: "CNY", IN: "INR",
            KR: "KRW", MX: "MXN", BR: "BRL", HK: "HKD", CH: "CHF", PL: "PLN",
            SE: "SEK", MY: "MYR", TW: "TWD", SA: "SAR", DK: "DKK", ID: "IDR",
            CZ: "CZK", HU: "HUF", NO: "NOK", RO: "RON", PH: "PHP", IL: "ILS",
            ZA: "ZAR", TH: "THB", VN: "VND", TR: "TRY", RU: "RUB", CL: "CLP",
            EG: "EGP", AR: "ARS", UA: "UAH", IR: "IRR",
        };
        setCurrency(currencyMap[destCountry] || "USD");
    }, [destCountry]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLoading) {
            setLoadingStep(0);
            interval = setInterval(() => {
                setLoadingStep(prev => (prev < 2 ? prev + 1 : prev));
            }, 1500);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const getLoadingMessage = () => {
        switch (loadingStep) {
            case 0: return "Classifying true HTS code...";
            case 1: return `Querying live 2026 ${countryName} Customs matrix...`;
            case 2: return "Finalizing Landed Cost Report...";
            default: return "Calculating...";
        }
    };

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        const data = {
            productDescription: formData.get("productDescription") as string,
            originCountry: formData.get("originCountry") as string,
            destinationCountry: destCountry,
            productValue: parseFloat(formData.get("productValue") as string),
            currency,
            shippingCost: parseFloat(formData.get("shippingCost") as string) || 0,
            insuranceCost: parseFloat(formData.get("insuranceCost") as string) || 0,
            quantity: parseInt(formData.get("quantity") as string) || 1,
            ...(formData.get("weight") ? { weight: parseFloat(formData.get("weight") as string) } : {}),
        };

        try {
            const res = await fetch("/api/landed-cost/calculate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                const errorMessage = errorData.error?.message || errorData.error || "Failed to calculate landed cost";
                throw new Error(typeof errorMessage === 'string' ? errorMessage : "Failed to calculate landed cost");
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

    const COUNTRIES = [
        { code: "CN", name: "China" }, { code: "US", name: "United States" },
        { code: "GB", name: "United Kingdom" }, { code: "DE", name: "Germany" },
        { code: "FR", name: "France" }, { code: "JP", name: "Japan" },
        { code: "KR", name: "South Korea" }, { code: "TW", name: "Taiwan" },
        { code: "VN", name: "Vietnam" }, { code: "IN", name: "India" },
        { code: "PK", name: "Pakistan" }, { code: "MX", name: "Mexico" },
        { code: "CA", name: "Canada" }, { code: "BR", name: "Brazil" },
        { code: "AE", name: "UAE" }, { code: "AU", name: "Australia" },
        { code: "IT", name: "Italy" }, { code: "NL", name: "Netherlands" },
        { code: "SG", name: "Singapore" }, { code: "TH", name: "Thailand" },
        { code: "MY", name: "Malaysia" }, { code: "ID", name: "Indonesia" },
        { code: "SA", name: "Saudi Arabia" }, { code: "TR", name: "Turkey" },
        { code: "PL", name: "Poland" }, { code: "SE", name: "Sweden" },
        { code: "CH", name: "Switzerland" }, { code: "ES", name: "Spain" },
    ];

    const DEST_COUNTRIES = [
        ...COUNTRIES,
        { code: "HK", name: "Hong Kong" }, { code: "IE", name: "Ireland" },
        { code: "BE", name: "Belgium" }, { code: "AT", name: "Austria" },
        { code: "DK", name: "Denmark" }, { code: "NO", name: "Norway" },
        { code: "FI", name: "Finland" }, { code: "CZ", name: "Czech Republic" },
        { code: "HU", name: "Hungary" }, { code: "RO", name: "Romania" },
        { code: "PH", name: "Philippines" }, { code: "PT", name: "Portugal" },
        { code: "GR", name: "Greece" }, { code: "IL", name: "Israel" },
        { code: "ZA", name: "South Africa" }, { code: "CL", name: "Chile" },
        { code: "EG", name: "Egypt" }, { code: "AR", name: "Argentina" },
        { code: "UA", name: "Ukraine" }, { code: "RU", name: "Russia" },
    ];

    return (
        <form onSubmit={onSubmit} className="calculator-form">
            {error && (
                <div className="error-alert">
                    {error}
                </div>
            )}

            <div className="form-group full-width">
                <label htmlFor="productDescription">Product Description *</label>
                <input
                    type="text"
                    id="productDescription"
                    name="productDescription"
                    required
                    placeholder={`e.g. Men's leather motorcycle jacket importing to ${countryName}`}
                    className="form-control"
                    disabled={isLoading}
                />
                <span className="input-hint">Be as detailed as possible for accurate AI HTS classification.</span>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="originCountry">Origin Country *</label>
                    <select id="originCountry" name="originCountry" required className="form-control" disabled={isLoading} defaultValue="CN">
                        {COUNTRIES.map(c => (
                            <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="destinationCountry">Destination *</label>
                    <select
                        id="destinationCountry"
                        name="destinationCountry"
                        required
                        className="form-control"
                        disabled={isLoading}
                        value={destCountry}
                        onChange={(e) => setDestCountry(e.target.value)}
                    >
                        {DEST_COUNTRIES.map(c => (
                            <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                        ))}
                    </select>
                    <span className="input-hint" style={{ color: "var(--accent)", fontWeight: 600 }}>
                        Pre-selected: {countryName}
                    </span>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="productValue">Product Value *</label>
                    <input type="number" id="productValue" name="productValue" required min="0.01" step="0.01" placeholder="1000.00" className="form-control" disabled={isLoading} />
                </div>

                <div className="form-group">
                    <label htmlFor="currency">Currency</label>
                    <select id="currency" name="currency" className="form-control" disabled={isLoading} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CNY">CNY (¥)</option>
                        <option value="JPY">JPY (¥)</option>
                        <option value="CAD">CAD ($)</option>
                        <option value="AUD">AUD ($)</option>
                        <option value="INR">INR (₹)</option>
                        <option value="PKR">PKR (₨)</option>
                        <option value="AED">AED (د.إ)</option>
                        <option value="SGD">SGD ($)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input type="number" id="quantity" name="quantity" min="1" defaultValue="1" className="form-control" disabled={isLoading} />
                </div>
            </div>

            {/* Advanced Toggle */}
            <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="advanced-toggle" style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.85rem", marginBottom: "1rem", padding: 0 }}>
                {showAdvanced ? "▼" : "►"} Advanced Logistics Options
            </button>

            {showAdvanced && (
                <div className="form-row" style={{ animation: "fadeIn 0.3s ease" }}>
                    <div className="form-group">
                        <label htmlFor="shippingCost">Shipping Cost</label>
                        <input type="number" id="shippingCost" name="shippingCost" min="0" step="0.01" defaultValue="0" className="form-control" disabled={isLoading} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="insuranceCost">Insurance Cost</label>
                        <input type="number" id="insuranceCost" name="insuranceCost" min="0" step="0.01" defaultValue="0" className="form-control" disabled={isLoading} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="weight">Weight (kg)</label>
                        <input type="number" id="weight" name="weight" min="0" step="0.01" placeholder="Optional" className="form-control" disabled={isLoading} />
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="submit-btn"
                style={{ width: "100%", padding: "0.9rem", fontSize: "1rem", fontWeight: 700, borderRadius: "8px", border: "none", cursor: isLoading ? "not-allowed" : "pointer", background: isLoading ? "var(--muted)" : "linear-gradient(135deg, var(--accent), #6366f1)", color: "#fff", transition: "all 0.3s ease" }}
            >
                {isLoading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                        <span className="spinner" style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                        {getLoadingMessage()}
                    </span>
                ) : (
                    `Calculate Import Duty to ${countryName}`
                )}
            </button>
        </form>
    );
}
