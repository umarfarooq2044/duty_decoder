import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Contact Us",
    description:
        "Get in touch with the DutyDecoder team for support, business inquiries, data corrections, or partnership opportunities. We typically respond within 1–2 business days.",
    alternates: { canonical: "/contact/" },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact DutyDecoder",
    description:
        "Contact the DutyDecoder team for support, business inquiries, or data corrections.",
    url: "https://dutydecoder.com/contact/",
    publisher: {
        "@type": "Organization",
        name: "DutyDecoder",
        url: "https://dutydecoder.com",
        email: "contact@dutydecoder.com",
    },
};

export default function ContactPage() {
    const sectionStyle: React.CSSProperties = { marginBottom: "2.5rem" };
    const headingStyle: React.CSSProperties = {
        fontSize: "1.3rem",
        fontWeight: 700,
        color: "var(--foreground)",
        marginBottom: "1rem",
    };
    const paraStyle: React.CSSProperties = {
        fontSize: "1rem",
        color: "var(--muted-foreground)",
        lineHeight: 1.8,
        marginBottom: "1rem",
    };
    const emailLinkStyle: React.CSSProperties = {
        color: "var(--accent)",
        textDecoration: "none",
        fontWeight: 600,
    };

    return (
        <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <h1
                style={{
                    fontSize: "2.25rem",
                    fontWeight: 800,
                    color: "var(--foreground)",
                    marginBottom: "0.5rem",
                }}
            >
                Contact Us
            </h1>
            <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", marginBottom: "3rem" }}>
                We&apos;d love to hear from you
            </p>

            {/* Intro */}
            <section style={sectionStyle}>
                <h2 style={headingStyle}>Get in Touch</h2>
                <p style={paraStyle}>
                    Whether you have a question about our import duty calculators, need help
                    with HS code classification, or want to report a data issue — the
                    DutyDecoder team is here to help. Reach out using any of the channels below
                    and we&apos;ll get back to you as quickly as possible.
                </p>
            </section>

            {/* General Inquiries */}
            <section style={sectionStyle}>
                <h2 style={headingStyle}>General Inquiries</h2>
                <p style={paraStyle}>
                    For general questions about our tools, tariff data, or how to use
                    DutyDecoder, email us at:
                </p>
                <p style={paraStyle}>
                    📧{" "}
                    <a href="mailto:contact@dutydecoder.com" style={emailLinkStyle}>
                        contact@dutydecoder.com
                    </a>
                </p>
            </section>

            {/* Business & Partnerships */}
            <section style={sectionStyle}>
                <h2 style={headingStyle}>Business &amp; Partnerships</h2>
                <p style={paraStyle}>
                    Interested in integrating DutyDecoder data into your platform, or
                    exploring a partnership? We&apos;re open to collaborations with customs brokers,
                    freight forwarders, e-commerce platforms, and trade compliance providers.
                </p>
                <p style={paraStyle}>
                    📧{" "}
                    <a href="mailto:contact@dutydecoder.com" style={emailLinkStyle}>
                        contact@dutydecoder.com
                    </a>
                </p>
            </section>

            {/* Data & Privacy Requests */}
            <section style={sectionStyle}>
                <h2 style={headingStyle}>Data &amp; Privacy Requests</h2>
                <p style={paraStyle}>
                    To request access to your personal data, ask for data deletion, or
                    exercise any rights outlined in our{" "}
                    <Link href="/privacy/" style={{ color: "var(--accent)" }}>
                        Privacy Policy
                    </Link>
                    , contact us at:
                </p>
                <p style={paraStyle}>
                    📧{" "}
                    <a href="mailto:contact@dutydecoder.com" style={emailLinkStyle}>
                        contact@dutydecoder.com
                    </a>
                </p>
            </section>

            {/* Report an Issue */}
            <section style={sectionStyle}>
                <h2 style={headingStyle}>Report an Issue</h2>
                <p style={paraStyle}>
                    Found an incorrect duty rate, outdated tariff schedule, or a bug in our
                    calculators? We take data accuracy seriously. Please include the URL of the
                    page, the product or country involved, and a brief description of the issue
                    so we can investigate promptly.
                </p>
                <p style={paraStyle}>
                    📧{" "}
                    <a href="mailto:contact@dutydecoder.com" style={emailLinkStyle}>
                        contact@dutydecoder.com
                    </a>
                </p>
            </section>

            {/* Response Time */}
            <section
                style={{
                    background: "rgba(34,197,94,0.06)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: "12px",
                    padding: "1.5rem 2rem",
                }}
            >
                <h2
                    style={{
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        color: "var(--foreground)",
                        marginBottom: "0.75rem",
                    }}
                >
                    ⏱️ Response Time
                </h2>
                <p style={{ ...paraStyle, margin: 0 }}>
                    We aim to respond to all inquiries within{" "}
                    <strong>1–2 business days</strong>. For urgent data corrections or
                    compliance-related queries, please mark your email subject with
                    &ldquo;URGENT&rdquo; and we&apos;ll prioritize it.
                </p>
            </section>
        </main>
    );
}
