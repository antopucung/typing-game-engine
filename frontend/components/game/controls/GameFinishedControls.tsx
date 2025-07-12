import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useTypingEngine } from "../../../hooks/useTypingEngine";
import { Flex } from "../../layout/Flex";
import { Button } from "../../ui/Button";
import { Play, RotateCcw } from "lucide-react";

export function GameFinishedControls() {
  const { theme } = useTheme();
  const { startGame, resetGame } = useTypingEngine();

  const handleStartGame = () => {
    startGame();
  };

  return (
    <Flex justify="center" gap={theme.spacing[4]} style={{
      animation: "slideInUp 0.5s ease-out",
      marginTop: theme.spacing[6],
    }}>
      <Button
        onClick={handleStartGame}
        variant="primary"
        icon={Play}
        style={{
          animation: "buttonPulse 2s ease-in-out infinite",
        }}
      >
        Play Again
      </Button>
      <Button
        onClick={resetGame}
        variant="outline"
        icon={RotateCcw}
      >
        Reset
      </Button>
    </Flex>
  );
}
