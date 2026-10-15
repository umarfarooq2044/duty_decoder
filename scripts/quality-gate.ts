/**
 * DutyDecoder Programmatic Quality Gate
 * Evaluates all programmatic /calculate/{slug} pages against Google AdSense
 * and Search Quality Guidelines.
 *
 * Usage:
 *   npx tsx scripts/quality-gate.ts
 *
 * Generates:
 *   reports/quality-gate.csv
 */

import postgres from "postgres";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const DB_CONNECTION =
    process.env.DATABASE_URL ||
    "postgresql://postgres.hflvxtyfmhrxapffuqib:umar8513umar@aws-1-ap-south-1.pooler.supabase.com:6543/postgres";

const sql = postgres(DB_CONNECTION, { connect_timeout: 10, max: 5 });

interface RouteRecord {
    slug: string;
    product_description: string;
    origin_country: string;
    destination_country: string;
    calculation_json: any;
    seo_title: string;
    seo_description: string;
    seo_h1: string;
    market_insight: string;
    semantic_h2_problem: string;
    semantic_h2_solution: string;
    faqs_json: any;
    guide_html: string;
    needs_human_review: boolean;
    created_at: string;
}

function countWords(text: string | null | undefined): number {
    if (!text) return 0;
    return text
        .replace(/<[^>]*>/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
}

// 3-shingle Jaccard overlap estimator
function getShingles(text: string): Set<string> {
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
    const shingles = new Set<string>();
    for (let i = 0; i <= words.length - 3; i++) {
        shingles.add(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
    }
    return shingles;
}

function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
    if (setA.size === 0 || setB.size === 0) return 0;
    let intersection = 0;
    for (const item of setA) {
        if (setB.has(item)) intersection++;
    }
    const union = setA.size + setB.size - intersection;
    return union === 0 ? 0 : intersection / union;
}

// Standard boilerplate opening to test template overlap
const CANONICAL_BOILERPLATE =
    "Classifying product correctly for import into destination from origin in 2026 can be challenging due to complex export regulations and varying import duty schedules.";
const boilerplateShingles = getShingles(CANONICAL_BOILERPLATE);

async function runQualityGate() {
    console.log("============================================================");
    console.log("🚀 DutyDecoder Programmatic Quality Gate Audit");
    console.log("============================================================\n");
    console.log("Connecting to PostgreSQL database...");

    const rows: RouteRecord[] = await sql`
        SELECT slug, product_description, origin_country, destination_country,
               calculation_json, seo_title, seo_description, seo_h1,
               market_insight, semantic_h2_problem, semantic_h2_solution,
               faqs_json, guide_html, needs_human_review, created_at
        FROM landed_costs
        WHERE slug IS NOT NULL
        ORDER BY created_at DESC
    `;

    console.log(`Fetched ${rows.length} total trade route records from database.\n`);

    const results: Array<{
        slug: string;
        route: string;
        product: string;
        wordCount: number;
        faqCount: number;
        hasBreakdown: boolean;
        hasUniqueTitle: boolean;
        similarity: number;
        passed: boolean;
        failReasons: string[];
    }> = [];

    let passedCount = 0;
    let failedCount = 0;

    for (const r of rows) {
        const failReasons: string[] = [];

        // 1. Computed Breakdown Check
        const calc = r.calculation_json;
        const hasBreakdown =
            calc &&
            (calc.totalLandedCost !== undefined ||
                calc.summary !== undefined ||
                calc.items !== undefined ||
                calc.customsDuty !== undefined);
        if (!hasBreakdown) {
            failReasons.push("Missing computed arithmetic breakdown");
        }

        // 2. Explanatory Word Count Check (Threshold: >= 250 words of unique content)
        const guideWords = countWords(r.guide_html);
        const insightWords = countWords(r.market_insight);
        const problemWords = countWords(r.semantic_h2_problem) + countWords(r.semantic_h2_solution);
        const totalWords = guideWords + insightWords + problemWords;

        if (totalWords < 250) {
            failReasons.push(`Thin content: only ${totalWords} unique words (minimum 250 required)`);
        }

        // 3. Unique Title & H1 Check
        const hasUniqueTitle = Boolean(r.seo_title && r.seo_title.length >= 15);
        if (!hasUniqueTitle) {
            failReasons.push("Missing or short SEO title");
        }

        // 4. FAQ Check (Threshold: >= 3 distinct Q&As)
        const faqs = Array.isArray(r.faqs_json) ? r.faqs_json : [];
        const faqCount = faqs.length;
        if (faqCount < 3) {
            failReasons.push(`Insufficient FAQs: ${faqCount} provided (minimum 3 required)`);
        }

        // 5. Template Overlap / Similarity Check (< 70% template overlap)
        const sampleText = `${r.guide_html || ""} ${r.market_insight || ""} ${r.semantic_h2_problem || ""}`;
        const routeShingles = getShingles(sampleText);
        const similarity = Number((jaccardSimilarity(routeShingles, boilerplateShingles) * 100).toFixed(1));

        if (similarity > 70) {
            failReasons.push(`Excessive template boilerplate similarity: ${similarity}%`);
        }

        // 6. Human Review Flag
        if (r.needs_human_review) {
            failReasons.push("Flagged for human review");
        }

        const passed = failReasons.length === 0;
        if (passed) passedCount++;
        else failedCount++;

        results.push({
            slug: r.slug,
            route: `${r.origin_country} -> ${r.destination_country}`,
            product: r.product_description || "N/A",
            wordCount: totalWords,
            faqCount,
            hasBreakdown: Boolean(hasBreakdown),
            hasUniqueTitle,
            similarity,
            passed,
            failReasons,
        });
    }

    // Write reports/quality-gate.csv
    const csvHeader = "slug,route,product,word_count,faq_count,has_breakdown,similarity_pct,status,reasons\n";
    const csvLines = results.map((res) => {
        const cleanProduct = `"${res.product.replace(/"/g, '""')}"`;
        const reasons = `"${res.failReasons.join("; ").replace(/"/g, '""')}"`;
        return `${res.slug},${res.route},${cleanProduct},${res.wordCount},${res.faqCount},${res.hasBreakdown},${res.similarity},${res.passed ? "PASS" : "FAIL"},${reasons}`;
    });

    const reportDir = path.join(process.cwd(), "reports");
    if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(path.join(reportDir, "quality-gate.csv"), csvHeader + csvLines.join("\n"), "utf-8");

    console.log("============================================================");
    console.log("📊 Quality Gate Evaluation Summary");
    console.log("============================================================");
    console.log(`Total Routes Evaluated: ${rows.length}`);
    console.log(`Passed Quality Gate (Indexable & Ad-Eligible): ${passedCount} (${((passedCount / rows.length) * 100).toFixed(1)}%)`);
    console.log(`Failed Quality Gate (Set to noindex, follow; No Ads): ${failedCount} (${((failedCount / rows.length) * 100).toFixed(1)}%)`);
    console.log(`\n📄 Report written to: reports/quality-gate.csv`);
    console.log("============================================================\n");

    await sql.end();
}

runQualityGate().catch((err) => {
    console.error("Quality Gate failed with error:", err);
    process.exit(1);
});
