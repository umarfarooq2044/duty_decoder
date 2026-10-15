"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShieldCheck, ChevronDown, ArrowRight } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { CountryFlag } from "@/components/ui/CountryFlag";

/* ─── Top 10 Popular Countries (by trade volume) ─── */
const POPULAR_CODES = ["US", "GB", "DE", "CN", "IN", "CA", "JP", "FR", "AU", "SG"];
const POPULAR_COUNTRIES = POPULAR_CODES
    .map(code => COUNTRIES.find(c => c.code === code))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

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
            if (e.key === "Escape") {
                setActivePanel(null);
                setMobileOpen(false);
            }
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
        ? COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
        : COUNTRIES;

    /* ─── Shared Styles ─── */
    const panelStyle: React.CSSProperties = {
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        background: "var(--surface, #FFFFFF)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid var(--border, #E3E8EF)",
        borderTop: "2px solid var(--teal-700, #0F766E)",
        borderRadius: "0 0 12px 12px",
        padding: "clamp(1.25rem, 3vw, 2.25rem)",
        zIndex: 100,
        boxShadow: "0 20px 45px rgba(11, 31, 58, 0.12), 0 4px 12px rgba(11, 31, 58, 0.05)",
        maxWidth: "1200px",
        margin: "0 auto",
        overflowY: "auto",
        maxHeight: "80vh",
    };

    const colHeadingStyle: React.CSSProperties = {
        fontSize: "0.75rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "var(--navy-900, #0B1F3A)",
        marginBottom: "0.85rem",
        paddingBottom: "0.5rem",
        borderBottom: "1px solid var(--border, #E3E8EF)",
    };

    const linkStyle: React.CSSProperties = {
        display: "block",
        fontSize: "0.88rem",
        color: "var(--text-body, #475569)",
        textDecoration: "none",
        padding: "0.35rem 0",
        lineHeight: 1.4,
        transition: "color 0.15s ease",
    };

    const navBtnStyle = (isActive: boolean): React.CSSProperties => ({
        background: "none",
        border: "none",
        color: isActive ? "var(--teal-700, #0F766E)" : "var(--navy-900, #0B1F3A)",
        fontSize: "0.9rem",
        fontWeight: 600,
        cursor: "pointer",
        padding: "0.5rem 0.75rem",
        borderRadius: "6px",
        transition: "color 0.15s ease",
    });

    return (
        <nav ref={navRef} aria-label="Main navigation" style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            background: "rgba(255, 255, 255, 0.97)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--border, #E3E8EF)",
        }}>
            <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 1.25rem",
                height: "64px"
            }}>
                {/* Brand */}
                <Link href="/" aria-label="DutyDecoder Home" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="28" height="28" style={{ display: 'block' }} role="img" aria-label="DutyDecoder logo">
                        <path d="M 25 10 L 50 10 A 40 40 0 0 1 50 90 L 25 90" fill="none" stroke="var(--teal-700, #0F766E)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="5" y="0" width="20" height="20" rx="5" fill="var(--navy-900, #0B1F3A)" />
                        <rect x="5" y="35" width="35" height="30" rx="5" fill="var(--navy-900, #0B1F3A)" />
                        <rect x="5" y="80" width="20" height="20" rx="5" fill="var(--navy-900, #0B1F3A)" />
                        <circle cx="55" cy="50" r="9" fill="var(--teal-700, #0F766E)" />
                    </svg>
                    <span style={{ fontWeight: 800, fontSize: "1.25rem", display: "flex", alignItems: "center", letterSpacing: "-0.02em" }}>
                        <span style={{ color: "var(--navy-900, #0B1F3A)" }}>Duty</span>
                        <span style={{ color: "var(--text-body, #475569)" }}>Decoder</span>
                        <span style={{ color: "var(--teal-700, #0F766E)" }}>.</span>
                    </span>
                </Link>

                {/* Mobile hamburger */}
                <button
                    className="mega-menu-hamburger"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                    style={{
                        display: "none",
                        background: "none",
                        border: "none",
                        color: "var(--navy-900, #0B1F3A)",
                        cursor: "pointer",
                        padding: "0.5rem",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>

                {/* Primary Nav Items — hidden on mobile */}
                <div className="mega-menu-links" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    {/* 1. Import Duty (mega menu) */}
                    <button
                        onClick={() => togglePanel("importDuty")}
                        onKeyDown={(e) => { if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") { e.preventDefault(); setActivePanel("importDuty"); } }}
                        aria-expanded={activePanel === "importDuty"}
                        aria-haspopup="true"
                        style={navBtnStyle(activePanel === "importDuty")}
                    >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                            Import Duty <ChevronDown size={14} style={{ transform: activePanel === "importDuty" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                        </span>
                    </button>

                    {/* 2. HS Code Finder (direct link) */}
                    <Link href="/hs-code-finder/" style={{ ...navBtnStyle(pathname === "/hs-code-finder/"), textDecoration: "none" }}>
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
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                            Countries <ChevronDown size={14} style={{ transform: activePanel === "countries" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                        </span>
                    </button>

                    {/* 4. Resources (mega menu) */}
                    <button
                        onClick={() => togglePanel("resources")}
                        onKeyDown={(e) => { if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") { e.preventDefault(); setActivePanel("resources"); } }}
                        aria-expanded={activePanel === "resources"}
                        aria-haspopup="true"
                        style={navBtnStyle(activePanel === "resources")}
                    >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                            Resources <ChevronDown size={14} style={{ transform: activePanel === "resources" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                        </span>
                    </button>

                    {/* 5. Methodology (direct link) */}
                    <Link href="/methodology/" style={{ ...navBtnStyle(pathname === "/methodology/"), textDecoration: "none" }}>
                        Methodology
                    </Link>
                </div>

                {/* CTA */}
                <Link href="/calculate/" className="mega-menu-cta" style={{
                    background: "var(--teal-700, #0F766E)",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    padding: "0.55rem 1.25rem",
                    borderRadius: "6px",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    boxShadow: "0 2px 6px rgba(15, 118, 110, 0.25)",
                    transition: "all 0.15s ease",
                }}>
                    Get Landed Cost
                </Link>
            </div>

            {/* Mobile dropdown drawer */}
            {mobileOpen && (
                <div className="mega-menu-mobile-drawer" style={{
                    background: "var(--surface, #FFFFFF)",
                    borderTop: "1px solid var(--border, #E3E8EF)",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.35rem",
                    boxShadow: "0 10px 25px rgba(11, 31, 58, 0.08)",
                }}>
                    <button onClick={() => togglePanel("importDuty")} style={{ ...navBtnStyle(false), textAlign: "left", width: "100%", padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                            Import Duty <ChevronDown size={14} />
                        </span>
                    </button>
                    <Link href="/hs-code-finder/" style={{ ...navBtnStyle(false), textDecoration: "none", padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>
                        HS Code Finder
                    </Link>
                    <button onClick={() => togglePanel("countries")} style={{ ...navBtnStyle(false), textAlign: "left", width: "100%", padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                            Countries <ChevronDown size={14} />
                        </span>
                    </button>
                    <button onClick={() => togglePanel("resources")} style={{ ...navBtnStyle(false), textAlign: "left", width: "100%", padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                            Resources <ChevronDown size={14} />
                        </span>
                    </button>
                    <Link href="/methodology/" style={{ ...navBtnStyle(false), textDecoration: "none", padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>
                        Methodology
                    </Link>
                    <Link href="/calculate/" style={{
                        background: "var(--teal-700, #0F766E)",
                        color: "#FFFFFF",
                        fontWeight: 700,
                        padding: "0.75rem 1.25rem",
                        borderRadius: "6px",
                        textDecoration: "none",
                        textAlign: "center",
                        marginTop: "0.5rem",
                    }}>
                        Get Landed Cost
                    </Link>
                </div>
            )}

            {/* ═══════════════ MEGA PANEL: Import Duty ═══════════════ */}
            {activePanel === "importDuty" && (
                <div style={panelStyle}>
                    {/* Top Row: How It Works Highlight */}
                    <div style={{
                        background: "var(--teal-50, #F0FDFA)",
                        border: "1px solid rgba(15, 118, 110, 0.2)",
                        borderRadius: "8px",
                        padding: "0.85rem 1.25rem",
                        marginBottom: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                    }}>
                        <span style={{ fontSize: "0.85rem", color: "var(--navy-900, #0B1F3A)" }}>
                            <strong style={{ color: "var(--navy-900)" }}>Calculation Pipeline:</strong> Product Description → AI HS Code Classification → Customs Duty → VAT/GST → <strong style={{ color: "var(--teal-700)" }}>Total Landed Cost</strong>
                        </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", gap: "2rem" }}>
                        {/* Col 1: Country Calculators (Top 10) */}
                        <div>
                            <h3 style={colHeadingStyle}>Country Calculators</h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {POPULAR_COUNTRIES.map(c => (
                                    <li key={c.slug} style={{ marginBottom: "0.25rem" }}>
                                        <Link href={`/${c.slug}/import-duty-calculator/`} style={{ ...linkStyle, display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                                            <CountryFlag code={c.code} style={{ width: "16px", height: "12px" }} />
                                            <span>{c.name} Import Duty</span>
                                        </Link>
                                    </li>
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
                                <li><Link href="/import-from-china/" style={linkStyle}>Importing from China</Link></li>
                                <li><Link href="/incoterms/" style={linkStyle}>Incoterms 2020 Rules</Link></li>
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
                                <li><Link href="/customs-broker/" style={linkStyle}>Customs Broker Guide</Link></li>
                            </ul>
                        </div>

                        {/* Col 4: Tools */}
                        <div>
                            <h3 style={colHeadingStyle}>Tools</h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                <li><Link href="/calculate/" style={linkStyle}>Landed Cost Calculator</Link></li>
                                <li><Link href="/hs-code-lookup/" style={linkStyle}>HS Code Lookup Guide</Link></li>
                                <li><Link href="/hs-code-finder/" style={linkStyle}>AI HS Code Finder</Link></li>
                            </ul>
                            <div style={{ marginTop: "1.5rem" }}>
                                <Link href="/calculate/" style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.35rem",
                                    background: "var(--teal-700, #0F766E)",
                                    color: "#FFFFFF",
                                    padding: "0.55rem 1.15rem",
                                    borderRadius: "6px",
                                    fontWeight: 600,
                                    fontSize: "0.85rem",
                                    textDecoration: "none",
                                }}>
                                    Try Calculator <ArrowRight size={14} />
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
                    <div style={{ marginBottom: "1.25rem" }}>
                        <input
                            type="text"
                            placeholder="Search 50 countries..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            aria-label="Search countries"
                            style={{
                                width: "100%",
                                padding: "0.65rem 1rem",
                                fontSize: "0.9rem",
                                borderRadius: "6px",
                                border: "1px solid var(--border, #E3E8EF)",
                                background: "var(--bg, #F7F9FC)",
                                color: "var(--navy-900, #0B1F3A)",
                                outline: "none",
                            }}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "2rem" }}>
                        {/* Left: Popular Countries */}
                        <div>
                            <h3 style={colHeadingStyle}>Popular Countries</h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {POPULAR_COUNTRIES.map(c => (
                                    <li key={c.slug} style={{ marginBottom: "0.65rem" }}>
                                        <Link href={`/${c.slug}/`} style={{ ...linkStyle, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                                            <CountryFlag code={c.code} style={{ width: "16px", height: "12px" }} />
                                            <span>{c.name}</span>
                                        </Link>
                                        <div style={{ display: "flex", gap: "0.75rem", paddingLeft: "1.5rem" }}>
                                            <Link href={`/${c.slug}/import-duty-calculator/`} style={{ fontSize: "0.75rem", color: "var(--teal-700)", textDecoration: "none", fontWeight: 500 }}>Calculator</Link>
                                            <Link href={`/${c.slug}/import-tax/`} style={{ fontSize: "0.75rem", color: "var(--teal-700)", textDecoration: "none", fontWeight: 500 }}>Import Tax</Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right: Full Alphabetical List */}
                        <div>
                            <h3 style={colHeadingStyle}>All 50 Supported Countries (A–Z)</h3>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "0.35rem 1rem",
                                maxHeight: "380px",
                                overflowY: "auto",
                                paddingRight: "0.5rem",
                            }}>
                                {filteredCountries.map(c => (
                                    <Link key={c.slug} href={`/${c.slug}/`} style={{ ...linkStyle, fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
                                        <CountryFlag code={c.code} style={{ width: "16px", height: "12px", flexShrink: 0 }} />
                                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                                    </Link>
                                ))}
                                {filteredCountries.length === 0 && (
                                    <p style={{ gridColumn: "1/-1", color: "var(--text-muted)", fontSize: "0.9rem", padding: "1rem 0" }}>
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
                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "2rem" }}>
                        {/* Col 1: Global Guides */}
                        <div>
                            <h3 style={colHeadingStyle}>Guides (Global)</h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                <li><Link href="/import-duty/" style={linkStyle}>Understanding Import Duty</Link></li>
                                <li><Link href="/import-tax/" style={linkStyle}>Import Tax (VAT & GST)</Link></li>
                                <li><Link href="/tariff-rates/" style={linkStyle}>Global Tariff Rates</Link></li>
                                <li><Link href="/import-from-china/" style={linkStyle}>Import from China Guide</Link></li>
                                <li><Link href="/incoterms/" style={linkStyle}>Incoterms 2020 Guide</Link></li>
                                <li><Link href="/trade-finance/" style={linkStyle}>Trade Finance & LCs</Link></li>
                                <li><Link href="/customs-broker/" style={linkStyle}>Customs Broker Guide</Link></li>
                                <li><Link href="/export-documents/" style={linkStyle}>Export Documents Guide</Link></li>
                                <li><Link href="/customs-clearance/" style={linkStyle}>Customs Clearance Guide</Link></li>
                                <li><Link href="/import-documents/" style={linkStyle}>Import Documentation</Link></li>
                                <li><Link href="/import-restrictions/" style={linkStyle}>Import Restrictions</Link></li>
                            </ul>
                        </div>

                        {/* Col 2: Country Guides */}
                        <div>
                            <h3 style={colHeadingStyle}>Country Guides</h3>
                            <p style={{ fontSize: "0.88rem", color: "var(--text-body)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                                Access detailed import duty guides, customs valuation rules, and compliance requirements across 50 countries.
                            </p>
                            <button onClick={() => setActivePanel("countries")} style={{
                                background: "var(--teal-700, #0F766E)",
                                color: "#FFFFFF",
                                border: "none",
                                padding: "0.55rem 1.15rem",
                                borderRadius: "6px",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.35rem",
                            }}>
                                Browse Countries <ArrowRight size={14} />
                            </button>
                        </div>

                        {/* Col 3: Methodology & Data */}
                        <div>
                            <h3 style={colHeadingStyle}>Methodology & Data</h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                <li><Link href="/methodology/" style={linkStyle}>Our Tariff Methodology</Link></li>
                                <li><Link href="/hs-code-lookup/" style={linkStyle}>How HS Classification Works</Link></li>
                                <li><Link href="/hs-code-finder/" style={linkStyle}>AI-Powered HS Code Finder</Link></li>
                            </ul>
                            <div style={{
                                marginTop: "1.25rem",
                                padding: "0.85rem",
                                background: "var(--teal-50, #F0FDFA)",
                                borderRadius: "8px",
                                border: "1px solid rgba(15, 118, 110, 0.2)",
                            }}>
                                <span style={{ fontSize: "0.8rem", color: "var(--teal-700)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                                    <ShieldCheck size={14} /> Verified 2026 Data
                                </span>
                                <p style={{ fontSize: "0.78rem", color: "var(--text-body)", margin: "0.25rem 0 0", lineHeight: 1.5 }}>
                                    Tariff schedules synchronized with US CBP, UK HMRC, EU TARIC, and 47 national customs authorities.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
