import React from "react";
import Button from "./Button"
import Dropdown from "./Dropdown"

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
  variant?: "default" | "bordered" | "elevated";
}

export function Card({
  title,
  footer,
  children,
  variant = "default",
}: CardProps) {
  return (
    <div className={`card card-${variant}`}>
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
