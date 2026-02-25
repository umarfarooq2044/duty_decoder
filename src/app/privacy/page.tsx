import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Duty Decoder",
    description: "Privacy Policy for Duty Decoder — how we collect, use, and protect your data when using our import duty calculator and trade compliance tools.",
    alternates: { canonical: "/privacy/" }
};

export default function PrivacyPage() {
    const sectionStyle: React.CSSProperties = { marginBottom: "2.5rem" };
    const headingStyle: React.CSSProperties = { fontSize: "1.3rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "1rem" };
    const paraStyle: React.CSSProperties = { fontSize: "1rem", color: "var(--muted-foreground)", lineHeight: 1.8, marginBottom: "1rem" };

    return (
        <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
            <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--foreground)", marginBottom: "0.5rem" }}>
                Privacy Policy
            </h1>
            <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", marginBottom: "3rem" }}>
                Last updated: February 23, 2026
            </p>

            <section style={sectionStyle}>
                <h2 style={headingStyle}>1. Information We Collect</h2>
                <p style={paraStyle}>
                    <strong>Usage Data:</strong> When you use Duty Decoder, we collect information about the product descriptions, origin countries, and destination countries you enter into our calculators. This information is used to provide accurate landed cost calculations and is stored to generate result pages that help other users.
                </p>
                <p style={paraStyle}>
                    <strong>Technical Data:</strong> We automatically collect your IP address, browser type, operating system, referring URLs, and pages visited. This data is used solely for analytics and service improvement.
                </p>
                <p style={paraStyle}>
                    <strong>Cookies:</strong> We use essential cookies for site functionality. We do not use tracking cookies or sell data to advertisers.
                </p>
            </section>

            <section style={sectionStyle}>
                <h2 style={headingStyle}>2. How We Use Your Information</h2>
                <p style={paraStyle}>
                    We use the data collected to: (a) provide import duty calculations, (b) improve the accuracy of our AI HS code classification engine, (c) generate import duty guides and educational content, and (d) monitor site performance and security. We do not sell, rent, or share your personal information with third parties for marketing purposes.
                </p>
            </section>

            <section style={sectionStyle}>
                <h2 style={headingStyle}>3. Data Storage & Security</h2>
                <p style={paraStyle}>
                    Calculation data is stored on Supabase infrastructure (PostgreSQL) with row-level security policies and encrypted at rest. We retain calculation data indefinitely to power our public directory of landed cost estimates. Personal data (IP addresses, session data) is retained for a maximum of 90 days.
                </p>
            </section>

            <section style={sectionStyle}>
                <h2 style={headingStyle}>4. Third-Party Services</h2>
                <p style={paraStyle}>
                    We use reputable third-party infrastructure providers for secure database hosting, AI-powered classification processing, and application delivery. Each provider operates under its own privacy policy and data processing agreement. Product descriptions submitted for HS code classification are processed in real time and are not retained by our AI provider beyond the duration of the request.
                </p>
            </section>

            <section style={sectionStyle}>
                <h2 style={headingStyle}>5. Your Rights</h2>
                <p style={paraStyle}>
                    You have the right to: (a) access the data we hold about you, (b) request deletion of your personal data, (c) opt out of non-essential data collection, and (d) request a copy of your data in a portable format. To exercise these rights, contact us at privacy@duty-decoder.com.
                </p>
            </section>

            <section style={sectionStyle}>
                <h2 style={headingStyle}>6. Changes to This Policy</h2>
                <p style={paraStyle}>
                    We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Your continued use of the service after changes constitutes acceptance of the updated policy.
                </p>
            </section>
        </main>
    );
}
