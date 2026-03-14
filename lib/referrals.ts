import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const REFERRAL_TOKENS = 15;
const CODE_LENGTH = 8;
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const MAX_CODE_GEN_ATTEMPTS = 10;

export function generateReferralCode(): string {
  const bytes = crypto.randomBytes(CODE_LENGTH);
  let code = "";

  for (let index = 0; index < CODE_LENGTH; index += 1) {
    code += CODE_CHARS[bytes[index]! % CODE_CHARS.length];
  }

  return code;
}

export async function ensureReferralCodeForUser(userId: string, existingCode?: string | null) {
  if (existingCode) return existingCode;

  for (let attempt = 0; attempt < MAX_CODE_GEN_ATTEMPTS; attempt += 1) {
    const code = generateReferralCode();

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { referralCode: code },
      });

      return updatedUser.referralCode!;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002" &&
        attempt < MAX_CODE_GEN_ATTEMPTS - 1
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("Failed to generate referral code");
}

export function buildReferralLink(baseUrl: string, code: string) {
  return `${baseUrl.replace(/\/$/, "")}/generate?ref=${encodeURIComponent(code)}`;
}
