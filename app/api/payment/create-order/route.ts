import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";

const getRazorpay = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) return null;
    return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

// POST - Create a Razorpay order
export async function POST(req: NextRequest) {
    const razorpay = getRazorpay();

    if (!razorpay) {
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

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        // Store pending transaction
        if (user) {
            await prisma.transaction.create({
                data: {
                    userId: user.id,
                    amount: credits * 9,
                    razorpayOrderId: order.id,
                    creditsPurchased: credits,
                    status: "pending",
                },
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
