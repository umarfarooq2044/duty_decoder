"use client";

import { useEffect, useState } from "react";

export function TableOfContents() {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0px 0px -80% 0px" }
        );

        // Target our newly injected AI Semantic H2 sections
        const headings = document.querySelectorAll(
            ".semantic-content-section h2, .breakdown-section h2, .faq-section h2"
        );

        headings.forEach((elem) => {
            // Apply IDs dynamically if they don't exist
            if (!elem.id) {
                elem.id = elem.textContent
                    ?.toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)+/g, "") || "";
            }
            observer.observe(elem);
        });

        return () => observer.disconnect();
    }, []);

    const scrollTo = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const navHeight = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <nav className="toc-sidebar glass-panel">
            <h4 style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "1rem" }}>
                Contents
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <li>
                    <a
                        href="#cost-breakdown"
                        onClick={(e) => scrollTo("cost-breakdown", e)}
                        className={`toc-link ${activeId === "cost-breakdown" ? "active" : ""}`}
                    >
                        Cost Breakdown
                    </a>
                </li>
                <li>
                    <a
                        href="#step-by-step-import-compliance-guide"
                        onClick={(e) => scrollTo("step-by-step-import-compliance-guide", e)}
                        className={`toc-link ${activeId === "step-by-step-import-compliance-guide" ? "active" : ""}`}
                    >
                        Import Guide
                    </a>
                </li>
                <li>
                    <a
                        href="#frequently-asked-questions"
                        onClick={(e) => scrollTo("frequently-asked-questions", e)}
                        className={`toc-link ${activeId === "frequently-asked-questions" ? "active" : ""}`}
                    >
                        FAQs
                    </a>
                </li>
            </ul>
        </nav>
    );
}
