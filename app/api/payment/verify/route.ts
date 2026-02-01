import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const getSupabase = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
};

// POST - Verify payment and add credits
export async function POST(req: NextRequest) {
    const supabase = getSupabase();
    if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = await req.json();

        // Verify signature
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            return NextResponse.json({ error: "Payment not configured" }, { status: 503 });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        // Get transaction
        const { data: transaction } = await supabase
            .from("transactions")
            .select("*")
            .eq("razorpay_order_id", razorpay_order_id)
            .single();

        if (!transaction) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        if (transaction.status === "completed") {
            return NextResponse.json({ error: "Already processed" }, { status: 400 });
        }

        // Update transaction
        await supabase
            .from("transactions")
            .update({
                razorpay_payment_id,
                status: "completed",
            })
            .eq("razorpay_order_id", razorpay_order_id);

        // Add credits to user
        const { data: credits } = await supabase
            .from("user_credits")
            .select("*")
            .eq("user_id", transaction.user_id)
            .single();

        if (credits) {
            await supabase
                .from("user_credits")
                .update({
                    paid_credits: credits.paid_credits + transaction.credits_purchased,
                })
                .eq("user_id", transaction.user_id);
        }

        return NextResponse.json({
            success: true,
            creditsAdded: transaction.credits_purchased
        });
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}
