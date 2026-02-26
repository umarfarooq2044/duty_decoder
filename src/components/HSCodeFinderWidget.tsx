"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { TurnstileWidget } from "@/components/TurnstileWidget";

interface HSResult {
    id: string;
    htsCode: string;
    description: string;
    dutyType: string;
    dutyRatePct: number | null;
    dutyRateSpecific: number | null;
    dutyUnit: string | null;
    vatRatePct: number | null;
    confidence: number;
    matchMethod: "vector" | "fts" | "ai";
}

export function HSCodeFinderWidget() {
    const [query, setQuery] = useState("");
    const [country, setCountry] = useState("US");
    const [results, setResults] = useState<HSResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string>("");

    const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);

    const COUNTRIES = [
        { code: "US", name: "🇺🇸 United States" },
        { code: "GB", name: "🇬🇧 United Kingdom" },
        { code: "EU", name: "🇪🇺 European Union" },
        { code: "DE", name: "🇩🇪 Germany" },
        { code: "FR", name: "🇫🇷 France" },
        { code: "CN", name: "🇨🇳 China" },
        { code: "JP", name: "🇯🇵 Japan" },
        { code: "IN", name: "🇮🇳 India" },
        { code: "CA", name: "🇨🇦 Canada" },
        { code: "AU", name: "🇦🇺 Australia" },
        { code: "SG", name: "🇸🇬 Singapore" },
        { code: "KR", name: "🇰🇷 South Korea" },
        { code: "BR", name: "🇧🇷 Brazil" },
        { code: "MX", name: "🇲🇽 Mexico" },
        { code: "AE", name: "🇦🇪 UAE" },
        { code: "SA", name: "🇸🇦 Saudi Arabia" },
        { code: "TR", name: "🇹🇷 Turkey" },
        { code: "TH", name: "🇹🇭 Thailand" },
        { code: "VN", name: "🇻🇳 Vietnam" },
        { code: "PK", name: "🇵🇰 Pakistan" },
    ];

    /**
     * Detects gibberish / nonsensical product descriptions.
     * Checks for: long random character strings, excessive consonant clusters,
     * and a high ratio of unrecognizable "words".
     */
    function isGibberish(text: string): boolean {
        const trimmed = text.trim();
        if (trimmed.length < 3) return true;

        const words = trimmed.split(/\s+/);

        // Rule 1: Any single "word" over 15 chars that isn't a known compound word
        if (words.some(w => w.length > 15 && !/[-_\/]/.test(w))) return true;

        // Rule 2: Words with 5+ consecutive consonants (like "bshbdhvbf")
        const consonantCluster = /[bcdfghjklmnpqrstvwxyz]{5,}/i;
        const clusterWords = words.filter(w => consonantCluster.test(w));
        if (clusterWords.length >= 2) return true;

        // Rule 3: Check if most words look like random characters
        // A "real" word has a reasonable vowel ratio (15-80% vowels)
        const vowelPattern = /[aeiou]/gi;
        let nonsenseCount = 0;
        for (const word of words) {
            if (word.length < 2) continue;
            const vowels = (word.match(vowelPattern) || []).length;
            const ratio = vowels / word.length;
            if (ratio < 0.1 || ratio > 0.85) nonsenseCount++;
        }
        if (words.length >= 2 && nonsenseCount / words.length > 0.6) return true;

        return false;
    }

    async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!query.trim()) return;

        // Validate input is a real product description
        if (isGibberish(query)) {
            setError("That doesn't look like a valid product description. Please describe a real product — for example: \"cotton t-shirt\", \"stainless steel pipe\", or \"lithium-ion battery pack\".");
            setResults([]);
            setSearched(true);
            return;
        }

        setIsLoading(true);
        setError(null);
        setSearched(true);

        try {
            const res = await fetch("/api/hts/search/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    description: query.trim(),
                    countryCode: country,
                    maxResults: 5,
                    turnstileToken,
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error?.message || errData.error || "Classification failed");
            }

            const data = await res.json();
            setResults(data.results || []);
        } catch (err: any) {
            setError(err.message || "An error occurred during classification.");
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }

    function getConfidenceColor(confidence: number): string {
        if (confidence >= 0.85) return "#22c55e";
        if (confidence >= 0.65) return "#f59e0b";
        return "#ef4444";
    }

    function getConfidenceLabel(confidence: number): string {
        if (confidence >= 0.85) return "High";
        if (confidence >= 0.65) return "Medium";
        return "Low";
    }

    function getMatchMethodLabel(method: string): string {
        if (method === "vector") return "Semantic Match";
        if (method === "fts") return "Text Match";
        return "AI Classification";
    }

    function getHSHierarchy(code: string) {
        const chapter = code.substring(0, 2);
        const heading = code.substring(0, 4);
        const subheading = code.substring(0, 6);
        return { chapter, heading, subheading, full: code };
    }

    return (
        <div>
            {/* Search Form */}
            <form onSubmit={handleSearch} style={{ marginBottom: "2rem" }}>
                <div style={{ marginBottom: "1.25rem" }}>
                    <label htmlFor="hs-product-query" style={{ display: "block", fontSize: "0.95rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.5rem" }}>
                        Describe Your Product
                    </label>
                    <textarea
                        id="hs-product-query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        required
                        disabled={isLoading}
                        rows={3}
                        placeholder="e.g., Men's leather motorcycle jacket with zip closure, made of cowhide leather"
                        style={{
                            width: "100%",
                            padding: "1rem",
                            fontSize: "1rem",
                            borderRadius: "10px",
                            border: "1px solid var(--border)",
                            background: "var(--background)",
                            color: "var(--foreground)",
                            resize: "vertical",
                            lineHeight: 1.5,
                            outline: "none",
                        }}
                    />
                    <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: "0.3rem", display: "block" }}>
                        💡 Tip: Include material, purpose, and components for more accurate classification.
                    </span>
                </div>

                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 min(250px, 100%)" }}>
                        <label htmlFor="hs-country" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.4rem" }}>
                            Destination Market
                        </label>
                        <select
                            id="hs-country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            disabled={isLoading}
                            style={{
                                width: "100%",
                                padding: "0.75rem 1rem",
                                fontSize: "0.95rem",
                                borderRadius: "8px",
                                border: "1px solid rgba(255,255,255,0.15)",
                                background: "#0f172a",
                                color: "#fff",
                                appearance: "none",
                                WebkitAppearance: "none",
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 8.825L.35 3.175l.7-.7L6 7.425l4.95-4.95.7.7z'/%3E%3C/svg%3E")`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "right 12px center",
                                cursor: "pointer",
                                outline: "none",
                            }}
                        >
                            {COUNTRIES.map(c => (
                                <option key={c.code} value={c.code} style={{ background: "#0f172a", color: "#fff" }}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        style={{
                            flex: "1 1 max-content",
                            padding: "0.75rem 2rem",
                            fontSize: "1rem",
                            fontWeight: 700,
                            borderRadius: "8px",
                            border: "none",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            background: isLoading ? "var(--muted)" : "linear-gradient(135deg, var(--accent), #6366f1)",
                            color: "#fff",
                            whiteSpace: "nowrap",
                            transition: "all 0.2s ease",
                            textAlign: "center",
                        }}
                    >
                        {isLoading ? (
                            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                                Classifying...
                            </span>
                        ) : (
                            "Find HS Code →"
                        )}
                    </button>
                </div>
            </form>

            {error && (
                <div role="alert" style={{ padding: "1rem 1.25rem", borderRadius: "10px", border: "1px solid #ef4444", background: "rgba(239,68,68,0.05)", color: "#ef4444", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Results */}
            {searched && !isLoading && results.length === 0 && !error && (
                <div style={{ textAlign: "center", padding: "3rem 2rem", background: "var(--card)", borderRadius: "12px", border: "1px solid var(--border)" }}>
                    <p style={{ fontSize: "1.1rem", color: "var(--muted-foreground)", margin: 0 }}>
                        No HS codes found for <strong>&ldquo;{query}&rdquo;</strong>. Try a more specific product description.
                    </p>
                </div>
            )}

            {results.length > 0 && (
                <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "1rem" }}>
                        Top {results.length} HS Code Suggestions
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {results.map((result, i) => {
                            const hierarchy = getHSHierarchy(result.htsCode);
                            const confColor = getConfidenceColor(result.confidence);
                            return (
                                <div key={`hs-${i}`} style={{
                                    background: "var(--card)",
                                    border: i === 0 ? `2px solid ${confColor}` : "1px solid var(--border)",
                                    borderRadius: "12px",
                                    padding: "1.5rem",
                                    position: "relative",
                                }}>
                                    {i === 0 && (
                                        <span style={{
                                            position: "absolute", top: "-10px", left: "16px",
                                            background: confColor, color: "#fff",
                                            fontSize: "0.7rem", fontWeight: 700, padding: "2px 10px",
                                            borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.05em"
                                        }}>
                                            Best Match
                                        </span>
                                    )}

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                                        <div style={{ flex: 1 }}>
                                            {/* HS Code + Description */}
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                                                <code style={{
                                                    fontSize: "1.4rem", fontWeight: 800, color: "var(--accent)",
                                                    background: "rgba(99,102,241,0.08)", padding: "0.35rem 0.75rem",
                                                    borderRadius: "6px", letterSpacing: "0.07em"
                                                }}>
                                                    {result.htsCode}
                                                </code>
                                                <span style={{
                                                    fontSize: "0.7rem", fontWeight: 600, color: confColor,
                                                    background: `${confColor}15`, padding: "3px 8px",
                                                    borderRadius: "4px", textTransform: "uppercase"
                                                }}>
                                                    {getConfidenceLabel(result.confidence)} • {Math.round(result.confidence * 100)}%
                                                </span>
                                            </div>

                                            <p style={{ fontSize: "0.95rem", color: "var(--foreground)", margin: "0 0 1rem", lineHeight: 1.5 }}>
                                                {result.description}
                                            </p>

                                            {/* Hierarchy Tree */}
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                                                <span style={{
                                                    fontSize: "0.75rem", background: "rgba(99,102,241,0.06)",
                                                    padding: "3px 8px", borderRadius: "4px", color: "var(--muted-foreground)"
                                                }}>
                                                    Ch. {hierarchy.chapter}
                                                </span>
                                                <span aria-hidden="true" style={{ color: "var(--muted-foreground)", fontSize: "0.7rem" }}>→</span>
                                                <span style={{
                                                    fontSize: "0.75rem", background: "rgba(99,102,241,0.06)",
                                                    padding: "3px 8px", borderRadius: "4px", color: "var(--muted-foreground)"
                                                }}>
                                                    Heading {hierarchy.heading}
                                                </span>
                                                <span aria-hidden="true" style={{ color: "var(--muted-foreground)", fontSize: "0.7rem" }}>→</span>
                                                <span style={{
                                                    fontSize: "0.75rem", background: "rgba(99,102,241,0.06)",
                                                    padding: "3px 8px", borderRadius: "4px", color: "var(--foreground)", fontWeight: 600
                                                }}>
                                                    {hierarchy.full}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right Panel: Method & Duty Info */}
                                        <div style={{ flex: "1 1 min(160px, 100%)", textAlign: "left", paddingLeft: "0", marginTop: "0.5rem" }}>
                                            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
                                                <div>
                                                    <span style={{
                                                        fontSize: "0.7rem", fontWeight: 600,
                                                        color: "var(--muted-foreground)", textTransform: "uppercase",
                                                        letterSpacing: "0.05em", display: "block", marginBottom: "0.25rem"
                                                    }}>
                                                        Match Type
                                                    </span>
                                                    <div style={{ fontSize: "0.85rem", color: "var(--foreground)", fontWeight: 500 }}>
                                                        {getMatchMethodLabel(result.matchMethod)}
                                                    </div>
                                                </div>
                                                {result.dutyRatePct !== null && (
                                                    <div>
                                                        <span style={{
                                                            fontSize: "0.7rem", fontWeight: 600,
                                                            color: "var(--muted-foreground)", textTransform: "uppercase",
                                                            letterSpacing: "0.05em", display: "block", marginBottom: "0.25rem"
                                                        }}>
                                                            Base Duty
                                                        </span>
                                                        <div style={{ fontSize: "0.95rem", color: "var(--foreground)", fontWeight: 700 }}>
                                                            {result.dutyRatePct}%
                                                        </div>
                                                    </div>
                                                )}
                                                {result.vatRatePct !== null && (
                                                    <div>
                                                        <span style={{
                                                            fontSize: "0.7rem", fontWeight: 600,
                                                            color: "var(--muted-foreground)", textTransform: "uppercase",
                                                            letterSpacing: "0.05em", display: "block", marginBottom: "0.25rem"
                                                        }}>
                                                            VAT/GST
                                                        </span>
                                                        <div style={{ fontSize: "0.95rem", color: "var(--foreground)", fontWeight: 700 }}>
                                                            {result.vatRatePct}%
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* CTA to calculator */}
                                    {
                                        i === 0 && (
                                            <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                                                <Link href="/calculate/" style={{
                                                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                                                    fontSize: "0.9rem", fontWeight: 600, color: "var(--accent)",
                                                    textDecoration: "none",
                                                }}>
                                                    Calculate full landed cost for this product →
                                                </Link>
                                            </div>
                                        )
                                    }
                                </div>
                            );
                        })}
                    </div>

                    {/* Disclaimer */}
                    <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: "1.5rem", lineHeight: 1.5 }}>
                        ⚠️ <strong>Disclaimer:</strong> HS code suggestions are AI-assisted and should be verified with your country&apos;s customs authority. Classification can vary by destination.
                        <Link href="/hs-code-lookup/" style={{ color: "var(--accent)", marginLeft: "0.25rem" }}>Verify with our HS Code Lookup →</Link>
                    </p>
                </div>
            )
            }
        </div >
    );
}
