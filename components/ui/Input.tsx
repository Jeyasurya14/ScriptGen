import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-bold text-white/50 uppercase tracking-wider pl-1 cursor-pointer">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full bg-surface2 border border-white/10 rounded-xl px-4 py-3
            text-sm text-white placeholder:text-white/20
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

Input.displayName = "Input";
