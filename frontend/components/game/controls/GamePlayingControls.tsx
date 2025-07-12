import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useTypingEngine } from "../../../hooks/useTypingEngine";
import { Flex } from "../../layout/Flex";
import { Button } from "../../ui/Button";
import { Pause, RotateCcw } from "lucide-react";
import { PowerUpControls } from "./PowerUpControls";

export function GamePlayingControls() {
  const { theme } = useTheme();
  const { pauseGame, resetGame } = useTypingEngine();

  return (
    <Flex direction="column" align="center" gap={theme.spacing[4]}>
      <Flex justify="center" gap={theme.spacing[4]} style={{ marginTop: theme.spacing[6] }}>
        <Button
          onClick={pauseGame}
          variant="secondary"
          icon={Pause}
        >
          Pause
        </Button>
        <Button
          onClick={resetGame}
          variant="outline"
          icon={RotateCcw}
        >
          Reset
        </Button>
      </Flex>

      <PowerUpControls />
    </Flex>
  );
}
