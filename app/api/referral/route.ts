import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Referral feature is disabled until referral_code column and referrals table exist.
// Run referral-migration.sql on your database to enable.

const REFERRAL_DISABLED = true;

// GET - Get my referral code and link (returns empty until migration is run)
export async function GET() {
    if (REFERRAL_DISABLED) {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ code: "", link: "" });
    }
    return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

// POST - Apply a referral code (returns error until migration is run)
export async function POST(req: NextRequest) {
    if (REFERRAL_DISABLED) {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json(
            { error: "Referral feature is not enabled yet. Run referral-migration.sql on your database to enable it." },
            { status: 503 }
        );
    }
    return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
