import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { Flex } from "../../layout/Flex";
import { Text } from "../../ui/Text";
import { TypingGameState } from "../../../contexts/TypingGameContext";

interface ResultsHeaderProps {
  showConfetti: boolean;
  fireworksActive: boolean;
  state: TypingGameState;
  animateStats: boolean;
}

export function ResultsHeader({ showConfetti, fireworksActive, state, animateStats }: ResultsHeaderProps) {
  const { theme } = useTheme();

  const getPerformanceRating = () => {
    if (state.wpm >= 80 && state.accuracy >= 95) return { 
      rating: "LEGENDARY!", 
      icon: "🏆", 
      color: theme.colors.accent,
      glow: true,
      particles: "✨🎉⭐",
    };
    if (state.wpm >= 60 && state.accuracy >= 90) return { 
      rating: "EXCELLENT!", 
      icon: "⭐", 
      color: theme.colors.status.correct,
      glow: true,
      particles: "🎉✨💫",
    };
    if (state.wpm >= 40 && state.accuracy >= 85) return { 
      rating: "GREAT!", 
      icon: "👍", 
      color: theme.colors.primary,
      glow: false,
      particles: "👏🎊",
    };
    if (state.wpm >= 25 && state.accuracy >= 80) return { 
      rating: "GOOD", 
      icon: "👌", 
      color: theme.colors.status.current,
      glow: false,
      particles: "👍",
    };
    return { 
      rating: "KEEP PRACTICING", 
      icon: "💪", 
      color: theme.colors.text.secondary,
      glow: false,
      particles: "💪",
    };
  };

  const performance = getPerformanceRating();

  return (
    <>
      {/* Confetti effect */}
      {showConfetti && (
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          pointerEvents: "none", 
          zIndex: theme.zIndex.popover,
          overflow: "hidden",
        }}>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `confettiFall ${2 + Math.random() * 3}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
                fontSize: "1.5rem",
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              {performance.particles.split('')[Math.floor(Math.random() * performance.particles.length)]}
            </div>
          ))}
        </div>
      )}

      {/* Fireworks effect */}
      {fireworksActive && (
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          pointerEvents: "none", 
          zIndex: theme.zIndex.popover,
        }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: [theme.colors.accent, theme.colors.primary, theme.colors.status.correct][i % 3],
                animation: `firework ${1 + Math.random()}s ease-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Performance rating */}
      <Flex direction="column" align="center" gap={theme.spacing[4]} style={{
        animation: "resultEnter 0.8s ease-out",
      }}>
        <div 
          style={{
            fontSize: "6rem",
            marginBottom: theme.spacing[4],
            transition: theme.transitions.slow,
            filter: performance.glow ? `drop-shadow(0 0 30px ${performance.color})` : "none",
            animation: performance.glow ? "iconCelebrate 2s ease-in-out infinite" : "iconBounce 0.8s ease-out",
            transform: animateStats ? "scale(1)" : "scale(0.5)",
          }}
        >
          {performance.icon}
        </div>
        <Text 
          variant="heading" 
          size="4xl" 
          as="h2"
          style={{ 
            color: performance.color,
            textShadow: performance.glow ? `0 0 30px ${performance.color}60` : "none",
            animation: performance.glow ? "textGlow 2s ease-in-out infinite" : "textSlideIn 0.8s ease-out",
            marginBottom: theme.spacing[2],
            background: performance.glow ? `linear-gradient(45deg, ${performance.color}, ${theme.colors.accent})` : "none",
            backgroundClip: performance.glow ? "text" : "none",
            WebkitBackgroundClip: performance.glow ? "text" : "none",
            WebkitTextFillColor: performance.glow ? "transparent" : performance.color,
          }}
        >
          {performance.rating}
        </Text>
        <Text variant="body" color="secondary" style={{
          animation: "fadeInUp 0.8s ease-out 0.3s both",
        }}>
          Game completed on {state.difficulty} difficulty
        </Text>
      </Flex>
    </>
  );
}
