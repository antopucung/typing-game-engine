import React, { ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getComponentStyle } from "../../design-system/components";
import { LucideIcon } from "lucide-react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "disabled";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  className?: string;
  style?: React.CSSProperties;
}

export function Button({ 
  children, 
  onClick, 
  disabled = false, 
  variant = "primary", 
  size = "md",
  icon: Icon,
  className = "",
  style = {}
}: ButtonProps) {
  const { theme } = useTheme();

  const baseStyle = getComponentStyle("button", disabled ? "disabled" : variant, theme);
  
  const sizeStyles = {
    sm: {
      padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
      fontSize: theme.typography.fontSize.sm,
    },
    md: {
      padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
      fontSize: theme.typography.fontSize.base,
    },
    lg: {
      padding: `${theme.spacing[4]} ${theme.spacing[8]}`,
      fontSize: theme.typography.fontSize.lg,
    },
  };

  const hoverStyles = !disabled && variant !== "disabled" ? {
    ":hover": {
      opacity: 0.9,
      transform: "scale(1.05)",
      boxShadow: theme.shadows.lg,
    },
    ":active": {
      transform: "scale(0.95)",
    },
  } : {};

  const combinedStyle: React.CSSProperties = {
    ...baseStyle,
    ...sizeStyles[size],
    ...style,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing[2],
    outline: "none",
    userSelect: "none",
    ...hoverStyles,
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={className}
      style={combinedStyle}
      onMouseEnter={(e) => {
        if (!disabled && variant !== "disabled") {
          e.currentTarget.style.opacity = "0.9";
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = theme.shadows.lg;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && variant !== "disabled") {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = baseStyle.boxShadow || "none";
        }
      }}
      onMouseDown={(e) => {
        if (!disabled && variant !== "disabled") {
          e.currentTarget.style.transform = "scale(0.95)";
        }
      }}
      onMouseUp={(e) => {
        if (!disabled && variant !== "disabled") {
          e.currentTarget.style.transform = "scale(1.05)";
        }
      }}
    >
      {Icon && <Icon style={{ width: "1.25rem", height: "1.25rem" }} />}
      <span>{children}</span>
    </button>
  );
}
