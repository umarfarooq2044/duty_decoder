# Google AdSense Readiness Audit — dutydecoder.com
**Date:** October 16, 2026  
**Auditor:** Senior Full-Stack Engineer, Technical SEO & Google Publisher Policy Specialist  
**Target:** https://dutydecoder.com  
**Reference Document:** `docs/ADSENSE_PROMPT.md` / `DUTYDECODER_DESIGN_BRIEF.md`

---

## Executive Summary

DutyDecoder is a high-utility international trade platform providing import duty calculations, AI HS code classification, and total landed cost forecasting for 50+ countries. The core calculation engine, financial UI/UX, and technical foundation are exceptionally strong.

However, from a **Google AdSense approval and publisher policy** standpoint, the site currently has **critical rejection risks** that must be resolved prior to application:

| Risk Area | Current State | AdSense Severity | Policy Citation |
|---|---|---|---|
| **Programmatic Page Scaled Abuse** | 11,781 `/calculate/{slug}` pages in sitemap; 60% of sampled pages contain thin, templated text (<250 words) with near-identical phrasing | 🔴 **CRITICAL (Rejection Blocker #1)** | *Google Publisher Policies: Thin content with little or no added value / Scaled content abuse* |
| **Sitemap 500 Server Error** | `https://dutydecoder.com/sitemap.xml` throws `HTTP 500` due to a Next.js file conflict between `public/sitemap.xml` and `src/app/sitemap.ts` | 🔴 **CRITICAL (Rejection Blocker #2)** | *AdSense Site Down or Unavailable / Crawl Error* |
| **Privacy Policy Deficiencies** | Privacy page is thin (73 lines), lacks mandatory third-party advertising disclosures, Google cookie notices, opt-out mechanisms, GDPR/CCPA disclosures, and Consent Mode v2 | 🔴 **CRITICAL (Rejection Blocker #3)** | *AdSense Program Policies: Required Privacy Disclosures & Third-Party Cookies* |
| **Missing Consent Management (CMP)** | Zero cookie banner or Consent Management Platform; no IAB TCF v2.2 integration or Google Consent Mode v2 | 🔴 **CRITICAL** | *Google EU User Consent Policy & Certified CMP Requirement (EEA/UK/CH)* |
| **Missing ads.txt** | `public/ads.txt` is missing from the repository root | 🟡 **HIGH** | *IAB Tech Lab Ads.txt Specification* |
| **Contact & Identity Transparency** | Contact page lacks an interactive form; About page lacks verified publisher/entity attribution (`TODO_OWNER`) and transparent revenue disclosure | 🟡 **HIGH** | *Google Search Essentials: E-E-A-T & Site Transparency* |
| **Unsubstantiated Metrics** | Site claims "99.2% Accuracy", inconsistent "5,000+" metrics, and "Trusted by importers..." without empirical proof | 🟡 **MEDIUM** | *Google Misrepresentation & Deceptive Claims Policy* |
| **Crawler Directive Gaps** | `robots.ts` blocks several user agents but does not explicitly whitelist `Mediapartners-Google` (AdSense review bot) | 🟡 **MEDIUM** | *AdSense Crawler Guidelines* |

---

## 1. Stack, Routing & Architecture Audit

### 1.1 Technical Stack
- **Framework:** Next.js 15.1.0 with React 19 and Turbopack.
- **Runtime:** Node.js v22 LTS on macOS / Vercel Edge & Serverless hosting.
- **Styling:** Bespoke Financial Design System (Pure CSS with custom design tokens in `src/app/globals.css`). Zero external CSS frameworks (no Tailwind overhead).
- **Typography:** Self-hosted Google Fonts (`Manrope`, `Inter`, `JetBrains Mono`) via `next/font/google`.
- **Database & Storage:** Supabase PostgreSQL instance (`aws-1-ap-south-1.pooler.supabase.com:6543/postgres`, Project ref: `hflvxtyfmhrxapffuqib`).
- **AI Inference Engine:** Groq SDK (`groq-sdk`) leveraging Llama 3.1 8B / 3.3 70B models for multi-layer HS classification.
- **Arithmetic Engine:** `Decimal.js` arbitrary-precision arithmetic avoiding floating-point rounding errors on duty, VAT, and fees.

### 1.2 Routing & Rendering Modes
- **Static Site Generation (SSG):** Global Pillar Guides (`/import-duty/`, `/incoterms/`, etc.) and Country Hubs (`revalidate = 86400`).
- **Server-Side Rendering (SSR) with SWR Caching:** `/calculate/[slug]/` via `getCachedLandedCostBySlug` (`unstable_cache` with 300s TTL).
- **Client Components (Interactive Islands):** Isolated to interactive calculator forms (`CalculatorForm.tsx`, `CountryCalculatorForm.tsx`, `HSCodeFinderWidget.tsx`, `PrintReportButton.tsx`).

### 1.3 How `/calculate/...` Routes are Generated & Stored
- The database contains **13,189 records** in the `landed_costs` table.
- Records were populated through `src/scripts/pSEO-factory.ts` across a 200-product matrix spanning Medical, Industrial, Energy, Electronics, Textiles, Food, and Automotive sectors across 50 trading nations.
- Each database row contains:
  - `slug`: e.g. `medical-patient-monitors-from-pk-to-au`
  - `calculation_json`: Pre-computed landed cost breakdown with FOB/CIF values, ad valorem/specific rates, VAT/GST, and handling fees.
  - `seo_title`, `seo_description`, `seo_h1`, `seo_blueprint`
  - `market_insight`, `semantic_h2_problem`, `semantic_h2_solution`
  - `faqs_json`: Array of questions and answers.
  - `guide_html`: Rich editorial guide text (present on a subset of routes).
  - `needs_human_review`: Boolean flag.

---

## 2. Inventory Breakdown & Indexable URL Counts

| Template Type | Route Pattern | Total in Database / App | In `public/sitemap.xml` | Status / Assessment |
|---|---|---|---|---|
| **Homepage** | `/` | 1 | 1 | Complete, compliant |
| **Tool Hubs** | `/calculate/`, `/hs-code-finder/` | 2 | 2 | Complete, compliant |
| **Country Hubs** | `/{country-slug}/` | 50 | 50 | 50 countries, rich editorial content |
| **Country Calculators** | `/{country-slug}/import-duty-calculator/` | 50 | 50 | Pre-set destination calculators |
| **Country Support Pages** | `/{country-slug}/{support-slug}/` | 400 | 400 | 8 support topics × 50 countries |
| **Global Pillar Guides** | `/import-duty/`, `/customs-duty/`, etc. | 13 | 13 | High E-E-A-T guides |
| **Category Hubs** | `/category/{id}/` | 8 | 8 | Industry vertical category directories |
| **Legal & Trust Pages** | `/about/`, `/contact/`, `/privacy/`, `/terms/`, `/disclaimer/`, `/methodology/` | 6 | 6 | Operational, needs policy upgrades |
| **Missing Trust Pages** | `/data-sources/`, `/editorial-policy/` | 0 | 0 | **Must be created** |
| **Programmatic Routes** | `/calculate/{slug}/` | **13,189** | **11,781** | **60% thin; requires Quality Gate** |
| **TOTAL** | | **13,719** | **12,311** | |

---

## 3. Deep Audit of Sample Programmatic Pages (40 Routes)

A randomized audit was conducted directly against 40 live database records from `landed_costs`.

### Summary Statistics
- **Sample Size:** 40 random routes
- **Average Unique Words:** 489.6 words
- **Routes with Rich `guide_html` (≥ 750 words):** 16 / 40 (40.0%)
- **Routes with Thin Templated Snippets (< 250 words):** 24 / 40 (60.0%)
- **Routes with Structured FAQs (3–5 questions):** 27 / 40 (67.5%)
- **Routes with Zero FAQs:** 13 / 40 (32.5%)
- **Routes Flagged `needs_human_review = true` in DB:** 0 / 40 (0.0%)

### Representative Route Comparison

| Route Slug | Product | Word Count | FAQs | Editorial Guide | Shingle Overlap / Risk |
|---|---|---|---|---|---|
| `graphics-card-from-cn-to-de` | Graphics Card | 1,310 words | 5 | Yes | Low risk (Comprehensive, original guide) |
| `medical-blood-pressure-monitors-from-tr-to-sa` | Blood Pressure Monitors | 1,223 words | 5 | Yes | Low risk (Detailed regulatory guide) |
| `medical-endoscopic-cameras-from-vn-to-sg` | Endoscopic Cameras | 789 words | 5 | Yes | Low risk (Customs breakdown + FAQs) |
| `medical-patient-monitors-from-pk-to-au` | Patient Monitors | 231 words | 5 | No | **High risk (Cookie-cutter template opening)** |
| `industrial-welding-robots-from-in-to-de` | Welding Robots | 226 words | 5 | No | **High risk (Identical syntax with swapped keywords)** |
| `import-mri-components-from-in-to-us` | MRI Components | 172 words | 0 | No | **Critical risk (Thin content, zero FAQs)** |
| `import-packaging-machines-from-ae-to-au` | Packaging Machines | 148 words | 0 | No | **Critical risk (Thin content, zero FAQs)** |
| `medical-hearing-aids-from-ae-to-pk` | Hearing Aids | 50 words | 2 | No | **Critical risk (50 words total)** |

### Identified Template Duplication Patterns
Thin pages exhibit cookie-cutter phrasing:
- *Template A:* `"Classifying {product} correctly for import into {dest} from {origin} in 2026 can be challenging due to complex {product} export regulations in {origin} and varying {dest} import duty..."`
- *Template B:* `"Importing {product} into {dest} requires careful attention to customs duty schedules..."`

**AdSense Impact:** If Google's review crawler indexes 12,000+ pages and encounters a majority of pages with <200 words and templated sentences, the site is virtually guaranteed rejection under *"Valuable inventory: No content / Templated pages"*.

---

## 4. Existing Pages Status Audit

### 4.1 About (`/about/`)
- **Status:** Live (`src/app/about/page.tsx`).
- **Deficiencies:**
  - Lacks concrete publisher / business operator entity name (`TODO_OWNER`).
  - Lacks monetization transparency disclosure required by AdSense guidelines: *"DutyDecoder is free; we display advertising (Google AdSense) to cover server and data licensing costs."*
  - Contains outdated dark-mode styling (`rgba(30, 34, 53, 0.5)`) and raw emojis in cards (`🌍`, `🏛️`, `🤖`, `📊`, `📝`, `📋`).

### 4.2 Contact (`/contact/`)
- **Status:** Live (`src/app/contact/page.tsx`).
- **Deficiencies:**
  - Has email links (`contact@dutydecoder.com`) but **no interactive contact form**.
  - Lacks physical business address or registered location (`TODO_OWNER`).
  - Lacks honeypot / Turnstile spam protection.

### 4.3 Privacy Policy (`/privacy/`)
- **Status:** Live (`src/app/privacy/page.tsx`).
- **Deficiencies (Critical AdSense Blocker):**
  - Only 73 lines of text.
  - Contains factually incorrect statement: *"We do not use tracking cookies or sell data to advertisers."*
  - Missing mandatory Google third-party cookie disclosures: Google uses cookies to serve ads based on visits to this and other websites; users may opt out via Google Ads Settings and `aboutads.info`.
  - Missing link to *"How Google uses information from sites or apps that use our services"*.
  - Missing GDPR/UK-GDPR data controller info, legal bases, and statutory rights.
  - Missing CCPA/CPRA Do Not Sell or Share provisions.
  - Missing COPPA / children's privacy statement.
  - Missing explicit list of active tracking vendors (Google Analytics 4 `G-G74QF4WDSL`).

### 4.4 Terms of Service (`/terms/`) & Disclaimer (`/disclaimer/`)
- **Status:** Live.
- **Strengths:** Explicit disclaimer that estimates are for informational purposes only; highlights CIF vs FOB valuation nuances.
- **Deficiencies:** Terms lacks governing law jurisdiction and formal dispute resolution clause (`TODO_OWNER`).

### 4.5 Methodology (`/methodology/`)
- **Status:** Live.
- **Strengths:** Excellent documentation of USITC HTS, EU TARIC, HMRC, and WCO GRI 1–6 principles.
- **Deficiencies:** Missing companion page `/data-sources/` detailing official refresh cadences and user correction submission workflow.

### 4.6 Missing Essential Trust Pages
- `/data-sources/`: Does not exist.
- `/editorial-policy/`: Does not exist.
- `/sitemap/`: HTML human-readable sitemap does not exist.

### 4.7 404 Error Page (`src/app/not-found.tsx`)
- **Status:** Excellent.
- **Verification:** Returns genuine `404 Not Found` HTTP status; styled with financial theme; includes search and navigation links to core calculators; completely ad-free.

---

## 5. Technical SEO, Crawlability & Health

### 5.1 Sitemap.xml Crash (Critical Bug)
- **Error:** When navigating to `https://dutydecoder.com/sitemap.xml`, the server returns `HTTP 500 Internal Server Error`.
- **Root Cause:** Next.js throws `Error: A conflicting public file and page file was found for path /sitemap.xml` because both `public/sitemap.xml` (a 2.5 MB static file with 12,303 URLs) and `src/app/sitemap.ts` exist simultaneously.
- **Resolution Plan:** Remove static `public/sitemap.xml`. Implement Next.js XML Sitemap Index referencing specialized sitemap subsets (`sitemap-pages.xml`, `sitemap-guides.xml`, `sitemap-countries.xml`, `sitemap-routes.xml`).

### 5.2 Robots.txt (`src/app/robots.ts`)
- **Status:** Live.
- **Deficiencies:** Does not explicitly declare `Mediapartners-Google` crawler permissions.

### 5.3 Ads.txt
- **Status:** Missing (`public/ads.txt` does not exist).
- **Resolution Plan:** Create `public/ads.txt` with publisher verification line:
  `google.com, pub-6219371790903754, DIRECT, f08c47fec0942fa0`

### 5.4 Canonical Host & HTTPS
- Canonical host: `https://dutydecoder.com` (non-www).
- HSTS & CSP: Enforced via HTTP headers in `next.config.ts`.
- Mixed content: 0 instances of insecure HTTP assets found.

---

## 6. Performance & Core Web Vitals Benchmark

Response times measured locally on Node v22 LTS:

| Route | Response Time | HTTP Status | Payload Size |
|---|---|---|---|
| Homepage (`/`) | 0.50s | 200 OK | 432 KB |
| US Import Duty Calculator (`/united-states/import-duty-calculator/`) | 0.17s | 200 OK | 227 KB |
| Global Landed Cost Calculator (`/calculate/`) | 0.15s | 200 OK | 293 KB |
| Incoterms Guide (`/incoterms/`) | 0.39s | 200 OK | 229 KB |

- Zero layout shifts (CLS < 0.05) due to fixed aspect-ratio containers.
- Self-hosted Google Fonts via `next/font` prevent render-blocking webfont waterfalls.

---

## 7. Substantiation of Claims Audit

| Current Claim | Location | Audit Finding | Required Remediation |
|---|---|---|---|
| **"99.2% Accuracy"** | `src/app/hs-code-finder/page.tsx:223`, `src/app/calculate/page.tsx:333` | Fabricated / unverified percentage claim | **Remove claim**. Replace with verifiable factual statement: *"Verified against official 2026 tariff schedules"*. |
| **"5,000+ Trade Routes" vs "5,000+ Estimates Generated"** | `src/app/page.tsx:43, 105, 498` | Inconsistent site-wide metrics | Standardize to single constant in `src/lib/constants/trade.ts` (e.g. `13,000+ Trade Scenarios`). |
| **"Trusted by importers, ecommerce brands..."** | `src/app/page.tsx:216` | Unsubstantiated social proof | Soften to: *"Engineered for importers, ecommerce brands, freight forwarders, and trade compliance teams."* |
| **"Verified 2026 Trade Data"** | Homepage hero badge | True for tariff tables; needs date citation | Link directly to `/methodology/` with explicit data refresh timestamps. |

---

## 8. Prioritized Remediation Roadmap (Phases 1–10)

1. **Phase 1: Technical Eligibility & Health:**
   - Resolve sitemap 500 error; create sitemap index.
   - Update `robots.ts` to explicitly allow `Mediapartners-Google`.
   - Add non-www redirect enforcement and canonical hygiene.
2. **Phase 2: Trust, Identity & Required Pages:**
   - Upgrade About page with publisher details and monetization disclosure.
   - Build working Contact form with honeypot spam protection.
   - Overhaul Privacy Policy to fully meet Google AdSense, GDPR, CCPA requirements.
   - Create `/editorial-policy/` and `/data-sources/`.
3. **Phase 3: Programmatic Quality Gate (Critical):**
   - Create `scripts/quality-gate.ts` to score all 13,189 routes.
   - Curate top 150–300 passing routes (`index, follow`).
   - Automatically set all thin/unreviewed routes to `noindex, follow` and exclude from sitemaps.
4. **Phase 4: Policy & Claims Review:**
   - Remove "99.2% Accuracy"; harmonize metrics via central constants file.
   - Audit sensitive commodities (military, hazardous goods) and add `noAds` / `noindex` guards.
5. **Phase 5: Navigation & IA:**
   - Add `/sitemap/` HTML sitemap.
   - Ensure breadcrumbs and structured data match perfectly.
6. **Phase 6: Consent & Privacy Compliance:**
   - Implement cookie consent banner with Google Consent Mode v2 default `denied`.
   - Add persistent "Privacy Settings" trigger in footer.
7. **Phase 7: AdSense Architecture (Flagged OFF):**
   - Clean up `<script>` tag in layout; add `<meta name="google-adsense-account">`.
   - Publish `public/ads.txt`.
   - Create `<AdSlot />` component with `ADS_ENABLED=false` feature flag.
8. **Phase 8: Structured Data & Schema Hygiene:**
   - Rich results validation with 0 errors.
9. **Phase 9: Build & Deployment Stability:**
   - Verify 100% clean production build (`npm run build`).
10. **Phase 10: Final Readiness Report & Owner Action Checklist.**
