import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Production-grade middleware: request tracing and security.
 * Security headers are set in next.config.ts; this adds request-id for logging/tracing.
 */
export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const requestId =
        request.headers.get("x-request-id") ||
        (typeof crypto !== "undefined" && "randomUUID" in crypto
            ? (crypto as { randomUUID: () => string }).randomUUID()
            : `req-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`);
    response.headers.set("X-Request-ID", requestId);
    return response;
}

export const config = {
    matcher: [
        /*
         * Match all pathnames except static files and api/health (no need to add ID for health checks).
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
    ],
};
