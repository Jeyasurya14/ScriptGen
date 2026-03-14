import React from "react";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-xl bg-white/[0.06]",
        "before:absolute before:inset-0 before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)] before:bg-[length:200%_100%] before:animate-shimmer",
        className,
      ].join(" ")}
    />
  );
}

export function SkeletonText({
  lines = 1,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-4 ${index === lines - 1 && lines > 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
}

export function SkeletonCircle({ className = "" }: { className?: string }) {
  return <Skeleton className={`rounded-full ${className}`} />;
}
