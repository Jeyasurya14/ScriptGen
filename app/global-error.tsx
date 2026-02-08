"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#030306] flex items-center justify-center p-4">
        {/* Inline styles for critical error page - no external CSS dependencies */}
        <style>{`
          body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 0;
          }
          .error-container {
            max-width: 28rem;
            width: 100%;
            text-align: center;
          }
          .error-icon-wrapper {
            position: relative;
            width: 6rem;
            height: 6rem;
            margin: 0 auto 2rem;
          }
          .error-icon-bg {
            display: none;
          }
          .error-icon {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 1.5rem;
            background: #0c0c12;
            border: 1px solid rgba(239, 68, 68, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .error-title {
            font-size: 1.875rem;
            font-weight: 700;
            color: #ffffff;
            margin: 0 0 1rem;
          }
          .error-message {
            color: #a1a1b5;
            margin: 0 0 2rem;
            line-height: 1.7;
          }
          .error-id {
            font-size: 0.75rem;
            color: #6b6b80;
            font-family: monospace;
            margin: 0 0 2rem;
          }
          .retry-button {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.875rem 1.5rem;
            border-radius: 0.75rem;
            background: #6366f1;
            color: white;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 14px -3px rgba(99, 102, 241, 0.4);
          }
          .retry-button:hover {
            background: #5558e8;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px -3px rgba(99, 102, 241, 0.5);
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>

        <div className="error-container">
          <div className="error-icon-wrapper">
            <div className="error-icon-bg" />
            <div className="error-icon">
              <AlertTriangle
                style={{ width: "3rem", height: "3rem", color: "#ef4444" }}
              />
            </div>
          </div>

          <h1 className="error-title">Critical Error</h1>
          <p className="error-message">
            A critical error has occurred. The application needs to be
            refreshed. We apologize for the inconvenience.
          </p>

          {error.digest && (
            <p className="error-id">Error ID: {error.digest}</p>
          )}

          <button onClick={reset} className="retry-button">
            <RefreshCw style={{ width: "1rem", height: "1rem" }} />
            Refresh Application
          </button>
        </div>
      </body>
    </html>
  );
}
