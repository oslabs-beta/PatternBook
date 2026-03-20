<<<<<<< HEAD
import React from 'react';
=======
import React from "react";
>>>>>>> origin/main

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
<<<<<<< HEAD
  placeholder = 'Select...',
=======
  placeholder = "Select...",
>>>>>>> origin/main
  disabled = false,
}: DropdownProps) {
  return (
    <div className="relative w-full max-w-sm">
      <select
<<<<<<< HEAD
        value={value ?? ''}
        onChange={e => onChange?.(e.target.value)}
        disabled={disabled}
        className={[
          'w-full appearance-none px-3 py-2 pr-8 text-sm rounded-md border bg-white shadow-sm',
          'transition-colors duration-150 cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          disabled
            ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200'
            : 'border-gray-300 hover:border-gray-400 text-gray-700',
          !value ? 'text-gray-400' : 'text-gray-700',
        ].join(' ')}
=======
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={[
          "w-full appearance-none px-3 py-2 pr-8 text-sm rounded-md border bg-white shadow-sm",
          "transition-colors duration-150 cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          disabled
            ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200"
            : "border-gray-300 hover:border-gray-400 text-gray-700",
          !value ? "text-gray-400" : "text-gray-700",
        ].join(" ")}
>>>>>>> origin/main
      >
        <option value="" disabled>
          {placeholder}
        </option>
<<<<<<< HEAD
        {options.map(opt => (
=======
        {options.map((opt) => (
>>>>>>> origin/main
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Custom chevron arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
