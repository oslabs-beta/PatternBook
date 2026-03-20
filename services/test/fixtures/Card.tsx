<<<<<<< HEAD
import React from 'react';
import Button from './Button';
import Input from './Input';
import Modal from './Modal';
import Dropdown from './Dropdown';
=======
import React from "react";
>>>>>>> origin/main

/**
 * A container component for grouping related content with optional header and footer
 */
export interface CardProps {
  /** Card title displayed in header */
  title?: string;
  /** Content for card footer */
  footer?: React.ReactNode;
  /** Main card content */
  children: React.ReactNode;
  /** Visual style variant */
<<<<<<< HEAD
  variant?: 'default' | 'bordered' | 'elevated';
}

const variantClasses: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'bg-white border border-gray-200',
  bordered: 'bg-white border-2 border-gray-300',
  elevated: 'bg-white border border-gray-100 shadow-lg',
=======
  variant?: "default" | "bordered" | "elevated";
}

const variantClasses: Record<NonNullable<CardProps["variant"]>, string> = {
  default: "bg-white border border-gray-200",
  bordered: "bg-white border-2 border-gray-300",
  elevated: "bg-white border border-gray-100 shadow-lg",
>>>>>>> origin/main
};

export function Card({
  title,
  footer,
  children,
<<<<<<< HEAD
  variant = 'default',
=======
  variant = "default",
>>>>>>> origin/main
}: CardProps) {
  return (
    <div
      className={[
<<<<<<< HEAD
        'rounded-xl overflow-hidden w-full max-w-sm',
        variantClasses[variant],
      ].join(' ')}
=======
        "rounded-xl overflow-hidden w-full max-w-sm",
        variantClasses[variant],
      ].join(" ")}
>>>>>>> origin/main
    >
      {title && (
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
      )}
<<<<<<< HEAD
      <Button />
      <Input />
      <Modal />
      <Dropdown />
=======
>>>>>>> origin/main
      <div className="px-5 py-4 text-sm text-gray-600">{children}</div>
      {footer && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
          {footer}
        </div>
      )}
    </div>
  );
}
