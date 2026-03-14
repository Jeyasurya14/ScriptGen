import React from "react";

interface BadgeProps {
  variant?: "success" | "draft" | "accent" | "gold";
  className?: string;
  children: React.ReactNode;
}

export const Badge = ({
  variant = "accent",
  className = "",
  children
}: BadgeProps) => {
  const baseStyles = "px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase inline-flex items-center justify-center";

  const variants = {
    accent: "bg-accent/10 text-accent border border-accent/20",
    success: "bg-green/10 text-green border border-green/20",
    gold: "bg-gold/10 text-gold border border-gold/20",
    draft: "bg-surface2 text-white/50 border border-white/10",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
