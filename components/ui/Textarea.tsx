import React, { useId } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-bold text-white/50 uppercase tracking-wider pl-1 cursor-pointer">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full bg-surface2 border border-white/10 rounded-xl px-4 py-3
            text-sm text-white placeholder:text-white/20 min-h-[120px] resize-y
            focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red/50 focus:border-red" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-[10px] font-semibold text-red pl-1 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
