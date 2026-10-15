import Link from "next/link";
import { ShieldCheck, ExternalLink } from "lucide-react";

export function Footer() {
    return (
        <footer role="contentinfo" style={{
            marginTop: "auto",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            background: "var(--navy-950, #06142B)",
            color: "#E2E8F0",
            padding: "4rem 1.25rem 2rem",
        }}>
            <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "2.5rem",
            }}>
                {/* Col 1: Brand & Official Sources */}
                <div style={{ gridColumn: "span 1" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="26" height="26" style={{ display: 'block' }} role="img" aria-label="DutyDecoder logo">
                            <path d="M 25 10 L 50 10 A 40 40 0 0 1 50 90 L 25 90" fill="none" stroke="#5EEAD4" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
                            <rect x="5" y="0" width="20" height="20" rx="5" fill="#FFFFFF" />
                            <rect x="5" y="35" width="35" height="30" rx="5" fill="#FFFFFF" />
                            <rect x="5" y="80" width="20" height="20" rx="5" fill="#FFFFFF" />
                            <circle cx="55" cy="50" r="9" fill="#5EEAD4" />
                        </svg>
                        <span style={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em" }}>
                            <span style={{ color: "#FFFFFF" }}>Duty</span>
                            <span style={{ color: "#94A3B8" }}>Decoder</span>
                            <span style={{ color: "#5EEAD4" }}>.</span>
                        </span>
                    </div>

                    <p style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                        AI-powered import duty and landed cost calculator. Accurate 2026 tariff schedules, de minimis rules, and VAT/GST rates across 50+ countries.
                    </p>

                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        background: "rgba(94, 234, 212, 0.1)",
                        border: "1px solid rgba(94, 234, 212, 0.25)",
                        padding: "0.4rem 0.75rem",
                        borderRadius: "6px",
                        marginBottom: "1.5rem",
                    }}>
                        <ShieldCheck size={14} style={{ color: "#5EEAD4" }} />
                        <span style={{ color: "#5EEAD4", fontSize: "0.75rem", fontWeight: 700 }}>
                            Verified 2026 Tariff Schedules
                        </span>
                    </div>

                    <div>
                        <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748B", fontWeight: 700, marginBottom: "0.5rem" }}>
                            Official Data Sources
                        </div>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.8rem", color: "#94A3B8", lineHeight: 1.8 }}>
                            <li>U.S. Customs & Border Protection (CBP)</li>
                            <li>HM Revenue & Customs (UK HMRC)</li>
                            <li>European Commission (EU TARIC)</li>
                            <li>World Customs Organization (WCO)</li>
                        </ul>
                    </div>
                </div>

                {/* Col 2: Popular Calculators */}
                <div>
                    <h4 style={{ color: "#FFFFFF", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
                        Popular Calculators
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem", lineHeight: 2.1 }}>
                        <li><Link href="/united-states/import-duty-calculator/" style={{ color: "#94A3B8", textDecoration: "none" }}>USA Import Duty Calculator</Link></li>
                        <li><Link href="/united-kingdom/import-duty-calculator/" style={{ color: "#94A3B8", textDecoration: "none" }}>UK Customs & VAT Calculator</Link></li>
                        <li><Link href="/canada/import-duty-calculator/" style={{ color: "#94A3B8", textDecoration: "none" }}>Canada Landed Cost Calculator</Link></li>
                        <li><Link href="/germany/import-duty-calculator/" style={{ color: "#94A3B8", textDecoration: "none" }}>Germany Import Duty Calculator</Link></li>
                        <li><Link href="/india/import-duty-calculator/" style={{ color: "#94A3B8", textDecoration: "none" }}>India Customs Duty & GST</Link></li>
                        <li><Link href="/china/import-duty-calculator/" style={{ color: "#94A3B8", textDecoration: "none" }}>China Import Duty Calculator</Link></li>
                        <li><Link href="/australia/import-duty-calculator/" style={{ color: "#94A3B8", textDecoration: "none" }}>Australia Duty & GST Calculator</Link></li>
                        <li><Link href="/japan/import-duty-calculator/" style={{ color: "#94A3B8", textDecoration: "none" }}>Japan Customs & Consumption Tax</Link></li>
                        <li><Link href="/france/import-duty-calculator/" style={{ color: "#94A3B8", textDecoration: "none" }}>France Customs Duty & TVA</Link></li>
                        <li><Link href="/singapore/import-duty-calculator/" style={{ color: "#94A3B8", textDecoration: "none" }}>Singapore GST & Duty Calculator</Link></li>
                    </ul>
                </div>

                {/* Col 3: Tools & Guides */}
                <div>
                    <h4 style={{ color: "#FFFFFF", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
                        Calculators & Tools
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem", lineHeight: 2.1 }}>
                        <li><Link href="/calculate/" style={{ color: "#94A3B8", textDecoration: "none" }}>Landed Cost Calculator</Link></li>
                        <li><Link href="/hs-code-finder/" style={{ color: "#94A3B8", textDecoration: "none" }}>AI HS Code Finder</Link></li>
                        <li><Link href="/hs-code-lookup/" style={{ color: "#94A3B8", textDecoration: "none" }}>HS Code Lookup Guide</Link></li>
                        <li><Link href="/tariff-rates/" style={{ color: "#94A3B8", textDecoration: "none" }}>Global Tariff Schedules</Link></li>
                    </ul>

                    <h4 style={{ color: "#FFFFFF", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "1.75rem 0 0.85rem" }}>
                        Import Guides
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem", lineHeight: 2.1 }}>
                        <li><Link href="/import-duty/" style={{ color: "#94A3B8", textDecoration: "none" }}>Import Duty Explained</Link></li>
                        <li><Link href="/customs-duty/" style={{ color: "#94A3B8", textDecoration: "none" }}>Customs Valuation (FOB vs CIF)</Link></li>
                        <li><Link href="/import-tax/" style={{ color: "#94A3B8", textDecoration: "none" }}>Import Tax (VAT / GST)</Link></li>
                        <li><Link href="/import-from-china/" style={{ color: "#94A3B8", textDecoration: "none" }}>Importing from China Guide</Link></li>
                        <li><Link href="/incoterms/" style={{ color: "#94A3B8", textDecoration: "none" }}>Incoterms 2020 Rules</Link></li>
                    </ul>
                </div>

                {/* Col 4: Compliance & Company */}
                <div>
                    <h4 style={{ color: "#FFFFFF", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
                        Compliance
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem", lineHeight: 2.1 }}>
                        <li><Link href="/customs-clearance/" style={{ color: "#94A3B8", textDecoration: "none" }}>Customs Clearance Process</Link></li>
                        <li><Link href="/customs-broker/" style={{ color: "#94A3B8", textDecoration: "none" }}>Working with Customs Brokers</Link></li>
                        <li><Link href="/import-documents/" style={{ color: "#94A3B8", textDecoration: "none" }}>Required Import Documents</Link></li>
                        <li><Link href="/import-restrictions/" style={{ color: "#94A3B8", textDecoration: "none" }}>Import Restrictions & Prohibitions</Link></li>
                        <li><Link href="/export-documents/" style={{ color: "#94A3B8", textDecoration: "none" }}>Export Documentation</Link></li>
                        <li><Link href="/trade-finance/" style={{ color: "#94A3B8", textDecoration: "none" }}>Trade Finance & Letters of Credit</Link></li>
                    </ul>

                    <h4 style={{ color: "#FFFFFF", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "1.75rem 0 0.85rem" }}>
                        Company & Transparency
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.85rem", lineHeight: 2.1 }}>
                        <li><Link href="/about/" style={{ color: "#94A3B8", textDecoration: "none" }}>About DutyDecoder</Link></li>
                        <li><Link href="/methodology/" style={{ color: "#94A3B8", textDecoration: "none" }}>Tariff Methodology</Link></li>
                        <li><Link href="/data-sources/" style={{ color: "#94A3B8", textDecoration: "none" }}>Official Data Sources Register</Link></li>
                        <li><Link href="/editorial-policy/" style={{ color: "#94A3B8", textDecoration: "none" }}>Editorial Policy &amp; Standards</Link></li>
                        <li><Link href="/contact/" style={{ color: "#94A3B8", textDecoration: "none" }}>Contact Compliance Desk</Link></li>
                        <li><Link href="/privacy/" style={{ color: "#94A3B8", textDecoration: "none" }}>Privacy Policy</Link></li>
                        <li><Link href="/terms/" style={{ color: "#94A3B8", textDecoration: "none" }}>Terms of Service</Link></li>
                        <li><Link href="/disclaimer/" style={{ color: "#94A3B8", textDecoration: "none" }}>Regulatory Disclaimer</Link></li>
                        <li><Link href="/sitemap/" style={{ color: "#94A3B8", textDecoration: "none" }}>HTML Sitemap</Link></li>
                    </ul>
                </div>
            </div>

            {/* Regulatory Disclaimer Banner */}
            <div style={{
                maxWidth: "1200px",
                margin: "2.5rem auto 0",
                padding: "1rem 1.25rem",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "8px",
                fontSize: "0.75rem",
                color: "#64748B",
                lineHeight: 1.6,
            }}>
                <strong style={{ color: "#94A3B8" }}>Regulatory Disclaimer:</strong> DutyDecoder estimates are designed for international trade budgeting, commercial planning, and preliminary landed cost estimation. Customs authorities and border control agencies determine official tariff classification, product valuation, duty assessment, and statutory import charges at the physical time of customs entry. Always verify critical or high-value shipments with a licensed customs broker.
            </div>

            {/* Bottom Bar */}
            <div style={{
                maxWidth: "1200px",
                margin: "1.5rem auto 0",
                paddingTop: "1.25rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
            }}>
                <p style={{ fontSize: "0.8rem", color: "#64748B", margin: 0 }}>
                    © {new Date().getFullYear()} DutyDecoder. Precision Trade Compliance. All rights reserved.
                </p>
                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                    <Link href="/privacy/" style={{ fontSize: "0.8rem", color: "#94A3B8", textDecoration: "none" }}>Privacy</Link>
                    <Link href="/terms/" style={{ fontSize: "0.8rem", color: "#94A3B8", textDecoration: "none" }}>Terms</Link>
                    <Link href="/disclaimer/" style={{ fontSize: "0.8rem", color: "#94A3B8", textDecoration: "none" }}>Disclaimer</Link>
                    <Link href="/methodology/" style={{ fontSize: "0.8rem", color: "#94A3B8", textDecoration: "none" }}>Methodology</Link>
                    <Link href="/contact/" style={{ fontSize: "0.8rem", color: "#94A3B8", textDecoration: "none" }}>Contact</Link>
                </div>
            </div>
        </footer>
    );
}
