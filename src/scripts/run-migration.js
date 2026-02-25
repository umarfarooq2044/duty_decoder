const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkColumns() {
    console.log("🔍 Checking all recent schema columns...");

    const groups = [
        {
            file: "008_seo_fields.sql",
            columns: ["seo_title", "seo_description", "market_insight"]
        },
        {
            file: "009_seo_longform.sql",
            columns: ["semantic_h2_problem", "semantic_h2_solution", "faqs_json"]
        },
        {
            file: "010_seo_blueprint.sql",
            columns: ["seo_blueprint", "seo_h1", "seo_h2_intent", "seo_h3_technical", "needs_human_review"]
        }
    ];

    const missingFiles = new Set();

    for (const group of groups) {
        console.log(`\n📄 Checking ${group.file}...`);
        for (const col of group.columns) {
            const { error } = await supabase.from("landed_costs").select(col).limit(0);
            if (error) {
                console.log(`  ❌ Missing: ${col}`);
                missingFiles.add(group.file);
            } else {
                console.log(`  ✅ Exists: ${col}`);
            }
        }
    }

    if (missingFiles.size > 0) {
        console.log("\n⚠️ Please run the following scripts in the Supabase Dashboard SQL Editor:");
        for (const file of missingFiles) {
            console.log(`   - schema/${file}`);
        }
    } else {
        console.log("\n🎉 All columns exist. PostgREST schema cache might just need a reload.");
    }
}

checkColumns();
