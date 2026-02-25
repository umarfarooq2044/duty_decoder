"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TurnstileWidget } from "@/components/TurnstileWidget";

export function CalculatorForm() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [showAdvanced, setShowAdvanced] = useState(true);
    const [turnstileToken, setTurnstileToken] = useState<string>("");

    const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);

    const [destCountry, setDestCountry] = useState("US");
    const [currency, setCurrency] = useState("USD");

    useEffect(() => {
        if (destCountry === "US") setCurrency("USD");
        else if (destCountry === "GB") setCurrency("GBP");
        else if (["EU", "DE", "FR"].includes(destCountry)) setCurrency("EUR");
        else if (destCountry === "PK") setCurrency("PKR");
        else if (destCountry === "AU") setCurrency("AUD");
        else if (destCountry === "CA") setCurrency("CAD");
        else if (destCountry === "AE") setCurrency("AED");
        else if (destCountry === "JP") setCurrency("JPY");
        else if (destCountry === "SG") setCurrency("SGD");
        else setCurrency("USD");
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
            case 0: return "Classifying your product…";
            case 1: return "Looking up duty rates…";
            case 2: return "Building your cost report…";
            default: return "Calculating…";
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
            destinationCountry: formData.get("destinationCountry") as string,
            productValue: parseFloat(formData.get("productValue") as string),
            currency: formData.get("currency") as string,
            shippingCost: parseFloat(formData.get("shippingCost") as string) || 0,
            insuranceCost: parseFloat(formData.get("insuranceCost") as string) || 0,
            quantity: parseInt(formData.get("quantity") as string) || 1,
            ...(formData.get("weight") ? { weight: parseFloat(formData.get("weight") as string) } : {}),
            turnstileToken,
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
                    placeholder="e.g. Men's leather motorcycle jacket"
                    className="form-control"
                    disabled={isLoading}
                />
                <span className="input-hint">Be specific — material, type, and use help us find the right HS code.</span>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="originCountry">Origin Country *</label>
                    <select id="originCountry" name="originCountry" required className="form-control" disabled={isLoading} defaultValue="CN">
                        <option value="CN">China</option>
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="EU">European Union</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="JP">Japan</option>
                        <option value="KR">South Korea</option>
                        <option value="TW">Taiwan</option>
                        <option value="VN">Vietnam</option>
                        <option value="IN">India</option>
                        <option value="PK">Pakistan</option>
                        <option value="MX">Mexico</option>
                        <option value="CA">Canada</option>
                        <option value="BR">Brazil</option>
                        <option value="AE">UAE</option>
                        <option value="AU">Australia</option>
                        <option value="TH">Thailand</option>
                        <option value="ID">Indonesia</option>
                        <option value="MY">Malaysia</option>
                        <option value="SG">Singapore</option>
                        <option value="IT">Italy</option>
                        <option value="ES">Spain</option>
                        <option value="TR">Turkey</option>
                        <option value="SA">Saudi Arabia</option>
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
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="EU">European Union</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="CA">Canada</option>
                        <option value="MX">Mexico</option>
                        <option value="AU">Australia</option>
                        <option value="JP">Japan</option>
                        <option value="AE">UAE</option>
                        <option value="SG">Singapore</option>
                        <option value="PK">Pakistan</option>
                        <option value="IN">India</option>
                        <option value="CN">China</option>
                        <option value="KR">South Korea</option>
                        <option value="TH">Thailand</option>
                        <option value="VN">Vietnam</option>
                        <option value="BR">Brazil</option>
                        <option value="SA">Saudi Arabia</option>
                        <option value="TR">Turkey</option>
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="productValue">Product Value *</label>
                    <input
                        type="number"
                        id="productValue"
                        name="productValue"
                        required
                        min="0.01"
                        step="0.01"
                        placeholder="150.00"
                        className="form-control"
                        disabled={isLoading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="currency">Currency *</label>
                    <select
                        id="currency"
                        name="currency"
                        required
                        className="form-control"
                        disabled={isLoading}
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
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
                    </select>
                </div>
            </div>

            {/* Advanced fields — open by default */}
            <div className="form-row">
                <div className="form-group full-width">
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600', padding: '0', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}
                    >
                        {showAdvanced ? "▼ Hide Shipping & Insurance Details" : "▶ Add Shipping & Insurance Details"}
                    </button>
                </div>
            </div>

            {showAdvanced && (
                <>
                    <div className="form-row" style={{ animation: "fadeIn 0.3s ease-in-out" }}>
                        <div className="form-group">
                            <label htmlFor="shippingCost" title="Freight cost to the destination port. Included in CIF value.">
                                Shipping Cost
                                <span style={{ cursor: "help", color: "var(--muted-foreground)", marginLeft: "4px" }}>(?)</span>
                            </label>
                            <input
                                type="number"
                                id="shippingCost"
                                name="shippingCost"
                                min="0"
                                step="0.01"
                                defaultValue="0"
                                className="form-control"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="insuranceCost" title="Insurance for goods in transit. Included in CIF value.">
                                Insurance Cost
                                <span style={{ cursor: "help", color: "var(--muted-foreground)", marginLeft: "4px" }}>(?)</span>
                            </label>
                            <input
                                type="number"
                                id="insuranceCost"
                                name="insuranceCost"
                                min="0"
                                step="0.01"
                                defaultValue="0"
                                className="form-control"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="form-row" style={{ animation: "fadeIn 0.3s ease-in-out" }}>
                        <div className="form-group">
                            <label htmlFor="quantity">Quantity *</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                required
                                min="1"
                                step="1"
                                defaultValue="1"
                                className="form-control"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="weight">Weight (kg) <span className="text-muted">(Optional)</span></label>
                            <input
                                type="number"
                                id="weight"
                                name="weight"
                                min="0"
                                step="0.01"
                                placeholder="e.g. 1.5"
                                className="form-control"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </>
            )}

            {!showAdvanced && (
                <input type="hidden" name="quantity" value="1" />
            )}

            <div className="form-submit-container">
                <TurnstileWidget onToken={handleTurnstileToken} />
                <button type="submit" className="submit-btn" disabled={isLoading} style={{ position: "relative", overflow: "hidden" }}>
                    {isLoading ? (
                        <>
                            <span className="spinner" style={{ marginRight: "10px" }}></span>
                            {getLoadingMessage()}
                        </>
                    ) : (
                        <span style={{ fontWeight: "700", letterSpacing: "0.02em" }}>Calculate Your Costs</span>
                    )}
                </button>
            </div>
        </form>
    );
}
