import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function checkDatabaseState() {
    console.log("📊 Analyzing `landed_costs` table state...\n");

    const { count: total } = await supabase.from('landed_costs').select('*', { count: 'exact', head: true });

    // Check how many have the new SEO content
    const { count: withSeo } = await supabase.from('landed_costs').select('id', { count: 'exact', head: true }).not("seo_h1", "is", null);

    // Check how many have Faqs
    const { count: withFaqs } = await supabase.from('landed_costs').select('id', { count: 'exact', head: true }).not("faqs_json", "is", null);

    // Check how many are missing HTS codes
    const { count: missingHts } = await supabase.from('landed_costs').select('id', { count: 'exact', head: true }).is("matched_hts_id", null);

    console.log(`Total Pages Managed: ${total}`);
    console.log(`Pages with base SEO (H1): ${withSeo}`);
    console.log(`Pages with FAQs_JSON:    ${withFaqs}`);
    console.log(`Pages missing HTS Codes: ${missingHts}`);
    console.log("\nIf Total != withFaqs, the factory may not have finished, or it hit an error. Let's find out.");

    // Sample of a page without FAQs
    if (withFaqs !== total) {
        const { data: sample } = await supabase.from('landed_costs').select('slug, created_at, seo_h1, faqs_json').is('faqs_json', null).limit(1).single();
        console.log("\nSample page missing FAQs:", sample);
    }
}

checkDatabaseState();
