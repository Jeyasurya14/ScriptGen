import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const FREE_TOKENS = 30;

const toCreditsPayload = (credits: {
    freeScriptsUsed: number;
    paidCredits: number;
    totalGenerated: number;
}) => {
    const freeTokensRemaining = Math.max(0, FREE_TOKENS - credits.freeScriptsUsed);
    const totalTokens = freeTokensRemaining + credits.paidCredits;
    return {
        freeTokensUsed: credits.freeScriptsUsed,
        freeTokensRemaining,
        paidTokens: credits.paidCredits,
        totalGenerated: credits.totalGenerated,
        totalTokens,
        canGenerate: totalTokens >= 10,
    };
};

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

        const result = await prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.findFirst({
                where: { razorpayOrderId: razorpay_order_id },
            });

            if (!transaction) {
                return { status: "not_found" as const };
            }

            if (transaction.status === "completed") {
                return {
                    status: "already_processed" as const,
                    userId: transaction.userId,
                    tokensAdded: 0,
                };
            }

            const updated = await tx.transaction.updateMany({
                where: {
                    id: transaction.id,
                    status: "pending",
                },
                data: {
                    razorpayPaymentId: razorpay_payment_id,
                    status: "completed",
                },
            });

            if (updated.count === 0) {
                return {
                    status: "already_processed" as const,
                    userId: transaction.userId,
                    tokensAdded: 0,
                };
            }

            await tx.userCredits.upsert({
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

            return {
                status: "completed" as const,
                userId: transaction.userId,
                tokensAdded: transaction.creditsPurchased,
            };
        });

        if (result.status === "not_found") {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        const credits = await prisma.userCredits.findUnique({
            where: { userId: result.userId },
        });

        return NextResponse.json({
            success: true,
            alreadyProcessed: result.status === "already_processed",
            tokensAdded: result.tokensAdded,
            ...(credits ? toCreditsPayload(credits) : {}),
        });
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}
