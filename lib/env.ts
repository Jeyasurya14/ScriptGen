import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    DATABASE_URL: z.string().optional(),
    NEXTAUTH_SECRET: z.string().optional(),
    NEXTAUTH_URL: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
    RAZORPAY_KEY_ID: z.string().optional(),
    RAZORPAY_KEY_SECRET: z.string().optional(),
    RAZORPAY_BUSINESS_NAME: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
    const parsed = envSchema.safeParse({
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
        RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
        RAZORPAY_BUSINESS_NAME: process.env.RAZORPAY_BUSINESS_NAME,
    });
    return (parsed.success ? parsed.data : { NODE_ENV: "development" }) as Env;
}

export const env = parseEnv();

export const isProd = env.NODE_ENV === "production";

/** Required for core app (auth + generate) in production */
export const REQUIRED_ENV_KEYS: (keyof Env)[] = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "OPENAI_API_KEY",
];

/** Validate required env at runtime (call from API routes / startup). Does not throw. */
export function assertRequiredEnv(keys: (keyof Env)[]): string[] {
    const missing: string[] = [];
    for (const key of keys) {
        const val = env[key];
        if (val === undefined || val === "") missing.push(key);
    }
    if (missing.length > 0 && isProd) {
        console.error("[env] Missing required vars:", missing.join(", "));
    }
    return missing;
}

/** Get required env var; in production throws if missing (use after assertRequiredEnv or for critical paths). */
export function getRequiredEnv(key: keyof Env): string {
    const val = env[key];
    if (val === undefined || val === "") {
        if (isProd) throw new Error(`Missing required env: ${key}`);
        return "";
    }
    return val as string;
}
