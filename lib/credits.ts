import type { TokenBalance } from "@/types";

export const FREE_TOKENS = 30;

type CreditSnapshot = {
  freeScriptsUsed: number;
  paidCredits: number;
  totalGenerated: number;
};

export function toTokenBalance(credits: CreditSnapshot): TokenBalance {
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
}

export function getTokenTotal(
  credits?: CreditSnapshot | null,
): number {
  if (!credits) return 0;
  return toTokenBalance(credits).totalTokens;
}
