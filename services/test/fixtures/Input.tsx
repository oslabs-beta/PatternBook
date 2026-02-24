import React from "react";

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
  type?: "text" | "email" | "password" | "number";
  /** Controlled input value */
  value?: string;
  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
  label,
  placeholder,
  error,
  type = "text",
  value,
  onChange,
}: InputProps) {
  return (
    <div className="input-wrapper">
      {label && <label>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
