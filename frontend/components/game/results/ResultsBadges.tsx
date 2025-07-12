import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { Grid } from "../../layout/Grid";
import { Card } from "../../ui/Card";
import { Text } from "../../ui/Text";
import { TypingGameState } from "../../../contexts/TypingGameContext";

interface ResultsBadgesProps {
  state: TypingGameState;
}

export function ResultsBadges({ state }: ResultsBadgesProps) {
  const { theme } = useTheme();

  const badges = [];

  if (state.netWpm >= 60) {
    badges.push({
      icon: "🚀",
      title: "SPEED DEMON",
      color: theme.colors.accent,
      animation: "rocketFly 2s ease-in-out infinite",
    });
  }

  if (state.accuracy >= 95) {
    badges.push({
      icon: "🎯",
      title: "PRECISION MASTER",
      color: theme.colors.status.correct,
      animation: "targetSpin 3s linear infinite",
    });
  }

  if (state.consistencyScore >= 90) {
    badges.push({
      icon: "📈",
      title: "CONSISTENCY KING",
      color: theme.colors.primary,
      animation: "chartGrow 2s ease-in-out infinite",
    });
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <Grid columns={3} gap="md" style={{ 
      width: "100%", 
      maxWidth: "32rem",
      animation: "badgeSlideIn 0.8s ease-out 1.2s both",
    }}>
      {badges.map((badge, index) => (
        <Card 
          key={index}
          variant="outlined"
          style={{ 
            textAlign: "center",
            backgroundColor: `${badge.color}15`,
            border: `2px solid ${badge.color}`,
            animation: "badgeGlow 2s ease-in-out infinite",
            animationDelay: `${index * 0.3}s`,
            boxShadow: `0 0 20px ${badge.color}50`,
          }}
        >
          <div style={{ 
            fontSize: "2.5rem",
            animation: badge.animation,
          }}>{badge.icon}</div>
          <Text variant="caption" weight="bold" style={{ color: badge.color }}>
            {badge.title}
          </Text>
        </Card>
      ))}
    </Grid>
  );
}
