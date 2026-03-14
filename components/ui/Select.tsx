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
      <div className="w-full space-y-2">
        {label ? (
          <label
            htmlFor={selectId}
            className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted"
          >
            {label}
          </label>
        ) : null}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={[
              "w-full appearance-none rounded-xl border border-border2 bg-surface2 px-4 py-3 pr-10 text-sm text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              error ? "border-red/40" : "focus:border-accent/40",
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
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted">
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
