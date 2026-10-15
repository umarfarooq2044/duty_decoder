import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Mail, Clock, MapPin, ShieldCheck, FileText } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact Us — Trade Compliance & Support",
    description:
        "Get in touch with the DutyDecoder team for support, business inquiries, tariff data corrections, or partnership opportunities. We respond within 1–2 business days.",
    alternates: { canonical: "/contact/" },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact DutyDecoder",
    description:
        "Contact the DutyDecoder team for support, tariff inquiries, or data corrections.",
    url: "https://dutydecoder.com/contact/",
    publisher: {
        "@type": "Organization",
        name: "DutyDecoder",
        url: "https://dutydecoder.com",
        email: "contact@dutydecoder.com",
    },
};

export default function ContactPage() {
    return (
        <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <header style={{ marginBottom: "2.5rem" }}>
                <h1
                    style={{
                        fontSize: "clamp(2rem, 4vw, 2.5rem)",
                        fontWeight: 800,
                        color: "var(--foreground)",
                        margin: "0 0 0.5rem",
                        lineHeight: 1.2,
                    }}
                >
                    Contact Us
                </h1>
                <p style={{ fontSize: "1.05rem", color: "var(--muted-foreground)", margin: 0, maxWidth: "700px" }}>
                    Have questions regarding an import duty estimate, need HS code verification, or spotted a tariff schedule discrepancy? Our trade compliance team is ready to assist.
                </p>
            </header>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
                {/* Contact Form Container */}
                <div
                    style={{
                        background: "var(--surface, #FFFFFF)",
                        border: "1px solid var(--border, #E3E8EF)",
                        borderRadius: "16px",
                        padding: "2rem",
                        boxShadow: "0 4px 12px rgba(11, 31, 58, 0.04)",
                    }}
                >
                    <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--foreground)", margin: "0 0 1.25rem" }}>
                        Send an Inquiry
                    </h2>
                    <ContactForm />
                </div>

                {/* Direct Contact Info & Policies */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {/* Monitored Channels Card */}
                    <div
                        style={{
                            background: "var(--surface, #FFFFFF)",
                            border: "1px solid var(--border, #E3E8EF)",
                            borderRadius: "16px",
                            padding: "1.5rem",
                            boxShadow: "0 2px 8px rgba(11, 31, 58, 0.03)",
                        }}
                    >
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--foreground)", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Mail size={18} style={{ color: "var(--accent)" }} />
                            <span>Direct Channels</span>
                        </h3>
                        <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", margin: "0 0 0.75rem", lineHeight: 1.6 }}>
                            For direct inquiries or formal documentation submissions:
                        </p>
                        <div style={{ padding: "0.75rem 1rem", background: "var(--bg, #F7F9FC)", borderRadius: "8px", border: "1px solid var(--border, #E3E8EF)", marginBottom: "0.75rem" }}>
                            <span style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>General &amp; Editorial</span>
                            <a href="mailto:contact@dutydecoder.com" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
                                contact@dutydecoder.com
                            </a>
                        </div>
                        <div style={{ padding: "0.75rem 1rem", background: "var(--bg, #F7F9FC)", borderRadius: "8px", border: "1px solid var(--border, #E3E8EF)" }}>
                            <span style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Data &amp; Tariff Corrections</span>
                            <a href="mailto:corrections@dutydecoder.com" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
                                corrections@dutydecoder.com
                            </a>
                        </div>
                    </div>

                    {/* Response Time & Location */}
                    <div
                        style={{
                            background: "var(--surface, #FFFFFF)",
                            border: "1px solid var(--border, #E3E8EF)",
                            borderRadius: "16px",
                            padding: "1.5rem",
                            boxShadow: "0 2px 8px rgba(11, 31, 58, 0.03)",
                        }}
                    >
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--foreground)", margin: "0 0 0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Clock size={18} style={{ color: "var(--accent)" }} />
                            <span>Response Standards</span>
                        </h3>
                        <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", margin: "0 0 1rem", lineHeight: 1.6 }}>
                            We review inquiries on a daily basis. Standard responses are delivered within <strong>1–2 business days</strong> (Monday–Friday). Rate correction notices are investigated within 48 hours of receipt.
                        </p>

                        <div style={{ borderTop: "1px solid var(--border, #E3E8EF)", paddingTop: "1rem" }}>
                            <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--foreground)", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <MapPin size={15} style={{ color: "var(--accent)" }} />
                                <span>Entity &amp; Registered Operations</span>
                            </h4>
                            <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", margin: 0, lineHeight: 1.6 }}>
                                DutyDecoder Digital Publications<br />
                                {/* TODO_OWNER: Provide exact business registration street address and tax jurisdiction */}
                                Registered Operating Entity: DutyDecoder / Umar Farooq<br />
                                International Trade Data Division
                            </p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div
                        style={{
                            background: "var(--teal-50, #F0FDFA)",
                            border: "1px solid rgba(15, 118, 110, 0.2)",
                            borderRadius: "16px",
                            padding: "1.25rem",
                        }}
                    >
                        <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--navy-900, #0B1F3A)", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <ShieldCheck size={16} style={{ color: "var(--accent)" }} />
                            <span>Compliance Transparency</span>
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.85rem", color: "var(--text-body, #475569)", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <li>
                                View our <Link href="/data-sources/" style={{ color: "var(--accent)", fontWeight: 600 }}>Data Sources &amp; Corrections Workflow</Link>
                            </li>
                            <li>
                                Read our <Link href="/editorial-policy/" style={{ color: "var(--accent)", fontWeight: 600 }}>Editorial &amp; Verification Standards</Link>
                            </li>
                            <li>
                                Exercise statutory rights under our <Link href="/privacy/" style={{ color: "var(--accent)", fontWeight: 600 }}>Privacy Policy</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}
