import "next-auth";
import "next-auth/jwt";
import type { DefaultSession } from "next-auth";
import type { TokenBalance } from "@/types";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      credits?: {
        freeScriptsUsed: number;
        paidCredits: number;
        totalGenerated: number;
      } | null;
      tokenBalance?: TokenBalance;
      tokens?: number;
      referralCode?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    referralCode?: string | null;
    tokens?: number;
  }
}
