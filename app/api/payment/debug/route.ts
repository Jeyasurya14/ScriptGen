import { NextResponse } from "next/server";

export async function GET() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    return NextResponse.json({
        keyId_start: keyId ? keyId.substring(0, 8) : "missing",
        keyId_length: keyId ? keyId.length : 0,
        keyId_ends_with_quote: keyId ? keyId.endsWith('"') : false,
        keySecret_length: keySecret ? keySecret.length : 0,
        vercel_env: process.env.VERCEL_ENV || "unknown"
    });
}
