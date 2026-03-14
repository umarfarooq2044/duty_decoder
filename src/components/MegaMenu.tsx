"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ─── Top 10 Popular Countries (by trade volume) ─── */
const POPULAR_COUNTRIES = [
    { name: "United States", slug: "united-states", flag: "🇺🇸" },
    { name: "United Kingdom", slug: "united-kingdom", flag: "🇬🇧" },
    { name: "Germany", slug: "germany", flag: "🇩🇪" },
    { name: "China", slug: "china", flag: "🇨🇳" },
    { name: "India", slug: "india", flag: "🇮🇳" },
    { name: "Canada", slug: "canada", flag: "🇨🇦" },
    { name: "Japan", slug: "japan", flag: "🇯🇵" },
    { name: "France", slug: "france", flag: "🇫🇷" },
    { name: "Australia", slug: "australia", flag: "🇦🇺" },
    { name: "Singapore", slug: "singapore", flag: "🇸🇬" },
];

/* ─── Full 50-country list for Countries panel ─── */
const ALL_COUNTRIES = [
    { name: "Argentina", slug: "argentina", flag: "🇦🇷" },
    { name: "Australia", slug: "australia", flag: "🇦🇺" },
    { name: "Austria", slug: "austria", flag: "🇦🇹" },
    { name: "Belgium", slug: "belgium", flag: "🇧🇪" },
    { name: "Brazil", slug: "brazil", flag: "🇧🇷" },
    { name: "Canada", slug: "canada", flag: "🇨🇦" },
    { name: "Chile", slug: "chile", flag: "🇨🇱" },
    { name: "China", slug: "china", flag: "🇨🇳" },
    { name: "Czech Republic", slug: "czech-republic", flag: "🇨🇿" },
    { name: "Denmark", slug: "denmark", flag: "🇩🇰" },
    { name: "Egypt", slug: "egypt", flag: "🇪🇬" },
    { name: "Finland", slug: "finland", flag: "🇫🇮" },
    { name: "France", slug: "france", flag: "🇫🇷" },
    { name: "Germany", slug: "germany", flag: "🇩🇪" },
    { name: "Greece", slug: "greece", flag: "🇬🇷" },
    { name: "Hong Kong", slug: "hong-kong", flag: "🇭🇰" },
    { name: "Hungary", slug: "hungary", flag: "🇭🇺" },
    { name: "India", slug: "india", flag: "🇮🇳" },
    { name: "Indonesia", slug: "indonesia", flag: "🇮🇩" },
    { name: "Iran", slug: "iran", flag: "🇮🇷" },
    { name: "Ireland", slug: "ireland", flag: "🇮🇪" },
    { name: "Israel", slug: "israel", flag: "🇮🇱" },
    { name: "Italy", slug: "italy", flag: "🇮🇹" },
    { name: "Japan", slug: "japan", flag: "🇯🇵" },
    { name: "Luxembourg", slug: "luxembourg", flag: "🇱🇺" },
    { name: "Malaysia", slug: "malaysia", flag: "🇲🇾" },
    { name: "Mexico", slug: "mexico", flag: "🇲🇽" },
    { name: "Netherlands", slug: "netherlands", flag: "🇳🇱" },
    { name: "Norway", slug: "norway", flag: "🇳🇴" },
    { name: "Pakistan", slug: "pakistan", flag: "🇵🇰" },
    { name: "Philippines", slug: "philippines", flag: "🇵🇭" },
    { name: "Poland", slug: "poland", flag: "🇵🇱" },
    { name: "Portugal", slug: "portugal", flag: "🇵🇹" },
    { name: "Romania", slug: "romania", flag: "🇷🇴" },
    { name: "Russia", slug: "russia", flag: "🇷🇺" },
    { name: "Saudi Arabia", slug: "saudi-arabia", flag: "🇸🇦" },
    { name: "Singapore", slug: "singapore", flag: "🇸🇬" },
    { name: "Slovakia", slug: "slovakia", flag: "🇸🇰" },
    { name: "South Africa", slug: "south-africa", flag: "🇿🇦" },
    { name: "South Korea", slug: "south-korea", flag: "🇰🇷" },
    { name: "Spain", slug: "spain", flag: "🇪🇸" },
    { name: "Sweden", slug: "sweden", flag: "🇸🇪" },
    { name: "Switzerland", slug: "switzerland", flag: "🇨🇭" },
    { name: "Taiwan", slug: "taiwan", flag: "🇹🇼" },
    { name: "Thailand", slug: "thailand", flag: "🇹🇭" },
    { name: "Turkey", slug: "turkey", flag: "🇹🇷" },
    { name: "Ukraine", slug: "ukraine", flag: "🇺🇦" },
    { name: "United Arab Emirates", slug: "united-arab-emirates", flag: "🇦🇪" },
    { name: "United Kingdom", slug: "united-kingdom", flag: "🇬🇧" },
    { name: "United States", slug: "united-states", flag: "🇺🇸" },
    { name: "Vietnam", slug: "vietnam", flag: "🇻🇳" },
];

