import React, { useState, useEffect } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useTypingEngine } from "../../../hooks/useTypingEngine";
import { Flex } from "../../layout/Flex";
import { Button } from "../../ui/Button";
import { Clock, Zap, Shield } from "lucide-react";

export function PowerUpControls() {
  const { theme } = useTheme();
  const { state, activatePowerUp } = useTypingEngine();
  const [powerUpCooldowns, setPowerUpCooldowns] = useState({
    timeFreeze: 0,
    doubleScore: 0,
    errorImmunity: 0,
  });

  const handlePowerUpActivation = (powerUp: "timeFreeze" | "doubleScore" | "errorImmunity") => {
    if (powerUpCooldowns[powerUp] === 0 && state.powerUps[powerUp] === 0) {
      activatePowerUp(powerUp);
      setPowerUpCooldowns(prev => ({ ...prev, [powerUp]: 30 }));
    }
  };

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

  if (state.score < 100) {
    return null;
  }

  return (
    <Flex justify="center" gap={theme.spacing[3]} style={{
      animation: "slideInUp 0.5s ease-out",
    }}>
      <Button
        onClick={() => handlePowerUpActivation("timeFreeze")}
        variant={state.powerUps.timeFreeze > 0 ? "primary" : "outline"}
        size="sm"
        icon={Clock}
        disabled={powerUpCooldowns.timeFreeze > 0 || state.score < 100}
        style={{
          opacity: powerUpCooldowns.timeFreeze > 0 ? 0.5 : 1,
          animation: state.powerUps.timeFreeze > 0 ? "powerUpActive 1s ease-in-out infinite" : "none",
        }}
      >
        Freeze {powerUpCooldowns.timeFreeze > 0 ? `(${powerUpCooldowns.timeFreeze}s)` : "(100pts)"}
      </Button>

      {state.score >= 200 && (
        <Button
          onClick={() => handlePowerUpActivation("doubleScore")}
          variant={state.powerUps.doubleScore > 0 ? "primary" : "outline"}
          size="sm"
          icon={Zap}
          disabled={powerUpCooldowns.doubleScore > 0 || state.score < 200}
          style={{
            opacity: powerUpCooldowns.doubleScore > 0 ? 0.5 : 1,
            animation: state.powerUps.doubleScore > 0 ? "powerUpActive 1s ease-in-out infinite" : "none",
          }}
        >
          2x Score {powerUpCooldowns.doubleScore > 0 ? `(${powerUpCooldowns.doubleScore}s)` : "(200pts)"}
        </Button>
      )}

      {state.score >= 300 && (
        <Button
          onClick={() => handlePowerUpActivation("errorImmunity")}
          variant={state.powerUps.errorImmunity > 0 ? "primary" : "outline"}
          size="sm"
          icon={Shield}
          disabled={powerUpCooldowns.errorImmunity > 0 || state.score < 300}
          style={{
            opacity: powerUpCooldowns.errorImmunity > 0 ? 0.5 : 1,
            animation: state.powerUps.errorImmunity > 0 ? "powerUpActive 1s ease-in-out infinite" : "none",
          }}
        >
          Shield {powerUpCooldowns.errorImmunity > 0 ? `(${powerUpCooldowns.errorImmunity}s)` : "(300pts)"}
        </Button>
      )}
    </Flex>
  );
}
