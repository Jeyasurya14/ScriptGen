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

// GET - Check user credits
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
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get credits
        const { data: credits } = await supabase
            .from("user_credits")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (!credits) {
            // Initialize credits if not exists
            await supabase
                .from("user_credits")
                .insert({
                    user_id: user.id,
                    free_scripts_used: 0,
                    paid_credits: 0,
                    total_generated: 0,
                });

            return NextResponse.json({
                freeScriptsUsed: 0,
                freeScriptsRemaining: 2,
                paidCredits: 0,
                canGenerate: true,
            });
        }

        const freeScriptsRemaining = Math.max(0, 2 - credits.free_scripts_used);
        const canGenerate = freeScriptsRemaining > 0 || credits.paid_credits > 0;

        return NextResponse.json({
            freeScriptsUsed: credits.free_scripts_used,
            freeScriptsRemaining,
            paidCredits: credits.paid_credits,
            totalGenerated: credits.total_generated,
            canGenerate,
        });
    } catch (error) {
        console.error("Error fetching credits:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

// POST - Use a credit (called after successful generation)
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

        // Get user
        const { data: user } = await supabase
            .from("users")
            .select("id")
            .eq("email", session.user.email)
            .single();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get current credits
        const { data: credits } = await supabase
            .from("user_credits")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (!credits) {
            return NextResponse.json({ error: "No credits found" }, { status: 404 });
        }

        // Check what to deduct
        const freeRemaining = 2 - credits.free_scripts_used;

        if (freeRemaining > 0) {
            // Use free credit
            await supabase
                .from("user_credits")
                .update({
                    free_scripts_used: credits.free_scripts_used + 1,
                    total_generated: credits.total_generated + 1,
                })
                .eq("user_id", user.id);
        } else if (credits.paid_credits > 0) {
            // Use paid credit
            await supabase
                .from("user_credits")
                .update({
                    paid_credits: credits.paid_credits - 1,
                    total_generated: credits.total_generated + 1,
                })
                .eq("user_id", user.id);
        } else {
            return NextResponse.json({ error: "No credits available" }, { status: 403 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error using credit:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
