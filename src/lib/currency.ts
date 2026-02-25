import Decimal from "decimal.js";
import { z } from "zod";
import { ServerError } from "@/lib/errors";

// ============================================================
// Currency Conversion with decimal.js precision
// ============================================================

const ExchangeRateSchema = z.object({
    base: z.string(),
    rates: z.record(z.string(), z.number().positive()),
    timestamp: z.number(),
});

type ExchangeRates = z.infer<typeof ExchangeRateSchema>;

// In-memory cache with 24-hour TTL
let cachedRates: ExchangeRates | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetch exchange rates from a free API.
 * Uses ExchangeRate-API (free tier: 1500 req/month).
 * Falls back to cached rates on failure.
 */
async function fetchExchangeRates(): Promise<ExchangeRates> {
    const now = Date.now();

    // Return cached if fresh
    if (cachedRates && now - cacheTimestamp < CACHE_TTL_MS) {
        return cachedRates;
    }

    try {
        const response = await fetch(
            "https://api.exchangerate-api.com/v4/latest/USD",
            { next: { revalidate: 86400 } } // Next.js cache: 24 hours
        );

        if (!response.ok) {
            throw new Error(`Exchange rate API returned ${response.status}`);
        }

        const data: unknown = await response.json();

        // Validate response shape
        const validated = ExchangeRateSchema.parse({
            base: "USD",
            rates: (data as { rates: Record<string, number> }).rates,
            timestamp: now,
        });

        cachedRates = validated;
        cacheTimestamp = now;
        return validated;
    } catch (error) {
        // Fall back to cached rates if available
        if (cachedRates) {
            console.warn("[Currency] API failed, using cached rates:", error);
            return cachedRates;
        }
        throw new ServerError("Failed to fetch exchange rates and no cache available");
    }
}

/**
 * Convert amount between currencies using decimal.js precision.
 * @returns Converted amount as Decimal
 */
export async function convertCurrency(
    amount: Decimal,
    fromCurrency: string,
    toCurrency: string
): Promise<{ converted: Decimal; rate: Decimal }> {
    if (fromCurrency === toCurrency) {
        return { converted: amount, rate: new Decimal(1) };
    }

    const rates = await fetchExchangeRates();

    const fromRate = rates.rates[fromCurrency];
    const toRate = rates.rates[toCurrency];

    if (fromRate === undefined) {
        throw new ServerError(`Unsupported currency: ${fromCurrency}`);
    }
    if (toRate === undefined) {
        throw new ServerError(`Unsupported currency: ${toCurrency}`);
    }

    // Convert via USD base: amount / fromRate * toRate
    const usdAmount = amount.div(new Decimal(fromRate));
    const converted = usdAmount.mul(new Decimal(toRate));
    const rate = new Decimal(toRate).div(new Decimal(fromRate));

    return {
        converted: converted.toDecimalPlaces(2, Decimal.ROUND_HALF_UP),
        rate: rate.toDecimalPlaces(6, Decimal.ROUND_HALF_UP),
    };
}

/**
 * Get the current exchange rate between two currencies.
 */
export async function getExchangeRate(
    fromCurrency: string,
    toCurrency: string
): Promise<Decimal> {
    const { rate } = await convertCurrency(new Decimal(1), fromCurrency, toCurrency);
    return rate;
}

// Supported currencies for validation
export const SUPPORTED_CURRENCIES = [
    "USD", "GBP", "EUR", "PKR", "CNY", "JPY", "INR", "CAD", "AUD",
    "AED", "SGD", "HKD", "KRW", "TWD", "THB", "MYR", "VND", "BDT",
] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];
