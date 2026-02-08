"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#030306] flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ef4444]/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative max-w-md w-full text-center">
        {/* Error icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-[#0c0c12] border border-[#ef4444]/20 flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-[#ef4444]" />
        </div>

        {/* Error message */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Something went wrong
        </h1>
        <p className="text-[#a1a1b5] mb-8 leading-relaxed">
          An unexpected error occurred. Don&apos;t worry, our team has been
          notified and is working on a fix.
        </p>

        {/* Error details */}
        {error.digest && (
          <p className="text-xs text-[#6b6b80] mb-8 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold bg-[#6366f1] hover:bg-[#5558e8] shadow-lg shadow-[#6366f1]/25 hover:shadow-[#6366f1]/40 transition-all duration-200 hover:-translate-y-0.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[#a1a1b5] hover:text-white font-medium bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
