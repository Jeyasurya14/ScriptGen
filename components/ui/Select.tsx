import React, { useId } from "react";

type SelectOption = { label: string; value: string };
type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: SelectOption[];
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", id, ...props }, ref) => {
    const uid = useId();
    const selectId = id || uid;
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-medium text-muted">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={[
              "w-full appearance-none rounded border border-border bg-surface2 px-3 py-2 pr-8 text-sm text-white transition",
              "focus:border-border2 focus:outline-none focus:ring-1 focus:ring-accent",
              error ? "border-red/40" : "",
              className,
            ].join(" ")}
            {...props}
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-muted">
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        {error && <p className="text-xs text-red">{error}</p>}
      </div>
    );
  },
);
Select.displayName = "Select";
