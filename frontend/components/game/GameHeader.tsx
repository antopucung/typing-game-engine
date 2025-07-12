import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Zap } from "lucide-react";

export function GameHeader() {
  const { theme } = useTheme();
  const { state } = useTypingEngine();

  return (
    <header 
      className="flex items-center justify-center p-6 mb-6"
    >
      <div className="flex items-center space-x-3">
        <div 
          className="p-3 rounded-lg"
          style={{ 
            backgroundColor: theme.colors.primary,
          }}
        >
          <Zap className="w-8 h-8 text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold" style={{ color: theme.colors.text.primary }}>
            Typing Master
          </h1>
          <p style={{ color: theme.colors.text.secondary }} className="text-lg">
            Test your typing speed and accuracy
          </p>
        </div>
      </div>
    </header>
  );
}
