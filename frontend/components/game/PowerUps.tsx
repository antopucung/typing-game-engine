import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Clock, Zap, Shield } from "lucide-react";
import { Button } from "../ui/Button";

export function PowerUps() {
  const { theme } = useTheme();
  const { state, activatePowerUp } = useTypingEngine();

  const powerUps = [
    {
      key: "timeFreeze" as const,
      icon: Clock,
      name: "Time Freeze",
      description: "Freeze timer for 10 seconds",
      color: theme.colors.primary,
      available: state.score >= 100,
    },
    {
      key: "doubleScore" as const,
      icon: Zap,
      name: "Double Score",
      description: "2x points for 10 seconds",
      color: theme.colors.accent,
      available: state.score >= 200,
    },
    {
      key: "errorImmunity" as const,
      icon: Shield,
      name: "Error Shield",
      description: "Ignore errors for 10 seconds",
      color: theme.colors.status.correct,
      available: state.score >= 300,
    },
  ];

  const activePowerUps = Object.entries(state.powerUps).filter(([_, duration]) => duration > 0);

  return (
    <div className="space-y-4">
      {activePowerUps.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activePowerUps.map(([powerUp, duration]) => {
            const powerUpData = powerUps.find(p => p.key === powerUp);
            if (!powerUpData) return null;
            
            return (
              <div
                key={powerUp}
                className="px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2"
                style={{ 
                  backgroundColor: `${powerUpData.color}20`,
                  border: `1px solid ${powerUpData.color}`,
                  color: powerUpData.color
                }}
              >
                <powerUpData.icon className="w-4 h-4" />
                <span>{powerUpData.name}</span>
                <span className="font-bold">{duration}s</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {powerUps.map((powerUp) => (
          <Button
            key={powerUp.key}
            onClick={() => activatePowerUp(powerUp.key)}
            disabled={!powerUp.available || state.powerUps[powerUp.key] > 0}
            variant={powerUp.available ? "outline" : "disabled"}
            size="sm"
            icon={powerUp.icon}
            className="text-xs"
          >
            {powerUp.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
