import React, { useId } from "react";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: SelectOption[];
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label ? (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-muted"
          >
            {label}
          </label>
        ) : null}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={[
              "w-full appearance-none rounded-md border border-border2 bg-surface2 px-3 py-2 pr-8 text-sm text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg",
              error ? "border-red/40" : "focus:border-white/20",
              className,
            ].join(" ")}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted">
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </div>
        {error ? <p className="text-xs text-red">{error}</p> : null}
      </div>
    );
  },
);

Select.displayName = "Select";
