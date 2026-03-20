<<<<<<< HEAD
import React from 'react';
=======
import React from "react";
>>>>>>> origin/main

/**
 * A modal dialog component with backdrop and close functionality
 */
export interface ModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Modal size */
<<<<<<< HEAD
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
=======
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
>>>>>>> origin/main
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
<<<<<<< HEAD
  size = 'md',
=======
  size = "md",
>>>>>>> origin/main
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className={[
<<<<<<< HEAD
          'relative w-full bg-white rounded-xl shadow-2xl overflow-hidden',
          sizeClasses[size],
        ].join(' ')}
        onClick={e => e.stopPropagation()}
=======
          "relative w-full bg-white rounded-xl shadow-2xl overflow-hidden",
          sizeClasses[size],
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
>>>>>>> origin/main
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5 text-sm text-gray-600">{children}</div>
      </div>
    </div>
  );
}
