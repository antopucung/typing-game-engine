import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Trophy, Zap, Target, Crown, Star } from "lucide-react";

export function GameHeader() {
  const { theme } = useTheme();
  const { state } = useTypingEngine();

  const getLevelColor = () => {
    if (state.level >= 10) return theme.colors.accent;
    if (state.level >= 5) return theme.colors.status.correct;
    return theme.colors.primary;
  };

  const getStreakColor = () => {
    if (state.streak >= 50) return theme.colors.accent;
    if (state.streak >= 25) return theme.colors.status.correct;
    if (state.streak >= 10) return theme.colors.primary;
    return theme.colors.text.muted;
  };

  return (
    <header 
      className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg mb-6 transition-all duration-300"
      style={{ 
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.ui.border}`,
        boxShadow: state.combo >= 25 ? `0 0 20px ${theme.colors.accent}30` : 'none'
      }}
    >
      <div className="flex items-center space-x-3 mb-4 sm:mb-0">
        <div 
          className={`p-2 rounded-lg transition-all duration-300 ${
            state.combo >= 25 ? 'animate-pulse' : ''
          }`}
          style={{ 
            backgroundColor: theme.colors.primary,
            boxShadow: state.combo >= 25 ? `0 0 15px ${theme.colors.primary}50` : 'none'
          }}
        >
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold flex items-center space-x-2">
            <span>Typing Master</span>
            {state.level >= 5 && (
              <Crown 
                className="w-5 h-5 animate-pulse" 
                style={{ color: getLevelColor() }} 
              />
            )}
          </h1>
          <p style={{ color: theme.colors.text.secondary }} className="text-sm">
            Level {state.level} • {state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1)}
            {state.maxStreak >= 10 && (
              <span className="ml-2 text-xs px-2 py-1 rounded-full" style={{ 
                backgroundColor: `${getStreakColor()}20`,
                color: getStreakColor()
              }}>
                Best Streak: {state.maxStreak}
              </span>
            )}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Trophy 
            className={`w-5 h-5 transition-all duration-300 ${
              state.score >= 1000 ? 'animate-bounce' : ''
            }`} 
            style={{ color: theme.colors.accent }} 
          />
          <span 
            className={`font-semibold transition-all duration-300 ${
              state.score >= 1000 ? 'animate-pulse' : ''
            }`}
            style={{ 
              color: state.score >= 1000 ? theme.colors.accent : theme.colors.text.primary,
              textShadow: state.score >= 1000 ? `0 0 8px ${theme.colors.accent}50` : 'none'
            }}
          >
            {state.score.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Target 
            className={`w-5 h-5 transition-all duration-300 ${
              state.maxCombo >= 50 ? 'animate-spin' : state.maxCombo >= 25 ? 'animate-pulse' : ''
            }`} 
            style={{ color: theme.colors.status.correct }} 
          />
          <span 
            className={`font-semibold transition-all duration-300 ${
              state.maxCombo >= 25 ? 'animate-pulse' : ''
            }`}
            style={{ 
              color: state.maxCombo >= 25 ? theme.colors.status.correct : theme.colors.text.primary,
              textShadow: state.maxCombo >= 25 ? `0 0 8px ${theme.colors.status.correct}50` : 'none'
            }}
          >
            {state.maxCombo}
          </span>
        </div>

        {state.achievements.length > 0 && (
          <div className="flex items-center space-x-2">
            <Star 
              className="w-5 h-5 animate-pulse" 
              style={{ color: theme.colors.accent }} 
            />
            <span 
              className="font-semibold text-sm"
              style={{ color: theme.colors.accent }}
            >
              {state.achievements.length}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
