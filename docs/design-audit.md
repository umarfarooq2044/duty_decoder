# DutyDecoder — Design & UI/UX Audit

> **Audit Date:** October 16, 2026  
> **Repository:** `umarfarooq2044/duty_decoder`  
> **Target Brief:** DutyDecoder Design System & UI/UX Brief v1.0

---

## 1. Existing Styles & Configuration Audit

### 1.1 Styling Architecture
- **Framework:** Pure CSS via `src/app/globals.css` (No Tailwind CSS configured; `tailwind.config.*` is not present in the repository).
- **CSS Variables in Use (`:root`):**
  - Backgrounds: `--color-bg-primary: #0a0b0f`, `--color-bg-secondary: #12141c`, `--color-bg-elevated: #1a1d2b`, `--color-bg-card: #1e2235`
  - Borders: `--color-border: #2a2e42`, `--color-border-hover: #3d4263`
  - Text: `--color-text-primary: #e8eaf0`, `--color-text-secondary: #8b8fa8`, `--color-text-muted: #5d6180`
  - Accent: `--color-accent: #6366f1` (Indigo/Purple), `--color-accent-hover: #818cf8`
  - Semantic: `--color-success: #22c55e`, `--color-warning: #f59e0b`, `--color-error: #ef4444`, `--color-info: #3b82f6`
- **Assessment against Brief:**
  - The current theme is deep dark mode with purple/indigo accents (`#6366f1`).
  - The brief mandates a **calm, authoritative financial-grade palette**:
    - Light crisp neutral background (`--bg: #F7F9FC`, `--surface: #FFFFFF`, `--border: #E3E8EF`)
    - Deep navy typography (`--navy-900: #0B1F3A`, `--navy-950: #06142B`)
    - Precise teal action accents (`--teal-700: #0F766E`, `--teal-800: #115E59`, `--teal-50: #F0FDFA`)
    - Restrained amber accent (`--amber-500: #F59E0B`)

### 1.2 Typography & Fonts
- **Current Setup (`src/app/layout.tsx`):**
  - `Inter` (weights: 400, 500, 600, 700) → `--font-inter`
  - `JetBrains_Mono` (weights: 400, 500) → `--font-jetbrains`
- **Assessment against Brief:**
  - The brief introduces **Manrope** for authoritative, confident headings (weights: 700, 800) with `-0.02em` tracking.
  - Body remains **Inter** (400, 500, 600).
  - Digits, HS codes, and tariff calculations use **JetBrains Mono** with `font-variant-numeric: tabular-nums`.

### 1.3 Key UX/UI Gaps Identified

1. **Flag Rendering (Windows Bug):**
   - Country links and menus in `MegaMenu.tsx`, `page.tsx`, `HSCodeFinderWidget.tsx`, etc., use raw Unicode emoji flags (`🇺🇸`, `🇬🇧`, `🇩🇪`).
   - On Windows (Chrome, Edge, Firefox), Unicode flags do not render as graphic flags; they render as two-letter country codes ("US", "GB"), breaking visual appeal and brand consistency.
2. **Origin & Destination Select Limit:**
   - In `CalculatorForm.tsx`, Origin only lists 25 countries and Destination lists 20 countries, while marketing and the database support 50+ countries.
   - Required marker `*` was previously embedded in options.
3. **Hero Layout & Above-the-Fold Usability:**
   - On mobile (375×667), marketing copy pushes the calculator form below the initial fold.
   - Calculator needs to be positioned side-by-side with hero copy on desktop and immediately accessible on mobile.
4. **Stale Timestamps & Unsourced Claims:**
   - "Last updated: Jul 18, 2026" displayed on Recent Calculations.
   - "99.2% Accuracy" stat lacked methodology verification link.
5. **Inconsistent Numbers:**
   - Mixed references to "5,000+ trade routes" vs "5,000+ calculations". Unified to single source of truth.

---

## 2. Migration Plan

1. **Tokens (`globals.css`):**
   - Inject verified design tokens from Section 3 of the Brief into `:root`.
   - Maintain backwards-compatible aliases so existing components continue to render without breakage while migrating.
2. **Typography (`src/app/layout.tsx`):**
   - Add `Manrope` (`--font-heading`) via `next/font/google`.
   - Keep `Inter` (`--font-body`) and `JetBrains_Mono` (`--font-mono`).
3. **Primitives:**
   - Create `src/components/ui/CountryFlag.tsx` with clean, vectorized SVG flags for all 50 countries.
   - Build a searchable, keyboard-navigable `CountryCombobox.tsx` covering all 50 countries with a "Popular" group.
4. **Calculator Form (`src/components/CalculatorForm.tsx`):**
   - Integrate `CountryCombobox` with SVG flags and a swap (⇄) button.
   - Add autosuggest chips ("ceramic tableware", "printed circuit boards", "wooden furniture").
   - Add trust microcopy ("Free · No signup · Uses official 2026 tariff data").
5. **Homepage (`src/app/page.tsx`):**
   - Side-by-side hero on desktop; mobile-first calculator.
   - Replace emoji flags with SVG flags.
   - Fix stale dates and link accuracy claims to Methodology.
6. **Header & Footer:**
   - Wordmark: `DutyDecoder<span className="text-teal-700">.</span>` in Manrope 800.
   - Mobile sheet navigation and footer accordions.
