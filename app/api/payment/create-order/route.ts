import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import Razorpay from "razorpay";

// Must match tokenPackages in ScriptGenerator.tsx (id, tokens, price in INR)
const TOKEN_PACKAGES = [
    { id: "starter", tokens: 100, price: 149 },
    { id: "plus", tokens: 250, price: 299 },
    { id: "growth", tokens: 500, price: 499 },
    { id: "pro", tokens: 1000, price: 899 },
    { id: "scale", tokens: 2500, price: 1999 },
    { id: "enterprise", tokens: 5000, price: 3499 },
];

const getPackage = (id: string) => TOKEN_PACKAGES.find((pkg) => pkg.id === id);

const getOrCreateUser = async (email: string, name?: string | null, image?: string | null) => {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        try {
            user = await prisma.user.create({
                data: {
                    email,
                    name: name || null,
                    image: image || null,
                },
            });
        } catch {
            user = await prisma.user.findUnique({ where: { email } });
        }
    }
    if (!user) throw new Error("Failed to resolve user");
    return user;
};

const getRazorpay = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) return null;
    return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

// POST - Create a Razorpay order
export async function POST(req: NextRequest) {
    const razorpay = getRazorpay();

    if (!razorpay) {
        return NextResponse.json({ error: "Payment not configured" }, { status: 503 });
    }

    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));
        const parsed = z.object({
            packageId: z.enum(["starter", "plus", "growth", "pro", "scale", "enterprise"]).default("pro"),
        }).safeParse(body);
        const packageId = parsed.success ? parsed.data.packageId : "pro";
        const selected = getPackage(packageId) || getPackage("pro");
        if (!selected) {
            return NextResponse.json({ error: "Invalid package" }, { status: 400 });
        }
        const amount = selected.price * 100; // amount in paise
        const businessName = env.RAZORPAY_BUSINESS_NAME || "ScriptGen";
        const websiteUrl = env.NEXTAUTH_URL || "https://scriptgen.learn-made.in";

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                email: session.user.email,
                tokens: selected.tokens.toString(),
                packageId: selected.id,
                businessName: businessName,
                website: websiteUrl,
                businessType: "SaaS",
            },
        });

        const user = await getOrCreateUser(session.user.email, session.user.name, session.user.image);

        // Store pending transaction
        await prisma.transaction.create({
            data: {
                userId: user.id,
                amount: selected.price,
                razorpayOrderId: order.id,
                creditsPurchased: selected.tokens,
                status: "pending",
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            businessName: businessName,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
