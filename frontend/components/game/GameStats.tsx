import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Grid } from "../layout/Grid";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { Flex } from "../layout/Flex";
import { Clock, Gauge, Target, Trophy } from "lucide-react";

export function GameStats() {
  const { theme } = useTheme();
  const { state } = useTypingEngine();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getWpmColor = () => {
    if (state.wpm >= 80) return "success";
    if (state.wpm >= 60) return "warning";
    if (state.wpm >= 40) return "primary";
    return "primary";
  };

  const getAccuracyColor = () => {
    if (state.accuracy >= 95) return "success";
    if (state.accuracy >= 85) return "warning";
    return "error";
  };

  const stats = [
    {
      icon: Clock,
      label: "Time",
      value: formatTime(state.remainingTime),
      color: state.remainingTime <= 10 ? "error" : "primary",
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
      color: "primary",
      pulse: false,
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
              boxShadow: stat.pulse ? `0 0 15px ${theme.colors.status.correct}30` : theme.shadows.sm,
              animation: stat.pulse ? "pulse 2s infinite" : "none",
            }}
          >
            <Flex direction="column" align="center" gap={theme.spacing[2]}>
              <stat.icon 
                style={{ 
                  width: "1.5rem", 
                  height: "1.5rem",
                  color: theme.colors.status[stat.color as keyof typeof theme.colors.status] || theme.colors.text[stat.color as keyof typeof theme.colors.text],
                  animation: stat.pulse ? "bounce 1s infinite" : "none",
                }} 
              />
              <Text 
                variant="heading" 
                size="2xl" 
                color={stat.color as any}
                style={{
                  textShadow: stat.pulse ? `0 0 8px ${theme.colors.status.correct}50` : "none",
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
    </div>
  );
}
