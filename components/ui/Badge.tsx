import React from "react";

type BadgeProps = {
  variant?: "success" | "draft" | "accent" | "gold";
  className?: string;
  children: React.ReactNode;
};

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  success: "border border-green/20 bg-green-bg text-green",
  draft: "border border-border2 bg-surface2 text-muted",
  accent: "border border-accent/25 bg-accent-glow text-accent2",
  gold: "border border-gold/20 bg-gold-bg text-gold",
};

export function Badge({ variant = "accent", className = "", children }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
