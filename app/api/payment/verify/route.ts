import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toTokenBalance } from "@/lib/credits";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// POST - Verify payment and add tokens
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found", code: "USER_NOT_FOUND" }, { status: 404 });
        }

        const body = await req.json().catch(() => ({}));
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ error: "Invalid payment data", code: 'VALIDATION_ERROR' }, { status: 422 });
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
            return NextResponse.json({ error: "Invalid signature", code: 'VALIDATION_ERROR' }, { status: 422 });
        }

        const result = await prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.findFirst({
                where: { razorpayOrderId: razorpay_order_id, userId: user.id },
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
            ...(credits ? toTokenBalance(credits) : {}),
        });
    } catch (error: unknown) {
        console.error("Error verifying payment:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error", code: 'INTERNAL_ERROR' },
            { status: 500 }
        );
    }
}
