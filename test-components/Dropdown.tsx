import React from "react";

/**
 * A dropdown select component with customizable options
 */
export interface DropdownProps {
  /** Array of dropdown options */
  options: Array<{ value: string; label: string }>;
  /** Currently selected value */
  value?: string;
  /** Callback when selection changes */
  onChange?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether dropdown is disabled */
  disabled?: boolean;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
}: DropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
