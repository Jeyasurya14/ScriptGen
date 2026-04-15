import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReferralSchema } from "@/lib/validations";
import { sanitizeError } from "@/lib/api-utils";
import { Prisma } from "@prisma/client";
import { buildReferralLink, ensureReferralCodeForUser, REFERRAL_TOKENS } from "@/lib/referrals";

const REFERRAL_DISABLED = false;

function getBaseUrl(req: NextRequest): string {
  if (process.env.NODE_ENV === "production" && process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL.replace(/\/$/, "");
  }
  const host = req.headers.get("host") || req.headers.get("x-forwarded-host");
  const proto = req.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
  if (host) return `${proto}://${host}`;
  return process.env.NEXTAUTH_URL || "https://scriptgen.app";
}

function isValidReferralCode(raw: string): boolean {
  if (raw.length < 3 || raw.length > 30) return false;
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
    let user;
    try {
      user = await prisma.user.findUnique({ where: { email: session.user.email } });
    } catch (dbErr) {
      console.error("[referral] DB connection failed:", dbErr);
      // DB is failing (e.g. Prisma locked) - let's return a dummy code so the page still loads
      const dummyCode = `REF${session.user.email.replace(/[^A-Za-z0-9]/g, '').slice(0, 6).toUpperCase()}`;
      const baseUrl = getBaseUrl(req);
      const link = buildReferralLink(baseUrl, dummyCode);
      return NextResponse.json({ code: dummyCode, link });
    }

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Try to ensure a referral code. If the DB write fails (e.g. locked binary in dev),
    // fall back to whatever code already exists rather than returning 500.
    let code = user.referralCode ?? "";
    try {
      code = await ensureReferralCodeForUser(user.id, user.referralCode);
    } catch (codeErr) {
      console.error("[referral] ensureReferralCodeForUser failed, using fallback:", codeErr);
      if (!code) code = `REF${user.id.slice(0, 6).toUpperCase()}`;
    }

    const baseUrl = getBaseUrl(req);
    const link = code ? buildReferralLink(baseUrl, code) : "";
    return NextResponse.json({ code, link });
  } catch (e) {
    console.error("[referral] GET error:", e);
    return NextResponse.json({ error: sanitizeError(e) }, { status: 500 });
  }
}


// POST - Apply a referral code (new user uses friend's code)
export async function POST(req: NextRequest) {
  try {
    if (REFERRAL_DISABLED) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return NextResponse.json({ error: "Referral feature is not enabled." }, { status: 503 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const parseResult = ReferralSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message ?? "Invalid referral code", code: "VALIDATION_ERROR" },
        { status: 422 },
      );
    }

    const { code } = parseResult.data;
    const raw = code.trim().toUpperCase();
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
        await tx.referral.create({ data: { referrerId: referrer.id, referredId: me.id } });
        const addCredits = (userId: string) =>
          tx.userCredits.upsert({
            where: { userId },
            create: { userId, paidCredits: REFERRAL_TOKENS, freeScriptsUsed: 0 },
            update: { paidCredits: { increment: REFERRAL_TOKENS } },
          });
        await addCredits(referrer.id);
        await addCredits(me.id);
      });
    } catch (txErr) {
      if (txErr instanceof Prisma.PrismaClientKnownRequestError && txErr.code === "P2002") {
        return NextResponse.json({ error: "You have already used a referral code" }, { status: 400 });
      }
      throw txErr;
    }

    return NextResponse.json({ message: `You both received ${REFERRAL_TOKENS} tokens!`, tokens: REFERRAL_TOKENS });
  } catch (e: unknown) {
    console.error("[referral] POST error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
