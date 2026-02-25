import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Duty Decoder",
    description: "Terms of Service for Duty Decoder — rules and conditions governing your use of our import duty calculator and trade compliance platform.",
    alternates: { canonical: "/terms/" }
};

export default function TermsPage() {
    const sectionStyle: React.CSSProperties = { marginBottom: "2.5rem" };
    const headingStyle: React.CSSProperties = { fontSize: "1.3rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "1rem" };
    const paraStyle: React.CSSProperties = { fontSize: "1rem", color: "var(--muted-foreground)", lineHeight: 1.8, marginBottom: "1rem" };

    return (
        <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
            <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--foreground)", marginBottom: "0.5rem" }}>
                Terms of Service
            </h1>
            <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", marginBottom: "3rem" }}>
                Last updated: February 23, 2026
            </p>

            <section style={sectionStyle}>
                <h2 style={headingStyle}>1. Acceptance of Terms</h2>
                <p style={paraStyle}>
                    By accessing or using Duty Decoder (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service. These terms apply to all visitors, users, and others who access our import duty calculators, HS code classification tools, and trade compliance content.
                </p>
            </section>

            <section style={sectionStyle}>
                <h2 style={headingStyle}>2. Service Description</h2>
                <p style={paraStyle}>
                    Duty Decoder provides AI-powered import duty calculations, HS code classification, and landed cost estimates. Our tools are designed for informational purposes only. While we strive for accuracy using current tariff schedules and trade regulations, our calculations are <strong>estimates and should not be treated as official customs assessments</strong>.
                </p>
            </section>

            <section style={sectionStyle}>
                <h2 style={headingStyle}>3. Accuracy & Limitations</h2>
                <p style={paraStyle}>
                    Import duty rates, HS code classifications, and compliance regulations are subject to frequent changes by government authorities. Duty Decoder makes no warranty or guarantee that the information provided is current, complete, or accurate. Users should always verify duty calculations with a licensed customs broker or the relevant government customs authority before making financial decisions.
                </p>
            </section>

            <section style={sectionStyle}>
                <h2 style={headingStyle}>4. User Responsibilities</h2>
                <p style={paraStyle}>
                    You are responsible for: (a) the accuracy of product descriptions you submit, (b) verifying calculations with official sources before relying on them, (c) complying with all applicable import/export laws in your jurisdiction, and (d) not using the Service for any unlawful purpose.
                </p>
            </section>

            <section style={sectionStyle}>
                <h2 style={headingStyle}>5. Intellectual Property</h2>
                <p style={paraStyle}>
                    All content on Duty Decoder, including text, calculations, guides, classifications, UI design, and codebase, is the property of Duty Decoder or its licensors. You may not reproduce, distribute, or create derivative works from our content without explicit written permission.
                </p>
            </section>

            <section style={sectionStyle}>
                <h2 style={headingStyle}>6. Limitation of Liability</h2>
                <p style={paraStyle}>
                    IN NO EVENT SHALL GLOBALTRADE DECODER, ITS OPERATORS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE. This includes, without limitation, damages from incorrect duty calculations, misclassified HS codes, or reliance on any information provided by the Service.
                </p>
            </section>

            <section style={sectionStyle}>
                <h2 style={headingStyle}>7. Modifications</h2>
                <p style={paraStyle}>
                    We reserve the right to modify these Terms at any time. Material changes will be communicated on this page with an updated revision date. Your continued use of the Service after modifications constitutes acceptance of the updated Terms.
                </p>
            </section>
        </main>
    );
}
