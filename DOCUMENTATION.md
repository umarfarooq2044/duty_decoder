# Duty Decoder — Full Project Documentation

> **Last updated:** February 23, 2026  
> **Stack:** Next.js 15 (App Router + Turbopack) · Supabase (PostgreSQL + pgvector) · Groq AI (Llama-3.3/3.1) · TypeScript · Decimal.js · Zod  

---

## Table of Contents

1. [Project Overview](#1-project-overview)  
2. [Architecture](#2-architecture)  
3. [Environment Variables](#3-environment-variables)  
4. [Database Schema](#4-database-schema)  
5. [API Endpoints](#5-api-endpoints)  
6. [Core Libraries](#6-core-libraries)  
7. [Frontend Routes](#7-frontend-routes)  
8. [Components](#8-components)  
9. [Content Generation Scripts](#9-content-generation-scripts)  
10. [SEO Architecture](#10-seo-architecture)  
11. [Running the Project](#11-running-the-project)  

---

## 1. Project Overview

Duty Decoder is an AI-powered SaaS platform that calculates exact import duties, VAT/GST, and total landed costs for international trade. It uses:

- **AI HTS Classification**: Groq LLMs classify products into Harmonized System codes
- **Live Customs Matrices**: Supabase stores real tariff data for 50+ countries
- **Programmatic SEO**: 5,000+ dynamically generated pages targeting high-intent trade queries
- **Country Hub System**: 50 country-specific hubs with 8 support pages each (400 pages)
- **Global Pillar Pages**: 10 authoritative root-level topic pages

### Total Page Count

| Page Type | Count |
|---|---|
| Homepage | 1 |
| Country Hub Pages | 50 |
| Country Calculator Pages | 50 |
| Country Support Pages (8 per country) | 400 |
| Global Pillar Pages | 10 |
| HS Code Finder (AI Tool) | 1 |
| Methodology | 1 |
| Calculate/[slug] (Dynamic Routes) | ~5,000+ |
| Category/[id] Pages | Dynamic |
| **Total** | **~5,500+** |

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│  Next.js 15 App Router (Server Components + RSC)    │
│  ┌──────────┐ ┌──────────┐ ┌───────────────────┐   │
│  │ Homepage │ │ Country  │ │ Global Pillars    │   │
│  │          │ │ Hubs x50 │ │ (10 root pages)   │   │
│  └──────────┘ └──────────┘ └───────────────────┘   │
│  ┌──────────────┐ ┌─────────────────────────────┐   │
│  │ Calculator   │ │ HS Code Finder (AI Widget)  │   │
│  │ Forms (2)    │ │ HSCodeFinderWidget.tsx       │   │
│  └──────────────┘ └─────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│                   API LAYER                         │
│  /api/landed-cost/calculate  → Landed Cost Engine   │
│  /api/hts/search             → 3-Tier HS Lookup     │
│  /api/compliance/rules       → Compliance Rules     │
│  /api/search                 → Global Search        │
├─────────────────────────────────────────────────────┤
│                 CORE ENGINE                         │
│  lib/calculator/landed-cost.ts  → Duty Calculator   │
│  lib/calculator/de-minimis.ts   → Threshold Logic   │
│  lib/groq.ts                    → AI Classification │
│  lib/currency.ts                → FX Conversion     │
├─────────────────────────────────────────────────────┤
│              DATABASE (Supabase)                    │
│  hts_codes          → Tariff schedules + embeddings │
│  landed_costs       → 5,000+ calculation results    │
│  country_hubs       → 50 countries × 10 page types  │
│  global_pillars     → 10 authority pillar pages     │
│  compliance_rules   → De minimis, FTA rules         │
└─────────────────────────────────────────────────────┘
```

---

## 3. Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GROQ_API_KEY=your-groq-api-key
NEXT_PUBLIC_BASE_URL=https://duty-decoder.com
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `GROQ_API_KEY` | Groq API key for AI classification |
| `NEXT_PUBLIC_BASE_URL` | Canonical site URL for SEO |

---

## 4. Database Schema

All migrations are in `schema/` and must be run **in order** in the Supabase SQL Editor.

| File | Table/Action | Purpose |
|---|---|---|
| `001_extensions.sql` | Enable `pgvector`, `pg_trgm` | PostgreSQL extensions for vector search and fuzzy matching |
| `002_hts_codes.sql` | `hts_codes` | Core tariff schedule table with embedding vectors |
| `003_landed_costs.sql` | `landed_costs` | Stores every calculation result (the 5,000+ pSEO pages) |
| `004_compliance_rules.sql` | `compliance_rules` | De minimis thresholds, FTA rules, handling fees |
| `005_rls_policies.sql` | RLS policies | Row Level Security for all tables |
| `006_seed_data.sql` | Seed data | Initial HTS codes and compliance rules |
| `007_vector_search_rpc.sql` | `match_hts_codes()` | RPC function for pgvector similarity search |
| `008_seo_fields.sql` | ALTER `landed_costs` | Adds SEO columns (title, description, keywords) |
| `009_seo_longform.sql` | ALTER `landed_costs` | Adds longform content columns |
| `010_seo_blueprint.sql` | ALTER `landed_costs` | Adds FAQs, compliance insights JSONB columns |
| `011_country_hubs.sql` | `country_hubs` | 50-country hub system (hub_page + calculator_page JSONB) |
| `012_country_support_pages.sql` | ALTER `country_hubs` | 8 new JSONB columns for support pages |
| `013_fix_year_references.sql` | Data fix | Replaces "2024" → "2026" across all content |
| `014_global_pillars.sql` | `global_pillars` | 10 authority pillar pages table |

### Key Tables

**`hts_codes`** — Tariff schedule data with vector embeddings:
- `hts_code`, `description`, `duty_rate_pct`, `vat_rate_pct`
- `embedding` (vector) for semantic similarity search
- `search_vector` (tsvector) for full-text search

**`landed_costs`** — Every calculation becomes a permanent SEO page:
- `slug` (unique URL), `origin`, `dest`, `product`
- `duty_amount`, `vat_amount`, `total_landed_cost`
- `seo_title`, `seo_description`, `faqs_json`, `compliance_insights`

**`country_hubs`** — Hub + Calculator + 8 support pages per country:
- `country_slug`, `country_code`
- `hub_page` (JSONB), `calculator_page` (JSONB)
- `import_duty_page`, `import_tax_page`, `hs_code_page`, `threshold_page`, `clearance_page`, `restrictions_page`, `documents_page`, `shipping_fees_page`

**`global_pillars`** — Root authority pages:
- `slug` (PK), `title_tag`, `meta_description`, `h1`
- `sections` (JSONB), `faq` (JSONB), `internal_links` (JSONB)

---

## 5. API Endpoints

### `POST /api/landed-cost/calculate`
The core calculation engine. Accepts product details and returns a full landed cost breakdown.

**Request:**
```json
{
  "productDescription": "Men's leather jacket",
  "originCountry": "CN",
  "destinationCountry": "US",
  "productValue": 1000,
  "currency": "USD",
  "shippingCost": 50,
  "insuranceCost": 10,
  "quantity": 1
}
```

**Response:** Creates a permanent `/calculate/[slug]` page and redirects to it.

**Pipeline:**
1. AI classifies product → HTS code (via Groq)
2. Retrieves country-specific duty rates from `hts_codes`
3. Applies de minimis logic (including EU Jul 2026 transition & US Aug 2025 elimination)
4. Calculates CIF value, duty, VAT/GST, handling fees
5. Returns total landed cost + SEO-optimized result page

### `POST /api/hts/search`
3-tier HS code classification engine.

**Request:**
```json
{
  "description": "Bluetooth wireless earbuds",
  "countryCode": "US",
  "maxResults": 5
}
```

**Strategy Cascade:**
1. **Vector similarity** (pgvector embedding search via `match_hts_codes` RPC)
2. **Full-text search** (GIN index on `search_vector`)
3. **AI classification** (Groq LLM fallback)

### `GET /api/compliance/rules`
Returns compliance rules (de minimis thresholds, handling fees) for a given country.

### `POST /api/search`
Global site search across all content.

---

## 6. Core Libraries

### `src/lib/calculator/landed-cost.ts`
The **Landed Cost Engine** — a pure calculation module using Decimal.js for precision:
- Computes CIF value (product + shipping + insurance)
- Applies ad valorem, specific, or compound duty rates
- Calculates VAT/GST on (CIF + duty)
- Adds country-specific handling fees (Italy/Romania surcharges, US MPF)
- Returns itemized cost breakdown

### `src/lib/calculator/de-minimis.ts`
**De Minimis Threshold Checker** with 2026-specific logic:
- US: Full duty on everything since Aug 29, 2025
- EU: Pre/Post July 2026 transition (€3/item flat duty)
- Standard thresholds for 50+ countries

### `src/lib/groq.ts`
**AI Classification Module** — interfaces with Groq API:
- `generateEmbedding()` — Creates vector embeddings for semantic search
- `classifyProduct()` — AI-powered HTS code classification
- Uses DataLoader pattern for request batching

### `src/lib/countries.ts`
**Country Configuration** — defines all 50 supported countries:
- `code`, `name`, `slug`, `currency`, `vatRate`, `vatLabel`, `region`
- Exported as `COUNTRY_BY_SLUG`, `ALL_COUNTRY_SLUGS`, `ALL_COUNTRIES`

### `src/lib/currency.ts`
**FX Conversion** — handles multi-currency calculations with live rates.

### `src/lib/supabase/server.ts`
Server-side Supabase client factory using service role key.

### `src/schemas/` (Zod Validation)
- `hts.ts` — `HTSSearchRequestSchema`, `HTSSearchResultSchema`
- `landed-cost.ts` — `LandedCostRequestSchema`
- `compliance.ts` — `HandlingFeeRuleSchema`

---

## 7. Frontend Routes

### Static Pages

| Route | File | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Homepage with primary calculator and featured routes |
| `/methodology` | `app/methodology/page.tsx` | Data methodology explanation |

### Global Pillar Pages (10)

| Route | Slug | Target Keywords |
|---|---|---|
| `/import-duty` | `import-duty` | import duty, customs duty, tariff rates |
| `/customs-duty` | `customs-duty` | customs duty definition, duty calculation |
| `/import-tax` | `import-tax` | import tax, VAT on imports, GST |
| `/tariff-rates` | `tariff-rates` | tariff rates, tariff schedule |
| `/calculate` | `calculate` | landed cost calculator (+ paginated directory) |
| `/hs-code-lookup` | `hs-code-lookup` | HS code lookup, tariff code |
| `/import-documents` | `import-documents` | customs paperwork, documentation |
| `/import-restrictions` | `import-restrictions` | prohibited items, restricted imports |
| `/customs-clearance` | `customs-clearance` | customs clearance process |
| `/hs-code-finder` | — | AI-powered HS code classification tool |

### Dynamic Country Routes (50 × 10 = 500)

For each of the 50 countries (e.g., `/united-states`, `/india`, `/germany`):

| Route | Component | Purpose |
|---|---|---|
| `/{country}` | `[country-slug]/page.tsx` | Hub page (overview, stats, guides) |
| `/{country}/import-duty-calculator` | `import-duty-calculator/page.tsx` | Country calculator with pre-set destination |
| `/{country}/import-duty` | `CountrySupportPage` | Import duty guide |
| `/{country}/import-tax` | `CountrySupportPage` | VAT/GST guide |
| `/{country}/hs-code-lookup` | `CountrySupportPage` | HS code classification |
| `/{country}/duty-free-threshold` | `CountrySupportPage` | De minimis threshold |
| `/{country}/customs-clearance` | `CountrySupportPage` | Clearance process |
| `/{country}/import-restrictions` | `CountrySupportPage` | Restricted goods |
| `/{country}/import-documents` | `CountrySupportPage` | Required paperwork |
| `/{country}/shipping-customs-fees` | `CountrySupportPage` | Shipping & brokerage fees |

### Dynamic Calculation Pages (~5,000+)

| Route | Purpose |
|---|---|
| `/calculate/[slug]` | Individual landed cost result page (auto-generated on each calculation) |
| `/category/[id]` | Category-based trade route pages |

---

## 8. Components

### Server Components

| Component | File | Purpose |
|---|---|---|
| `GlobalPillarPage` | `GlobalPillarPage.tsx` | Shared layout for the 10 global pillar pages (content, sidebar, internal links) |
| `CountrySupportPage` | `CountrySupportPage.tsx` | Shared layout for the 400 country support pages |
| `DataIntegrityBadge` | `DataIntegrityBadge.tsx` | "Verified 2026 Data" trust badge |
| `Breadcrumbs` | `Breadcrumbs.tsx` | Dynamic breadcrumb navigation |
| `MegaMenu` | `MegaMenu.tsx` | Country & topic mega navigation menu |
| `TableOfContents` | `TableOfContents.tsx` | Sticky sidebar table of contents |

### Client Components

| Component | File | Purpose |
|---|---|---|
| `CalculatorForm` | `CalculatorForm.tsx` | Global calculator form (any origin → any destination) |
| `CountryCalculatorForm` | `calculator/CountryCalculatorForm.tsx` | Country-specific calculator (destination pre-set) |
| `SidebarCalculator` | `calculator/SidebarCalculator.tsx` | Compact calculator for sidebars |
| `HSCodeFinderWidget` | `HSCodeFinderWidget.tsx` | AI-powered HS code classification tool (product input → top 5 suggestions with confidence scores, hierarchy trees, duty info) |
| `PrintReportButton` | `calculator/PrintReportButton.tsx` | Print/PDF export button for results |

---

## 9. Content Generation Scripts

All scripts are in `src/scripts/` and run via `npx tsx src/scripts/<name>.ts`.

### Core Generation Pipeline

| Script | Purpose | AI Models Used |
|---|---|---|
| `generate-country-hubs.ts` | Generates hub_page + calculator_page for all 50 countries | Llama-3.1-8b + Llama-3.3-70b |
| `generate-country-support-pages.ts` | Generates 8 support pages × 50 countries (400 pages) | Llama-3.1-8b + Llama-3.3-70b |
| `generate-global-pillars.ts` | Generates 9 global pillar pages | Llama-3.1-8b + Llama-3.3-70b |
| `generate-featured-routes.ts` | Generates featured trade route calculations | Llama-3.3-70b |
| `generate-semantic-seo.ts` | Generates semantic SEO content for industry verticals | Llama-3.3-70b |
| `pSEO-factory.ts` | Mass-generates pSEO route pages with AI enrichment | Multi-model pipeline |
| `seed-seo-engine.ts` | Seeds SEO metadata for landed cost pages | Llama-3.3-70b |
| `expert-seo-update.ts` | Updates SEO content with expert-level insights | Llama-3.3-70b |

### Utility Scripts

| Script | Purpose |
|---|---|
| `run-migration.js` | Runs SQL migrations against Supabase |
| `check-data.ts` | Verifies database content integrity |
| `cleanup-legacy.ts` | Removes deprecated data |
| `debug-pages.ts` | Debugs page rendering issues |
| `requeue-rate-limits.ts` | Re-queues failed Groq API calls |
| `test-db-auth.js` | Tests Supabase authentication |
| `test-inference-chain.ts` | Tests the AI inference pipeline |
| `verify-featured-seo.ts` | Verifies featured route SEO quality |

---

## 10. SEO Architecture

### Content Hierarchy

```
Homepage (/)
├── Global Pillars (10 pages)
│   ├── /import-duty
│   ├── /customs-duty
│   ├── /import-tax
│   ├── /tariff-rates
│   ├── /calculate (paginated directory + calculator)
│   ├── /hs-code-lookup
│   ├── /import-documents
│   ├── /import-restrictions
│   └── /customs-clearance
├── HS Code Finder (/hs-code-finder — AI tool page)
├── Country Hubs (50 countries)
│   ├── /{country}/ (Hub Page)
│   ├── /{country}/import-duty-calculator
│   └── /{country}/{8 support pages}
└── Calculate Routes (~5,000+ pages)
    └── /calculate/{slug}
```

### JSON-LD Structured Data

Every page automatically injects relevant JSON-LD:
- `BreadcrumbList` — on all pages
- `FAQPage` — on pages with FAQ sections
- `SoftwareApplication` — on calculator and tool pages
- `Article` — on pillar and guide pages

### Sitemap

`src/app/sitemap.ts` dynamically generates paginated XML sitemaps:
- Static routes + 10 global pillars at priority 0.9
- 50 country hubs + 50 calculators at priority 0.9
- 400 country support pages at priority 0.6
- ~5,000+ calculation routes paginated into 1,000-URL chunks

### Internal Linking Matrix

- Every **global pillar** links to → Calculator, HS Code Lookup, Import Documents, Top 5 Country Hubs
- Every **country hub** links to → Country Calculator, 8 Support Pages
- Every **country calculator** links to → Hub Page, 8 Support Pages
- Every **support page** links to → Calculator CTA, Related Guides
- **`/calculate`** links to → All 5,000+ route pages (paginated)

---

## 11. Running the Project

### Prerequisites
- Node.js 18+
- npm
- Supabase project with pgvector extension

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GROQ_API_KEY

# Run database migrations (in Supabase SQL Editor, in order)
# schema/001_extensions.sql through schema/014_global_pillars.sql

# Start development server
npm run dev
```

### Content Generation (One-Time)

```bash
# 1. Generate 50 country hub pages
npx tsx src/scripts/generate-country-hubs.ts

# 2. Generate 400 country support pages (8 per country)
npx tsx src/scripts/generate-country-support-pages.ts

# 3. Generate 9 global pillar pages
npx tsx src/scripts/generate-global-pillars.ts

# 4. Generate featured trade routes
npx tsx src/scripts/generate-featured-routes.ts

# 5. Mass-generate pSEO calculation routes
npx tsx src/scripts/pSEO-factory.ts
```

### Verification

```bash
# TypeScript type check
npx tsc --noEmit

# Development server
npm run dev

# Production build
npm run build
```

### Key URLs for Testing

| URL | What To Verify |
|---|---|
| `http://localhost:3000` | Homepage + calculator + featured routes |
| `http://localhost:3000/united-states` | Country hub page |
| `http://localhost:3000/india/import-duty-calculator` | Country calculator |
| `http://localhost:3000/germany/customs-clearance` | Country support page |
| `http://localhost:3000/import-duty` | Global pillar page |
| `http://localhost:3000/calculate` | Paginated calculator directory |
| `http://localhost:3000/hs-code-finder` | AI HS Code Finder tool |
| `http://localhost:3000/sitemap/0.xml` | XML Sitemap (first chunk) |

---

## 50 Supported Countries

United States, China, Germany, Japan, France, United Kingdom, India, Canada, Netherlands, South Korea, Italy, Singapore, Mexico, Hong Kong, Ireland, Belgium, Switzerland, Spain, Poland, Turkey, Australia, Russia, Brazil, Vietnam, Thailand, Sweden, Austria, Malaysia, Saudi Arabia, Taiwan, Denmark, Indonesia, UAE, Czech Republic, Hungary, Norway, Romania, Philippines, Portugal, Luxembourg, Israel, Finland, South Africa, Slovakia, Greece, Iran, Chile, Egypt, Argentina, Ukraine.
