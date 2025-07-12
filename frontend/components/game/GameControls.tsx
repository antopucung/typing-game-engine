import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Flex } from "../layout/Flex";
import { Text } from "../ui/Text";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { Play, Pause, RotateCcw, Settings, Zap, Clock, Shield } from "lucide-react";

export function GameControls() {
  const { theme } = useTheme();
  const { state, startGame, pauseGame, resumeGame, resetGame, activatePowerUp } = useTypingEngine();
  const [buttonHover, setButtonHover] = useState<string | null>(null);
  const [powerUpCooldowns, setPowerUpCooldowns] = useState({
    timeFreeze: 0,
    doubleScore: 0,
    errorImmunity: 0,
  });

  const handleDifficultyChange = (difficulty: "easy" | "medium" | "hard") => {
    startGame(difficulty);
  };

  const handleStartGame = () => {
    startGame();
  };

  const handlePowerUpActivation = (powerUp: "timeFreeze" | "doubleScore" | "errorImmunity") => {
    if (powerUpCooldowns[powerUp] === 0 && state.powerUps[powerUp] === 0) {
      activatePowerUp(powerUp);
      setPowerUpCooldowns(prev => ({ ...prev, [powerUp]: 30 })); // 30 second cooldown
    }
  };

  // Cooldown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setPowerUpCooldowns(prev => ({
        timeFreeze: Math.max(0, prev.timeFreeze - 1),
        doubleScore: Math.max(0, prev.doubleScore - 1),
        errorImmunity: Math.max(0, prev.errorImmunity - 1),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (state.gameStatus === "idle") {
    return (
      <Flex direction="column" align="center" gap={theme.spacing[6]}>
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
          
          <div
            style={{
              animation: "bounceIn 0.6s ease-out 1s both",
            }}
            onMouseEnter={() => setButtonHover("start")}
            onMouseLeave={() => setButtonHover(null)}
          >
            <Button
              onClick={handleStartGame}
              variant="primary"
              size="lg"
              icon={Play}
              style={{
                transform: buttonHover === "start" ? "scale(1.05)" : "scale(1)",
                boxShadow: buttonHover === "start" 
                  ? `0 0 25px ${theme.colors.primary}60` 
                  : `0 0 15px ${theme.colors.primary}30`,
                transition: "all 0.3s ease-in-out",
                animation: "buttonPulse 2s ease-in-out infinite",
              }}
            >
              Start Game
            </Button>
          </div>
        </Flex>
      </Flex>
    );
  }

  if (state.gameStatus === "playing") {
    return (
      <Flex direction="column" align="center" gap={theme.spacing[4]}>
        {/* Main controls */}
        <Flex justify="center" gap={theme.spacing[4]} style={{ marginTop: theme.spacing[6] }}>
          <div
            onMouseEnter={() => setButtonHover("pause")}
            onMouseLeave={() => setButtonHover(null)}
          >
            <Button
              onClick={pauseGame}
              variant="secondary"
              icon={Pause}
              style={{
                transform: buttonHover === "pause" ? "scale(1.05)" : "scale(1)",
                transition: "all 0.2s ease-in-out",
              }}
            >
              Pause
            </Button>
          </div>
          <div
            onMouseEnter={() => setButtonHover("reset")}
            onMouseLeave={() => setButtonHover(null)}
          >
            <Button
              onClick={resetGame}
              variant="outline"
              icon={RotateCcw}
              style={{
                transform: buttonHover === "reset" ? "scale(1.05)" : "scale(1)",
                transition: "all 0.2s ease-in-out",
              }}
            >
              Reset
            </Button>
          </div>
        </Flex>

        {/* Power-ups */}
        {state.score >= 100 && (
          <Flex justify="center" gap={theme.spacing[3]} style={{
            animation: "slideInUp 0.5s ease-out",
          }}>
            <div
              onMouseEnter={() => setButtonHover("timeFreeze")}
              onMouseLeave={() => setButtonHover(null)}
            >
              <Button
                onClick={() => handlePowerUpActivation("timeFreeze")}
                variant={state.powerUps.timeFreeze > 0 ? "primary" : "outline"}
                size="sm"
                icon={Clock}
                disabled={powerUpCooldowns.timeFreeze > 0 || state.score < 100}
                style={{
                  transform: buttonHover === "timeFreeze" ? "scale(1.1)" : "scale(1)",
                  transition: "all 0.2s ease-in-out",
                  opacity: powerUpCooldowns.timeFreeze > 0 ? 0.5 : 1,
                  animation: state.powerUps.timeFreeze > 0 ? "powerUpActive 1s ease-in-out infinite" : "none",
                }}
              >
                Freeze {powerUpCooldowns.timeFreeze > 0 ? `(${powerUpCooldowns.timeFreeze}s)` : "(100pts)"}
              </Button>
            </div>

            {state.score >= 200 && (
              <div
                onMouseEnter={() => setButtonHover("doubleScore")}
                onMouseLeave={() => setButtonHover(null)}
              >
                <Button
                  onClick={() => handlePowerUpActivation("doubleScore")}
                  variant={state.powerUps.doubleScore > 0 ? "primary" : "outline"}
                  size="sm"
                  icon={Zap}
                  disabled={powerUpCooldowns.doubleScore > 0 || state.score < 200}
                  style={{
                    transform: buttonHover === "doubleScore" ? "scale(1.1)" : "scale(1)",
                    transition: "all 0.2s ease-in-out",
                    opacity: powerUpCooldowns.doubleScore > 0 ? 0.5 : 1,
                    animation: state.powerUps.doubleScore > 0 ? "powerUpActive 1s ease-in-out infinite" : "none",
                  }}
                >
                  2x Score {powerUpCooldowns.doubleScore > 0 ? `(${powerUpCooldowns.doubleScore}s)` : "(200pts)"}
                </Button>
              </div>
            )}

            {state.score >= 300 && (
              <div
                onMouseEnter={() => setButtonHover("errorImmunity")}
                onMouseLeave={() => setButtonHover(null)}
              >
                <Button
                  onClick={() => handlePowerUpActivation("errorImmunity")}
                  variant={state.powerUps.errorImmunity > 0 ? "primary" : "outline"}
                  size="sm"
                  icon={Shield}
                  disabled={powerUpCooldowns.errorImmunity > 0 || state.score < 300}
                  style={{
                    transform: buttonHover === "errorImmunity" ? "scale(1.1)" : "scale(1)",
                    transition: "all 0.2s ease-in-out",
                    opacity: powerUpCooldowns.errorImmunity > 0 ? 0.5 : 1,
                    animation: state.powerUps.errorImmunity > 0 ? "powerUpActive 1s ease-in-out infinite" : "none",
                  }}
                >
                  Shield {powerUpCooldowns.errorImmunity > 0 ? `(${powerUpCooldowns.errorImmunity}s)` : "(300pts)"}
                </Button>
              </div>
            )}
          </Flex>
        )}
      </Flex>
    );
  }

  if (state.gameStatus === "paused") {
    return (
      <Flex justify="center" gap={theme.spacing[4]} style={{
        animation: "fadeIn 0.5s ease-out",
      }}>
        <div
          onMouseEnter={() => setButtonHover("resume")}
          onMouseLeave={() => setButtonHover(null)}
        >
          <Button
            onClick={resumeGame}
            variant="primary"
            icon={Play}
            style={{
              transform: buttonHover === "resume" ? "scale(1.05)" : "scale(1)",
              transition: "all 0.2s ease-in-out",
              animation: "buttonPulse 2s ease-in-out infinite",
            }}
          >
            Resume
          </Button>
        </div>
        <div
          onMouseEnter={() => setButtonHover("reset")}
          onMouseLeave={() => setButtonHover(null)}
        >
          <Button
            onClick={resetGame}
            variant="outline"
            icon={RotateCcw}
            style={{
              transform: buttonHover === "reset" ? "scale(1.05)" : "scale(1)",
              transition: "all 0.2s ease-in-out",
            }}
          >
            Reset
          </Button>
        </div>
      </Flex>
    );
  }

  return (
    <Flex justify="center" gap={theme.spacing[4]} style={{
      animation: "slideInUp 0.5s ease-out",
    }}>
      <div
        onMouseEnter={() => setButtonHover("playAgain")}
        onMouseLeave={() => setButtonHover(null)}
      >
        <Button
          onClick={handleStartGame}
          variant="primary"
          icon={Play}
          style={{
            transform: buttonHover === "playAgain" ? "scale(1.05)" : "scale(1)",
            transition: "all 0.2s ease-in-out",
            animation: "buttonPulse 2s ease-in-out infinite",
          }}
        >
          Play Again
        </Button>
      </div>
      <div
        onMouseEnter={() => setButtonHover("reset")}
        onMouseLeave={() => setButtonHover(null)}
      >
        <Button
          onClick={resetGame}
          variant="outline"
          icon={RotateCcw}
          style={{
            transform: buttonHover === "reset" ? "scale(1.05)" : "scale(1)",
            transition: "all 0.2s ease-in-out",
          }}
        >
          Reset
        </Button>
      </div>

      {/* Global styles for animations */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes slideInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes titleGlow {
          0%, 100% { filter: drop-shadow(0 0 10px ${theme.colors.primary}40); }
          50% { filter: drop-shadow(0 0 20px ${theme.colors.primary}60) drop-shadow(0 0 30px ${theme.colors.accent}40); }
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes buttonPulse {
          0%, 100% { box-shadow: 0 0 15px ${theme.colors.primary}30; }
          50% { box-shadow: 0 0 25px ${theme.colors.primary}50; }
        }
        
        @keyframes powerUpActive {
          0%, 100% { box-shadow: 0 0 15px ${theme.colors.accent}50; }
          50% { box-shadow: 0 0 25px ${theme.colors.accent}70; }
        }
      `}</style>
    </Flex>
  );
}
