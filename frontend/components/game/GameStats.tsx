import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Clock, Gauge, Target, Flame, Zap, Trophy } from "lucide-react";

export function GameStats() {
  const { theme } = useTheme();
  const { state } = useTypingEngine();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getWpmColor = () => {
    if (state.wpm >= 80) return theme.colors.accent;
    if (state.wpm >= 60) return theme.colors.status.correct;
    if (state.wpm >= 40) return theme.colors.primary;
    return theme.colors.text.primary;
  };

  const getAccuracyColor = () => {
    if (state.accuracy >= 95) return theme.colors.status.correct;
    if (state.accuracy >= 85) return theme.colors.status.current;
    return theme.colors.status.incorrect;
  };

  const stats = [
    {
      icon: Clock,
      label: "Time",
      value: formatTime(state.remainingTime),
      color: state.remainingTime <= 10 ? theme.colors.status.incorrect : theme.colors.text.primary,
      pulse: state.remainingTime <= 10,
    },
    {
      icon: Gauge,
      label: "WPM",
      value: state.wpm.toString(),
      color: getWpmColor(),
      pulse: state.wpm >= 60,
    },
    {
      icon: Target,
      label: "Accuracy",
      value: `${state.accuracy}%`,
      color: getAccuracyColor(),
      pulse: state.accuracy >= 95,
    },
    {
      icon: Trophy,
      label: "Score",
      value: state.score.toString(),
      color: theme.colors.accent,
      pulse: false,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg text-center transition-all duration-300 ${
            stat.pulse ? 'animate-pulse' : ''
          }`}
          style={{ 
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.ui.border}`,
            boxShadow: stat.pulse ? `0 0 15px ${stat.color}30` : 'none'
          }}
        >
          <div className="flex items-center justify-center mb-2">
            <stat.icon 
              className={`w-6 h-6 transition-all duration-300 ${stat.pulse ? 'animate-bounce' : ''}`} 
              style={{ color: stat.color }} 
            />
          </div>
          <div 
            className={`text-2xl font-bold transition-all duration-300 ${stat.pulse ? 'animate-pulse' : ''}`} 
            style={{ 
              color: stat.color,
              textShadow: stat.pulse ? `0 0 8px ${stat.color}50` : 'none'
            }}
          >
            {stat.value}
          </div>
          <div className="text-sm" style={{ color: theme.colors.text.muted }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
