import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = "" }: SkeletonProps) => {
  return (
    <div
      className={`animate-pulse bg-surface2 rounded-md ${className}`}
    />
  );
};

export const SkeletonText = ({ lines = 1, className = "" }: { lines?: number; className?: string }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 && lines > 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
};

export const SkeletonCircle = ({ className = "" }: { className?: string }) => {
  return <Skeleton className={`rounded-full ${className}`} />;
};
