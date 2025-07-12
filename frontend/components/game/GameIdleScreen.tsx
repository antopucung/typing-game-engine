import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Flex } from "../layout/Flex";
import { Text } from "../ui/Text";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { Play, Settings } from "lucide-react";
import { GameControlsAnimations } from "./animations/GameControlsAnimations";

export function GameIdleScreen() {
  const { theme } = useTheme();
  const { state, startGame } = useTypingEngine();

  const handleDifficultyChange = (difficulty: "easy" | "medium" | "hard") => {
    startGame(difficulty);
  };

  const handleStartGame = () => {
    startGame();
  };

  return (
    <Flex direction="column" align="center" justify="center" style={{ flex: 1 }}>
      <div style={{ 
        textAlign: "center", 
        marginBottom: theme.spacing[6],
        animation: "fadeInUp 0.8s ease-out",
      }}>
        <Text variant="heading" size="3xl" as="h2" style={{ 
          marginBottom: theme.spacing[2],
          background: `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.accent})`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "titleGlow 3s ease-in-out infinite",
        }}>
          Ready to Type?
        </Text>
        <Text variant="body" color="secondary" style={{
          animation: "fadeIn 1s ease-out 0.3s both",
        }}>
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
          animation: "slideInUp 0.8s ease-out 0.5s both",
        }}
      >
        <Flex align="center" gap={theme.spacing[2]}>
          <Settings style={{ 
            width: "1.25rem", 
            height: "1.25rem", 
            color: theme.colors.text.muted,
            animation: "rotate 4s linear infinite",
          }} />
          <Text variant="body" color="secondary">Difficulty:</Text>
        </Flex>
        
        <div style={{
          animation: "scaleIn 0.5s ease-out 0.8s both",
        }}>
          <Select
            value={state.difficulty}
            onValueChange={handleDifficultyChange}
            options={[
              { value: "easy", label: "Easy (90s)" },
              { value: "medium", label: "Medium (60s)" },
              { value: "hard", label: "Hard (45s)" },
            ]}
          />
        </div>
        
        <div style={{
          animation: "bounceIn 0.6s ease-out 1s both",
        }}>
          <Button
            onClick={handleStartGame}
            variant="primary"
            size="lg"
            icon={Play}
            style={{
              animation: "buttonPulse 2s ease-in-out infinite",
            }}
          >
            Start Game
          </Button>
        </div>
      </Flex>
      
      <GameControlsAnimations />
    </Flex>
  );
}
