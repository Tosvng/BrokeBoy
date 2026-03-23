import React, { type ButtonHTMLAttributes } from "react";
import { motion } from "motion/react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  children,
  disabled,
  ...props
}) => {
  const baseStyles =
    "relative inline-flex items-center justify-center rounded-2xl font-semibold transition-all select-none disabled:opacity-40 disabled:cursor-not-allowed";

  const variantStyles: Record<string, string> = {
    primary: "bg-primary-gradient text-on-primary shadow-gold hover:shadow-pulse",
    secondary: "bg-surface-card-high text-on-surface hover:bg-outline-variant/30",
    tertiary: "bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-card",
    ghost: "border border-outline-variant text-on-surface hover:bg-surface-card",
  };

  const sizeStyles: Record<string, string> = {
    sm: "px-4 py-2 text-sm gap-1.5",
    md: "px-5 py-3 text-sm gap-2",
    lg: "px-6 py-4 text-base gap-2",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {isLoading ? (
        <svg
          className="animate-spin"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" />
          <path className="opacity-75" d="M4 12a8 8 0 018-8" />
        </svg>
      ) : (
        children
      )}
    </motion.button>
  );
};
