"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [category, setCategory] = useState("general");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [websiteHp, setWebsiteHp] = useState(""); // Honeypot

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus("idle");
        setErrorMessage("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    category,
                    subject,
                    message,
                    website_hp: websiteHp,
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setStatus("success");
                setName("");
                setEmail("");
                setSubject("");
                setMessage("");
            } else {
                setStatus("error");
                setErrorMessage(data.message || "Failed to submit message. Please try again or email us directly.");
            }
        } catch {
            setStatus("error");
            setErrorMessage("Network error. Please check your connection or email contact@dutydecoder.com directly.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === "success") {
        return (
            <div
                style={{
                    background: "var(--teal-50, #F0FDFA)",
                    border: "1px solid rgba(15, 118, 110, 0.25)",
                    borderRadius: "12px",
                    padding: "2rem",
                    textAlign: "center",
                    margin: "1.5rem 0",
                }}
            >
                <CheckCircle2 size={40} style={{ color: "var(--teal-700, #0F766E)", margin: "0 auto 1rem" }} />
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--navy-900, #0B1F3A)", margin: "0 0 0.5rem" }}>
                    Message Received
                </h3>
                <p style={{ fontSize: "0.95rem", color: "var(--text-body, #475569)", lineHeight: 1.6, maxWidth: "500px", margin: "0 auto 1.5rem" }}>
                    Thank you for contacting DutyDecoder. Our customs compliance and editorial team will review your message and reply to <strong>{email || "your email"}</strong> within 1–2 business days.
                </p>
                <button
                    onClick={() => setStatus("idle")}
                    style={{
                        padding: "0.6rem 1.25rem",
                        background: "var(--teal-700, #0F766E)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {status === "error" && (
                <div
                    style={{
                        background: "#FEF2F2",
                        border: "1px solid #F87171",
                        borderRadius: "8px",
                        padding: "0.85rem 1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        color: "#991B1B",
                        fontSize: "0.9rem",
                    }}
                >
                    <AlertCircle size={18} style={{ flexShrink: 0 }} />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Honeypot field for bot suppression (hidden from humans) */}
            <div style={{ display: "none" }} aria-hidden="true">
                <label htmlFor="website_hp">Leave this field blank</label>
                <input
                    type="text"
                    id="website_hp"
                    name="website_hp"
                    tabIndex={-1}
                    value={websiteHp}
                    onChange={(e) => setWebsiteHp(e.target.value)}
                    autoComplete="off"
                />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
                <div className="form-group">
                    <label htmlFor="contact-name">Your Full Name *</label>
                    <input
                        type="text"
                        id="contact-name"
                        required
                        className="form-control"
                        placeholder="e.g. Sarah Jenkins"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="contact-email">Email Address *</label>
                    <input
                        type="email"
                        id="contact-email"
                        required
                        className="form-control"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
                <div className="form-group">
                    <label htmlFor="contact-category">Inquiry Type *</label>
                    <select
                        id="contact-category"
                        className="form-control"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        disabled={isSubmitting}
                    >
                        <option value="general">General Inquiry</option>
                        <option value="data_correction">Tariff Rate Correction / Dispute</option>
                        <option value="partnership">Customs Broker / Platform Partnership</option>
                        <option value="privacy">Privacy &amp; Data Subject Request</option>
                        <option value="bug_report">Technical Bug Report</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="contact-subject">Subject *</label>
                    <input
                        type="text"
                        id="contact-subject"
                        required
                        className="form-control"
                        placeholder="Brief summary of your inquiry"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="contact-message">Message *</label>
                <textarea
                    id="contact-message"
                    required
                    rows={5}
                    className="form-control"
                    placeholder="Provide details about your question, calculation, or tariff schedule inquiry..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSubmitting}
                    style={{ resize: "vertical", minHeight: "120px" }}
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="submit-btn"
                style={{
                    alignSelf: "flex-start",
                    width: "auto",
                    padding: "0.85rem 2rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                }}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Sending message...</span>
                    </>
                ) : (
                    <>
                        <Send size={18} />
                        <span>Send Message</span>
                    </>
                )}
            </button>
        </form>
    );
}
