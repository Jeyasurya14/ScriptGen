import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeError } from "@/lib/api-utils";
import { Prisma } from "@prisma/client";

const REFERRAL_DISABLED = false;
const REFERRAL_TOKENS = 25;
const CODE_LENGTH = 8;
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Exclude I,O,0,1 to avoid confusion
const MAX_CODE_GEN_ATTEMPTS = 10;

function getBaseUrl(req: NextRequest): string {
    if (process.env.NODE_ENV === "production" && process.env.NEXTAUTH_URL) {
        return process.env.NEXTAUTH_URL.replace(/\/$/, "");
    }
    const host = req.headers.get("host") || req.headers.get("x-forwarded-host");
    const proto = req.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
    if (host) return `${proto}://${host}`;
    return process.env.NEXTAUTH_URL || "https://scriptgen.app";
}

/** Cryptographically secure referral code generation */
function generateReferralCode(): string {
    const bytes = crypto.randomBytes(CODE_LENGTH);
    let code = "";
    for (let i = 0; i < CODE_LENGTH; i++) {
        code += CODE_CHARS[bytes[i]! % CODE_CHARS.length];
    }
    return code;
}

function isValidReferralCode(raw: string): boolean {
    if (raw.length < 4 || raw.length > 16) return false;
    return /^[A-Z0-9]+$/.test(raw);
}

// GET - Get my referral code and shareable link
export async function GET(req: NextRequest) {
    if (REFERRAL_DISABLED) {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        return NextResponse.json({ code: "", link: "" });
    }
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        let user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
        if (!user.referralCode) {
            for (let attempt = 0; attempt < MAX_CODE_GEN_ATTEMPTS; attempt++) {
                const code = generateReferralCode();
                try {
                    user = await prisma.user.update({
                        where: { id: user.id },
                        data: { referralCode: code },
                    });
                    break;
                } catch (updateErr) {
                    if (updateErr instanceof Prisma.PrismaClientKnownRequestError && updateErr.code === "P2002") {
                        if (attempt === MAX_CODE_GEN_ATTEMPTS - 1) {
                            console.error("[referral] GET: max code gen attempts exceeded");
                            return NextResponse.json({ error: "Failed to generate referral code" }, { status: 500 });
                        }
                        continue;
                    }
                    throw updateErr;
                }
            }
        }
        const code = user.referralCode!;
        const baseUrl = getBaseUrl(req);
        const link = `${baseUrl}/app?ref=${encodeURIComponent(code)}`;
        return NextResponse.json({ code, link });
    } catch (e) {
        console.error("[referral] GET error:", e);
        return NextResponse.json({ error: sanitizeError(e) }, { status: 500 });
    }
}

// POST - Apply a referral code (new user uses friend's code)
export async function POST(req: NextRequest) {
    if (REFERRAL_DISABLED) {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        return NextResponse.json(
            { error: "Referral feature is not enabled." },
            { status: 503 }
        );
    }
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const body = await req.json().catch(() => ({}));
        const code = typeof body?.code === "string" ? body.code : "";
        const raw = code.trim().toUpperCase();
        if (!raw) return NextResponse.json({ error: "Please enter a referral code" }, { status: 400 });
        if (!isValidReferralCode(raw)) {
            return NextResponse.json({ error: "Invalid referral code format" }, { status: 400 });
        }
        const me = await prisma.user.findUnique({ where: { email: session.user.email }, include: { credits: true } });
        if (!me) return NextResponse.json({ error: "User not found" }, { status: 404 });
        const referrer = await prisma.user.findUnique({ where: { referralCode: raw }, include: { credits: true } });
        if (!referrer) return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });
        if (referrer.id === me.id) return NextResponse.json({ error: "You cannot use your own referral code" }, { status: 400 });
        const existing = await prisma.referral.findUnique({ where: { referredId: me.id } });
        if (existing) return NextResponse.json({ error: "You have already used a referral code" }, { status: 400 });
        try {
            await prisma.$transaction(async (tx) => {
                await tx.referral.create({
                    data: { referrerId: referrer.id, referredId: me.id },
                });
                const addCredits = (userId: string, current: number) =>
                    tx.userCredits.upsert({
                        where: { userId },
                        create: { userId, paidCredits: current + REFERRAL_TOKENS, freeScriptsUsed: 0 },
                        update: { paidCredits: { increment: REFERRAL_TOKENS } },
                    });
                await addCredits(referrer.id, referrer.credits?.paidCredits ?? 0);
                await addCredits(me.id, me.credits?.paidCredits ?? 0);
            });
        } catch (txErr) {
            if (txErr instanceof Prisma.PrismaClientKnownRequestError && txErr.code === "P2002") {
                return NextResponse.json({ error: "You have already used a referral code" }, { status: 400 });
            }
            throw txErr;
        }
        return NextResponse.json({
            message: `You both received ${REFERRAL_TOKENS} tokens!`,
            tokens: REFERRAL_TOKENS,
        });
    } catch (e) {
        console.error("[referral] POST error:", e);
        return NextResponse.json({ error: sanitizeError(e) }, { status: 500 });
    }
}
