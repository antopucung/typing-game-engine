import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Clock, Gauge, Target, Flame } from "lucide-react";

export function GameStats() {
  const { theme } = useTheme();
  const { state } = useTypingEngine();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const stats = [
    {
      icon: Clock,
      label: "Time",
      value: formatTime(state.remainingTime),
      color: state.remainingTime <= 10 ? theme.colors.status.incorrect : theme.colors.text.primary,
    },
    {
      icon: Gauge,
      label: "WPM",
      value: state.wpm.toString(),
      color: theme.colors.primary,
    },
    {
      icon: Target,
      label: "Accuracy",
      value: `${state.accuracy}%`,
      color: state.accuracy >= 95 ? theme.colors.status.correct : 
             state.accuracy >= 85 ? theme.colors.status.current : theme.colors.status.incorrect,
    },
    {
      icon: Flame,
      label: "Combo",
      value: state.combo.toString(),
      color: theme.colors.accent,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-4 rounded-lg text-center"
          style={{ 
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.ui.border}` 
          }}
        >
          <div className="flex items-center justify-center mb-2">
            <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
          </div>
          <div className="text-2xl font-bold" style={{ color: stat.color }}>
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
