import React, { ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { LucideIcon } from "lucide-react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "disabled";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  className?: string;
}

export function Button({ 
  children, 
  onClick, 
  disabled = false, 
  variant = "primary", 
  size = "md",
  icon: Icon,
  className = ""
}: ButtonProps) {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: theme.colors.primary,
          color: "white",
          border: `1px solid ${theme.colors.primary}`,
        };
      case "secondary":
        return {
          backgroundColor: theme.colors.surface,
          color: theme.colors.text.primary,
          border: `1px solid ${theme.colors.ui.border}`,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          color: theme.colors.text.primary,
          border: `1px solid ${theme.colors.ui.border}`,
        };
      case "disabled":
        return {
          backgroundColor: theme.colors.surface,
          color: theme.colors.text.muted,
          border: `1px solid ${theme.colors.ui.border}`,
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-sm";
      case "lg":
        return "px-8 py-4 text-lg";
      default:
        return "px-6 py-3 text-base";
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center space-x-2 
    font-medium rounded-lg transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${getSizeStyles()}
    ${disabled || variant === "disabled" ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-90"}
    ${className}
  `;

  return (
    <button
      onClick={disabled || variant === "disabled" ? undefined : onClick}
      disabled={disabled || variant === "disabled"}
      className={baseClasses}
      style={{
        ...getVariantStyles(),
        focusRingColor: theme.colors.ui.focus,
      }}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
    </button>
  );
}
