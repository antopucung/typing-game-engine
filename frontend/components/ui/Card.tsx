import React, { ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getComponentStyle } from "../../design-system/components";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "elevated" | "outlined";
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ 
  children, 
  variant = "default", 
  className = "",
  style = {},
  onClick,
  hover = false
}: CardProps) {
  const { theme } = useTheme();

  const baseStyle = getComponentStyle("card", variant, theme);
  
  const interactiveStyles = (onClick || hover) ? {
    cursor: onClick ? "pointer" : "default",
    transition: theme.transitions.normal,
  } : {};

  const combinedStyle: React.CSSProperties = {
    ...baseStyle,
    ...interactiveStyles,
    ...style,
  };

  return (
    <div
      className={className}
      style={combinedStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick || hover) {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = theme.shadows.lg;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick || hover) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = baseStyle.boxShadow || theme.shadows.sm;
        }
      }}
    >
      {children}
    </div>
  );
}
