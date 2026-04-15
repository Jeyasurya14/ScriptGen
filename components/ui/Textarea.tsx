import React, { useId } from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const uid = useId();
    const textareaId = id || uid;
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-medium text-muted">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={[
            "w-full resize-y rounded border border-border bg-surface2 px-3 py-2 text-sm text-white placeholder-hint transition",
            "focus:border-border2 focus:outline-none focus:ring-1 focus:ring-accent",
            error ? "border-red/40" : "",
            className,
          ].join(" ")}
          {...props}
        />
        {error && <p className="text-xs text-red">{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";
