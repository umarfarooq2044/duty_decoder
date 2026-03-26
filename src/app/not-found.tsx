import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist. Browse our import duty calculators, HS code tools, and trade compliance guides.",
    robots: { index: false, follow: true },
};

export default function NotFound() {
    return (
        <main style={{ maxWidth: "700px", margin: "0 auto", padding: "4rem 1rem", textAlign: "center" }}>
            {/* Visual indicator */}
            <div style={{
                fontSize: "5rem",
                fontWeight: 800,
                background: "linear-gradient(135deg, var(--color-accent, #6366f1), var(--color-accent-hover, #818cf8))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "1rem",
            }}>
                404
            </div>

            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-text-primary, #e8eaf0)", marginBottom: "0.75rem" }}>
                Page Not Found
            </h1>
            <p style={{ fontSize: "1.05rem", color: "var(--color-text-secondary, #8b8fa8)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
                The page you're looking for doesn't exist or has been moved.
                Try one of these popular tools instead:
            </p>

            {/* Quick-access cards */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginBottom: "3rem",
                textAlign: "left",
            }}>
                {[
                    { href: "/", icon: "🏠", title: "Homepage", desc: "Import duty & landed cost calculator" },
                    { href: "/calculate/", icon: "🧮", title: "Calculator", desc: "Calculate duties for any product" },
                    { href: "/hs-code-finder/", icon: "🔍", title: "HS Code Finder", desc: "AI-powered tariff classification" },
                    { href: "/import-duty/", icon: "📖", title: "Import Duty Guide", desc: "How duties work globally" },
                    { href: "/tariff-rates/", icon: "📋", title: "Tariff Rates", desc: "Country-by-country schedules" },
                    { href: "/customs-clearance/", icon: "🛃", title: "Customs Clearance", desc: "Step-by-step process guide" },
                ].map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        style={{
                            display: "block",
                            background: "rgba(30, 34, 53, 0.7)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            borderRadius: "12px",
                            padding: "1.25rem",
                            textDecoration: "none",
                            transition: "border-color 0.2s ease, transform 0.15s ease",
                        }}
                    >
                        <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "0.5rem" }} aria-hidden="true">
                            {link.icon}
                        </span>
                        <strong style={{ fontSize: "0.95rem", color: "var(--color-accent, #6366f1)", display: "block", marginBottom: "0.25rem" }}>
                            {link.title}
                        </strong>
                        <span style={{ fontSize: "0.8rem", color: "var(--color-text-secondary, #8b8fa8)" }}>
                            {link.desc}
                        </span>
                    </Link>
                ))}
            </div>

            {/* Popular country calculators */}
            <div style={{
                background: "rgba(99, 102, 241, 0.04)",
                border: "1px solid rgba(99, 102, 241, 0.1)",
                borderRadius: "12px",
                padding: "1.5rem",
                marginBottom: "2rem",
            }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-text-primary, #e8eaf0)", marginBottom: "1rem" }}>
                    Popular Country Calculators
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                    {[
                        { flag: "🇺🇸", name: "USA", slug: "united-states" },
                        { flag: "🇬🇧", name: "UK", slug: "united-kingdom" },
                        { flag: "🇩🇪", name: "Germany", slug: "germany" },
                        { flag: "🇨🇳", name: "China", slug: "china" },
                        { flag: "🇮🇳", name: "India", slug: "india" },
                        { flag: "🇨🇦", name: "Canada", slug: "canada" },
                        { flag: "🇯🇵", name: "Japan", slug: "japan" },
                        { flag: "🇦🇺", name: "Australia", slug: "australia" },
                    ].map(c => (
                        <Link
                            key={c.slug}
                            href={`/${c.slug}/import-duty-calculator/`}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "6px",
                                padding: "0.4rem 0.75rem",
                                fontSize: "0.82rem",
                                color: "var(--color-text-primary, #e8eaf0)",
                                textDecoration: "none",
                                fontWeight: 500,
                            }}
                        >
                            {c.flag} {c.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Back to home CTA */}
            <Link
                href="/"
                style={{
                    display: "inline-block",
                    background: "linear-gradient(135deg, var(--color-accent, #6366f1), #818cf8)",
                    color: "#fff",
                    fontWeight: 700,
                    padding: "0.85rem 2rem",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontSize: "1rem",
                }}
            >
                ← Back to Homepage
            </Link>
        </main>
    );
}
