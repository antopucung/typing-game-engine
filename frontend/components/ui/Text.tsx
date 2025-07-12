import React, { ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getComponentStyle } from "../../design-system/components";

interface TextProps {
  children: ReactNode;
  variant?: "heading" | "body" | "caption" | "mono";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  weight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
  color?: "primary" | "secondary" | "muted" | "success" | "warning" | "error";
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  className?: string;
  style?: React.CSSProperties;
}

export function Text({ 
  children, 
  variant = "body",
  size = "base",
  weight,
  color = "primary",
  as: Component = "span",
  className = "",
  style = {}
}: TextProps) {
  const { theme } = useTheme();

  const baseStyle = getComponentStyle("text", variant, theme);
  
  const sizeStyle = {
    fontSize: theme.typography.fontSize[size],
  };

  const weightStyle = weight ? {
    fontWeight: theme.typography.fontWeight[weight],
  } : {};

  const colorMap = {
    primary: theme.colors.text.primary,
    secondary: theme.colors.text.secondary,
    muted: theme.colors.text.muted,
    success: theme.colors.status.correct,
    warning: theme.colors.status.current,
    error: theme.colors.status.incorrect,
  };

  const colorStyle = {
    color: colorMap[color],
  };

  const combinedStyle: React.CSSProperties = {
    ...baseStyle,
    ...sizeStyle,
    ...weightStyle,
    ...colorStyle,
    ...style,
  };

  return (
    <Component className={className} style={combinedStyle}>
      {children}
    </Component>
  );
}
