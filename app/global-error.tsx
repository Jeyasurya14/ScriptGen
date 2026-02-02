"use client";

import { useEffect } from "react";

/**
 * Root-level error boundary. Catches unhandled errors in the app shell.
 * Must include html and body for layout reset.
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        if (process.env.NODE_ENV === "production") {
            // Send to error tracking service (e.g. Sentry) here
            console.error("[global-error]", error?.message || error);
        } else {
            console.error("[global-error]", error);
        }
    }, [error]);

    return (
        <html lang="en">
            <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center", padding: 24, maxWidth: 400 }}>
                    <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: "#64748b", marginBottom: 24, lineHeight: 1.5 }}>
                        An unexpected error occurred. Please try again.
                    </p>
                    <button
                        onClick={reset}
                        style={{
                            padding: "12px 24px",
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            fontWeight: 500,
                            cursor: "pointer",
                        }}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
