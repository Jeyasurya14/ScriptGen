import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// POST - Verify payment and add tokens
export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
        }

        // Verify signature
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            return NextResponse.json({ error: "Payment not configured" }, { status: 503 });
        }

        const signaturePayload = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(signaturePayload)
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

        // Add tokens to user (upsert in case credits row doesn't exist)
        await prisma.userCredits.upsert({
            where: { userId: transaction.userId },
            create: {
                userId: transaction.userId,
                freeScriptsUsed: 0,
                paidCredits: transaction.creditsPurchased,
                totalGenerated: 0,
            },
            update: {
                paidCredits: { increment: transaction.creditsPurchased },
            },
        });

        return NextResponse.json({
            success: true,
            tokensAdded: transaction.creditsPurchased
        });
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}
