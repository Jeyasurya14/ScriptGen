import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "border border-accent bg-accent text-white hover:bg-accent/90",
  ghost:
    "border border-border2 bg-surface text-white hover:border-white/20 hover:bg-surface2",
  danger:
    "border border-red/40 bg-red-bg text-red hover:bg-red/15",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 rounded-md px-3 text-xs",
  md: "h-9 rounded-md px-4 text-sm",
  lg: "h-10 rounded-md px-5 text-sm",
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
        "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg",
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
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/30 border-t-current"
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
