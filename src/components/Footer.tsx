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
                        <strong style={{ color: "#fff", fontSize: "1rem" }}>DutyDecoder</strong>
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
                        <li><Link href="/united-states/import-duty-calculator/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>USA Import Duty Calculator</Link></li>
                        <li><Link href="/united-kingdom/import-duty-calculator/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>UK Import Tax Calculator</Link></li>
                        <li><Link href="/canada/import-duty-calculator/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Canada Landed Cost</Link></li>
                        <li><Link href="/germany/import-duty-calculator/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Germany Customs Duty</Link></li>
                        <li><Link href="/india/import-duty-calculator/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>India Import Duty</Link></li>
                        <li><Link href="/china/import-duty-calculator/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>China Import Duty</Link></li>
                        <li><Link href="/australia/import-duty-calculator/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Australia GST Calculator</Link></li>
                        <li><Link href="/japan/import-duty-calculator/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Japan Customs Calculator</Link></li>
                        <li><Link href="/france/import-duty-calculator/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>France VAT Calculator</Link></li>
                        <li><Link href="/singapore/import-duty-calculator/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Singapore GST Calculator</Link></li>
                    </ul>
                </div>

                {/* Col 3: Tools & Guides */}
                <div>
                    <h4 style={{ color: "var(--foreground)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "1rem" }}>
                        Calculators & Tools
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem", lineHeight: 2 }}>
                        <li><Link href="/calculate/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Landed Cost Calculator</Link></li>
                        <li><Link href="/hs-code-finder/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>AI HS Code Finder</Link></li>
                        <li><Link href="/hs-code-lookup/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>HS Code Lookup Guide</Link></li>
                    </ul>

                    <h4 style={{ color: "var(--foreground)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", margin: "1.5rem 0 0.75rem" }}>
                        Import Guides
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem", lineHeight: 2 }}>
                        <li><Link href="/import-duty/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Import Duty Guide</Link></li>
                        <li><Link href="/customs-duty/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Customs Duty Explained</Link></li>
                        <li><Link href="/import-tax/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Import Tax (VAT/GST)</Link></li>
                        <li><Link href="/tariff-rates/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Tariff Rates</Link></li>
                    </ul>
                </div>

                {/* Col 4: Compliance + Company */}
                <div>
                    <h4 style={{ color: "var(--foreground)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "1rem" }}>
                        Compliance
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem", lineHeight: 2 }}>
                        <li><Link href="/import-documents/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Import Documents</Link></li>
                        <li><Link href="/import-restrictions/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Import Restrictions</Link></li>
                        <li><Link href="/customs-clearance/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Customs Clearance</Link></li>
                    </ul>

                    <h4 style={{ color: "var(--foreground)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", margin: "1.5rem 0 0.75rem" }}>
                        Company
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem", lineHeight: 2 }}>
                        <li><Link href="/about/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>About Us</Link></li>
                        <li><Link href="/methodology/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Data Methodology</Link></li>
                        <li><Link href="/privacy/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Privacy Policy</Link></li>
                        <li><Link href="/terms/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Terms of Service</Link></li>
                        <li><Link href="/disclaimer/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Disclaimer</Link></li>
                        <li><Link href="/contact/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>Contact Us</Link></li>
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
                    © {new Date().getFullYear()} DutyDecoder. All rights reserved.
                </p>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                    <Link href="/privacy/" style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", textDecoration: "none" }}>Privacy</Link>
                    <Link href="/terms/" style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", textDecoration: "none" }}>Terms</Link>
                    <Link href="/disclaimer/" style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", textDecoration: "none" }}>Disclaimer</Link>
                    <Link href="/methodology/" style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", textDecoration: "none" }}>Methodology</Link>
                    <Link href="/contact/" style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", textDecoration: "none" }}>Contact</Link>
                </div>
            </div>
        </footer>
    );
}
