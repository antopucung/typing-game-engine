import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Flex } from "../layout/Flex";
import { Text } from "../ui/Text";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";

export function GameControls() {
  const { theme } = useTheme();
  const { state, startGame, pauseGame, resumeGame, resetGame } = useTypingEngine();

  const handleDifficultyChange = (difficulty: "easy" | "medium" | "hard") => {
    startGame(difficulty);
  };

  const handleStartGame = () => {
    startGame();
  };

  if (state.gameStatus === "idle") {
    return (
      <Flex direction="column" align="center" gap={theme.spacing[6]}>
        <div style={{ textAlign: "center", marginBottom: theme.spacing[6] }}>
          <Text variant="heading" size="3xl" as="h2" style={{ marginBottom: theme.spacing[2] }}>
            Ready to Type?
          </Text>
          <Text variant="body" color="secondary">
            Choose your difficulty and start improving your typing skills
          </Text>
        </div>
        
        <Flex 
          direction="column" 
          align="center" 
          gap={theme.spacing[4]}
          style={{
            [`@media (min-width: ${theme.breakpoints.sm})`]: {
              flexDirection: "row",
            },
          }}
        >
          <Flex align="center" gap={theme.spacing[2]}>
            <Settings style={{ width: "1.25rem", height: "1.25rem", color: theme.colors.text.muted }} />
            <Text variant="body" color="secondary">Difficulty:</Text>
          </Flex>
          
          <Select
            value={state.difficulty}
            onValueChange={handleDifficultyChange}
            options={[
              { value: "easy", label: "Easy (90s)" },
              { value: "medium", label: "Medium (60s)" },
              { value: "hard", label: "Hard (45s)" },
            ]}
          />
          
          <Button
            onClick={handleStartGame}
            variant="primary"
            size="lg"
            icon={Play}
          >
            Start Game
          </Button>
        </Flex>
      </Flex>
    );
  }

  if (state.gameStatus === "playing") {
    return (
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
    );
  }

  if (state.gameStatus === "paused") {
    return (
      <Flex justify="center" gap={theme.spacing[4]}>
        <Button
          onClick={resumeGame}
          variant="primary"
          icon={Play}
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
    );
  }

  return (
    <Flex justify="center" gap={theme.spacing[4]}>
      <Button
        onClick={handleStartGame}
        variant="primary"
        icon={Play}
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
