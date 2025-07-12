import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";

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
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">Ready to Type?</h2>
          <p style={{ color: theme.colors.text.secondary }}>
            Choose your difficulty and start improving your typing skills
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5" style={{ color: theme.colors.text.muted }} />
            <span style={{ color: theme.colors.text.secondary }}>Difficulty:</span>
          </div>
          
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
        </div>
      </div>
    );
  }

  if (state.gameStatus === "playing") {
    return (
      <div className="flex justify-center space-x-4">
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
      </div>
    );
  }

  if (state.gameStatus === "paused") {
    return (
      <div className="flex justify-center space-x-4">
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
      </div>
    );
  }

  return (
    <div className="flex justify-center space-x-4">
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
    </div>
  );
}
