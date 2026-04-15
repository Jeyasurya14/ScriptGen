import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:   "bg-accent text-white border-transparent hover:bg-accent/90",
  secondary: "bg-surface2 text-white border-border hover:bg-surface border-transparent hover:border-border",
  ghost:     "bg-transparent text-muted border-border hover:bg-surface hover:text-white",
  danger:    "bg-red-bg text-red border-red/30 hover:bg-red/15",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-7 rounded px-2.5 text-xs gap-1.5",
  md: "h-8 rounded px-3 text-sm gap-2",
  lg: "h-9 rounded px-4 text-sm gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center whitespace-nowrap border font-medium transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg",
        "disabled:cursor-not-allowed disabled:opacity-40",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-3 w-3 animate-spin rounded-full border border-current/20 border-t-current" aria-hidden />
          <span>Processing…</span>
        </>
      ) : children}
    </button>
  );
}
