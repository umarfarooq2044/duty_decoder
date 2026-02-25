import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors";
import { getCachedComplianceRules } from "@/lib/cache";
import { DeMinimisRuleSchema } from "@/schemas/compliance";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const countryCode = searchParams.get("country");

        if (!countryCode || countryCode.length !== 2) {
            return NextResponse.json(
                { error: { code: "VALIDATION_ERROR", message: "Query param 'country' is required (2-letter code)" } },
                { status: 400 }
            );
        }

        const country = countryCode.toUpperCase();

        // Fetch all active rules for this country
        const rules = await getCachedComplianceRules(country);

        // Extract de minimis rule
        const deMinimisRules = rules.filter((r) => (r.rule_type as string) === "de_minimis");
        const today = new Date().toISOString().split("T")[0] as string;

        const activeDeMinimis = deMinimisRules.find((r) => {
            const from = r.effective_from as string;
            const to = r.effective_to as string | null;
            return from <= today && (to === null || to >= today);
        });

        let parsedDeMinimis = null;
        if (activeDeMinimis) {
            const parsed = DeMinimisRuleSchema.safeParse(activeDeMinimis.rule_value);
            if (parsed.success) {
                parsedDeMinimis = parsed.data;
            }
        }

        // Extract disclaimer
        const disclaimerRule = rules.find((r) => (r.rule_type as string) === "disclaimer");
        const disclaimer = disclaimerRule
            ? ((disclaimerRule.rule_value as { text?: string })?.text ?? null)
            : null;

        return NextResponse.json({
            countryCode: country,
            rules: rules.map((r) => ({
                id: r.id,
                ruleType: r.rule_type,
                ruleKey: r.rule_key,
                ruleValue: r.rule_value,
                description: r.description,
                version: r.version,
                effectiveFrom: r.effective_from,
                effectiveTo: r.effective_to,
            })),
            deMinimis: parsedDeMinimis,
            disclaimer,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return handleApiError(error);
    }
}
