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
    <div className="flex min-h-[calc(100vh-60px)] items-center justify-center px-4">
      <div className="glass-panel w-full max-w-lg rounded-[28px] p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red/20 bg-red-bg text-red">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-head text-2xl font-bold text-white">{title}</h1>
        <p className="mt-3 text-sm text-muted">
          {error.message || "Something unexpected happened while loading this page."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="ghost" onClick={reset}>
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Link href="/" className="inline-flex">
            <Button variant="primary">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
