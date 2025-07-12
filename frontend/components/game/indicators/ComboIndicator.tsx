import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useTypingEngine } from "../../../hooks/useTypingEngine";
import { Card } from "../../ui/Card";
import { Text } from "../../ui/Text";
import { Flex } from "../../layout/Flex";
import { Flame } from "lucide-react";

export function ComboIndicator() {
  const { theme } = useTheme();
  const { state } = useTypingEngine();

  if (state.combo <= 5) {
    return null;
  }

  return (
    <div style={{
      position: "fixed",
      top: "20%",
      right: theme.spacing[6],
      zIndex: theme.zIndex.popover,
      animation: "comboFloat 2s ease-in-out infinite",
    }}>
      <Card 
        variant="elevated"
        style={{
          padding: theme.spacing[4],
          border: `2px solid ${theme.colors.accent}`,
          boxShadow: `0 0 25px ${theme.colors.accent}60`,
          backgroundColor: `${theme.colors.accent}15`,
          animation: state.combo % 10 === 0 ? "comboExplode 0.5s ease-out" : "none",
        }}
      >
        <Flex align="center" gap={theme.spacing[2]}>
          <Flame style={{ 
            width: "1.5rem", 
            height: "1.5rem", 
            color: theme.colors.accent,
            animation: "flameFlicker 0.5s ease-in-out infinite alternate",
          }} />
          <div>
            <Text variant="heading" size="lg" style={{ color: theme.colors.accent }}>
              {state.combo}x
            </Text>
            <Text variant="caption" color="muted">
              COMBO
            </Text>
          </div>
        </Flex>
      </Card>
    </div>
  );
}
