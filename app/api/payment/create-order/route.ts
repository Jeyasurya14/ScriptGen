import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import Razorpay from "razorpay";

const getSupabase = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
};

const getRazorpay = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) return null;
    return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

// POST - Create a Razorpay order
export async function POST(req: NextRequest) {
    const supabase = getSupabase();
    const razorpay = getRazorpay();

    if (!supabase || !razorpay) {
        return NextResponse.json({ error: "Payment not configured" }, { status: 503 });
    }

    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { credits = 1 } = await req.json();
        const amount = credits * 9 * 100; // ₹9 per credit, amount in paise

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                email: session.user.email,
                credits: credits.toString(),
            },
        });

        // Get user
        const { data: user } = await supabase
            .from("users")
            .select("id")
            .eq("email", session.user.email)
            .single();

        // Store pending transaction
        if (user) {
            await supabase.from("transactions").insert({
                user_id: user.id,
                amount: credits * 9,
                razorpay_order_id: order.id,
                credits_purchased: credits,
                status: "pending",
            });
        }

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
