import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const REFERRAL_BONUS = 25;
const BASE_URL = process.env.NEXTAUTH_URL || "https://scriptgen.learn-made.in";

function generateReferralCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No I,O,0,1 for clarity
    let code = "";
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// GET - Get my referral code and link
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

        let code = user.referralCode;
        if (!code) {
            // Generate unique code
            let attempts = 0;
            while (attempts < 10) {
                code = generateReferralCode();
                const exists = await prisma.user.findFirst({ where: { referralCode: code } });
                if (!exists) break;
                attempts++;
            }
            if (!code) {
                return NextResponse.json({ error: "Failed to generate referral code" }, { status: 500 });
            }
            await prisma.user.update({
                where: { id: user.id },
                data: { referralCode: code },
            });
        }

        const link = `${BASE_URL}/app?ref=${code}`;
        return NextResponse.json({ code, link });
    } catch (error) {
        console.error("Referral GET error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

// POST - Apply a referral code (new user uses referrer's code)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { code } = await req.json().catch(() => ({}));
        if (!code || typeof code !== "string") {
            return NextResponse.json({ error: "Please enter a referral code" }, { status: 400 });
        }

        const referralCode = code.trim().toUpperCase();
        const referredUser = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!referredUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Can't use own code
        if (referredUser.referralCode === referralCode) {
            return NextResponse.json({ error: "You cannot use your own referral code" }, { status: 400 });
        }

        const referrer = await prisma.user.findUnique({
            where: { referralCode },
        });

        if (!referrer) {
            return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });
        }

        // Check if this user was already referred
        const existing = await prisma.referral.findUnique({
            where: { referredId: referredUser.id },
        });

        if (existing) {
            return NextResponse.json({ error: "You have already used a referral code" }, { status: 400 });
        }

        // Get or create credits for both users
        let referrerCredits = await prisma.userCredits.findUnique({ where: { userId: referrer.id } });
        let referredCredits = await prisma.userCredits.findUnique({ where: { userId: referredUser.id } });

        if (!referrerCredits) {
            referrerCredits = await prisma.userCredits.create({
                data: { userId: referrer.id, freeScriptsUsed: 0, paidCredits: 0, totalGenerated: 0 },
            });
        }
        if (!referredCredits) {
            referredCredits = await prisma.userCredits.create({
                data: { userId: referredUser.id, freeScriptsUsed: 0, paidCredits: 0, totalGenerated: 0 },
            });
        }

        await prisma.$transaction([
            prisma.referral.create({
                data: { referrerId: referrer.id, referredId: referredUser.id },
            }),
            prisma.userCredits.update({
                where: { id: referrerCredits.id },
                data: { paidCredits: referrerCredits.paidCredits + REFERRAL_BONUS },
            }),
            prisma.userCredits.update({
                where: { id: referredCredits.id },
                data: { paidCredits: referredCredits.paidCredits + REFERRAL_BONUS },
            }),
        ]);

        return NextResponse.json({
            success: true,
            tokensAdded: REFERRAL_BONUS,
            message: `You and your friend both got ${REFERRAL_BONUS} tokens!`,
        });
    } catch (error) {
        console.error("Referral apply error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
