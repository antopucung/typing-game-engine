import React, { ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { createLayoutStyles } from "../../design-system/layout";

interface ContainerProps {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  style?: React.CSSProperties;
}

export function Container({ 
  children, 
  maxWidth = "xl", 
  className = "",
  style = {}
}: ContainerProps) {
  const { theme } = useTheme();
  const layoutStyles = createLayoutStyles(theme);

  const maxWidthMap = {
    sm: "640px",
    md: "768px", 
    lg: "1024px",
    xl: "1280px",
    full: "100%",
  };

  const containerStyle: React.CSSProperties = {
    ...layoutStyles.container,
    maxWidth: maxWidthMap[maxWidth],
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      {children}
    </div>
  );
}
