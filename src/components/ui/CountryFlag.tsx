import React from "react";

interface CountryFlagProps {
    code: string;
    size?: "sm" | "md" | "lg";
    className?: string;
    style?: React.CSSProperties;
}

/**
 * Clean SVG Country Flag component.
 * Eliminates Windows Unicode emoji flag rendering bug ("US", "GB" letters).
 * Fully responsive, crisp on all resolutions, zero external network requests.
 */
export function CountryFlag({ code, size = "md", className = "", style = {} }: CountryFlagProps) {
    const c = code?.toUpperCase() || "";

    const dimensions = {
        sm: { width: 16, height: 12 },
        md: { width: 20, height: 14 },
        lg: { width: 26, height: 18 },
    }[size];

    const baseStyle: React.CSSProperties = {
        display: "inline-block",
        verticalAlign: "middle",
        borderRadius: "2px",
        overflow: "hidden",
        boxShadow: "0 0 1px rgba(0,0,0,0.3)",
        flexShrink: 0,
        ...style,
    };

    switch (c) {
        case "US":
            return (
                <svg viewBox="0 0 20 14" width={dimensions.width} height={dimensions.height} style={baseStyle} className={className} aria-label="United States flag">
                    <rect width="20" height="14" fill="#B22234" />
                    <path d="M0 1.08h20v1.08H0zm0 2.15h20v1.08H0zm0 2.15h20v1.08H0zm0 2.15h20v1.08H0zm0 2.15h20v1.08H0zm0 2.15h20v1.08H0z" fill="#FFF" />
                    <rect width="8" height="7.5" fill="#3C3B6E" />
                    <circle cx="2" cy="1.8" r="0.6" fill="#FFF" />
                    <circle cx="4" cy="1.8" r="0.6" fill="#FFF" />
                    <circle cx="6" cy="1.8" r="0.6" fill="#FFF" />
                    <circle cx="3" cy="3.7" r="0.6" fill="#FFF" />
                    <circle cx="5" cy="3.7" r="0.6" fill="#FFF" />
                    <circle cx="2" cy="5.6" r="0.6" fill="#FFF" />
                    <circle cx="4" cy="5.6" r="0.6" fill="#FFF" />
                    <circle cx="6" cy="5.6" r="0.6" fill="#FFF" />
                </svg>
            );
        case "GB":
        case "UK":
            return (
                <svg viewBox="0 0 20 14" width={dimensions.width} height={dimensions.height} style={baseStyle} className={className} aria-label="United Kingdom flag">
                    <rect width="20" height="14" fill="#012169" />
                    <path d="M0 0L20 14M20 0L0 14" stroke="#FFF" strokeWidth="2.5" />
                    <path d="M0 0L20 14M20 0L0 14" stroke="#C8102E" strokeWidth="1.2" />
                    <path d="M10 0v14M0 7h20" stroke="#FFF" strokeWidth="4" />
                    <path d="M10 0v14M0 7h20" stroke="#C8102E" strokeWidth="2.4" />
                </svg>
            );
        case "CN":
            return (
                <svg viewBox="0 0 20 14" width={dimensions.width} height={dimensions.height} style={baseStyle} className={className} aria-label="China flag">
                    <rect width="20" height="14" fill="#DE2910" />
                    <polygon points="3.5,1.5 4,3 5.5,3 4.2,3.9 4.7,5.4 3.5,4.4 2.3,5.4 2.8,3.9 1.5,3 3,3" fill="#FFDE00" />
                    <polygon points="6,1.2 6.2,1.8 6.8,1.8 6.3,2.1 6.5,2.7 6,2.3 5.5,2.7 5.7,2.1 5.2,1.8 5.8,1.8" fill="#FFDE00" />
                    <polygon points="7.5,2.5 7.7,3.1 8.3,3.1 7.8,3.4 8,4 7.5,3.6 7,4 7.2,3.4 6.7,3.1 7.3,3.1" fill="#FFDE00" />
                    <polygon points="7.5,4.5 7.7,5.1 8.3,5.1 7.8,5.4 8,6 7.5,5.6 7,6 7.2,5.4 6.7,5.1 7.3,5.1" fill="#FFDE00" />
                </svg>
            );
        case "DE":
            return (
                <svg viewBox="0 0 20 14" width={dimensions.width} height={dimensions.height} style={baseStyle} className={className} aria-label="Germany flag">
                    <rect width="20" height="4.66" y="0" fill="#000" />
                    <rect width="20" height="4.66" y="4.66" fill="#DD0000" />
                    <rect width="20" height="4.66" y="9.33" fill="#FFCE00" />
                </svg>
            );
        case "FR":
            return (
                <svg viewBox="0 0 20 14" width={dimensions.width} height={dimensions.height} style={baseStyle} className={className} aria-label="France flag">
                    <rect width="6.66" height="14" x="0" fill="#002395" />
                    <rect width="6.66" height="14" x="6.66" fill="#FFF" />
                    <rect width="6.66" height="14" x="13.33" fill="#ED2939" />
                </svg>
            );
        case "JP":
            return (
                <svg viewBox="0 0 20 14" width={dimensions.width} height={dimensions.height} style={baseStyle} className={className} aria-label="Japan flag">
                    <rect width="20" height="14" fill="#FFF" />
                    <circle cx="10" cy="7" r="4.2" fill="#BC002D" />
                </svg>
            );
        case "IN":
            return (
                <svg viewBox="0 0 20 14" width={dimensions.width} height={dimensions.height} style={baseStyle} className={className} aria-label="India flag">
                    <rect width="20" height="4.66" y="0" fill="#FF9933" />
                    <rect width="20" height="4.66" y="4.66" fill="#FFF" />
                    <rect width="20" height="4.66" y="9.33" fill="#128807" />
                    <circle cx="10" cy="7" r="1.8" fill="none" stroke="#000080" strokeWidth="0.5" />
                </svg>
            );
        case "CA":
            return (
                <svg viewBox="0 0 20 14" width={dimensions.width} height={dimensions.height} style={baseStyle} className={className} aria-label="Canada flag">
                    <rect width="5" height="14" x="0" fill="#FF0000" />
                    <rect width="10" height="14" x="5" fill="#FFF" />
                    <rect width="5" height="14" x="15" fill="#FF0000" />
                    <path d="M10 3.5l0.8 1.8 1.8-0.5-0.7 1.5 1.4 0.9-1.6 0.5 0.5 1.5-1.5-0.6-0.7 1.4-0.7-1.4-1.5 0.6 0.5-1.5-1.6-0.5 1.4-0.9-0.7-1.5 1.8 0.5z" fill="#FF0000" />
                </svg>
            );
        case "AU":
            return (
                <svg viewBox="0 0 20 14" width={dimensions.width} height={dimensions.height} style={baseStyle} className={className} aria-label="Australia flag">
                    <rect width="20" height="14" fill="#00008B" />
                    <rect width="8" height="5.5" fill="#012169" />
                    <path d="M0 0L8 5.5M8 0L0 5.5" stroke="#FFF" strokeWidth="1" />
                    <path d="M4 0v5.5M0 2.75h8" stroke="#C8102E" strokeWidth="0.8" />
                    <circle cx="4" cy="9.5" r="1.2" fill="#FFF" />
                    <circle cx="14" cy="3.5" r="0.8" fill="#FFF" />
                    <circle cx="16.5" cy="5.5" r="0.7" fill="#FFF" />
                    <circle cx="15.5" cy="8.5" r="0.8" fill="#FFF" />
                    <circle cx="13" cy="9.5" r="0.8" fill="#FFF" />
                </svg>
            );
        case "SG":
            return (
                <svg viewBox="0 0 20 14" width={dimensions.width} height={dimensions.height} style={baseStyle} className={className} aria-label="Singapore flag">
                    <rect width="20" height="7" y="0" fill="#ED2939" />
                    <rect width="20" height="7" y="7" fill="#FFF" />
                    <circle cx="4.5" cy="3.5" r="2.2" fill="#FFF" />
                    <circle cx="5.2" cy="3.5" r="2" fill="#ED2939" />
                </svg>
            );
        case "EU":
            return (
                <svg viewBox="0 0 20 14" width={dimensions.width} height={dimensions.height} style={baseStyle} className={className} aria-label="European Union flag">
                    <rect width="20" height="14" fill="#003399" />
                    <circle cx="10" cy="3" r="0.6" fill="#FFCC00" />
                    <circle cx="12.8" cy="4.2" r="0.6" fill="#FFCC00" />
                    <circle cx="14" cy="7" r="0.6" fill="#FFCC00" />
                    <circle cx="12.8" cy="9.8" r="0.6" fill="#FFCC00" />
                    <circle cx="10" cy="11" r="0.6" fill="#FFCC00" />
                    <circle cx="7.2" cy="9.8" r="0.6" fill="#FFCC00" />
                    <circle cx="6" cy="7" r="0.6" fill="#FFCC00" />
                    <circle cx="7.2" cy="4.2" r="0.6" fill="#FFCC00" />
                </svg>
            );
        case "PK":
            return (
                <svg viewBox="0 0 20 14" width={dimensions.width} height={dimensions.height} style={baseStyle} className={className} aria-label="Pakistan flag">
                    <rect width="5" height="14" x="0" fill="#FFF" />
                    <rect width="15" height="14" x="5" fill="#01411C" />
                    <circle cx="12.5" cy="7" r="3.2" fill="#FFF" />
                    <circle cx="13.5" cy="6.2" r="2.8" fill="#01411C" />
                    <polygon points="13.2,5 13.6,5.8 14.5,5.8 13.8,6.3 14,7.2 13.2,6.7 12.4,7.2 12.7,6.3 12,5.8 12.8,5.8" fill="#FFF" />
                </svg>
            );
        case "IT":
            return (
                <svg viewBox="0 0 20 14" width={dimensions.width} height={dimensions.height} style={baseStyle} className={className} aria-label="Italy flag">
                    <rect width="6.66" height="14" x="0" fill="#009246" />
                    <rect width="6.66" height="14" x="6.66" fill="#FFF" />
                    <rect width="6.66" height="14" x="13.33" fill="#CE2B37" />
                </svg>
            );
        case "ES":
            return (
                <svg viewBox="0 0 20 14" width={dimensions.width} height={dimensions.height} style={baseStyle} className={className} aria-label="Spain flag">
                    <rect width="20" height="3.5" y="0" fill="#AA151B" />
                    <rect width="20" height="7" y="3.5" fill="#F1BF00" />
                    <rect width="20" height="3.5" y="10.5" fill="#AA151B" />
                </svg>
            );
        case "NL":
            return (
                <svg viewBox="0 0 20 14" width={dimensions.width} height={dimensions.height} style={baseStyle} className={className} aria-label="Netherlands flag">
                    <rect width="20" height="4.66" y="0" fill="#AE1C28" />
                    <rect width="20" height="4.66" y="4.66" fill="#FFF" />
                    <rect width="20" height="4.66" y="9.33" fill="#21468B" />
                </svg>
            );
        case "BR":
            return (
                <svg viewBox="0 0 20 14" width={dimensions.width} height={dimensions.height} style={baseStyle} className={className} aria-label="Brazil flag">
                    <rect width="20" height="14" fill="#009739" />
                    <polygon points="10,1.5 18,7 10,12.5 2,7" fill="#FEDD00" />
                    <circle cx="10" cy="7" r="3.2" fill="#012169" />
                </svg>
            );
        case "MX":
            return (
                <svg viewBox="0 0 20 14" width={dimensions.width} height={dimensions.height} style={baseStyle} className={className} aria-label="Mexico flag">
                    <rect width="6.66" height="14" x="0" fill="#006847" />
                    <rect width="6.66" height="14" x="6.66" fill="#FFF" />
                    <rect width="6.66" height="14" x="13.33" fill="#CE1126" />
                    <circle cx="10" cy="7" r="1.5" fill="#8B4513" />
                </svg>
            );
        case "KR":
            return (
                <svg viewBox="0 0 20 14" width={dimensions.width} height={dimensions.height} style={baseStyle} className={className} aria-label="South Korea flag">
                    <rect width="20" height="14" fill="#FFF" />
                    <circle cx="10" cy="7" r="3.5" fill="#CD2E3A" />
                    <path d="M10 7a3.5 3.5 0 0 1 0 7 3.5 3.5 0 0 1 0-7z" fill="#0047A0" />
                </svg>
            );
        case "AE":
            return (
                <svg viewBox="0 0 20 14" width={dimensions.width} height={dimensions.height} style={baseStyle} className={className} aria-label="UAE flag">
                    <rect width="15" height="4.66" x="5" y="0" fill="#00732F" />
                    <rect width="15" height="4.66" x="5" y="4.66" fill="#FFF" />
                    <rect width="15" height="4.66" x="5" y="9.33" fill="#000" />
                    <rect width="5" height="14" x="0" fill="#FF0000" />
                </svg>
            );
        case "SA":
            return (
                <svg viewBox="0 0 20 14" width={dimensions.width} height={dimensions.height} style={baseStyle} className={className} aria-label="Saudi Arabia flag">
                    <rect width="20" height="14" fill="#006C35" />
                    <path d="M5 9.5h10M6 8h8" stroke="#FFF" strokeWidth="0.8" />
                </svg>
            );
        default:
            // Fallback: Elegant 2-letter badge with neutral border
            return (
                <span
                    style={{
                        ...baseStyle,
                        width: `${dimensions.width}px`,
                        height: `${dimensions.height}px`,
                        background: "var(--navy-800, #12305A)",
                        color: "#FFF",
                        fontSize: size === "sm" ? "8px" : "9px",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textTransform: "uppercase",
                        letterSpacing: "-0.05em",
                    }}
                    className={className}
                    title={code}
                >
                    {c.slice(0, 2)}
                </span>
            );
    }
}
