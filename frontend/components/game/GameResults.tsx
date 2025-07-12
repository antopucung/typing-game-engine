import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Grid } from "../layout/Grid";
import { Flex } from "../layout/Flex";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { Trophy, Target, Gauge, Clock, Flame, Star, Award, Zap, Activity, TrendingUp } from "lucide-react";

export function GameResults() {
  const { theme } = useTheme();
  const { state } = useTypingEngine();
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);

  const timeTaken = state.startTime && state.endTime 
    ? Math.round((state.endTime - state.startTime) / 1000)
    : 0;

  useEffect(() => {
    setTimeout(() => setAnimateStats(true), 300);
    
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
      label: "Net WPM",
      value: state.netWpm,
      suffix: "WPM",
      color: state.netWpm >= 60 ? theme.colors.accent : theme.colors.primary,
      highlight: state.netWpm >= 60,
    },
    {
      icon: Activity,
      label: "Raw WPM",
      value: state.rawWpm,
      suffix: "WPM",
      color: theme.colors.text.secondary,
      highlight: false,
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
      icon: TrendingUp,
      label: "Consistency",
      value: state.consistencyScore,
      suffix: "%",
      color: state.consistencyScore >= 90 ? theme.colors.status.correct : theme.colors.status.current,
      highlight: state.consistencyScore >= 90,
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
    <Flex direction="column" align="center" gap={theme.spacing[8]} style={{ position: "relative" }}>
      {showConfetti && (
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          pointerEvents: "none", 
          zIndex: theme.zIndex.popover 
        }}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: "ping 2s infinite",
                animationDelay: `${Math.random() * 2}s`,
                fontSize: "2rem",
              }}
            >
              🎉
            </div>
          ))}
        </div>
      )}

      <Flex direction="column" align="center" gap={theme.spacing[4]}>
        <div 
          style={{
            fontSize: "5rem",
            marginBottom: theme.spacing[4],
            transition: theme.transitions.slow,
            filter: performance.glow ? `drop-shadow(0 0 20px ${performance.color})` : "none",
            animation: performance.glow ? "pulse 2s infinite" : "none",
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
            textShadow: performance.glow ? `0 0 20px ${performance.color}50` : "none",
            animation: performance.glow ? "pulse 2s infinite" : "none",
            marginBottom: theme.spacing[2],
          }}
        >
          {performance.rating}
        </Text>
        <Text variant="body" color="secondary">
          Game completed on {state.difficulty} difficulty
        </Text>
      </Flex>

      <Grid columns={4} gap="lg" style={{ width: "100%", maxWidth: "96rem" }}>
        {results.map((result, index) => (
          <Card
            key={index}
            variant="default"
            hover
            style={{
              textAlign: "center",
              border: `1px solid ${result.highlight ? result.color : theme.colors.ui.border}`,
              boxShadow: result.highlight ? `0 0 20px ${result.color}30` : theme.shadows.sm,
              transform: animateStats ? "translateY(0)" : "translateY(2rem)",
              opacity: animateStats ? 1 : 0,
              transition: `all ${theme.transitions.slow}`,
              transitionDelay: `${index * 100}ms`,
              animation: result.highlight ? "pulse 2s infinite" : "none",
            }}
          >
            <Flex direction="column" align="center" gap={theme.spacing[3]}>
              <result.icon 
                style={{ 
                  width: "1.5rem", 
                  height: "1.5rem",
                  color: result.color,
                  animation: result.highlight ? "bounce 1s infinite" : "none",
                }} 
              />
              <Text 
                variant="heading" 
                size="3xl" 
                style={{ 
                  color: result.color,
                  textShadow: result.highlight ? `0 0 10px ${result.color}50` : "none",
                  animation: result.highlight ? "pulse 2s infinite" : "none",
                }}
              >
                {result.value}{result.suffix}
              </Text>
              <Text variant="caption" color="muted">
                {result.label}
              </Text>
              {result.highlight && (
                <Award 
                  style={{ 
                    width: "1rem", 
                    height: "1rem", 
                    color: result.color,
                    animation: "spin 2s linear infinite",
                  }} 
                />
              )}
            </Flex>
          </Card>
        ))}
      </Grid>

      <Grid columns={3} gap="md" style={{ width: "100%", maxWidth: "64rem" }}>
        <Card variant="default" style={{ textAlign: "center" }}>
          <Text variant="heading" size="2xl" color="primary">
            {state.totalKeystrokes}
          </Text>
          <Text variant="caption" color="muted">
            Total Keystrokes
          </Text>
        </Card>
        
        <Card variant="default" style={{ textAlign: "center" }}>
          <Text variant="heading" size="2xl" color="success">
            {state.correctChars.size}
          </Text>
          <Text variant="caption" color="muted">
            Correct Characters
          </Text>
        </Card>
        
        <Card variant="default" style={{ textAlign: "center" }}>
          <Text variant="heading" size="2xl" color="error">
            {state.incorrectChars.size}
          </Text>
          <Text variant="caption" color="muted">
            Incorrect Characters
          </Text>
        </Card>
      </Grid>

      {state.achievements.length > 0 && (
        <div style={{ width: "100%", maxWidth: "32rem" }}>
          <Flex direction="column" align="center" gap={theme.spacing[4]}>
            <Flex align="center" gap={theme.spacing[2]}>
              <Zap style={{ width: "1.5rem", height: "1.5rem", color: theme.colors.accent }} />
              <Text variant="heading" size="xl">New Achievements!</Text>
              <Zap style={{ width: "1.5rem", height: "1.5rem", color: theme.colors.accent }} />
            </Flex>
            <Grid columns={2} gap="md" style={{ width: "100%" }}>
              {state.achievements.slice(-3).map((achievement, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  hover
                  style={{
                    border: `2px solid ${theme.colors.accent}`,
                    boxShadow: `0 0 15px ${theme.colors.accent}30`,
                    animation: "pulse 2s infinite",
                  }}
                >
                  <Flex align="center" gap={theme.spacing[3]}>
                    <div style={{ fontSize: "3rem", animation: "bounce 1s infinite" }}>🏅</div>
                    <div>
                      <Text variant="body" weight="semibold" style={{ color: theme.colors.accent }}>
                        {achievement}
                      </Text>
                      <Text variant="caption" color="muted">
                        Achievement unlocked!
                      </Text>
                    </div>
                  </Flex>
                </Card>
              ))}
            </Grid>
          </Flex>
        </div>
      )}

      <Grid columns={3} gap="md" style={{ width: "100%", maxWidth: "32rem" }}>
        {state.netWpm >= 60 && (
          <Card 
            variant="outlined"
            style={{ 
              textAlign: "center",
              backgroundColor: `${theme.colors.accent}20`,
              border: `1px solid ${theme.colors.accent}`,
              animation: "pulse 2s infinite",
            }}
          >
            <div style={{ fontSize: "2rem" }}>🚀</div>
            <Text variant="caption" weight="bold" style={{ color: theme.colors.accent }}>
              SPEED DEMON
            </Text>
          </Card>
        )}
        
        {state.accuracy >= 95 && (
          <Card 
            variant="outlined"
            style={{ 
              textAlign: "center",
              backgroundColor: `${theme.colors.status.correct}20`,
              border: `1px solid ${theme.colors.status.correct}`,
              animation: "pulse 2s infinite",
            }}
          >
            <div style={{ fontSize: "2rem" }}>🎯</div>
            <Text variant="caption" weight="bold" style={{ color: theme.colors.status.correct }}>
              PRECISION MASTER
            </Text>
          </Card>
        )}
        
        {state.consistencyScore >= 90 && (
          <Card 
            variant="outlined"
            style={{ 
              textAlign: "center",
              backgroundColor: `${theme.colors.primary}20`,
              border: `1px solid ${theme.colors.primary}`,
              animation: "pulse 2s infinite",
            }}
          >
            <div style={{ fontSize: "2rem" }}>📈</div>
            <Text variant="caption" weight="bold" style={{ color: theme.colors.primary }}>
              CONSISTENCY KING
            </Text>
          </Card>
        )}
      </Grid>
    </Flex>
  );
}
