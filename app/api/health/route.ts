import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Health check for monitoring and load balancers.
 * GET /api/health - returns 200 if app + DB are reachable
 */
export async function GET() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return NextResponse.json(
            {
                status: "ok",
                timestamp: new Date().toISOString(),
                database: "connected",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("[health] Database check failed:", error);
        return NextResponse.json(
            {
                status: "error",
                timestamp: new Date().toISOString(),
                database: "disconnected",
            },
            { status: 503 }
        );
    }
}
