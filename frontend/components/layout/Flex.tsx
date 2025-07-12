import React, { ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { layoutConfig } from "../../design-system/layout";

interface FlexProps {
  children: ReactNode;
  direction?: "row" | "column";
  justify?: "start" | "center" | "end" | "between" | "around";
  align?: "start" | "center" | "end" | "stretch";
  gap?: string;
  wrap?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Flex({ 
  children, 
  direction = "row",
  justify = "start",
  align = "start",
  gap = "0",
  wrap = false,
  className = "",
  style = {}
}: FlexProps) {
  const { theme } = useTheme();

  const flexStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: layoutConfig.flex.direction[direction] as any,
    justifyContent: layoutConfig.flex.justify[justify],
    alignItems: layoutConfig.flex.align[align],
    gap,
    flexWrap: wrap ? "wrap" : "nowrap",
    ...style,
  };

  return (
    <div className={className} style={flexStyle}>
      {children}
    </div>
  );
}
