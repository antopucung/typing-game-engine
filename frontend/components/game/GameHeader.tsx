import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Trophy, Zap, Target } from "lucide-react";

export function GameHeader() {
  const { theme } = useTheme();
  const { state } = useTypingEngine();

  return (
    <header 
      className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg mb-6"
      style={{ 
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.ui.border}` 
      }}
    >
      <div className="flex items-center space-x-3 mb-4 sm:mb-0">
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Typing Master</h1>
          <p style={{ color: theme.colors.text.secondary }} className="text-sm">
            Level {state.level} • {state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5" style={{ color: theme.colors.accent }} />
          <span className="font-semibold">{state.score}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5" style={{ color: theme.colors.status.correct }} />
          <span className="font-semibold">{state.maxCombo}</span>
        </div>
      </div>
    </header>
  );
}
