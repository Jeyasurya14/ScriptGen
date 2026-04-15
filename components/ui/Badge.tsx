import React from "react";

type BadgeProps = {
  variant?: "default" | "success" | "warning" | "danger" | "draft";
  className?: string;
  children: React.ReactNode;
};

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "border-border2 bg-surface2 text-muted",
  success: "border-green/20 bg-green-bg text-green",
  warning: "border-gold/20 bg-gold-bg text-gold",
  danger:  "border-red/20 bg-red-bg text-red",
  draft:   "border-border bg-surface text-hint",
};

export function Badge({ variant = "default", className = "", children }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
