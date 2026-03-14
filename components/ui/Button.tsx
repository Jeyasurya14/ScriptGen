import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "border border-accent/40 bg-[linear-gradient(135deg,#6C63FF,#B06AFF)] text-white shadow-[0_18px_40px_rgba(108,99,255,0.28)] hover:brightness-110",
  ghost:
    "border border-border2 bg-white/[0.02] text-white hover:border-accent/40 hover:bg-white/[0.05]",
  danger:
    "border border-red/40 bg-red-bg text-red hover:bg-red/15",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 rounded-lg px-3 text-xs",
  md: "h-11 rounded-xl px-5 text-sm",
  lg: "h-12 rounded-xl px-6 text-sm",
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
        "inline-flex items-center justify-center gap-2 whitespace-nowrap font-head font-semibold tracking-[0.01em] transition duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current"
            aria-hidden="true"
          />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
