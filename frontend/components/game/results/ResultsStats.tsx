import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { Grid } from "../../layout/Grid";
import { Card } from "../../ui/Card";
import { Text } from "../../ui/Text";
import { Flex } from "../../layout/Flex";
import { Award } from "lucide-react";

interface ResultsStat {
  icon: React.ComponentType<any>;
  label: string;
  value: number;
  suffix: string;
  color: string;
  highlight: boolean;
  milestone: string;
}

interface ResultsStatsProps {
  results: ResultsStat[];
  animateStats: boolean;
}

export function ResultsStats({ results, animateStats }: ResultsStatsProps) {
  const { theme } = useTheme();

  return (
    <Grid columns={4} gap="lg" style={{ 
      width: "100%", 
      maxWidth: "96rem",
      animation: "gridSlideIn 0.8s ease-out 0.5s both",
    }}>
      {results.map((result, index) => (
        <Card
          key={index}
          variant="default"
          hover
          style={{
            textAlign: "center",
            border: `2px solid ${result.highlight ? result.color : theme.colors.ui.border}`,
            boxShadow: result.highlight 
              ? `0 0 30px ${result.color}40, inset 0 0 20px ${result.color}20` 
              : theme.shadows.sm,
            transform: animateStats ? "translateY(0)" : "translateY(3rem)",
            opacity: animateStats ? 1 : 0,
            transition: `all ${theme.transitions.slow}`,
            transitionDelay: `${index * 100}ms`,
            animation: result.highlight ? "statCelebrate 2s ease-in-out infinite" : "none",
            backgroundColor: result.highlight ? `${result.color}08` : theme.colors.surface,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Milestone badge */}
          {result.milestone && (
            <div style={{
              position: "absolute",
              top: theme.spacing[2],
              right: theme.spacing[2],
              fontSize: "0.7rem",
              padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
              backgroundColor: result.color,
              color: "white",
              borderRadius: theme.borderRadius.full,
              fontWeight: "bold",
              animation: "badgePop 0.5s ease-out",
              boxShadow: `0 0 10px ${result.color}50`,
            }}>
              {result.milestone}
            </div>
          )}

          <Flex direction="column" align="center" gap={theme.spacing[3]}>
            <result.icon 
              style={{ 
                width: "2rem", 
                height: "2rem",
                color: result.color,
                animation: result.highlight ? "iconSpin 3s linear infinite" : "iconPop 0.5s ease-out",
                filter: result.highlight ? `drop-shadow(0 0 10px ${result.color})` : "none",
              }} 
            />
            <Text 
              variant="heading" 
              size="3xl" 
              style={{ 
                color: result.color,
                textShadow: result.highlight ? `0 0 15px ${result.color}50` : "none",
                animation: result.highlight ? "numberGlow 2s ease-in-out infinite" : "numberCount 0.8s ease-out",
                fontWeight: result.highlight ? "800" : "600",
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
                  width: "1.2rem", 
                  height: "1.2rem", 
                  color: result.color,
                  animation: "awardSpin 3s linear infinite",
                  filter: `drop-shadow(0 0 8px ${result.color})`,
                }} 
              />
            )}
          </Flex>
        </Card>
      ))}
    </Grid>
  );
}
