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

// GET - Fetch a specific script
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

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
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get script
        const { data: script, error } = await supabase
            .from("scripts")
            .select("*")
            .eq("id", id)
            .eq("user_id", user.id)
            .single();

        if (error || !script) {
            return NextResponse.json({ error: "Script not found" }, { status: 404 });
        }

        return NextResponse.json({ script });
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
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Delete script (only if owned by user)
        const { error } = await supabase
            .from("scripts")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting script:", error);
        return NextResponse.json({ error: "Failed to delete script" }, { status: 500 });
    }
}
