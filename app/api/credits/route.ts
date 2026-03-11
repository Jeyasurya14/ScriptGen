import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeError } from "@/lib/api-utils";

const FREE_TOKENS = 30;
export const dynamic = "force-dynamic";
export const revalidate = 0;

type AuthIdentity = {
    email: string;
    name?: string | null;
    image?: string | null;
};

const resolveIdentity = async (req: NextRequest): Promise<AuthIdentity | null> => {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
        return {
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
        };
    }

    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) return null;

    const token =
        (await getToken({ req, secret })) ||
        (await getToken({ req, secret, secureCookie: true })) ||
        (await getToken({ req, secret, secureCookie: false }));

    if (typeof token?.email === "string") {
        return {
            email: token.email,
            name: typeof token.name === "string" ? token.name : null,
            image: typeof token.picture === "string" ? token.picture : null,
        };
    }

    return null;
};

const getOrCreateUserWithCredits = async (identity: AuthIdentity) => {
    const user = await prisma.user.upsert({
        where: { email: identity.email },
        update: {
            ...(identity.name ? { name: identity.name } : {}),
            ...(identity.image ? { image: identity.image } : {}),
        },
        create: {
            email: identity.email,
            name: identity.name || null,
            image: identity.image || null,
        },
    });

    const credits = await prisma.userCredits.upsert({
        where: { userId: user.id },
        create: {
            userId: user.id,
            freeScriptsUsed: 0,
            paidCredits: 0,
            totalGenerated: 0,
        },
        update: {},
    });

    return { user, credits };
};

// GET - Check user tokens
export async function GET(req: NextRequest) {
    try {
        const identity = await resolveIdentity(req);
        if (!identity) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { credits } = await getOrCreateUserWithCredits(identity);

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
        console.error("[credits] GET error:", error);
        return NextResponse.json({ error: sanitizeError(error) }, { status: 500 });
    }
}

// POST - Use tokens (called after successful generation)
export async function POST(req: NextRequest) {
    try {
        const identity = await resolveIdentity(req);
        if (!identity) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { credits } = await getOrCreateUserWithCredits(identity);

        const body = await req.json().catch(() => ({}));
        const parsed = z.object({ count: z.coerce.number().int().min(1).max(200).default(10) }).safeParse(body);
        const count = parsed.success ? parsed.data.count : 10;

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
        console.error("[credits] POST error:", error);
        return NextResponse.json({ error: sanitizeError(error) }, { status: 500 });
    }
}
