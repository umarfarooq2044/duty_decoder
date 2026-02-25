import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function findAndResetRateLimitedRows() {
    console.log("🔍 Scanning for rate-limited or fallback content...");

    // Find rows where Llama-4-Maverick failed (needs_human_review = true)
    const { data: maverickFailed, error: err1 } = await supabase
        .from("landed_costs")
        .select("id, slug, product_description, origin_country, destination_country")
        .eq("needs_human_review", true);

    // Find rows where Llama-3.3-70b failed (this is harder to pinpoint, but usually means fallback H1 was used)
    // The fallback H1 typically starts with "Import duty on"
    const { data: writerFailed, error: err2 } = await supabase
        .from("landed_costs")
        .select("id, slug, product_description")
        .like("seo_h1", "Import duty on%");

    console.log(`\n📊 Found ${maverickFailed?.length || 0} rows where Research Agent (Maverick) failed/rate-limited.`);
    console.log(`📊 Found ${writerFailed?.length || 0} rows where Content Writer (70b) potentially failed.`);

    const toReset = [...(maverickFailed || [])];

    // Add writer failures that aren't already in the maverick list
    const maverickIds = new Set(toReset.map(r => r.id));
    if (writerFailed) {
        for (const row of writerFailed) {
            if (!maverickIds.has(row.id)) {
                toReset.push({ ...row, origin_country: '?', destination_country: '?' });
            }
        }
    }

    if (toReset.length === 0) {
        console.log("✅ No rate-limited rows found. You are good to go!");
        return;
    }

    console.log(`\n🧹 Nullifying SEO columns for ${toReset.length} rows so the Factory re-processes them...`);

    let count = 0;
    for (const row of toReset) {
        const { error } = await supabase
            .from("landed_costs")
            .update({
                seo_blueprint: null,
                seo_h1: null,
                seo_h2_intent: null,
                seo_h3_technical: null,
                semantic_h2_problem: null,
                semantic_h2_solution: null,
                faqs_json: null,
                needs_human_review: false
            })
            .eq("id", row.id);

        if (error) {
            console.error(`  ❌ Failed to reset ${row.slug}:`, error.message);
        } else {
            console.log(`  ✅ Requeued: ${row.slug}`);
            count++;
        }
    }

    console.log(`\n🎉 Successfully reset ${count} rows. They will be regenerated on the next Factory sweep!`);
}

findAndResetRateLimitedRows();
