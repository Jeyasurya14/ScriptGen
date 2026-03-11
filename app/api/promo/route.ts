import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Define promo codes and their rewards
const PROMO_CODES: { [key: string]: { tokens: number; description: string } } = {
    PRODUCTHUNT: { tokens: 100, description: "Product Hunt Launch Special" },
    WELCOME50: { tokens: 50, description: "Welcome Bonus" },
    // Add more codes as needed
};
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

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));
        const code = typeof body?.code === "string" ? body.code : "";

        if (!code.trim()) {
            return NextResponse.json({ error: "Invalid promo code" }, { status: 400 });
        }

        const upperCode = code.trim().toUpperCase();

        // Check if promo code exists
        if (!PROMO_CODES[upperCode]) {
            return NextResponse.json({ error: "Invalid promo code" }, { status: 400 });
        }

        let user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            try {
                user = await prisma.user.create({
                    data: {
                        email: session.user.email,
                        name: session.user.name || null,
                        image: session.user.image || null,
                    },
                });
            } catch {
                user = await prisma.user.findUnique({
                    where: { email: session.user.email },
                });
            }
        }

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 500 });
        }

        const promoDetails = PROMO_CODES[upperCode];
        const credits = await prisma.$transaction(async (tx) => {
            await tx.promoRedemption.create({
                data: {
                    userId: user.id,
                    code: upperCode,
                },
            });

            return tx.userCredits.upsert({
                where: { userId: user.id },
                create: {
                    userId: user.id,
                    freeScriptsUsed: 0,
                    paidCredits: promoDetails.tokens,
                    totalGenerated: 0,
                },
                update: {
                    paidCredits: { increment: promoDetails.tokens },
                },
            });
        });

        return NextResponse.json({
            success: true,
            tokensAdded: promoDetails.tokens,
            description: promoDetails.description,
            ...toCreditsPayload(credits),
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return NextResponse.json({ error: "You've already used this promo code" }, { status: 400 });
        }
        console.error("Error redeeming promo code:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
