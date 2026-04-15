import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ReferralClient from "@/components/referral/ReferralClient";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getReferralStats } from "@/lib/referral-stats";
import { buildReferralLink, ensureReferralCodeForUser } from "@/lib/referrals";
import type { ReferralStats } from "@/types";

function getBaseUrl(host: string | null, proto: string | null) {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (host) return `${proto || "https"}://${host}`;
  return "https://scriptgen.app";
}

const EMPTY_STATS: ReferralStats = { totalReferred: 0, tokensEarned: 0, activeUsers: 0 };

export default async function ReferralPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/");

  // Separate DB errors from "user not found" so we don't redirect authenticated
  // users to home just because the DB is temporarily unavailable.
  let user: { id: string; referralCode: string | null } | null = null;
  let dbError = false;

  try {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, referralCode: true },
    });
  } catch (e) {
    console.error("[referral] DB error fetching user:", e);
    dbError = true;
  }

  // DB threw → let the error boundary handle it gracefully
  if (dbError) {
    throw new Error("Unable to load referral data. Please refresh the page.");
  }

  // User genuinely doesn't exist in DB (first sign-in race) → redirect
  if (!user) redirect("/");

  const headerStore = await headers();
  const baseUrl = getBaseUrl(
    headerStore.get("host"),
    headerStore.get("x-forwarded-proto"),
  );

  let code = user.referralCode ?? "";
  let stats: ReferralStats = EMPTY_STATS;

  try {
    code = await ensureReferralCodeForUser(user.id, user.referralCode);
  } catch (e) {
    console.error("[referral] ensureReferralCode error:", e);
    code = user.referralCode ?? `REF${user.id.slice(0, 6).toUpperCase()}`;
  }

  try {
    stats = await getReferralStats(user.id);
  } catch (e) {
    console.error("[referral] getReferralStats error:", e);
  }

  const link = buildReferralLink(baseUrl, code);

  return <ReferralClient code={code} link={link} stats={stats} />;
}
