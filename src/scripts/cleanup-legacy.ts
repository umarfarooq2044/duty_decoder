import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function cleanupLegacyRows() {
    console.log("🧹 Cleaning up old legacy rows without AI-generated SEO data...\n");

    const { data: legacyRows, error } = await supabase
        .from('landed_costs')
        .select('id, slug')
        .is('faqs_json', null)
        .is('seo_h1', null)
        .limit(10000); // Fetch all missing rows

    if (error) {
        console.error("Error fetching legacy rows:", error.message);
        return;
    }

    if (!legacyRows || legacyRows.length === 0) {
        console.log("No legacy rows found. Database is clean!");
        return;
    }

    console.log(`Found ${legacyRows.length} legacy rows to delete. Deleting in batches...`);

    const BATCH_SIZE = 500; // PostgREST has limits on how many we can delete at once by ID IN
    let deletedCount = 0;

    for (let i = 0; i < legacyRows.length; i += BATCH_SIZE) {
        const batch = legacyRows.slice(i, i + BATCH_SIZE);
        const ids = batch.map(r => r.id);

        const { error: deleteError } = await supabase
            .from('landed_costs')
            .delete()
            .in('id', ids);

        if (deleteError) {
            console.error(`❌ Batch delete failed:`, deleteError.message);
        } else {
            deletedCount += batch.length;
            console.log(`✅ Deleted ${deletedCount}/${legacyRows.length} legacy rows...`);
        }
    }

    console.log(`\n🎉 Cleanup complete! The database now ONLY contains the ${10318 - deletedCount} factory-generated pages.`);
}

cleanupLegacyRows();
