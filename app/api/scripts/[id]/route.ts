import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch a specific script
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

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

        // Get script
        const script = await prisma.script.findFirst({
            where: {
                id: id,
                userId: user.id,
            },
        });

        if (!script) {
            return NextResponse.json({ error: "Script not found" }, { status: 404 });
        }

        // Return script with mapped fields if necessary, or usage of script object directly
        // The previous implementation returned `{ script }` where script was the raw db row.
        // Prisma returns camelCase.
        // If frontend expects usage of `data.script.script_content` (snake_case), we need to map.
        // Let's assume we mapped it.
        const formattedScript = {
            id: script.id,
            user_id: script.userId,
            title: script.title,
            channel_name: script.channelName,
            duration: script.duration,
            content_type: script.contentType,
            script_content: script.scriptContent,
            seo_data: script.seoData,
            images_data: script.imagesData,
            chapters_data: script.chaptersData,
            broll_data: script.brollData,
            shorts_data: script.shortsData,
            created_at: script.createdAt,
        };

        return NextResponse.json({ script: formattedScript });
    } catch (error) {
        console.error("Error fetching script:", error);
        return NextResponse.json({ error: "Failed to fetch script" }, { status: 500 });
    }
}

// DELETE - Delete a script
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

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

        // Delete script (only if owned by user)
        // usage of deleteMany to avoid error if not found, or explicit check?
        // standard pattern:
        const deleteResult = await prisma.script.deleteMany({
            where: {
                id: id,
                userId: user.id,
            },
        });

        if (deleteResult.count === 0) {
            // Maybe it didn't exist or belonged to another user.
            // Original logic: just tried to delete.
            // If we want to return success even if not found, that's fine.
            // But usually it implies success.
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting script:", error);
        return NextResponse.json({ error: "Failed to delete script" }, { status: 500 });
    }
}
