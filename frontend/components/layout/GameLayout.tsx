import React, { ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface GameLayoutProps {
  children: ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
  const { theme } = useTheme();

  return (
    <div 
      className="min-h-screen w-full flex flex-col overflow-hidden"
      style={{ 
        backgroundColor: theme.colors.background,
        color: theme.colors.text.primary 
      }}
    >
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-4 md:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
