import { z } from "zod";

export const GenerateSchema = z.object({
  topic: z.string().min(10).max(500),
  language: z.enum(["English", "Hindi", "Tamil", "Thanglish"]),
  tamilRatio: z.number().min(10).max(90).optional(),
  vidLength: z.enum(["5", "10", "15", "20"]),
  contentType: z.enum(["Tutorial", "Story", "Review", "Educational", "Vlog"]),
  assets: z.object({
    generateImages: z.boolean(),
    includeChapters: z.boolean(),
    includeBRoll: z.boolean(),
    includeShorts: z.boolean(),
  }),
});

export const PaymentSchema = z.object({
  pack: z.enum(["30", "100", "300"]),
});

export const ReferralSchema = z.object({
  code: z.string().min(3).max(20),
});

export type GenerateInput = z.infer<typeof GenerateSchema>;
export type PaymentInput = z.infer<typeof PaymentSchema>;
export type ReferralInput = z.infer<typeof ReferralSchema>;
