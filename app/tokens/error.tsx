"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ErrorState({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-red/10 flex items-center justify-center text-red mb-6 border border-red/20 shadow-[0_0_30px_-5px_rgba(255,92,122,0.3)]">
        <AlertCircle size={32} />
      </div>
      <h2 className="font-head font-bold text-2xl text-white mb-3">Failed to load tokens page</h2>
      <p className="text-white/60 max-w-md mb-8">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <div className="flex gap-4">
        <Button variant="ghost" onClick={() => window.location.href = '/'}>
          Go Home
        </Button>
        <Button variant="primary" onClick={() => reset()}>
          <RefreshCw size={16} className="mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
