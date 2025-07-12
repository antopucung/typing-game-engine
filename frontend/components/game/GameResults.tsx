import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Trophy, Target, Gauge, Clock, Flame, Star } from "lucide-react";

export function GameResults() {
  const { theme } = useTheme();
  const { state } = useTypingEngine();

  const timeTaken = state.startTime && state.endTime 
    ? Math.round((state.endTime - state.startTime) / 1000)
    : 0;

  const getPerformanceRating = () => {
    if (state.wpm >= 80 && state.accuracy >= 95) return { rating: "Excellent!", icon: "🏆", color: theme.colors.accent };
    if (state.wpm >= 60 && state.accuracy >= 90) return { rating: "Great!", icon: "⭐", color: theme.colors.status.correct };
    if (state.wpm >= 40 && state.accuracy >= 85) return { rating: "Good", icon: "👍", color: theme.colors.primary };
    if (state.wpm >= 25 && state.accuracy >= 80) return { rating: "Fair", icon: "👌", color: theme.colors.status.current };
    return { rating: "Keep Practicing", icon: "💪", color: theme.colors.text.secondary };
  };

  const performance = getPerformanceRating();

  const results = [
    {
      icon: Gauge,
      label: "Words Per Minute",
      value: state.wpm,
      suffix: "WPM",
      color: theme.colors.primary,
    },
    {
      icon: Target,
      label: "Accuracy",
      value: state.accuracy,
      suffix: "%",
      color: theme.colors.status.correct,
    },
    {
      icon: Trophy,
      label: "Score",
      value: state.score,
      suffix: "pts",
      color: theme.colors.accent,
    },
    {
      icon: Flame,
      label: "Max Combo",
      value: state.maxCombo,
      suffix: "",
      color: theme.colors.status.current,
    },
    {
      icon: Clock,
      label: "Time Taken",
      value: timeTaken,
      suffix: "s",
      color: theme.colors.text.primary,
    },
    {
      icon: Star,
      label: "Errors",
      value: state.errors,
      suffix: "",
      color: theme.colors.status.incorrect,
    },
  ];

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="text-center">
        <div className="text-6xl mb-4">{performance.icon}</div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: performance.color }}>
          {performance.rating}
        </h2>
        <p style={{ color: theme.colors.text.secondary }}>
          Game completed on {state.difficulty} difficulty
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {results.map((result, index) => (
          <div
            key={index}
            className="p-6 rounded-lg text-center"
            style={{ 
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.ui.border}` 
            }}
          >
            <div className="flex items-center justify-center mb-3">
              <result.icon className="w-6 h-6" style={{ color: result.color }} />
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: result.color }}>
              {result.value}{result.suffix}
            </div>
            <div className="text-sm" style={{ color: theme.colors.text.muted }}>
              {result.label}
            </div>
          </div>
        ))}
      </div>

      {state.achievements.length > 0 && (
        <div className="w-full max-w-2xl">
          <h3 className="text-xl font-bold mb-4 text-center">New Achievements!</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {state.achievements.slice(-3).map((achievement, index) => (
              <div
                key={index}
                className="p-4 rounded-lg flex items-center space-x-3"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  border: `1px solid ${theme.colors.accent}` 
                }}
              >
                <div className="text-2xl">🏅</div>
                <div>
                  <div className="font-semibold">{achievement}</div>
                  <div className="text-sm" style={{ color: theme.colors.text.muted }}>
                    Achievement unlocked!
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
