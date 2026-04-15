"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function AppErrorState({
  title,
  error,
  reset,
}: {
  title: string;
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4">
      <div className="w-full max-w-md rounded border border-border bg-surface p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded border border-red/20 bg-red-bg text-red">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <h1 className="mt-5 text-base font-semibold text-white">{title}</h1>
        <p className="mt-2 text-sm text-muted">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>
        {error.digest && (
          <p className="mt-1 font-mono text-[10px] text-hint">digest: {error.digest}</p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button variant="ghost" size="sm" onClick={reset}>
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
          <Link href="/">
            <Button size="sm">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
