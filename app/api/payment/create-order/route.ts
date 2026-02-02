import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";

const TOKEN_PACKAGES = [
    { id: "starter", tokens: 100, price: 99 },
    { id: "growth", tokens: 300, price: 249 },
    { id: "pro", tokens: 500, price: 399 },
    { id: "scale", tokens: 1000, price: 699 },
];

const getPackage = (id: string) => TOKEN_PACKAGES.find((pkg) => pkg.id === id);

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

        const { packageId = "pro" } = await req.json();
        const selected = getPackage(packageId) || getPackage("pro");
        if (!selected) {
            return NextResponse.json({ error: "Invalid package" }, { status: 400 });
        }
        const amount = selected.price * 100; // amount in paise

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                email: session.user.email,
                tokens: selected.tokens.toString(),
                packageId: selected.id,
            },
        });

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        // Store pending transaction
        if (user) {
            await prisma.transaction.create({
                data: {
                    userId: user.id,
                    amount: selected.price,
                    razorpayOrderId: order.id,
                    creditsPurchased: selected.tokens,
                    status: "pending",
                },
            });
        }

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
