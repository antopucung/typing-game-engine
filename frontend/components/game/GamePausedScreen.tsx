import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Flex } from "../layout/Flex";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { Button } from "../ui/Button";
import { Play, RotateCcw } from "lucide-react";

export function GamePausedScreen() {
  const { theme } = useTheme();
  const { resumeGame, resetGame } = useTypingEngine();

  return (
    <Flex direction="column" style={{ flex: 1 }}>
      <Card 
        variant="default"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: theme.spacing[8],
          animation: "breathe 2s ease-in-out infinite",
        }}
      >
        <Flex direction="column" align="center" gap={theme.spacing[4]}>
          <div style={{ 
            fontSize: "4rem", 
            animation: "pulse 2s infinite",
            filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
          }}>⏸️</div>
          <Text variant="heading" size="2xl" as="h2">Game Paused</Text>
          <Text variant="body" color="secondary">
            Press Resume to continue
          </Text>
        </Flex>
      </Card>
      
      <Flex justify="center" gap={theme.spacing[4]} style={{
        animation: "fadeIn 0.5s ease-out",
        marginTop: theme.spacing[6],
      }}>
        <Button
          onClick={resumeGame}
          variant="primary"
          icon={Play}
          style={{
            animation: "buttonPulse 2s ease-in-out infinite",
          }}
        >
          Resume
        </Button>
        <Button
          onClick={resetGame}
          variant="outline"
          icon={RotateCcw}
        >
          Reset
        </Button>
      </Flex>
    </Flex>
  );
}
