import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText, Globe, UserCheck } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy — Data Protection & Cookie Disclosure",
    description:
        "DutyDecoder Privacy Policy: Comprehensive disclosure of data collection, cookie usage, Google advertising practices, GDPR/UK-GDPR rights, CCPA compliance, and user privacy controls.",
    alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
    const sectionStyle: React.CSSProperties = { marginBottom: "3rem" };
    const h2Style: React.CSSProperties = {
        fontSize: "1.35rem",
        fontWeight: 700,
        color: "var(--foreground)",
        marginBottom: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
    };
    const paraStyle: React.CSSProperties = {
        fontSize: "0.975rem",
        color: "var(--text-body, #475569)",
        lineHeight: 1.8,
        marginBottom: "1.25rem",
    };

    return (
        <main style={{ maxWidth: "850px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
            <header style={{ marginBottom: "3rem", borderBottom: "1px solid var(--border, #E3E8EF)", paddingBottom: "1.5rem" }}>
                <h1
                    style={{
                        fontSize: "clamp(2rem, 4vw, 2.75rem)",
                        fontWeight: 800,
                        color: "var(--foreground)",
                        margin: "0 0 0.5rem",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                    }}
                >
                    Privacy Policy
                </h1>
                <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", margin: 0 }}>
                    <strong>Effective Date:</strong> March 26, 2026 &bull; <strong>Last Updated:</strong> March 26, 2026
                </p>
            </header>

            {/* Overview / Controller Info */}
            <section style={sectionStyle}>
                <h2 style={h2Style}>
                    <ShieldCheck size={20} style={{ color: "var(--accent)" }} />
                    <span>1. Data Controller &amp; Scope</span>
                </h2>
                <p style={paraStyle}>
                    This Privacy Policy applies to the services, applications, and websites operated by <strong>DutyDecoder</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), accessible via <strong>https://dutydecoder.com</strong>.
                </p>
                <p style={paraStyle}>
                    For the purposes of the General Data Protection Regulation (GDPR / UK-GDPR) and applicable data protection legislation, the Data Controller is:
                </p>
                <div style={{ background: "var(--bg, #F7F9FC)", border: "1px solid var(--border, #E3E8EF)", borderRadius: "10px", padding: "1.25rem", marginBottom: "1.25rem" }}>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--foreground)", lineHeight: 1.6 }}>
                        <strong>DutyDecoder Digital Operations</strong><br />
                        {/* TODO_OWNER: Insert legal address */}
                        Attention: Data Protection Officer / Privacy Officer<br />
                        Email: <a href="mailto:privacy@dutydecoder.com" style={{ color: "var(--accent)", fontWeight: 600 }}>privacy@dutydecoder.com</a> or <a href="mailto:contact@dutydecoder.com" style={{ color: "var(--accent)", fontWeight: 600 }}>contact@dutydecoder.com</a>
                    </p>
                </div>
            </section>

            {/* Information We Collect */}
            <section style={sectionStyle}>
                <h2 style={h2Style}>
                    <Eye size={20} style={{ color: "var(--accent)" }} />
                    <span>2. Information We Collect and How We Use It</span>
                </h2>
                <p style={paraStyle}>
                    We collect minimal personal data necessary to provide accurate tariff estimates, optimize calculation performance, and maintain platform security. Information collected includes:
                </p>
                <ul style={{ ...paraStyle, paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <li>
                        <strong>Calculator Inputs (Non-Personal Trade Data):</strong> Product descriptions, origin countries, destination jurisdictions, declared shipment values, freight/insurance amounts, and currency preferences entered into our calculator. These inputs are processed to generate landed cost breakdowns and public reference routes. They do not identify you personally.
                    </li>
                    <li>
                        <strong>Direct Communication Data:</strong> Name, email address, inquiry topic, and message contents submitted through our <Link href="/contact/" style={{ color: "var(--accent)", fontWeight: 600 }}>Contact Form</Link> or sent via email. Used exclusively to respond to your inquiry and retained for 12 months.
                    </li>
                    <li>
                        <strong>Technical &amp; Log Data:</strong> Internet Protocol (IP) address, browser type, operating system version, referring URLs, access timestamps, and request latency. Used for rate-limiting, bot detection, and server security. IP logs are anonymized or purged within 30 days.
                    </li>
                    <li>
                        <strong>Analytics Data (Google Analytics 4):</strong> Anonymized interaction metrics (page visits, session duration, device viewport) collected via Google Analytics 4 (Measurement ID: <code>G-G74QF4WDSL</code>). IP addresses are automatically truncated by GA4 before storage.
                    </li>
                </ul>
            </section>

            {/* Cookies & Advertising Disclosure (CRITICAL FOR ADSENSE) */}
            <section style={sectionStyle}>
                <div
                    style={{
                        background: "var(--surface, #FFFFFF)",
                        border: "1px solid var(--teal-700, #0F766E)",
                        borderRadius: "16px",
                        padding: "1.75rem",
                        boxShadow: "0 4px 16px rgba(15, 118, 110, 0.08)",
                    }}
                >
                    <h2 style={{ ...h2Style, color: "var(--navy-900, #0B1F3A)", marginTop: 0 }}>
                        <Lock size={20} style={{ color: "var(--teal-700, #0F766E)" }} />
                        <span>3. Cookies, Third-Party Advertising &amp; Google AdSense</span>
                    </h2>

                    <p style={paraStyle}>
                        DutyDecoder uses cookies and similar storage technologies to ensure basic site functionality, measure audience engagement, and serve digital advertisements.
                    </p>

                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--navy-900, #0B1F3A)", margin: "1.25rem 0 0.5rem" }}>
                        Third-Party Advertising Disclosures
                    </h3>
                    <ul style={{ ...paraStyle, paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <li>
                            <strong>Google and Third-Party Vendors:</strong> Google, as a third-party vendor, uses cookies to serve advertisements on DutyDecoder.
                        </li>
                        <li>
                            <strong>DoubleClick / Advertising Cookies:</strong> Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visits to DutyDecoder and/or other sites on the Internet.
                        </li>
                        <li>
                            <strong>Personalized Advertising Opt-Out:</strong> Users may opt out of personalized advertising by visiting{" "}
                            <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontWeight: 600 }}>
                                Google Ads Settings
                            </a>
                            . Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{" "}
                            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontWeight: 600 }}>
                                www.aboutads.info/choices
                            </a>
                            {" "}or the European Interactive Digital Advertising Alliance (EDAA) consumer choice page at{" "}
                            <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontWeight: 600 }}>
                                youronlinechoices.eu
                            </a>.
                        </li>
                        <li>
                            <strong>How Google Uses Data:</strong> For detailed transparency regarding how Google processes information when you use partner sites, visit{" "}
                            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontWeight: 600 }}>
                                How Google uses information from sites or apps that use our services
                            </a>.
                        </li>
                    </ul>

                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--navy-900, #0B1F3A)", margin: "1.25rem 0 0.5rem" }}>
                        Cookie Categories Deployed
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginTop: "0.75rem" }}>
                        <div style={{ padding: "1rem", background: "var(--bg, #F7F9FC)", borderRadius: "10px", border: "1px solid var(--border, #E3E8EF)" }}>
                            <strong style={{ display: "block", fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "0.25rem" }}>Strictly Necessary</strong>
                            <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Essential session and security tokens, user interface preferences, and cookie consent records.</span>
                        </div>
                        <div style={{ padding: "1rem", background: "var(--bg, #F7F9FC)", borderRadius: "10px", border: "1px solid var(--border, #E3E8EF)" }}>
                            <strong style={{ display: "block", fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "0.25rem" }}>Analytics (GA4)</strong>
                            <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Aggregated traffic measurement and navigation telemetry via Google Analytics 4.</span>
                        </div>
                        <div style={{ padding: "1rem", background: "var(--bg, #F7F9FC)", borderRadius: "10px", border: "1px solid var(--border, #E3E8EF)" }}>
                            <strong style={{ display: "block", fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "0.25rem" }}>Advertising</strong>
                            <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Third-party ad measurement and personalization cookies deployed by Google AdSense and certified ad tech partners.</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* GDPR & International Rights */}
            <section style={sectionStyle}>
                <h2 style={h2Style}>
                    <Globe size={20} style={{ color: "var(--accent)" }} />
                    <span>4. European Economic Area (EEA) &amp; UK Privacy Rights</span>
                </h2>
                <p style={paraStyle}>
                    If you are located in the EEA or the United Kingdom, your personal data is processed under the following lawful bases:
                </p>
                <ul style={{ ...paraStyle, paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <li><strong>Consent (Art. 6(1)(a) GDPR):</strong> For the deployment of non-essential cookies, analytics, and advertising cookies via our consent management mechanism.</li>
                    <li><strong>Legitimate Interests (Art. 6(1)(f) GDPR):</strong> To protect platform integrity, prevent fraudulent bot traffic, and respond to inquiries.</li>
                </ul>
                <p style={paraStyle}>
                    Under the GDPR, you enjoy the right to: access your personal data; rectify inaccurate records; request erasure (&ldquo;right to be forgotten&rdquo;); restrict or object to processing; data portability; and withdraw consent at any time without affecting prior lawful processing.
                </p>
                <p style={paraStyle}>
                    To exercise any GDPR right, email <a href="mailto:privacy@dutydecoder.com" style={{ color: "var(--accent)", fontWeight: 600 }}>privacy@dutydecoder.com</a>. You also have the right to lodge a complaint with your local data protection supervisory authority.
                </p>
            </section>

            {/* California / US State Privacy */}
            <section style={sectionStyle}>
                <h2 style={h2Style}>
                    <UserCheck size={20} style={{ color: "var(--accent)" }} />
                    <span>5. California &amp; US State Privacy Disclosures (CCPA / CPRA)</span>
                </h2>
                <p style={paraStyle}>
                    Under the California Consumer Privacy Act (CCPA) as amended by the CPRA, California residents are entitled to specific disclosures:
                </p>
                <ul style={{ ...paraStyle, paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <li><strong>No Sale of Personal Information:</strong> DutyDecoder does not sell personal information for monetary consideration.</li>
                    <li><strong>Sharing for Cross-Context Advertising:</strong> We may share pseudonymous cookie identifiers with advertising partners (Google) to deliver relevant ads. You may opt out at any time.</li>
                    <li><strong>Right to Know &amp; Delete:</strong> You have the right to request disclosure of personal data collected and request deletion.</li>
                    <li><strong>Non-Discrimination:</strong> We will never discriminate against you, degrade calculator functionality, or deny services for exercising your privacy rights.</li>
                </ul>
            </section>

            {/* Children's Privacy */}
            <section style={sectionStyle}>
                <h2 style={h2Style}>
                    <FileText size={20} style={{ color: "var(--accent)" }} />
                    <span>6. Children&apos;s Privacy (COPPA)</span>
                </h2>
                <p style={paraStyle}>
                    DutyDecoder is an international B2B and commercial trade tool intended solely for adult commercial operators, importers, and trade professionals. We do not knowingly collect personal information from children under the age of 16. If we become aware that an individual under 16 has submitted personal data, we will immediately delete such records.
                </p>
            </section>

            {/* Policy Updates & Contact */}
            <section style={sectionStyle}>
                <h2 style={h2Style}>
                    <ShieldCheck size={20} style={{ color: "var(--accent)" }} />
                    <span>7. Updates to This Policy &amp; Contact Information</span>
                </h2>
                <p style={paraStyle}>
                    We may update this Privacy Policy periodically to reflect changes in regulatory standards or our technology stack. Any modifications will be posted to this page with an updated revision date.
                </p>
                <p style={paraStyle}>
                    For privacy inquiries, contact our Data Protection Team at{" "}
                    <a href="mailto:privacy@dutydecoder.com" style={{ color: "var(--accent)", fontWeight: 600 }}>
                        privacy@dutydecoder.com
                    </a>{" "}
                    or via our <Link href="/contact/" style={{ color: "var(--accent)", fontWeight: 600 }}>Contact Page</Link>.
                </p>
            </section>
        </main>
    );
}
