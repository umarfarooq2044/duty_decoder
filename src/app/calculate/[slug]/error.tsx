"use client";

export default function CalculateError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div style={{
            maxWidth: "600px",
            margin: "4rem auto",
            padding: "2rem",
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
        }}>
            <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#ef4444" }}>
                Something went wrong
            </h1>
            <p style={{ color: "#94a3b8", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                We couldn&apos;t load this calculation page. This may be a temporary issue.
            </p>
            {error.digest && (
                <p style={{ color: "#64748b", fontSize: "0.8rem", marginBottom: "1rem" }}>
                    Error ID: {error.digest}
                </p>
            )}
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <button
                    onClick={reset}
                    style={{
                        padding: "0.75rem 1.5rem",
                        background: "var(--accent, #4ade80)",
                        color: "#000",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 600,
                    }}
                >
                    Try Again
                </button>
                <a
                    href="/calculate/"
                    style={{
                        padding: "0.75rem 1.5rem",
                        background: "rgba(255,255,255,0.1)",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontWeight: 600,
                    }}
                >
                    Back to Calculator
                </a>
            </div>
        </div>
    );
}
