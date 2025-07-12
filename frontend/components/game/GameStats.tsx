import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Clock, Gauge, Target, Flame, Zap, Trophy, Activity, TrendingUp } from "lucide-react";

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

  const getComboColor = () => {
    if (state.combo >= 50) return theme.colors.accent;
    if (state.combo >= 25) return theme.colors.status.correct;
    if (state.combo >= 10) return theme.colors.primary;
    return theme.colors.text.muted;
  };

  const getConsistencyColor = () => {
    if (state.consistencyScore >= 90) return theme.colors.status.correct;
    if (state.consistencyScore >= 70) return theme.colors.status.current;
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
      icon: Flame,
      label: "Combo",
      value: state.combo.toString(),
      color: getComboColor(),
      pulse: state.combo >= 10,
    },
    {
      icon: Trophy,
      label: "Score",
      value: state.score.toString(),
      color: theme.colors.accent,
      pulse: false,
    },
    {
      icon: Zap,
      label: "Level",
      value: state.level.toString(),
      color: theme.colors.primary,
      pulse: false,
    },
  ];

  // Add advanced stats for longer games
  if (state.wpmHistory.length > 5) {
    stats.push(
      {
        icon: Activity,
        label: "Raw WPM",
        value: state.rawWpm.toString(),
        color: theme.colors.text.secondary,
        pulse: false,
      },
      {
        icon: TrendingUp,
        label: "Consistency",
        value: `${state.consistencyScore}%`,
        color: getConsistencyColor(),
        pulse: state.consistencyScore >= 90,
      }
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg text-center transition-all duration-300 transform hover:scale-105 ${
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
              className={`w-5 h-5 transition-all duration-300 ${stat.pulse ? 'animate-bounce' : ''}`} 
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
