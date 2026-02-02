import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const FREE_TOKENS = 50;

// GET - Check user tokens
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        let credits = await prisma.userCredits.findUnique({
            where: { userId: user.id },
        });

        if (!credits) {
            // Initialize credits if not exists
            credits = await prisma.userCredits.create({
                data: {
                    userId: user.id,
                    freeScriptsUsed: 0,
                    paidCredits: 0,
                    totalGenerated: 0,
                },
            });

            return NextResponse.json({
                freeTokensUsed: 0,
                freeTokensRemaining: FREE_TOKENS,
                paidTokens: 0,
                totalGenerated: 0,
                canGenerate: true,
            });
        }

        const freeTokensRemaining = Math.max(0, FREE_TOKENS - credits.freeScriptsUsed);
        const canGenerate = freeTokensRemaining + credits.paidCredits >= 10;

        return NextResponse.json({
            freeTokensUsed: credits.freeScriptsUsed,
            freeTokensRemaining,
            paidTokens: credits.paidCredits,
            totalGenerated: credits.totalGenerated,
            canGenerate,
        });
    } catch (error) {
        console.error("Error fetching tokens:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

// POST - Use tokens (called after successful generation)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const credits = await prisma.userCredits.findUnique({
            where: { userId: user.id },
        });

        if (!credits) {
            return NextResponse.json({ error: "No tokens found" }, { status: 404 });
        }

        // Check what to deduct
        // Parse count from body, default to 10 tokens
        const { count = 10 } = await req.json().catch(() => ({}));

        // Check availability
        const freeRemaining = Math.max(0, FREE_TOKENS - credits.freeScriptsUsed);
        const totalAvailable = freeRemaining + credits.paidCredits;

        if (totalAvailable < count) {
            return NextResponse.json({
                error: "Insufficient tokens",
                required: count,
                available: totalAvailable
            }, { status: 403 });
        }

        // Deduct logic
        let newFreeUsed = credits.freeScriptsUsed;
        let newPaid = credits.paidCredits;
        let remainingToDeduct = count;

        // 1. Deduct from free first
        if (freeRemaining > 0) {
            const deductFree = Math.min(freeRemaining, remainingToDeduct);
            newFreeUsed += deductFree;
            remainingToDeduct -= deductFree;
        }

        // 2. Deduct remaining from paid
        if (remainingToDeduct > 0) {
            newPaid -= remainingToDeduct;
        }

        // Update DB
        await prisma.userCredits.update({
            where: { id: credits.id },
            data: {
                freeScriptsUsed: newFreeUsed,
                paidCredits: newPaid,
                totalGenerated: credits.totalGenerated + count,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error using tokens:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
