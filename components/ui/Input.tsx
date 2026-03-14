import React, { useId } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-2">
        {label ? (
          <label
            htmlFor={inputId}
            className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted"
          >
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={[
            "w-full rounded-xl border border-border2 bg-surface2 px-4 py-3 text-sm text-white placeholder:text-hint",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            error ? "border-red/40" : "focus:border-accent/40",
            className,
          ].join(" ")}
          {...props}
        />
        {error ? <p className="text-xs text-red">{error}</p> : null}
      </div>
    );
  },
);

Input.displayName = "Input";
