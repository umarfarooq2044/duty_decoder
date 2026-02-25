import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function checkData() {
    const { data, error } = await supabase
        .from('landed_costs')
        .select('slug, seo_h1, semantic_h2_problem, faqs_json')
        .eq('slug', 'industrial-industrial-mixers-from-cn-to-sa')
        .single();

    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log("Database Data:");
        console.log("H1:", data.seo_h1?.substring(0, 50));
        console.log("Semantic H2:", data.semantic_h2_problem?.substring(0, 50));
        console.log("FAQs Count:", data.faqs_json?.length || 0);
    }
}

checkData();
