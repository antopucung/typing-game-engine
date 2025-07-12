import React, { ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { layoutConfig } from "../../design-system/layout";

interface GridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: "sm" | "md" | "lg" | "xl";
  className?: string;
  style?: React.CSSProperties;
}

export function Grid({ 
  children, 
  columns = 1, 
  gap = "md",
  className = "",
  style = {}
}: GridProps) {
  const { theme } = useTheme();

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: layoutConfig.grid.columns[columns],
    gap: layoutConfig.grid.gap[gap],
    ...style,
  };

  return (
    <div className={className} style={gridStyle}>
      {children}
    </div>
  );
}
