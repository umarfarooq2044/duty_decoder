// ============================================================
// Master Country Registry — 50 Trading Nations
// ============================================================

export interface CountryEntry {
    code: string;       // ISO 3166-1 alpha-2
    name: string;       // Full display name
    slug: string;       // URL slug
    currency: string;   // ISO 4217 currency code
    vatLabel: string;   // "VAT" | "GST" | "Sales Tax" | "Consumption Tax"
    vatRate: number;     // Standard VAT/GST rate as percentage
    region: string;     // Geographic region for grouping
}

export const COUNTRIES: CountryEntry[] = [
    { code: "US", name: "United States", slug: "united-states", currency: "USD", vatLabel: "Sales Tax", vatRate: 0, region: "North America" },
    { code: "CN", name: "China", slug: "china", currency: "CNY", vatLabel: "VAT", vatRate: 13, region: "Asia" },
    { code: "DE", name: "Germany", slug: "germany", currency: "EUR", vatLabel: "VAT", vatRate: 19, region: "Europe" },
    { code: "GB", name: "United Kingdom", slug: "united-kingdom", currency: "GBP", vatLabel: "VAT", vatRate: 20, region: "Europe" },
    { code: "FR", name: "France", slug: "france", currency: "EUR", vatLabel: "VAT", vatRate: 20, region: "Europe" },
    { code: "JP", name: "Japan", slug: "japan", currency: "JPY", vatLabel: "Consumption Tax", vatRate: 10, region: "Asia" },
    { code: "NL", name: "Netherlands", slug: "netherlands", currency: "EUR", vatLabel: "VAT", vatRate: 21, region: "Europe" },
    { code: "IN", name: "India", slug: "india", currency: "INR", vatLabel: "GST", vatRate: 18, region: "Asia" },
    { code: "CA", name: "Canada", slug: "canada", currency: "CAD", vatLabel: "GST", vatRate: 5, region: "North America" },
    { code: "KR", name: "South Korea", slug: "south-korea", currency: "KRW", vatLabel: "VAT", vatRate: 10, region: "Asia" },
    { code: "IT", name: "Italy", slug: "italy", currency: "EUR", vatLabel: "VAT", vatRate: 22, region: "Europe" },
    { code: "SG", name: "Singapore", slug: "singapore", currency: "SGD", vatLabel: "GST", vatRate: 9, region: "Asia" },
    { code: "MX", name: "Mexico", slug: "mexico", currency: "MXN", vatLabel: "VAT", vatRate: 16, region: "North America" },
    { code: "HK", name: "Hong Kong", slug: "hong-kong", currency: "HKD", vatLabel: "None", vatRate: 0, region: "Asia" },
    { code: "IE", name: "Ireland", slug: "ireland", currency: "EUR", vatLabel: "VAT", vatRate: 23, region: "Europe" },
    { code: "BE", name: "Belgium", slug: "belgium", currency: "EUR", vatLabel: "VAT", vatRate: 21, region: "Europe" },
    { code: "CH", name: "Switzerland", slug: "switzerland", currency: "CHF", vatLabel: "VAT", vatRate: 8.1, region: "Europe" },
    { code: "ES", name: "Spain", slug: "spain", currency: "EUR", vatLabel: "VAT", vatRate: 21, region: "Europe" },
    { code: "PL", name: "Poland", slug: "poland", currency: "PLN", vatLabel: "VAT", vatRate: 23, region: "Europe" },
    { code: "AU", name: "Australia", slug: "australia", currency: "AUD", vatLabel: "GST", vatRate: 10, region: "Oceania" },
    { code: "TR", name: "Turkey", slug: "turkey", currency: "TRY", vatLabel: "VAT", vatRate: 20, region: "Europe" },
    { code: "RU", name: "Russia", slug: "russia", currency: "RUB", vatLabel: "VAT", vatRate: 20, region: "Europe" },
    { code: "BR", name: "Brazil", slug: "brazil", currency: "BRL", vatLabel: "ICMS", vatRate: 17, region: "South America" },
    { code: "VN", name: "Vietnam", slug: "vietnam", currency: "VND", vatLabel: "VAT", vatRate: 10, region: "Asia" },
    { code: "TH", name: "Thailand", slug: "thailand", currency: "THB", vatLabel: "VAT", vatRate: 7, region: "Asia" },
    { code: "SE", name: "Sweden", slug: "sweden", currency: "SEK", vatLabel: "VAT", vatRate: 25, region: "Europe" },
    { code: "AT", name: "Austria", slug: "austria", currency: "EUR", vatLabel: "VAT", vatRate: 20, region: "Europe" },
    { code: "MY", name: "Malaysia", slug: "malaysia", currency: "MYR", vatLabel: "SST", vatRate: 10, region: "Asia" },
    { code: "TW", name: "Taiwan", slug: "taiwan", currency: "TWD", vatLabel: "VAT", vatRate: 5, region: "Asia" },
    { code: "SA", name: "Saudi Arabia", slug: "saudi-arabia", currency: "SAR", vatLabel: "VAT", vatRate: 15, region: "Middle East" },
    { code: "DK", name: "Denmark", slug: "denmark", currency: "DKK", vatLabel: "VAT", vatRate: 25, region: "Europe" },
    { code: "ID", name: "Indonesia", slug: "indonesia", currency: "IDR", vatLabel: "VAT", vatRate: 11, region: "Asia" },
    { code: "AE", name: "United Arab Emirates", slug: "united-arab-emirates", currency: "AED", vatLabel: "VAT", vatRate: 5, region: "Middle East" },
    { code: "CZ", name: "Czech Republic", slug: "czech-republic", currency: "CZK", vatLabel: "VAT", vatRate: 21, region: "Europe" },
    { code: "HU", name: "Hungary", slug: "hungary", currency: "HUF", vatLabel: "VAT", vatRate: 27, region: "Europe" },
    { code: "NO", name: "Norway", slug: "norway", currency: "NOK", vatLabel: "VAT", vatRate: 25, region: "Europe" },
    { code: "RO", name: "Romania", slug: "romania", currency: "RON", vatLabel: "VAT", vatRate: 19, region: "Europe" },
    { code: "PH", name: "Philippines", slug: "philippines", currency: "PHP", vatLabel: "VAT", vatRate: 12, region: "Asia" },
    { code: "PT", name: "Portugal", slug: "portugal", currency: "EUR", vatLabel: "VAT", vatRate: 23, region: "Europe" },
    { code: "LU", name: "Luxembourg", slug: "luxembourg", currency: "EUR", vatLabel: "VAT", vatRate: 17, region: "Europe" },
    { code: "IL", name: "Israel", slug: "israel", currency: "ILS", vatLabel: "VAT", vatRate: 17, region: "Middle East" },
    { code: "FI", name: "Finland", slug: "finland", currency: "EUR", vatLabel: "VAT", vatRate: 25.5, region: "Europe" },
    { code: "ZA", name: "South Africa", slug: "south-africa", currency: "ZAR", vatLabel: "VAT", vatRate: 15, region: "Africa" },
    { code: "SK", name: "Slovakia", slug: "slovakia", currency: "EUR", vatLabel: "VAT", vatRate: 23, region: "Europe" },
    { code: "GR", name: "Greece", slug: "greece", currency: "EUR", vatLabel: "VAT", vatRate: 24, region: "Europe" },
    { code: "IR", name: "Iran", slug: "iran", currency: "IRR", vatLabel: "VAT", vatRate: 9, region: "Middle East" },
    { code: "CL", name: "Chile", slug: "chile", currency: "CLP", vatLabel: "VAT", vatRate: 19, region: "South America" },
    { code: "EG", name: "Egypt", slug: "egypt", currency: "EGP", vatLabel: "VAT", vatRate: 14, region: "Africa" },
    { code: "AR", name: "Argentina", slug: "argentina", currency: "ARS", vatLabel: "VAT", vatRate: 21, region: "South America" },
    { code: "UA", name: "Ukraine", slug: "ukraine", currency: "UAH", vatLabel: "VAT", vatRate: 20, region: "Europe" },
    { code: "PK", name: "Pakistan", slug: "pakistan", currency: "PKR", vatLabel: "Sales Tax", vatRate: 18, region: "South Asia" },
];

// Lookup helpers
export const COUNTRY_BY_CODE = Object.fromEntries(COUNTRIES.map(c => [c.code, c]));
export const COUNTRY_BY_SLUG = Object.fromEntries(COUNTRIES.map(c => [c.slug, c]));
export const ALL_COUNTRY_SLUGS = COUNTRIES.map(c => c.slug);
