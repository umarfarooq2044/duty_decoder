import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Please provide a valid email address"),
    category: z.enum(["general", "data_correction", "partnership", "privacy", "bug_report"]),
    subject: z.string().min(3, "Subject is required").max(150),
    message: z.string().min(10, "Message must be at least 10 characters").max(3000),
    website_hp: z.string().optional(), // Honeypot field for bot suppression
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 1. Silent rejection for bots filling the honeypot
        if (body.website_hp && body.website_hp.trim().length > 0) {
            console.warn("[Contact API] Bot honeypot triggered");
            return NextResponse.json({ success: true, message: "Message received." });
        }

        // 2. Validate input
        const parsed = contactSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, errors: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const data = parsed.data;

        // 3. Log inquiry for monitoring / webhook / notification
        console.log(`[Contact API] Inquiry from: ${data.name} <${data.email}> [${data.category}]: ${data.subject}`);

        return NextResponse.json({
            success: true,
            message: "Thank you for contacting DutyDecoder. Our team will review your message and reply within 1–2 business days.",
        });
    } catch (err) {
        console.error("[Contact API] Error processing message:", err);
        return NextResponse.json(
            { success: false, message: "An unexpected error occurred. Please email us directly at contact@dutydecoder.com." },
            { status: 500 }
        );
    }
}
