import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Define promo codes and their rewards
const PROMO_CODES: { [key: string]: { tokens: number; description: string } } = {
    PRODUCTHUNT: { tokens: 100, description: "Product Hunt Launch Special" },
    WELCOME50: { tokens: 50, description: "Welcome Bonus" },
    // Add more codes as needed
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

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if user already redeemed this code
        const existingRedemption = await prisma.promoRedemption.findUnique({
            where: {
                userId_code: {
                    userId: user.id,
                    code: upperCode,
                },
            },
        });

        if (existingRedemption) {
            return NextResponse.json(
                { error: "You've already used this promo code" },
                { status: 400 }
            );
        }

        const promoDetails = PROMO_CODES[upperCode];

        // Create user credits if doesn't exist
        let credits = await prisma.userCredits.findUnique({
            where: { userId: user.id },
        });

        if (!credits) {
            credits = await prisma.userCredits.create({
                data: {
                    userId: user.id,
                    freeScriptsUsed: 0,
                    paidCredits: 0,
                    totalGenerated: 0,
                },
            });
        }

        // Add tokens and record redemption in a transaction
        await prisma.$transaction([
            prisma.userCredits.update({
                where: { id: credits.id },
                data: {
                    paidCredits: credits.paidCredits + promoDetails.tokens,
                },
            }),
            prisma.promoRedemption.create({
                data: {
                    userId: user.id,
                    code: upperCode,
                },
            }),
        ]);

        return NextResponse.json({
            success: true,
            tokensAdded: promoDetails.tokens,
            description: promoDetails.description,
        });
    } catch (error) {
        console.error("Error redeeming promo code:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
