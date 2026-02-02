import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch user's script history
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ scripts: [] });
        }

        const scripts = await prisma.script.findMany({
            where: { userId: user.id },
            select: {
                id: true,
                title: true,
                channelName: true,
                duration: true,
                contentType: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        // Map Prisma camelCase to snake_case if frontend expects it, or keep snake_case in Frontend?
        // Current frontend expects snake_case based on Supabase implementation?
        // Let's check the schema. The schema maps fields to snake_case in DB, but Prisma Client uses camelCase.
        // We might need to transform, or update Frontend types.
        // The original code returned: select("id, title, channel_name, duration, content_type, created_at")
        // So I should map it back to snake_case to avoid breaking frontend.

        const formattedScripts = scripts.map((s: typeof scripts[0]) => ({
            id: s.id,
            title: s.title,
            channel_name: s.channelName,
            duration: s.duration,
            content_type: s.contentType,
            created_at: s.createdAt,
        }));

        return NextResponse.json({ scripts: formattedScripts });
    } catch (error) {
        console.error("Error fetching scripts:", error);
        return NextResponse.json({ error: "Failed to fetch scripts" }, { status: 500 });
    }
}

// POST - Save a new script
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Save script
        const script = await prisma.script.create({
            data: {
                userId: user.id,
                title: body.title,
                channelName: body.channelName,
                duration: body.duration,
                contentType: body.contentType,
                scriptContent: body.scriptContent,
                seoData: body.seoData,
                imagesData: body.imagesData,
                chaptersData: body.chaptersData,
                brollData: body.brollData,
                shortsData: body.shortsData,
            },
        });

        return NextResponse.json({ success: true, scriptId: script.id });
    } catch (error) {
        console.error("Error saving script:", error);
        return NextResponse.json({ error: "Failed to save script" }, { status: 500 });
    }
}
