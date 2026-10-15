import Link from "next/link";
import type { Metadata } from "next";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { Home, Calculator, Search, BookOpen, FileSpreadsheet, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist. Browse our import duty calculators, HS code tools, and trade compliance guides.",
    robots: { index: false, follow: true },
};

export default function NotFound() {
    return (
        <main style={{ maxWidth: "760px", margin: "0 auto", padding: "5rem 1.25rem", textAlign: "center" }}>
            {/* Visual indicator */}
            <div style={{
                fontSize: "4.5rem",
                fontWeight: 800,
                color: "var(--teal-700, #0F766E)",
                lineHeight: 1,
                marginBottom: "1rem",
                fontFamily: "var(--font-heading)",
            }}>
                404
            </div>

            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--navy-900, #0B1F3A)", marginBottom: "0.75rem" }}>
                Page Not Found
            </h1>
            <p style={{ fontSize: "1.05rem", color: "var(--text-body, #475569)", lineHeight: 1.6, marginBottom: "2.5rem" }}>
                The page you are looking for does not exist or may have been relocated.
                Explore our duty calculators, AI HS classification, or trade guides below:
            </p>

            {/* Quick-access cards */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "1rem",
                marginBottom: "2.5rem",
                textAlign: "left",
            }}>
                {[
                    { href: "/", icon: <Home size={20} style={{ color: "var(--teal-700)" }} />, title: "Homepage", desc: "Import duty & landed cost calculator" },
                    { href: "/calculate/", icon: <Calculator size={20} style={{ color: "var(--teal-700)" }} />, title: "Landed Cost Calculator", desc: "Calculate duties for 50+ countries" },
                    { href: "/hs-code-finder/", icon: <Search size={20} style={{ color: "var(--teal-700)" }} />, title: "HS Code Finder", desc: "AI-powered tariff classification" },
                    { href: "/import-duty/", icon: <BookOpen size={20} style={{ color: "var(--teal-700)" }} />, title: "Import Duty Guide", desc: "How duties and tariffs work" },
                    { href: "/tariff-rates/", icon: <FileSpreadsheet size={20} style={{ color: "var(--teal-700)" }} />, title: "Tariff Rates", desc: "2026 country schedules" },
                    { href: "/customs-clearance/", icon: <ShieldCheck size={20} style={{ color: "var(--teal-700)" }} />, title: "Customs Clearance", desc: "Clearance requirements & steps" },
                ].map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="premium-card"
                        style={{
                            display: "block",
                            textDecoration: "none",
                            padding: "1.25rem",
                        }}
                    >
                        <div style={{ marginBottom: "0.5rem" }}>
                            {link.icon}
                        </div>
                        <strong style={{ fontSize: "0.95rem", color: "var(--navy-900, #0B1F3A)", display: "block", marginBottom: "0.25rem" }}>
                            {link.title}
                        </strong>
                        <span style={{ fontSize: "0.82rem", color: "var(--text-muted, #64748B)", lineHeight: 1.4, display: "block" }}>
                            {link.desc}
                        </span>
                    </Link>
                ))}
            </div>

            {/* Popular country calculators */}
            <div style={{
                background: "var(--surface, #FFFFFF)",
                border: "1px solid var(--border, #E3E8EF)",
                borderRadius: "12px",
                padding: "1.75rem",
                marginBottom: "2.5rem",
                boxShadow: "0 1px 3px rgba(11, 31, 58, 0.04)",
            }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--navy-900, #0B1F3A)", marginBottom: "1rem" }}>
                    Popular Country Calculators
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                    {[
                        { code: "US", name: "USA", slug: "united-states" },
                        { code: "GB", name: "UK", slug: "united-kingdom" },
                        { code: "DE", name: "Germany", slug: "germany" },
                        { code: "CN", name: "China", slug: "china" },
                        { code: "IN", name: "India", slug: "india" },
                        { code: "CA", name: "Canada", slug: "canada" },
                        { code: "JP", name: "Japan", slug: "japan" },
                        { code: "AU", name: "Australia", slug: "australia" },
                    ].map(c => (
                        <Link
                            key={c.slug}
                            href={`/${c.slug}/import-duty-calculator/`}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.45rem",
                                background: "var(--bg, #F7F9FC)",
                                border: "1px solid var(--border, #E3E8EF)",
                                borderRadius: "6px",
                                padding: "0.45rem 0.85rem",
                                fontSize: "0.85rem",
                                color: "var(--navy-900, #0B1F3A)",
                                textDecoration: "none",
                                fontWeight: 600,
                            }}
                        >
                            <CountryFlag code={c.code} style={{ width: "16px", height: "12px" }} />
                            <span>{c.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Back to home CTA */}
            <Link
                href="/"
                className="premium-btn-primary"
            >
                ← Return to Homepage
            </Link>
        </main>
    );
}
