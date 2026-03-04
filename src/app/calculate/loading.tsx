export default function CalculateIndexLoading() {
    return (
        <div className="skeleton-page">
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

                {/* Hero / Calculator skeleton */}
                <header style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(59,130,246,0.04))",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 3rem)",
                    marginBottom: "3rem",
                }}>
                    {/* Breadcrumb skeleton */}
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                        <span className="skeleton-block" style={{ width: "50px", height: "14px" }} />
                        <span className="skeleton-block" style={{ width: "120px", height: "14px" }} />
                    </div>

                    <div className="hero-split-grid">
                        {/* Left: text content */}
                        <div>
                            <div className="skeleton-block" style={{ width: "80%", maxWidth: "450px", height: "2.5rem", borderRadius: "8px", marginBottom: "1rem" }} />
                            <div className="skeleton-block" style={{ width: "100%", maxWidth: "500px", height: "1rem", borderRadius: "4px", marginBottom: "0.5rem" }} />
                            <div className="skeleton-block" style={{ width: "85%", maxWidth: "420px", height: "1rem", borderRadius: "4px", marginBottom: "1.5rem" }} />

                            {/* Feature list skeleton */}
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                                    <div className="skeleton-block" style={{ width: "20px", height: "20px", borderRadius: "4px", flexShrink: 0 }} />
                                    <div className="skeleton-block" style={{ width: `${180 + Math.random() * 80}px`, height: "0.9rem", borderRadius: "4px" }} />
                                </div>
                            ))}

                            {/* Trust bar skeleton */}
                            <div style={{ display: "flex", gap: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)", marginTop: "0.5rem" }}>
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} style={{ textAlign: "center", flex: 1 }}>
                                        <div className="skeleton-block" style={{ width: "50px", height: "1.2rem", borderRadius: "4px", margin: "0 auto 0.25rem" }} />
                                        <div className="skeleton-block" style={{ width: "60px", height: "0.7rem", borderRadius: "4px", margin: "0 auto" }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Calculator form skeleton */}
                        <div style={{
                            background: "var(--card)",
                            borderRadius: "16px",
                            padding: "2rem",
                            border: "1px solid var(--border)",
                        }}>
                            <div className="skeleton-block" style={{ width: "60%", height: "1.2rem", borderRadius: "6px", marginBottom: "0.5rem" }} />
                            <div className="skeleton-block" style={{ width: "90%", height: "0.8rem", borderRadius: "4px", marginBottom: "1.5rem" }} />
                            {/* Input fields */}
                            <div className="skeleton-block" style={{ width: "100%", height: "44px", borderRadius: "8px", marginBottom: "1rem" }} />
                            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
                                <div className="skeleton-block" style={{ flex: 1, height: "44px", borderRadius: "8px" }} />
                                <div className="skeleton-block" style={{ flex: 1, height: "44px", borderRadius: "8px" }} />
                            </div>
                            <div className="skeleton-block" style={{ width: "100%", height: "44px", borderRadius: "8px", marginBottom: "1rem" }} />
                            <div className="skeleton-block" style={{ width: "100%", height: "48px", borderRadius: "8px" }} />
                        </div>
                    </div>
                </header>

                {/* Trust cards skeleton */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} style={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            padding: "1.5rem",
                        }}>
                            <div className="skeleton-block" style={{ width: "40px", height: "40px", borderRadius: "8px", marginBottom: "0.75rem" }} />
                            <div className="skeleton-block" style={{ width: "60%", height: "1.1rem", borderRadius: "6px", marginBottom: "0.5rem" }} />
                            <div className="skeleton-block" style={{ width: "100%", height: "0.85rem", borderRadius: "4px", marginBottom: "0.4rem" }} />
                            <div className="skeleton-block" style={{ width: "90%", height: "0.85rem", borderRadius: "4px" }} />
                        </div>
                    ))}
                </div>

                {/* Content + Sidebar skeleton */}
                <div className="content-sidebar-grid" style={{ marginBottom: "4rem" }}>
                    <div>
                        {/* Section skeletons */}
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} style={{ marginBottom: "2.5rem", paddingBottom: "2.5rem", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                                <div className="skeleton-block" style={{ width: `${50 + Math.random() * 30}%`, height: "1.5rem", borderRadius: "6px", marginBottom: "1rem" }} />
                                <div className="skeleton-block" style={{ width: "100%", height: "0.9rem", borderRadius: "4px", marginBottom: "0.5rem" }} />
                                <div className="skeleton-block" style={{ width: "95%", height: "0.9rem", borderRadius: "4px", marginBottom: "0.5rem" }} />
                                <div className="skeleton-block" style={{ width: "88%", height: "0.9rem", borderRadius: "4px", marginBottom: "0.5rem" }} />
                                <div className="skeleton-block" style={{ width: "75%", height: "0.9rem", borderRadius: "4px" }} />
                            </div>
                        ))}
                    </div>

                    {/* Sidebar skeleton */}
                    <aside style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <div style={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            padding: "1.5rem",
                        }}>
                            <div className="skeleton-block" style={{ width: "70%", height: "0.85rem", borderRadius: "4px", marginBottom: "1rem" }} />
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="skeleton-block" style={{ width: `${60 + Math.random() * 35}%`, height: "0.85rem", borderRadius: "4px", marginBottom: "0.75rem" }} />
                            ))}
                        </div>
                        <div style={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            padding: "1.5rem",
                        }}>
                            <div className="skeleton-block" style={{ width: "60%", height: "0.85rem", borderRadius: "4px", marginBottom: "1rem" }} />
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
                                    <div className="skeleton-block" style={{ width: "20px", height: "20px", borderRadius: "4px", flexShrink: 0 }} />
                                    <div className="skeleton-block" style={{ width: `${80 + Math.random() * 60}px`, height: "0.85rem", borderRadius: "4px" }} />
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>

                {/* Route directory skeleton */}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "3rem" }}>
                    <div className="skeleton-block" style={{ width: "350px", height: "1.75rem", borderRadius: "8px", marginBottom: "0.5rem" }} />
                    <div className="skeleton-block" style={{ width: "500px", height: "1rem", borderRadius: "4px", marginBottom: "2rem" }} />

                    {/* Category filter tabs skeleton */}
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="skeleton-block" style={{ width: `${80 + Math.random() * 50}px`, height: "36px", borderRadius: "20px" }} />
                        ))}
                    </div>

                    {/* Route cards skeleton */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "0.75rem" }}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} style={{
                                background: "var(--card)",
                                border: "1px solid var(--border)",
                                padding: "1rem 1.25rem",
                                borderRadius: "10px",
                            }}>
                                <div className="skeleton-block" style={{ width: `${70 + Math.random() * 25}%`, height: "0.9rem", borderRadius: "5px", marginBottom: "0.5rem" }} />
                                <div className="skeleton-block" style={{ width: "120px", height: "0.75rem", borderRadius: "4px" }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
