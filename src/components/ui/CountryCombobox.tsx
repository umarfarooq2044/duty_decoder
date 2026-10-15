"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { COUNTRIES } from "@/lib/countries";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { ChevronDown, Search, Check } from "lucide-react";

interface CountryComboboxProps {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (code: string) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    hint?: string;
}

const POPULAR_CODES = ["US", "CN", "GB", "DE", "JP", "IN", "CA", "FR", "AU", "SG", "PK", "AE"];

export function CountryCombobox({
    id,
    name,
    label,
    value,
    onChange,
    placeholder = "Select country",
    required = false,
    disabled = false,
    hint,
}: CountryComboboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const triggerId = useId();

    const selectedCountry = COUNTRIES.find((c) => c.code === value);

    // Grouping: Popular vs All
    const filtered = COUNTRIES.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.code.toLowerCase().includes(search.toLowerCase())
    );

    const popularList = filtered.filter((c) => POPULAR_CODES.includes(c.code));
    const otherList = filtered.filter((c) => !POPULAR_CODES.includes(c.code));

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when opened
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        } else {
            setSearch("");
        }
    }, [isOpen]);

    const handleSelect = (code: string) => {
        onChange(code);
        setIsOpen(false);
    };

    return (
        <div className="form-group country-combobox-container" ref={containerRef} style={{ position: "relative" }}>
            {/* Hidden input for standard HTML FormData compatibility */}
            <input type="hidden" name={name} value={value} />

            <label htmlFor={triggerId} style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--navy-900, #0B1F3A)" }}>
                {label} {required && <span style={{ color: "var(--danger, #B91C1C)" }} aria-hidden="true">*</span>}
            </label>

            {/* Combobox Trigger Button */}
            <button
                type="button"
                id={triggerId}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-required={required}
                disabled={disabled}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className="form-control combobox-trigger"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    minWidth: 0,
                    height: "48px",
                    padding: "0.5rem 0.75rem",
                    background: "var(--surface, #FFFFFF)",
                    border: `1px solid ${isOpen ? "var(--teal-700, #0F766E)" : "var(--border, #E3E8EF)"}`,
                    borderRadius: "var(--r-md, 10px)",
                    color: selectedCountry ? "var(--text, #0B1F3A)" : "var(--text-muted, #64748B)",
                    fontSize: "0.95rem",
                    cursor: disabled ? "not-allowed" : "pointer",
                    boxShadow: isOpen ? "var(--focus, 0 0 0 3px rgba(15,118,110,.25))" : "var(--sh-1, 0 1px 2px rgba(11,31,58,.06))",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                    overflow: "hidden",
                }}
            >
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0, overflow: "hidden", flex: 1 }}>
                    {selectedCountry ? (
                        <>
                            <CountryFlag code={selectedCountry.code} size="md" />
                            <span style={{ fontWeight: 500, color: "var(--text, #0B1F3A)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>
                                {selectedCountry.name}
                            </span>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted, #64748B)", flexShrink: 0 }}>
                                ({selectedCountry.code})
                            </span>
                        </>
                    ) : (
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{placeholder}</span>
                    )}
                </span>
                <ChevronDown size={16} style={{ color: "var(--text-muted, #64748B)", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", flexShrink: 0, marginLeft: "0.25rem" }} />
            </button>

            {hint && <span className="input-hint">{hint}</span>}

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    role="listbox"
                    style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        right: 0,
                        zIndex: 100,
                        background: "var(--surface, #FFFFFF)",
                        border: "1px solid var(--border, #E3E8EF)",
                        borderRadius: "var(--r-md, 10px)",
                        boxShadow: "var(--sh-3, 0 12px 32px rgba(11,31,58,.12))",
                        maxHeight: "320px",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                >
                    {/* Search Input Header */}
                    <div style={{ padding: "0.5rem 0.65rem", borderBottom: "1px solid var(--border, #E3E8EF)", background: "var(--bg, #F7F9FC)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Search size={16} style={{ color: "var(--text-muted, #64748B)" }} />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Type to filter 50+ countries..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: "100%",
                                border: "none",
                                background: "transparent",
                                outline: "none",
                                fontSize: "0.9rem",
                                color: "var(--text, #0B1F3A)",
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") setIsOpen(false);
                            }}
                        />
                    </div>

                    {/* Scrollable list */}
                    <div style={{ overflowY: "auto", flex: 1, padding: "0.25rem 0" }}>
                        {popularList.length > 0 && !search && (
                            <div>
                                <div style={{ padding: "0.4rem 0.85rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--teal-700, #0F766E)", background: "var(--teal-50, #F0FDFA)" }}>
                                    Popular Trade Lanes
                                </div>
                                {popularList.map((c) => (
                                    <CountryOption key={`pop-${c.code}`} country={c} isSelected={c.code === value} onSelect={handleSelect} />
                                ))}
                                <div style={{ height: "1px", background: "var(--border, #E3E8EF)", margin: "0.25rem 0" }} />
                            </div>
                        )}

                        {otherList.length > 0 && (
                            <div>
                                {!search && (
                                    <div style={{ padding: "0.4rem 0.85rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted, #64748B)" }}>
                                        All Countries (50+)
                                    </div>
                                )}
                                {otherList.map((c) => (
                                    <CountryOption key={`all-${c.code}`} country={c} isSelected={c.code === value} onSelect={handleSelect} />
                                ))}
                            </div>
                        )}

                        {filtered.length === 0 && (
                            <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted, #64748B)", fontSize: "0.9rem" }}>
                                No country matching &ldquo;{search}&rdquo;
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function CountryOption({ country, isSelected, onSelect }: { country: any; isSelected: boolean; onSelect: (code: string) => void }) {
    return (
        <div
            role="option"
            aria-selected={isSelected}
            onClick={() => onSelect(country.code)}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.5rem 0.85rem",
                cursor: "pointer",
                background: isSelected ? "var(--teal-50, #F0FDFA)" : "transparent",
                color: isSelected ? "var(--teal-800, #115E59)" : "var(--text, #0B1F3A)",
                fontSize: "0.9rem",
                transition: "background 0.1s ease",
            }}
            onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.background = "var(--bg, #F7F9FC)";
            }}
            onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.background = "transparent";
            }}
        >
            <span style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <CountryFlag code={country.code} size="md" />
                <span style={{ fontWeight: isSelected ? 600 : 400 }}>{country.name}</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted, #64748B)" }}>({country.code})</span>
            </span>
            {isSelected && <Check size={16} style={{ color: "var(--teal-700, #0F766E)" }} />}
        </div>
    );
}
