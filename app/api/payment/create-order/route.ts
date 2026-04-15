import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { getTokenPackById, TOKEN_PACKS } from "@/lib/token-packs";
import { PaymentSchema } from "@/lib/validations";
import Razorpay from "razorpay";

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
    try {
        const razorpay = getRazorpay();

        if (!razorpay) {
            return NextResponse.json({ error: "Payment not configured" }, { status: 503 });
        }

        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));
        
        // The user's PaymentSchema expects { pack: "30" | "100" | "300" }
        const parseResult = PaymentSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json(
                { error: parseResult.error.issues[0]?.message ?? "Invalid request", code: 'VALIDATION_ERROR' },
                { status: 422 }
            );
        }

        const { pack } = parseResult.data;
        const selected = getTokenPackById(pack) || TOKEN_PACKS[0];
        
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
                packageLabel: selected.label,
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
            pack: selected,
        });
    } catch (error: any) {
        let errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        
        // Handle specific Razorpay API errors (like 401 Unauthorized for bad keys)
        if (error && typeof error === "object" && error.statusCode && error.error) {
           errorMessage = `Razorpay Error: ${error.error.description || error.error.code}`;
        }
        
        console.error("Error creating order:", error);
        return NextResponse.json(
            { error: errorMessage, code: 'INTERNAL_ERROR' },
            { status: 500 }
        );
    }
}
