import React, { useId } from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full space-y-2">
        {label ? (
          <label
            htmlFor={textareaId}
            className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted"
          >
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          id={textareaId}
          className={[
            "w-full resize-y rounded-xl border border-border2 bg-surface2 px-4 py-3 text-sm text-white placeholder:text-hint",
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

Textarea.displayName = "Textarea";