type PanelKey = "importDuty" | "countries" | "resources" | null;

export function MegaMenu() {
    const pathname = usePathname();
    const [activePanel, setActivePanel] = useState<PanelKey>(null);
    const [countrySearch, setCountrySearch] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    // Close panels on route change
    useEffect(() => {
        setActivePanel(null);
        setCountrySearch("");
        setMobileOpen(false);
    }, [pathname]);

    // Close panels on Escape
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") { setActivePanel(null); setMobileOpen(false); }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Close panels on click outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setActivePanel(null);
                setMobileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const togglePanel = useCallback((panel: PanelKey) => {
        setActivePanel(prev => prev === panel ? null : panel);
    }, []);

    const filteredCountries = countrySearch.length > 0
        ? ALL_COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
        : ALL_COUNTRIES;

    /* ─── Shared Styles ─── */
    const panelStyle: React.CSSProperties = {
        position: "absolute", top: "100%", left: 0, right: 0,
        background: "rgba(10, 15, 36, 0.97)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderTop: "2px solid var(--accent)", borderRadius: "0 0 12px 12px",
        padding: "clamp(1rem, 3vw, 2rem)", zIndex: 100,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        maxWidth: "1200px", margin: "0 auto",
        overflowY: "auto" as const, maxHeight: "80vh",
    };

    const colHeadingStyle: React.CSSProperties = {
        fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.08em", color: "rgba(255,255,255,0.5)",
        marginBottom: "0.75rem", paddingBottom: "0.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
    };

    const linkStyle: React.CSSProperties = {
        display: "block", fontSize: "0.9rem", color: "rgba(255,255,255,0.85)",
        textDecoration: "none", padding: "0.35rem 0", lineHeight: 1.4,
    };

    const navBtnStyle = (isActive: boolean): React.CSSProperties => ({
        background: "none", border: "none", color: isActive ? "var(--accent)" : "var(--foreground)",
        fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", padding: "0.5rem 0.75rem",
        borderRadius: "6px", transition: "color 0.2s",
    });

    return (
        <nav ref={navRef} aria-label="Main navigation" style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
            background: "rgba(10, 15, 36, 0.95)", backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--border)",
        }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1rem", height: "64px" }}>
                {/* Brand */}
                <Link href="/" aria-label="DutyDecoder Home" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="28" height="28" style={{ display: 'block' }}>
                        <path d="M 25 10 L 50 10 A 40 40 0 0 1 50 90 L 25 90" fill="none" stroke="#4ade80" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="5" y="0" width="20" height="20" rx="6" fill="#1e293b" />
                        <rect x="5" y="35" width="35" height="30" rx="6" fill="#1e293b" />
                        <rect x="5" y="80" width="20" height="20" rx="6" fill="#1e293b" />
                        <circle cx="55" cy="50" r="10" fill="#4ade80" />
                    </svg>
                    <span style={{ fontWeight: 800, fontSize: "1.25rem", display: "flex", alignItems: "center" }}>
                        <span style={{ color: "#fff" }}>Duty</span>
                        <span style={{ color: "var(--muted-foreground)" }}>Decoder</span>
                        <span style={{ color: "#4ade80" }}>.</span>
                    </span>
                </Link>

                {/* Mobile hamburger */}
                <button
                    className="mega-menu-hamburger"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                    style={{
                        display: "none", background: "none", border: "none",
                        color: "#fff", fontSize: "1.5rem", cursor: "pointer", padding: "0.5rem",
                    }}
                >
                    {mobileOpen ? "✕" : "☰"}
                </button>

                {/* Primary Nav Items — hidden on mobile, shown in hamburger drawer */}
                <div className="mega-menu-links" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    {/* 1. Import Duty (mega menu) */}
                    <button
                        onClick={() => togglePanel("importDuty")}
                        onKeyDown={(e) => { if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") { e.preventDefault(); setActivePanel("importDuty"); } }}
                        aria-expanded={activePanel === "importDuty"}
                        aria-haspopup="true"
                        style={navBtnStyle(activePanel === "importDuty")}
                    >
                        Import Duty ▾
                    </button>

                    {/* 2. HS Code Finder (direct link) */}
                    <Link href="/hs-code-finder/" style={{ ...navBtnStyle(pathname === "/hs-code-finder"), textDecoration: "none" }}>
                        HS Code Finder
                    </Link>

                    {/* 3. Countries (mega menu) */}
                    <button
                        onClick={() => togglePanel("countries")}
                        onKeyDown={(e) => { if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") { e.preventDefault(); setActivePanel("countries"); } }}
                        aria-expanded={activePanel === "countries"}
                        aria-haspopup="true"
                        style={navBtnStyle(activePanel === "countries")}
                    >
                        Countries ▾
                    </button>

                    {/* 4. Resources (mega menu) */}
                    <button
                        onClick={() => togglePanel("resources")}
                        onKeyDown={(e) => { if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") { e.preventDefault(); setActivePanel("resources"); } }}
                        aria-expanded={activePanel === "resources"}
                        aria-haspopup="true"
                        style={navBtnStyle(activePanel === "resources")}
                    >
                        Resources ▾
                    </button>

                    {/* 5. Methodology (direct link) */}
                    <Link href="/methodology/" style={{ ...navBtnStyle(pathname === "/methodology"), textDecoration: "none" }}>
                        Methodology
                    </Link>
                </div>

                {/* CTA */}
                <Link href="/calculate/" className="mega-menu-cta" style={{
                    background: "linear-gradient(135deg, var(--accent), #6366f1)",
                    color: "#fff", fontWeight: 700, fontSize: "0.9rem",
                    padding: "0.6rem 1.25rem", borderRadius: "8px",
                    textDecoration: "none", whiteSpace: "nowrap",
                }}>
                    Get Landed Cost
                </Link>
            </div>

            {/* Mobile dropdown drawer */}
            {mobileOpen && (
                <div className="mega-menu-mobile-drawer" style={{
                    background: "rgba(10, 15, 36, 0.98)", borderTop: "1px solid rgba(255,255,255,0.08)",
                    padding: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem",
                }}>
                    <button onClick={() => togglePanel("importDuty")} style={{ ...navBtnStyle(false), textAlign: "left", width: "100%", padding: "0.75rem" }}>Import Duty ▾</button>
                    <Link href="/hs-code-finder/" style={{ ...navBtnStyle(false), textDecoration: "none", padding: "0.75rem" }}>HS Code Finder</Link>
                    <button onClick={() => togglePanel("countries")} style={{ ...navBtnStyle(false), textAlign: "left", width: "100%", padding: "0.75rem" }}>Countries ▾</button>
                    <button onClick={() => togglePanel("resources")} style={{ ...navBtnStyle(false), textAlign: "left", width: "100%", padding: "0.75rem" }}>Resources ▾</button>
                    <Link href="/methodology/" style={{ ...navBtnStyle(false), textDecoration: "none", padding: "0.75rem" }}>Methodology</Link>
                    <Link href="/calculate/" style={{
                        background: "var(--accent)", color: "#fff", fontWeight: 700,
                        padding: "0.75rem 1.25rem", borderRadius: "8px", textDecoration: "none",
                        textAlign: "center", marginTop: "0.5rem",
                    }}>Get Landed Cost</Link>
                </div>
            )}

            {/* ═══════════════ MEGA PANEL: Import Duty ═══════════════ */}
            {activePanel === "importDuty" && (
                <div style={panelStyle}>
                    {/* Top Row: How It Works Highlight */}
                    <div style={{
                        background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(59,130,246,0.08))",
                        border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px",
                        padding: "1rem 1.5rem", marginBottom: "1.5rem",
                        display: "flex", alignItems: "center", gap: "1.5rem",
                    }}>
                        <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
                            <strong style={{ color: "#fff" }}>How it works:</strong> Product Description → AI HS Code Classification → Customs Duty → VAT/GST → <strong style={{ color: "var(--accent)" }}>Total Landed Cost</strong>
                        </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "2rem" }}>
                        {/* Col 1: Country Calculators (Top 10) */}
                        <div>
                            <h3 style={colHeadingStyle}>Country Calculators</h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {POPULAR_COUNTRIES.map(c => (
                                    <li key={c.slug}><Link href={`/${c.slug}/import-duty-calculator/`} style={linkStyle}>{c.flag} {c.name} Import Duty Calculator</Link></li>
                                ))}
                            </ul>
                        </div>

                        {/* Col 2: Import Duty Guides */}
                        <div>
                            <h3 style={colHeadingStyle}>Import Duty Guides</h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                <li><Link href="/import-duty/" style={linkStyle}>Import Duty Guide</Link></li>
                                <li><Link href="/customs-duty/" style={linkStyle}>Customs Duty Explained</Link></li>
                                <li><Link href="/tariff-rates/" style={linkStyle}>Tariff Rates & Schedules</Link></li>
                            </ul>
                        </div>

                        {/* Col 3: Compliance & Rules */}
                        <div>
                            <h3 style={colHeadingStyle}>Compliance & Rules</h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                <li><Link href="/import-tax/" style={linkStyle}>Import Tax (VAT/GST)</Link></li>
                                <li><Link href="/customs-clearance/" style={linkStyle}>Customs Clearance Process</Link></li>
                                <li><Link href="/import-documents/" style={linkStyle}>Required Import Documents</Link></li>
                                <li><Link href="/import-restrictions/" style={linkStyle}>Import Restrictions</Link></li>
                            </ul>
                        </div>

                        {/* Col 4: Tools */}
                        <div>
                            <h3 style={colHeadingStyle}>Tools</h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                <li><Link href="/calculate/" style={linkStyle}>Landed Cost Calculator</Link></li>
                                <li><Link href="/hs-code-lookup/" style={linkStyle}>HS Code Lookup</Link></li>
                                <li><Link href="/hs-code-finder/" style={linkStyle}>AI HS Code Finder</Link></li>
                            </ul>
                            <div style={{ marginTop: "1.5rem" }}>
                                <Link href="/calculate/" style={{
                                    display: "inline-block", background: "var(--accent)", color: "#fff",
                                    padding: "0.6rem 1.25rem", borderRadius: "8px", fontWeight: 600,
                                    fontSize: "0.85rem", textDecoration: "none",
                                }}>
                                    Try Calculator →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════ MEGA PANEL: Countries ═══════════════ */}
            {activePanel === "countries" && (
                <div style={panelStyle}>
                    {/* Search */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <input
                            type="text"
                            placeholder="Search 51 countries..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            aria-label="Search countries"
                            style={{
                                width: "100%", padding: "0.75rem 1rem", fontSize: "0.95rem",
                                borderRadius: "8px", border: "1px solid rgba(255,255,255,0.12)",
                                background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none",
                            }}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "2rem" }}>
                        {/* Left: Popular Countries */}
                        <div>
                            <h3 style={colHeadingStyle}>Popular Countries</h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {POPULAR_COUNTRIES.map(c => (
                                    <li key={c.slug} style={{ marginBottom: "0.5rem" }}>
                                        <Link href={`/${c.slug}/`} style={{ ...linkStyle, fontWeight: 600 }}>
                                            {c.flag} {c.name}
                                        </Link>
                                        <div style={{ display: "flex", gap: "0.75rem", paddingLeft: "1.5rem" }}>
                                            <Link href={`/${c.slug}/import-duty-calculator/`} style={{ fontSize: "0.75rem", color: "var(--accent)", textDecoration: "none" }}>Calculator</Link>
                                            <Link href={`/${c.slug}/import-tax/`} style={{ fontSize: "0.75rem", color: "var(--accent)", textDecoration: "none" }}>Import Tax</Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right: Full Alphabetical List */}
                        <div>
                            <h3 style={colHeadingStyle}>All Countries (A–Z)</h3>
                            <div style={{
                                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.25rem 1rem",
                                maxHeight: "400px", overflowY: "auto",
                            }}>
                                {filteredCountries.map(c => (
                                    <Link key={c.slug} href={`/${c.slug}/`} style={{ ...linkStyle, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                                        <span style={{ fontSize: "0.9rem" }}>{c.flag}</span> {c.name}
                                    </Link>
                                ))}
                                {filteredCountries.length === 0 && (
                                    <p style={{ gridColumn: "1/-1", color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", padding: "1rem 0" }}>
                                        No countries match &ldquo;{countrySearch}&rdquo;
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════ MEGA PANEL: Resources ═══════════════ */}
            {activePanel === "resources" && (
                <div style={panelStyle}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem" }}>
                        {/* Col 1: Global Guides */}
                        <div>
                            <h3 style={colHeadingStyle}>Guides (Global)</h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                <li><Link href="/import-duty/" style={linkStyle}>Understanding Import Duty</Link></li>
                                <li><Link href="/import-tax/" style={linkStyle}>Import Tax (VAT & GST)</Link></li>
                                <li><Link href="/tariff-rates/" style={linkStyle}>Global Tariff Rates</Link></li>
                                <li><Link href="/customs-clearance/" style={linkStyle}>Customs Clearance Guide</Link></li>
                                <li><Link href="/import-documents/" style={linkStyle}>Import Documentation</Link></li>
                                <li><Link href="/import-restrictions/" style={linkStyle}>Import Restrictions</Link></li>
                            </ul>
                        </div>

                        {/* Col 2: Country Guides */}
                        <div>
                            <h3 style={colHeadingStyle}>Country Guides</h3>
                            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: "1rem" }}>
                                Access detailed import duty guides, customs calculators, and compliance tools for 51 countries.
                            </p>
                            <button onClick={() => setActivePanel("countries")} style={{
                                background: "var(--accent)", color: "#fff", border: "none",
                                padding: "0.6rem 1.25rem", borderRadius: "8px", fontSize: "0.85rem",
                                fontWeight: 600, cursor: "pointer",
                            }}>
                                Browse Countries →
                            </button>
                        </div>

                        {/* Col 3: Methodology & Data */}
                        <div>
                            <h3 style={colHeadingStyle}>Methodology & Data</h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                <li><Link href="/methodology/" style={linkStyle}>Our Methodology</Link></li>
                                <li><Link href="/hs-code-lookup/" style={linkStyle}>How HS Classification Works</Link></li>
                                <li><Link href="/hs-code-finder/" style={linkStyle}>AI-Powered HS Code Finder</Link></li>
                            </ul>
                            <div style={{
                                marginTop: "1rem", padding: "0.75rem",
                                background: "rgba(34,197,94,0.08)", borderRadius: "8px",
                                border: "1px solid rgba(34,197,94,0.2)",
                            }}>
                                <span style={{ fontSize: "0.8rem", color: "#22c55e", fontWeight: 600 }}>✓ Verified 2026 Data</span>
                                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", margin: "0.25rem 0 0" }}>
                                    Tariff schedules updated to reflect 2026 customs matrices.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
