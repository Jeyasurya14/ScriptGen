import { prisma } from "@/lib/prisma";
import { REFERRAL_TOKENS } from "@/lib/referrals";

export async function getReferralStats(userId: string) {
  const referrals = await prisma.referral.findMany({
    where: { referrerId: userId },
    select: {
      referred: {
        select: {
          scripts: {
            select: { id: true },
            take: 1,
          },
          credits: true,
        },
      },
    },
  });

  const totalReferred = referrals.length;
  const activeUsers = referrals.filter((referral) => {
    const credits = referral.referred.credits;
    return (
      referral.referred.scripts.length > 0 ||
      (credits?.totalGenerated ?? 0) > 0 ||
      (credits?.paidCredits ?? 0) > 0
    );
  }).length;

  return {
    totalReferred,
    tokensEarned: totalReferred * REFERRAL_TOKENS,
    activeUsers,
  };
}
