import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const getSupabase = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
};

// GET - Fetch user's script history
export async function GET(req: NextRequest) {
    const supabase = getSupabase();
    if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user
        const { data: user } = await supabase
            .from("users")
            .select("id")
            .eq("email", session.user.email)
            .single();

        if (!user) {
            return NextResponse.json({ scripts: [] });
        }

        // Get scripts
        const { data: scripts, error } = await supabase
            .from("scripts")
            .select("id, title, channel_name, duration, content_type, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(50);

        if (error) throw error;

        return NextResponse.json({ scripts: scripts || [] });
    } catch (error) {
        console.error("Error fetching scripts:", error);
        return NextResponse.json({ error: "Failed to fetch scripts" }, { status: 500 });
    }
}

// POST - Save a new script
export async function POST(req: NextRequest) {
    const supabase = getSupabase();
    if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // Get user
        const { data: user } = await supabase
            .from("users")
            .select("id")
            .eq("email", session.user.email)
            .single();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Save script
        const { data: script, error } = await supabase
            .from("scripts")
            .insert({
                user_id: user.id,
                title: body.title,
                channel_name: body.channelName,
                duration: body.duration,
                content_type: body.contentType,
                script_content: body.scriptContent,
                seo_data: body.seoData,
                images_data: body.imagesData,
                chapters_data: body.chaptersData,
                broll_data: body.brollData,
                shorts_data: body.shortsData,
            })
            .select("id")
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, scriptId: script?.id });
    } catch (error) {
        console.error("Error saving script:", error);
        return NextResponse.json({ error: "Failed to save script" }, { status: 500 });
    }
}
