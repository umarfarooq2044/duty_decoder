export default function CalculateLoading() {
    return (
        <div className="skeleton-page">
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                {/* Breadcrumbs skeleton */}
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                    <span className="skeleton-block" style={{ width: "50px", height: "14px" }} />
                    <span className="skeleton-block" style={{ width: "80px", height: "14px" }} />
                    <span className="skeleton-block" style={{ width: "140px", height: "14px" }} />
                </div>

                {/* Header skeleton */}
                <header style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <div className="skeleton-block" style={{ width: "70%", maxWidth: "500px", height: "2.5rem", margin: "0 auto 0.75rem", borderRadius: "8px" }} />
                    <div className="skeleton-block" style={{ width: "50%", maxWidth: "350px", height: "1.25rem", margin: "0 auto 1rem", borderRadius: "6px" }} />
                    <div className="skeleton-block" style={{ width: "180px", height: "32px", margin: "0 auto", borderRadius: "9999px" }} />
                </header>

                {/* Two column grid */}
                <div className="report-grid">
                    {/* Main content */}
                    <div>
                        {/* Breakdown table skeleton */}
                        <section style={{
                            background: "var(--color-bg-card)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "var(--radius-lg)",
                            overflow: "hidden",
                            marginBottom: "var(--space-xl)",
                        }}>
                            <div style={{ padding: "var(--space-lg)", borderBottom: "1px solid var(--color-border)" }}>
                                <div className="skeleton-block" style={{ width: "200px", height: "1.2rem", borderRadius: "6px" }} />
                            </div>
                            {/* Table rows */}
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div key={i} style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "0.75rem var(--space-lg)",
                                    borderBottom: i < 6 ? "1px solid rgba(42, 46, 66, 0.5)" : "none",
                                }}>
                                    <div className="skeleton-block" style={{ width: `${120 + Math.random() * 100}px`, height: "0.9rem", borderRadius: "4px" }} />
                                    <div className="skeleton-block" style={{ width: "60px", height: "0.9rem", borderRadius: "4px" }} />
                                    <div className="skeleton-block" style={{ width: "80px", height: "0.9rem", borderRadius: "4px" }} />
                                </div>
                            ))}
                            {/* Total row */}
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "var(--space-md) var(--space-lg)",
                                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(99, 102, 241, 0.04))",
                            }}>
                                <div className="skeleton-block" style={{ width: "140px", height: "1.1rem", borderRadius: "6px" }} />
                                <div className="skeleton-block" style={{ width: "100px", height: "1.1rem", borderRadius: "6px" }} />
                            </div>
                        </section>

                        {/* Semantic content skeleton */}
                        <section style={{
                            background: "var(--color-bg-card)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "var(--radius-lg)",
                            padding: "var(--space-xl)",
                            marginBottom: "var(--space-xl)",
                        }}>
                            <div className="skeleton-block" style={{ width: "60%", height: "1.3rem", borderRadius: "6px", marginBottom: "1rem" }} />
                            <div className="skeleton-block" style={{ width: "100%", height: "0.85rem", borderRadius: "4px", marginBottom: "0.6rem" }} />
                            <div className="skeleton-block" style={{ width: "90%", height: "0.85rem", borderRadius: "4px", marginBottom: "0.6rem" }} />
                            <div className="skeleton-block" style={{ width: "95%", height: "0.85rem", borderRadius: "4px", marginBottom: "0.6rem" }} />
                            <div className="skeleton-block" style={{ width: "75%", height: "0.85rem", borderRadius: "4px" }} />
                        </section>

                        {/* FAQ skeleton */}
                        <section style={{
                            background: "var(--color-bg-card)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "var(--radius-lg)",
                            padding: "var(--space-xl)",
                            marginBottom: "var(--space-xl)",
                        }}>
                            <div className="skeleton-block" style={{ width: "180px", height: "1.3rem", borderRadius: "6px", marginBottom: "1.25rem" }} />
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} style={{ marginBottom: i < 2 ? "1rem" : 0 }}>
                                    <div className="skeleton-block" style={{ width: `${70 + Math.random() * 25}%`, height: "1rem", borderRadius: "5px", marginBottom: "0.5rem" }} />
                                    <div className="skeleton-block" style={{ width: "100%", height: "0.8rem", borderRadius: "4px", marginBottom: "0.35rem" }} />
                                    <div className="skeleton-block" style={{ width: "85%", height: "0.8rem", borderRadius: "4px" }} />
                                </div>
                            ))}
                        </section>
                    </div>

                    {/* Sidebar skeleton */}
                    <aside className="report-sidebar">
                        <div style={{
                            background: "var(--color-bg-card)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "12px",
                            padding: "1.5rem",
                            marginBottom: "1.5rem",
                        }}>
                            <div className="skeleton-block" style={{ width: "80%", height: "1.1rem", borderRadius: "6px", marginBottom: "1rem" }} />
                            <div className="skeleton-block" style={{ width: "100%", height: "0.85rem", borderRadius: "4px", marginBottom: "0.5rem" }} />
                            <div className="skeleton-block" style={{ width: "90%", height: "0.85rem", borderRadius: "4px", marginBottom: "1rem" }} />
                            <div className="skeleton-block" style={{ width: "100%", height: "42px", borderRadius: "8px" }} />
                        </div>

                        <div style={{
                            background: "var(--color-bg-card)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "12px",
                            padding: "1.5rem",
                        }}>
                            <div className="skeleton-block" style={{ width: "60%", height: "0.75rem", borderRadius: "4px", marginBottom: "1rem" }} />
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="skeleton-block" style={{ width: `${60 + Math.random() * 35}%`, height: "0.85rem", borderRadius: "4px", marginBottom: "0.6rem" }} />
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
