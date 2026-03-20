<<<<<<< HEAD
import React from 'react';
=======
import React from "react";
>>>>>>> origin/main

/**
 * A flexible input field with label, error states, and validation support
 */
export interface InputProps {
  /** Label text displayed above the input */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Error message to display */
  error?: string;
  /** Input type */
<<<<<<< HEAD
  type?: 'text' | 'email' | 'password' | 'number';
=======
  type?: "text" | "email" | "password" | "number";
>>>>>>> origin/main
  /** Controlled input value */
  value?: string;
  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
  label,
  placeholder,
  error,
<<<<<<< HEAD
  type = 'text',
=======
  type = "text",
>>>>>>> origin/main
  value,
  onChange,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full max-w-sm">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={[
<<<<<<< HEAD
          'w-full px-3 py-2 text-sm rounded-md border bg-white shadow-sm transition-colors duration-150',
          'placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          error
            ? 'border-red-400 focus:ring-red-400'
            : 'border-gray-300 hover:border-gray-400',
        ].join(' ')}
=======
          "w-full px-3 py-2 text-sm rounded-md border bg-white shadow-sm transition-colors duration-150",
          "placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          error
            ? "border-red-400 focus:ring-red-400"
            : "border-gray-300 hover:border-gray-400",
        ].join(" ")}
>>>>>>> origin/main
      />
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
