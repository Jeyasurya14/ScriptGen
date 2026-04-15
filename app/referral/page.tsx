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

  let user = null;
  try {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, referralCode: true },
    });
  } catch (e) {
    console.error("[referral] DB error fetching user:", e);
  }

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
    // Generate a temp display code from userId if DB write fails
    code = user.referralCode ?? user.id.slice(0, 8).toUpperCase();
  }

  try {
    stats = await getReferralStats(user.id);
  } catch (e) {
    console.error("[referral] getReferralStats error:", e);
    // Fall back to empty stats — don't crash the page
  }

  const link = buildReferralLink(baseUrl, code);

  return <ReferralClient code={code} link={link} stats={stats} />;
}
