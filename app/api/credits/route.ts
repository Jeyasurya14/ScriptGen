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

class InsufficientTokensError extends Error {
    required: number;
    available: number;

    constructor(required: number, available: number) {
        super("Insufficient tokens");
        this.required = required;
        this.available = available;
    }
}

type AuthIdentity = {
    email: string;
    name?: string | null;
    image?: string | null;
};

const resolveIdentity = async (req: NextRequest): Promise<AuthIdentity | null> => {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.email) {
            return {
                email: session.user.email,
                name: session.user.name,
                image: session.user.image,
            };
        }
    } catch (error) {
        console.error("[credits] resolveIdentity session error:", error);
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
    let user = await prisma.user.findUnique({
        where: { email: identity.email },
    });

    if (!user) {
        try {
            user = await prisma.user.create({
                data: {
                    email: identity.email,
                    name: identity.name || null,
                    image: identity.image || null,
                },
            });
        } catch {
            // Handle race where another request created the same user.
            user = await prisma.user.findUnique({
                where: { email: identity.email },
            });
        }
    }

    if (!user) {
        throw new Error("Failed to resolve user");
    }

    const userNeedsProfileUpdate =
        (identity.name && identity.name !== user.name) ||
        (identity.image && identity.image !== user.image);

    if (userNeedsProfileUpdate) {
        user = await prisma.user.update({
            where: { id: user.id },
            data: {
                ...(identity.name ? { name: identity.name } : {}),
                ...(identity.image ? { image: identity.image } : {}),
            },
        });
    }

    let credits = await prisma.userCredits.findUnique({
        where: { userId: user.id },
    });

    if (!credits) {
        try {
            credits = await prisma.userCredits.create({
                data: {
                    userId: user.id,
                    freeScriptsUsed: 0,
                    paidCredits: 0,
                    totalGenerated: 0,
                },
            });
        } catch {
            // Handle race where another request created credits for the same user.
            credits = await prisma.userCredits.findUnique({
                where: { userId: user.id },
            });
        }
    }

    if (!credits) {
        throw new Error("Failed to resolve user credits");
    }

    return { user, credits };
};

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

const deductTokensAtomic = async (userId: string, count: number) => {
    // Optimistic concurrency with bounded retries.
    for (let attempt = 0; attempt < 3; attempt++) {
        let credits = await prisma.userCredits.findUnique({
            where: { userId },
        });

        if (!credits) {
            try {
                credits = await prisma.userCredits.create({
                    data: {
                        userId,
                        freeScriptsUsed: 0,
                        paidCredits: 0,
                        totalGenerated: 0,
                    },
                });
            } catch {
                credits = await prisma.userCredits.findUnique({
                    where: { userId },
                });
            }
        }

        if (!credits) {
            throw new Error("Failed to resolve user credits");
        }

        const freeRemaining = Math.max(0, FREE_TOKENS - credits.freeScriptsUsed);
        const totalAvailable = freeRemaining + credits.paidCredits;
        if (totalAvailable < count) {
            throw new InsufficientTokensError(count, totalAvailable);
        }

        const deductFree = Math.min(freeRemaining, count);
        const deductPaid = count - deductFree;

        const updated = await prisma.userCredits.updateMany({
            where: {
                id: credits.id,
                freeScriptsUsed: credits.freeScriptsUsed,
                paidCredits: credits.paidCredits,
                totalGenerated: credits.totalGenerated,
            },
            data: {
                freeScriptsUsed: credits.freeScriptsUsed + deductFree,
                paidCredits: credits.paidCredits - deductPaid,
                totalGenerated: credits.totalGenerated + count,
            },
        });

        if (updated.count === 1) {
            const latest = await prisma.userCredits.findUnique({
                where: { userId },
            });
            if (!latest) throw new Error("Failed to load updated credits");
            return latest;
        }
    }

    throw new Error("Token deduction conflict. Please retry.");
};

// GET - Check user tokens
export async function GET(req: NextRequest) {
    try {
        const identity = await resolveIdentity(req);
        if (!identity) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { credits } = await getOrCreateUserWithCredits(identity);

        return NextResponse.json(toCreditsPayload(credits));
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

        const body = await req.json().catch(() => ({}));
        const parsed = z.object({ count: z.coerce.number().int().min(1).max(200).default(10) }).safeParse(body);
        const count = parsed.success ? parsed.data.count : 10;
        const { user } = await getOrCreateUserWithCredits(identity);
        const updatedCredits = await deductTokensAtomic(user.id, count);

        return NextResponse.json({
            success: true,
            deducted: count,
            ...toCreditsPayload(updatedCredits),
        });
    } catch (error) {
        if (error instanceof InsufficientTokensError) {
            return NextResponse.json(
                {
                    error: "Insufficient tokens",
                    required: error.required,
                    available: error.available,
                },
                { status: 403 }
            );
        }
        console.error("[credits] POST error:", error);
        return NextResponse.json({ error: sanitizeError(error) }, { status: 500 });
    }
}
