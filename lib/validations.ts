import { z } from "zod";

export const GenerateSchema = z.object({
  topic: z.string().min(10, "Topic must be at least 10 characters").max(500),
  language: z.enum(["english", "hindi", "tamil", "thanglish"]),
  tamilRatio: z.number().min(10).max(90).optional(),
  vidLength: z.enum(["short", "medium", "long", "deep-dive"]),
  contentType: z.enum(["tutorial", "live-build", "review", "explainer", "news"]),
  assets: z.object({
    seo: z.boolean(),
    broll: z.boolean(),
    shorts: z.boolean(),
    imagePrompts: z.boolean(),
    tamilContext: z.boolean(),
  }),
});

export const PaymentSchema = z.object({
  pack: z.enum(["30", "100", "300"]),
});

export const ReferralSchema = z.object({
  code: z.string().min(3).max(30),
});

export type GenerateInput = z.infer<typeof GenerateSchema>;
export type PaymentInput = z.infer<typeof PaymentSchema>;
export type ReferralInput = z.infer<typeof ReferralSchema>;
