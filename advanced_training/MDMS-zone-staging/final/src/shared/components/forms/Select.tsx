import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";
import "./forms.css";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  // Compact = filter in a table toolbar: no visible label, no bottom margin.
  compact?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, placeholder, compact, id, className = "", ...rest }, ref) => {
    const autoId = useId();
    const selectId = id ?? autoId;
    return (
      <div className={`field ${compact ? "field--compact" : ""}`}>
        <label htmlFor={selectId} className={compact ? "sr-only" : "field__label"}>
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={`field__input ${error ? "field__input--error" : ""} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...rest}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${selectId}-error`} className="field__error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Select.displayName = "Select";

export default Select;
