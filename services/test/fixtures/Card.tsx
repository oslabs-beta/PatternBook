import React from 'react';
import Button from './Button';
import Input from './Input';
import Modal from './Modal';
import Dropdown from './Dropdown';

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
  variant?: 'default' | 'bordered' | 'elevated';
}

const variantClasses: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'bg-white border border-gray-200',
  bordered: 'bg-white border-2 border-gray-300',
  elevated: 'bg-white border border-gray-100 shadow-lg',
};

export function Card({
  title,
  footer,
  children,
  variant = 'default',
}: CardProps) {
  return (
    <div
      className={[
        'rounded-xl overflow-hidden w-full max-w-sm',
        variantClasses[variant],
      ].join(' ')}
    >
      {title && (
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <Button />
      <Input />
      <Modal />
      <Dropdown />
      <div className="px-5 py-4 text-sm text-gray-600">{children}</div>
      {footer && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
          {footer}
        </div>
      )}
    </div>
  );
}
