import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Trophy, Target, Gauge, Clock, Flame, Star, Award, Zap } from "lucide-react";

export function GameResults() {
  const { theme } = useTheme();
  const { state } = useTypingEngine();
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);

  const timeTaken = state.startTime && state.endTime 
    ? Math.round((state.endTime - state.startTime) / 1000)
    : 0;

  useEffect(() => {
    // Trigger animations when component mounts
    setTimeout(() => setAnimateStats(true), 300);
    
    // Show confetti for good performance
    if (state.wpm >= 60 || state.accuracy >= 95 || state.maxCombo >= 25) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [state.wpm, state.accuracy, state.maxCombo]);

  const getPerformanceRating = () => {
    if (state.wpm >= 80 && state.accuracy >= 95) return { 
      rating: "LEGENDARY!", 
      icon: "🏆", 
      color: theme.colors.accent,
      glow: true 
    };
    if (state.wpm >= 60 && state.accuracy >= 90) return { 
      rating: "EXCELLENT!", 
      icon: "⭐", 
      color: theme.colors.status.correct,
      glow: true 
    };
    if (state.wpm >= 40 && state.accuracy >= 85) return { 
      rating: "GREAT!", 
      icon: "👍", 
      color: theme.colors.primary,
      glow: false 
    };
    if (state.wpm >= 25 && state.accuracy >= 80) return { 
      rating: "GOOD", 
      icon: "👌", 
      color: theme.colors.status.current,
      glow: false 
    };
    return { 
      rating: "KEEP PRACTICING", 
      icon: "💪", 
      color: theme.colors.text.secondary,
      glow: false 
    };
  };

  const performance = getPerformanceRating();

  const results = [
    {
      icon: Gauge,
      label: "Words Per Minute",
      value: state.wpm,
      suffix: "WPM",
      color: state.wpm >= 60 ? theme.colors.accent : theme.colors.primary,
      highlight: state.wpm >= 60,
    },
    {
      icon: Target,
      label: "Accuracy",
      value: state.accuracy,
      suffix: "%",
      color: state.accuracy >= 95 ? theme.colors.status.correct : theme.colors.primary,
      highlight: state.accuracy >= 95,
    },
    {
      icon: Trophy,
      label: "Score",
      value: state.score,
      suffix: "pts",
      color: theme.colors.accent,
      highlight: state.score >= 1000,
    },
    {
      icon: Flame,
      label: "Max Combo",
      value: state.maxCombo,
      suffix: "",
      color: state.maxCombo >= 25 ? theme.colors.accent : theme.colors.status.current,
      highlight: state.maxCombo >= 25,
    },
    {
      icon: Clock,
      label: "Time Taken",
      value: timeTaken,
      suffix: "s",
      color: theme.colors.text.primary,
      highlight: false,
    },
    {
      icon: Star,
      label: "Errors",
      value: state.errors,
      suffix: "",
      color: state.errors === 0 ? theme.colors.status.correct : theme.colors.status.incorrect,
      highlight: state.errors === 0,
    },
  ];

  return (
    <div className="flex flex-col items-center space-y-8 relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                fontSize: '2rem',
              }}
            >
              🎉
            </div>
          ))}
        </div>
      )}

      <div className="text-center">
        <div 
          className={`text-8xl mb-4 transition-all duration-1000 ${
            performance.glow ? 'animate-pulse' : ''
          }`}
          style={{
            filter: performance.glow ? `drop-shadow(0 0 20px ${performance.color})` : 'none'
          }}
        >
          {performance.icon}
        </div>
        <h2 
          className={`text-4xl font-bold mb-2 transition-all duration-1000 ${
            performance.glow ? 'animate-pulse' : ''
          }`} 
          style={{ 
            color: performance.color,
            textShadow: performance.glow ? `0 0 20px ${performance.color}50` : 'none'
          }}
        >
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
            className={`p-6 rounded-lg text-center transition-all duration-700 transform hover:scale-105 ${
              animateStats ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            } ${result.highlight ? 'animate-pulse' : ''}`}
            style={{ 
              backgroundColor: theme.colors.surface,
              border: `1px solid ${result.highlight ? result.color : theme.colors.ui.border}`,
              boxShadow: result.highlight ? `0 0 20px ${result.color}30` : 'none',
              transitionDelay: `${index * 100}ms`
            }}
          >
            <div className="flex items-center justify-center mb-3">
              <result.icon 
                className={`w-6 h-6 transition-all duration-300 ${
                  result.highlight ? 'animate-bounce' : ''
                }`} 
                style={{ color: result.color }} 
              />
            </div>
            <div 
              className={`text-3xl font-bold mb-1 transition-all duration-300 ${
                result.highlight ? 'animate-pulse' : ''
              }`} 
              style={{ 
                color: result.color,
                textShadow: result.highlight ? `0 0 10px ${result.color}50` : 'none'
              }}
            >
              {result.value}{result.suffix}
            </div>
            <div className="text-sm" style={{ color: theme.colors.text.muted }}>
              {result.label}
            </div>
            {result.highlight && (
              <div className="mt-2">
                <Award className="w-4 h-4 mx-auto animate-spin" style={{ color: result.color }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Achievement Showcase */}
      {state.achievements.length > 0 && (
        <div className="w-full max-w-2xl">
          <h3 className="text-xl font-bold mb-4 text-center flex items-center justify-center space-x-2">
            <Zap className="w-6 h-6" style={{ color: theme.colors.accent }} />
            <span>New Achievements!</span>
            <Zap className="w-6 h-6" style={{ color: theme.colors.accent }} />
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {state.achievements.slice(-3).map((achievement, index) => (
              <div
                key={index}
                className="p-4 rounded-lg flex items-center space-x-3 transform hover:scale-105 transition-all duration-300 animate-pulse"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  border: `2px solid ${theme.colors.accent}`,
                  boxShadow: `0 0 15px ${theme.colors.accent}30`
                }}
              >
                <div className="text-3xl animate-bounce">🏅</div>
                <div>
                  <div className="font-semibold" style={{ color: theme.colors.accent }}>
                    {achievement}
                  </div>
                  <div className="text-sm" style={{ color: theme.colors.text.muted }}>
                    Achievement unlocked!
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Bonuses */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {state.wpm >= 60 && (
          <div 
            className="p-3 rounded-lg text-center animate-pulse"
            style={{ 
              backgroundColor: `${theme.colors.accent}20`,
              border: `1px solid ${theme.colors.accent}`
            }}
          >
            <div className="text-2xl">🚀</div>
            <div className="text-sm font-bold" style={{ color: theme.colors.accent }}>
              SPEED DEMON
            </div>
          </div>
        )}
        
        {state.accuracy >= 95 && (
          <div 
            className="p-3 rounded-lg text-center animate-pulse"
            style={{ 
              backgroundColor: `${theme.colors.status.correct}20`,
              border: `1px solid ${theme.colors.status.correct}`
            }}
          >
            <div className="text-2xl">🎯</div>
            <div className="text-sm font-bold" style={{ color: theme.colors.status.correct }}>
              PRECISION MASTER
            </div>
          </div>
        )}
        
        {state.maxCombo >= 25 && (
          <div 
            className="p-3 rounded-lg text-center animate-pulse"
            style={{ 
              backgroundColor: `${theme.colors.primary}20`,
              border: `1px solid ${theme.colors.primary}`
            }}
          >
            <div className="text-2xl">🔥</div>
            <div className="text-sm font-bold" style={{ color: theme.colors.primary }}>
              COMBO KING
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
