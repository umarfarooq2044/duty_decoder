import Link from "next/link";

export function Footer() {
    return (
        <footer role="contentinfo" style={{
            marginTop: "auto",
            borderTop: "1px solid var(--border)",
            background: "rgba(10, 15, 36, 0.95)",
            padding: "3.5rem 1rem 2rem",
        }}>
            <div style={{
                maxWidth: "1200px", margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "2.5rem",
            }}>
                {/* Col 1: Brand + Description */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="24" height="24" style={{ display: 'block' }}>
                            <path d="M 25 10 L 50 10 A 40 40 0 0 1 50 90 L 25 90" fill="none" stroke="#4ade80" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
                            <rect x="5" y="0" width="20" height="20" rx="6" fill="#1e293b" />
                            <rect x="5" y="35" width="35" height="30" rx="6" fill="#1e293b" />
                            <rect x="5" y="80" width="20" height="20" rx="6" fill="#1e293b" />
                            <circle cx="55" cy="50" r="10" fill="#4ade80" />
                        </svg>
                        <strong style={{ color: "#fff", fontSize: "1rem" }}>Duty Decoder</strong>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: "1rem" }}>
                        AI-powered import duty calculator and customs compliance engine. Calculate landed costs for 50+ countries with real-time 2026 tariff data.
                    </p>
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: "0.5rem",
                        background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
                        padding: "0.4rem 0.75rem", borderRadius: "6px",
                    }}>
                        <span style={{ color: "#22c55e", fontSize: "0.75rem", fontWeight: 600 }}>✓ Verified 2026 Data</span>
                    </div>
                </div>

                {/* Col 2: Popular Country Calculators */}
                <div>
                    <h4 style={{ color: "var(--foreground)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "1rem" }}>
                        Popular Calculators
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem", lineHeight: 2 }}>
                        <li><a href="/united-states/import-duty-calculator/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>USA Import Duty Calculator</a></li>
                        <li><a href="/united-kingdom/import-duty-calculator/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>UK Import Tax Calculator</a></li>
                        <li><a href="/canada/import-duty-calculator/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Canada Landed Cost</a></li>
                        <li><a href="/germany/import-duty-calculator/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Germany Customs Duty</a></li>
                        <li><a href="/india/import-duty-calculator/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>India Import Duty</a></li>
                        <li><a href="/china/import-duty-calculator/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>China Import Duty</a></li>
                        <li><a href="/australia/import-duty-calculator/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Australia GST Calculator</a></li>
                        <li><a href="/japan/import-duty-calculator/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Japan Customs Calculator</a></li>
                        <li><a href="/france/import-duty-calculator/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>France VAT Calculator</a></li>
                        <li><a href="/singapore/import-duty-calculator/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Singapore GST Calculator</a></li>
                    </ul>
                </div>

                {/* Col 3: Tools & Guides */}
                <div>
                    <h4 style={{ color: "var(--foreground)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "1rem" }}>
                        Calculators & Tools
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem", lineHeight: 2 }}>
                        <li><a href="/calculate/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Landed Cost Calculator</a></li>
                        <li><a href="/hs-code-finder/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>AI HS Code Finder</a></li>
                        <li><a href="/hs-code-lookup/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>HS Code Lookup Guide</a></li>
                    </ul>

                    <h4 style={{ color: "var(--foreground)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", margin: "1.5rem 0 0.75rem" }}>
                        Import Guides
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem", lineHeight: 2 }}>
                        <li><a href="/import-duty/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Import Duty Guide</a></li>
                        <li><a href="/customs-duty/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Customs Duty Explained</a></li>
                        <li><a href="/import-tax/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Import Tax (VAT/GST)</a></li>
                        <li><a href="/tariff-rates/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Tariff Rates</a></li>
                    </ul>
                </div>

                {/* Col 4: Compliance + Company */}
                <div>
                    <h4 style={{ color: "var(--foreground)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "1rem" }}>
                        Compliance
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem", lineHeight: 2 }}>
                        <li><a href="/import-documents/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Import Documents</a></li>
                        <li><a href="/import-restrictions/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Import Restrictions</a></li>
                        <li><a href="/customs-clearance/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Customs Clearance</a></li>
                    </ul>

                    <h4 style={{ color: "var(--foreground)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", margin: "1.5rem 0 0.75rem" }}>
                        Company
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem", lineHeight: 2 }}>
                        <li><a href="/methodology/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Data Methodology</a></li>
                        <li><a href="/privacy/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Privacy Policy</a></li>
                        <li><a href="/terms/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Terms of Service</a></li>
                        <li><a href="/disclaimer/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Disclaimer</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={{
                maxWidth: "1200px", margin: "2.5rem auto 0",
                paddingTop: "1.5rem", borderTop: "1px solid var(--border)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                flexWrap: "wrap", gap: "1rem",
            }}>
                <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", margin: 0 }}>
                    © {new Date().getFullYear()} Duty Decoder. All rights reserved.
                </p>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                    <a href="/privacy/" style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", textDecoration: "none" }}>Privacy</a>
                    <a href="/terms/" style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", textDecoration: "none" }}>Terms</a>
                    <a href="/disclaimer/" style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", textDecoration: "none" }}>Disclaimer</a>
                    <a href="/methodology/" style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", textDecoration: "none" }}>Methodology</a>
                </div>
            </div>
        </footer>
    );
}
