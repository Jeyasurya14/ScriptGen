import { NextResponse } from "next/server";

const isProd = process.env.NODE_ENV === "production";

/**
 * Sanitize error message for API response - never expose internal details in production
 */
export function sanitizeError(error: unknown): string {
    if (isProd) {
        return "An error occurred. Please try again.";
    }
    if (error instanceof Error) return error.message;
    return String(error);
}

/**
 * Consistent API error response
 */
export function apiError(
    message: string,
    status: number = 500,
    details?: unknown
): NextResponse {
    const body: Record<string, unknown> = { error: message };
    if (!isProd && details !== undefined) {
        body.details = details;
    }
    return NextResponse.json(body, { status });
}
