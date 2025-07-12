import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Grid } from "../layout/Grid";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { Flex } from "../layout/Flex";
import { Clock, Gauge, Target, Trophy } from "lucide-react";
import { StatsAnimations } from "./animations/StatsAnimations";
import { ComboIndicator } from "./indicators/ComboIndicator";
import { PowerUpIndicators } from "./indicators/PowerUpIndicators";

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
    if (state.wpm >= 40) return theme.colors.status.current;
    return theme.colors.primary;
  };

  const getAccuracyColor = () => {
    if (state.accuracy >= 95) return theme.colors.status.correct;
    if (state.accuracy >= 85) return theme.colors.status.current;
    return theme.colors.status.incorrect;
  };

  const getTimeColor = () => {
    if (state.remainingTime <= 10) return theme.colors.status.incorrect;
    if (state.remainingTime <= 30) return theme.colors.status.current;
    return theme.colors.primary;
  };

  const stats = [
    {
      icon: Clock,
      label: "Time",
      value: formatTime(state.remainingTime),
      color: getTimeColor(),
      pulse: state.remainingTime <= 10,
      glow: state.remainingTime <= 5,
    },
    {
      icon: Gauge,
      label: "WPM",
      value: state.wpm.toString(),
      color: getWpmColor(),
      pulse: state.wpm >= 60,
      glow: state.wpm >= 80,
    },
    {
      icon: Target,
      label: "Accuracy",
      value: `${state.accuracy}%`,
      color: getAccuracyColor(),
      pulse: state.accuracy >= 95,
      glow: state.accuracy === 100,
    },
    {
      icon: Trophy,
      label: "Score",
      value: state.score.toString(),
      color: theme.colors.accent,
      pulse: false,
      glow: state.score >= 1000,
    },
  ];

  return (
    <div style={{ marginBottom: theme.spacing[6] }}>
      <Grid columns={4} gap="md">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            variant="default"
            style={{
              textAlign: "center",
              border: `1px solid ${stat.glow ? stat.color : theme.colors.ui.border}`,
              boxShadow: stat.pulse || stat.glow 
                ? `0 0 20px ${stat.color}50, inset 0 0 10px ${stat.color}20` 
                : theme.shadows.sm,
              animation: stat.pulse ? "statPulse 1.5s ease-in-out infinite" : "none",
              backgroundColor: stat.glow ? `${stat.color}10` : theme.colors.surface,
            }}
          >
            <Flex direction="column" align="center" gap={theme.spacing[2]}>
              <stat.icon 
                style={{ 
                  width: "1.5rem", 
                  height: "1.5rem",
                  color: stat.color,
                  animation: stat.pulse ? "iconSpin 2s linear infinite" : 
                           stat.glow ? "iconGlow 1s ease-in-out infinite" : "none",
                  filter: stat.glow ? `drop-shadow(0 0 8px ${stat.color})` : "none",
                }} 
              />
              <Text 
                variant="heading" 
                size="2xl" 
                style={{
                  color: stat.color,
                  textShadow: stat.glow ? `0 0 10px ${stat.color}60` : "none",
                  fontWeight: stat.glow ? "800" : "600",
                }}
              >
                {stat.value}
              </Text>
              <Text variant="caption" color="muted">
                {stat.label}
              </Text>
            </Flex>
          </Card>
        ))}
      </Grid>

      <ComboIndicator />
      <PowerUpIndicators />
      <StatsAnimations />
    </div>
  );
}
