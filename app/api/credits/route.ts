import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Check user credits
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        let credits = await prisma.userCredits.findUnique({
            where: { userId: user.id },
        });

        if (!credits) {
            // Initialize credits if not exists
            credits = await prisma.userCredits.create({
                data: {
                    userId: user.id,
                    freeScriptsUsed: 0,
                    paidCredits: 0,
                    totalGenerated: 0,
                },
            });

            return NextResponse.json({
                freeScriptsUsed: 0,
                freeScriptsRemaining: 2,
                paidCredits: 0,
                canGenerate: true,
            });
        }

        const freeScriptsRemaining = Math.max(0, 2 - credits.freeScriptsUsed);
        const canGenerate = freeScriptsRemaining > 0 || credits.paidCredits > 0;

        return NextResponse.json({
            freeScriptsUsed: credits.freeScriptsUsed,
            freeScriptsRemaining,
            paidCredits: credits.paidCredits,
            totalGenerated: credits.totalGenerated,
            canGenerate,
        });
    } catch (error) {
        console.error("Error fetching credits:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

// POST - Use a credit (called after successful generation)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const credits = await prisma.userCredits.findUnique({
            where: { userId: user.id },
        });

        if (!credits) {
            return NextResponse.json({ error: "No credits found" }, { status: 404 });
        }

        // Check what to deduct
        // Parse count from body, default to 1
        const { count = 1 } = await req.json().catch(() => ({}));

        // Check availability
        const freeRemaining = Math.max(0, 2 - credits.freeScriptsUsed);
        const totalAvailable = freeRemaining + credits.paidCredits;

        if (totalAvailable < count) {
            return NextResponse.json({
                error: "Insufficient credits",
                required: count,
                available: totalAvailable
            }, { status: 403 });
        }

        // Deduct logic
        let newFreeUsed = credits.freeScriptsUsed;
        let newPaid = credits.paidCredits;
        let remainingToDeduct = count;

        // 1. Deduct from free first
        if (freeRemaining > 0) {
            const deductFree = Math.min(freeRemaining, remainingToDeduct);
            newFreeUsed += deductFree;
            remainingToDeduct -= deductFree;
        }

        // 2. Deduct remaining from paid
        if (remainingToDeduct > 0) {
            newPaid -= remainingToDeduct;
        }

        // Update DB
        await prisma.userCredits.update({
            where: { id: credits.id },
            data: {
                freeScriptsUsed: newFreeUsed,
                paidCredits: newPaid,
                totalGenerated: credits.totalGenerated + 1, // Count generation event, not credits? Or should this track credits? 
                // Let's keep it as "generations" count for now, or maybe irrelevant.
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error using credit:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
