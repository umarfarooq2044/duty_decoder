export default function CategoryLoading() {
    return (
        <div className="skeleton-page">
            <main style={{ maxWidth: "1100px", margin: "0 auto" }}>
                {/* Header skeleton */}
                <header style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(59,130,246,0.04))",
                    border: "1px solid var(--color-border, rgba(255,255,255,0.08))",
                    borderRadius: "16px",
                    padding: "2.5rem 3rem",
                    marginBottom: "3rem",
                }}>
                    {/* Breadcrumb skeleton */}
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                        <span className="skeleton-block" style={{ width: "45px", height: "14px" }} />
                        <span className="skeleton-block" style={{ width: "70px", height: "14px" }} />
                        <span className="skeleton-block" style={{ width: "120px", height: "14px" }} />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
                        {/* Icon */}
                        <div className="skeleton-block" style={{ width: "72px", height: "72px", borderRadius: "14px", flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <div className="skeleton-block" style={{ width: "60%", maxWidth: "350px", height: "2rem", borderRadius: "8px", marginBottom: "0.5rem" }} />
                            <div className="skeleton-block" style={{ width: "40%", maxWidth: "250px", height: "1.1rem", borderRadius: "6px" }} />
                        </div>
                    </div>
                    <div className="skeleton-block" style={{ width: "90%", maxWidth: "700px", height: "0.9rem", borderRadius: "4px", marginBottom: "0.5rem" }} />
                    <div className="skeleton-block" style={{ width: "75%", maxWidth: "600px", height: "0.9rem", borderRadius: "4px" }} />
                </header>

                {/* Content + Sidebar grid */}
                <div className="content-sidebar-grid">
                    <section>
                        {/* Results count */}
                        <div style={{ marginBottom: "1.5rem" }}>
                            <div className="skeleton-block" style={{ width: "250px", height: "1.3rem", borderRadius: "6px" }} />
                        </div>

                        {/* Product grid skeleton */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} style={{
                                    background: "var(--color-bg-card, #1e2235)",
                                    border: "1px solid var(--color-border, #2a2e42)",
                                    padding: "1.25rem",
                                    borderRadius: "10px",
                                }}>
                                    <div className="skeleton-block" style={{ width: `${70 + Math.random() * 25}%`, height: "0.95rem", borderRadius: "5px", marginBottom: "0.75rem" }} />
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div className="skeleton-block" style={{ width: "120px", height: "0.8rem", borderRadius: "4px" }} />
                                        <div className="skeleton-block" style={{ width: "65px", height: "20px", borderRadius: "4px" }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Sidebar skeleton */}
                    <aside style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <div style={{
                            background: "var(--color-bg-card, #1e2235)",
                            border: "1px solid var(--color-border, #2a2e42)",
                            borderRadius: "12px",
                            padding: "1.5rem",
                        }}>
                            <div className="skeleton-block" style={{ width: "80%", height: "1rem", borderRadius: "5px", marginBottom: "0.75rem" }} />
                            <div className="skeleton-block" style={{ width: "100%", height: "0.85rem", borderRadius: "4px", marginBottom: "1rem" }} />
                            <div className="skeleton-block" style={{ width: "100%", height: "40px", borderRadius: "8px" }} />
                        </div>

                        <div style={{
                            background: "var(--color-bg-card, #1e2235)",
                            border: "1px solid var(--color-border, #2a2e42)",
                            borderRadius: "12px",
                            padding: "1.25rem",
                        }}>
                            <div className="skeleton-block" style={{ width: "50%", height: "0.7rem", borderRadius: "4px", marginBottom: "0.75rem" }} />
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div key={i} className="skeleton-block" style={{ width: `${55 + Math.random() * 40}%`, height: "0.85rem", borderRadius: "4px", marginBottom: "0.5rem" }} />
                            ))}
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
