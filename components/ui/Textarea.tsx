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
      <div className="w-full space-y-1.5">
        {label ? (
          <label
            htmlFor={textareaId}
            className="block text-xs font-medium text-muted"
          >
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          id={textareaId}
          className={[
            "w-full resize-y rounded-md border border-border2 bg-surface2 px-3 py-2.5 text-sm text-white placeholder:text-hint",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg",
            error ? "border-red/40" : "focus:border-white/20",
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
