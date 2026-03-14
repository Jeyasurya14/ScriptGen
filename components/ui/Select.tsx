import React, { useId } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-bold text-white/50 uppercase tracking-wider pl-1 cursor-pointer">
            {label}
          </label>
        )}
        <div className="relative group">
          <select
            ref={ref}
            id={selectId}
            className={`
              appearance-none w-full bg-surface2 border border-white/10 rounded-xl px-4 py-3
              text-sm text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
              transition-all duration-200 cursor-pointer pr-10
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? "border-red/50 focus:border-red" : ""}
              ${className}
            `}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-surface text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 group-focus-within:text-accent transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="text-[10px] font-semibold text-red pl-1 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
