"use client";

import AppErrorState from "@/components/AppErrorState";

export default function ErrorState({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AppErrorState title="Failed to load generator" error={error} reset={reset} />;
}
