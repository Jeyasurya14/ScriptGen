import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ReferralClient from "@/components/referral/ReferralClient";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getReferralStats } from "@/lib/referral-stats";
import { buildReferralLink, ensureReferralCodeForUser } from "@/lib/referrals";

function getBaseUrl(host: string | null, proto: string | null) {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  if (host) {
    return `${proto || "https"}://${host}`;
  }

  return "https://scriptgen.app";
}

export default async function ReferralPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      referralCode: true,
    },
  });

  if (!user) {
    redirect("/");
  }

  const headerStore = await headers();
  const baseUrl = getBaseUrl(headerStore.get("host"), headerStore.get("x-forwarded-proto"));
  const code = await ensureReferralCodeForUser(user.id, user.referralCode);
  const link = buildReferralLink(baseUrl, code);
  const stats = await getReferralStats(user.id);

  return <ReferralClient code={code} link={link} stats={stats} />;
}
