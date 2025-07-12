import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useTypingEngine } from "../../../hooks/useTypingEngine";
import { Card } from "../../ui/Card";
import { Text } from "../../ui/Text";
import { Flex } from "../../layout/Flex";
import { Clock, Zap, Target } from "lucide-react";

export function PowerUpIndicators() {
  const { theme } = useTheme();
  const { state } = useTypingEngine();

  const activePowerUps = Object.entries(state.powerUps).filter(([_, duration]) => duration > 0);

  if (activePowerUps.length === 0) {
    return null;
  }

  return (
    <div style={{
      position: "fixed",
      top: "30%",
      right: theme.spacing[6],
      zIndex: theme.zIndex.popover,
    }}>
      <Flex direction="column" gap={theme.spacing[2]}>
        {state.powerUps.timeFreeze > 0 && (
          <Card style={{
            padding: theme.spacing[2],
            backgroundColor: `${theme.colors.primary}20`,
            border: `1px solid ${theme.colors.primary}`,
            animation: "powerUpPulse 1s ease-in-out infinite",
          }}>
            <Flex align="center" gap={theme.spacing[1]}>
              <Clock style={{ width: "1rem", height: "1rem", color: theme.colors.primary }} />
              <Text variant="caption" style={{ color: theme.colors.primary }}>
                Freeze {state.powerUps.timeFreeze}s
              </Text>
            </Flex>
          </Card>
        )}
        {state.powerUps.doubleScore > 0 && (
          <Card style={{
            padding: theme.spacing[2],
            backgroundColor: `${theme.colors.accent}20`,
            border: `1px solid ${theme.colors.accent}`,
            animation: "powerUpPulse 1s ease-in-out infinite",
          }}>
            <Flex align="center" gap={theme.spacing[1]}>
              <Zap style={{ width: "1rem", height: "1rem", color: theme.colors.accent }} />
              <Text variant="caption" style={{ color: theme.colors.accent }}>
                2x Score {state.powerUps.doubleScore}s
              </Text>
            </Flex>
          </Card>
        )}
        {state.powerUps.errorImmunity > 0 && (
          <Card style={{
            padding: theme.spacing[2],
            backgroundColor: `${theme.colors.status.correct}20`,
            border: `1px solid ${theme.colors.status.correct}`,
            animation: "powerUpPulse 1s ease-in-out infinite",
          }}>
            <Flex align="center" gap={theme.spacing[1]}>
              <Target style={{ width: "1rem", height: "1rem", color: theme.colors.status.correct }} />
              <Text variant="caption" style={{ color: theme.colors.status.correct }}>
                Shield {state.powerUps.errorImmunity}s
              </Text>
            </Flex>
          </Card>
        )}
      </Flex>
    </div>
  );
}
