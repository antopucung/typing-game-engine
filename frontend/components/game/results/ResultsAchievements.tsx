import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { Grid } from "../../layout/Grid";
import { Card } from "../../ui/Card";
import { Text } from "../../ui/Text";
import { Flex } from "../../layout/Flex";
import { Zap } from "lucide-react";

interface ResultsAchievementsProps {
  achievements: string[];
}

export function ResultsAchievements({ achievements }: ResultsAchievementsProps) {
  const { theme } = useTheme();

  if (achievements.length === 0) {
    return null;
  }

  return (
    <div style={{ 
      width: "100%", 
      maxWidth: "32rem",
      animation: "achievementSlideIn 0.8s ease-out 1s both",
    }}>
      <Flex direction="column" align="center" gap={theme.spacing[4]}>
        <Flex align="center" gap={theme.spacing[2]}>
          <Zap style={{ 
            width: "1.5rem", 
            height: "1.5rem", 
            color: theme.colors.accent,
            animation: "sparkle 1s ease-in-out infinite",
          }} />
          <Text variant="heading" size="xl" style={{
            background: `linear-gradient(45deg, ${theme.colors.accent}, ${theme.colors.primary})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            New Achievements!
          </Text>
          <Zap style={{ 
            width: "1.5rem", 
            height: "1.5rem", 
            color: theme.colors.accent,
            animation: "sparkle 1s ease-in-out infinite",
            animationDelay: "0.5s",
          }} />
        </Flex>
        <Grid columns={2} gap="md" style={{ width: "100%" }}>
          {achievements.slice(-3).map((achievement, index) => (
            <Card
              key={index}
              variant="outlined"
              hover
              style={{
                border: `2px solid ${theme.colors.accent}`,
                boxShadow: `0 0 20px ${theme.colors.accent}40`,
                animation: "achievementPulse 2s ease-in-out infinite",
                animationDelay: `${index * 0.2}s`,
                backgroundColor: `${theme.colors.accent}10`,
              }}
            >
              <Flex align="center" gap={theme.spacing[3]}>
                <div style={{ 
                  fontSize: "3rem", 
                  animation: "medalBounce 2s ease-in-out infinite",
                  filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))",
                }}>🏅</div>
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
  );
}
