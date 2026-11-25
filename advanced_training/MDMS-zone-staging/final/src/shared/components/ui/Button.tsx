import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./ui.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  icon?: ReactNode;
}

export default function Button({
  variant = "secondary",
  size = "md",
  icon,
  className = "",
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={`btn btn--${variant} btn--${size} ${className}`} {...rest}>
      {icon}
      {children}
    </button>
  );
}
