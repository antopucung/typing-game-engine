import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Clock, Zap, Shield, Star } from "lucide-react";
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
      cost: 100,
    },
    {
      key: "doubleScore" as const,
      icon: Zap,
      name: "Double Score",
      description: "2x points for 10 seconds",
      color: theme.colors.accent,
      available: state.score >= 200,
      cost: 200,
    },
    {
      key: "errorImmunity" as const,
      icon: Shield,
      name: "Error Shield",
      description: "Ignore errors for 10 seconds",
      color: theme.colors.status.correct,
      available: state.score >= 300,
      cost: 300,
    },
  ];

  const activePowerUps = Object.entries(state.powerUps).filter(([_, duration]) => duration > 0);

  return (
    <div className="space-y-4">
      {/* Active Power-ups Display */}
      {activePowerUps.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activePowerUps.map(([powerUp, duration]) => {
            const powerUpData = powerUps.find(p => p.key === powerUp);
            if (!powerUpData) return null;
            
            return (
              <div
                key={powerUp}
                className="px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 animate-pulse transform hover:scale-105 transition-all duration-300"
                style={{ 
                  backgroundColor: `${powerUpData.color}30`,
                  border: `2px solid ${powerUpData.color}`,
                  color: powerUpData.color,
                  boxShadow: `0 0 15px ${powerUpData.color}40`
                }}
              >
                <powerUpData.icon className="w-4 h-4 animate-spin" />
                <span className="font-bold">{powerUpData.name}</span>
                <div 
                  className="px-2 py-1 rounded-full text-xs font-bold animate-bounce"
                  style={{ 
                    backgroundColor: powerUpData.color,
                    color: 'white'
                  }}
                >
                  {duration}s
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Power-up Purchase Buttons */}
      <div className="flex flex-wrap gap-3">
        {powerUps.map((powerUp) => {
          const isActive = state.powerUps[powerUp.key] > 0;
          const canAfford = state.score >= powerUp.cost;
          
          return (
            <div key={powerUp.key} className="relative">
              <Button
                onClick={() => activatePowerUp(powerUp.key)}
                disabled={!canAfford || isActive}
                variant={canAfford && !isActive ? "outline" : "disabled"}
                size="sm"
                icon={powerUp.icon}
                className={`text-xs transition-all duration-300 ${
                  canAfford && !isActive ? 'hover:scale-105 hover:shadow-lg' : ''
                } ${isActive ? 'animate-pulse' : ''}`}
                style={{
                  borderColor: canAfford ? powerUp.color : theme.colors.ui.border,
                  color: canAfford ? powerUp.color : theme.colors.text.muted,
                  boxShadow: canAfford && !isActive ? `0 0 10px ${powerUp.color}30` : 'none'
                }}
              >
                <span className="flex items-center space-x-1">
                  <span>{powerUp.name}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>{powerUp.cost}</span>
                  </div>
                </span>
              </Button>
              
              {/* Tooltip */}
              <div 
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  border: `1px solid ${theme.colors.ui.border}`,
                  color: theme.colors.text.primary
                }}
              >
                {powerUp.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Power-up Hints */}
      {state.score < 100 && (
        <div 
          className="text-center text-sm p-3 rounded-lg animate-pulse"
          style={{ 
            backgroundColor: `${theme.colors.primary}10`,
            border: `1px solid ${theme.colors.primary}30`,
            color: theme.colors.text.secondary
          }}
        >
          💡 Score {100 - state.score} more points to unlock your first power-up!
        </div>
      )}
    </div>
  );
}
