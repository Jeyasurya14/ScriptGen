import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// POST - Verify payment and add credits
export async function POST(req: NextRequest) {
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
        const transaction = await prisma.transaction.findFirst({
            where: {
                razorpayOrderId: razorpay_order_id
            }
        });

        if (!transaction) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        if (transaction.status === "completed") {
            return NextResponse.json({ error: "Already processed" }, { status: 400 });
        }

        // Update transaction
        await prisma.transaction.update({
            where: {
                id: transaction.id
            },
            data: {
                razorpayPaymentId: razorpay_payment_id,
                status: "completed",
            }
        });

        // Add credits to user
        // Using atomic increment for safety
        await prisma.userCredits.update({
            where: {
                userId: transaction.userId
            },
            data: {
                paidCredits: {
                    increment: transaction.creditsPurchased
                }
            }
        });

        return NextResponse.json({
            success: true,
            creditsAdded: transaction.creditsPurchased
        });
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}
