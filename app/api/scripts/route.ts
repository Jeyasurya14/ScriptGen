import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeError } from "@/lib/api-utils";

const MAX_SCRIPT_CONTENT_LENGTH = 500_000;
const MAX_TITLE_LENGTH = 500;

const SaveScriptSchema = z.object({
    title: z.string().min(1).max(MAX_TITLE_LENGTH).default("Untitled"),
    channelName: z.string().max(200).optional().nullable(),
    duration: z.number().int().min(0).max(600).optional().nullable(),
    contentType: z.string().max(100).optional().nullable(),
    scriptContent: z.string().max(MAX_SCRIPT_CONTENT_LENGTH).optional().nullable(),
    seoData: z.unknown().optional().nullable(),
    imagesData: z.unknown().optional().nullable(),
    chaptersData: z.unknown().optional().nullable(),
    brollData: z.unknown().optional().nullable(),
    shortsData: z.unknown().optional().nullable(),
});

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

        const formattedScripts = scripts.map((s: any) => ({
            id: s.id,
            title: s.title,
            channel_name: s.channelName,
            duration: s.duration,
            content_type: s.contentType,
            created_at: s.createdAt,
        }));

        return NextResponse.json({ scripts: formattedScripts });
    } catch (error) {
        console.error("[scripts] GET error:", error);
        return NextResponse.json(
            { error: sanitizeError(error), code: 'INTERNAL_ERROR' },
            { status: 500 }
        );
    }
}

// POST - Save a new script
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const raw = await req.json().catch(() => ({}));
        const parsed = SaveScriptSchema.safeParse(raw);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues, code: 'VALIDATION_ERROR' },
                { status: 422 }
            );
        }
        const body = parsed.data;

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const script = await prisma.script.create({
            data: {
                userId: user.id,
                title: body.title,
                channelName: body.channelName ?? undefined,
                duration: body.duration ?? undefined,
                contentType: body.contentType ?? undefined,
                scriptContent: body.scriptContent ?? undefined,
                seoData: body.seoData ?? undefined,
                imagesData: body.imagesData ?? undefined,
                chaptersData: body.chaptersData ?? undefined,
                brollData: body.brollData ?? undefined,
                shortsData: body.shortsData ?? undefined,
            },
        });

        return NextResponse.json({ success: true, scriptId: script.id });
    } catch (error: unknown) {
        console.error("[scripts] POST error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error", code: 'INTERNAL_ERROR' },
            { status: 500 }
        );
    }
}
