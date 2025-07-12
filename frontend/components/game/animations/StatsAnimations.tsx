import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export function StatsAnimations() {
  const { theme } = useTheme();

  return (
    <style>{`
      @keyframes statPulse {
        0%, 100% { 
          box-shadow: 0 0 20px ${theme.colors.status.incorrect}50, inset 0 0 10px ${theme.colors.status.incorrect}20;
          transform: scale(1);
        }
        50% { 
          box-shadow: 0 0 30px ${theme.colors.status.incorrect}70, inset 0 0 15px ${theme.colors.status.incorrect}30;
          transform: scale(1.02);
        }
      }
      
      @keyframes iconSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes iconGlow {
        0%, 100% { filter: drop-shadow(0 0 8px ${theme.colors.accent}); }
        50% { filter: drop-shadow(0 0 15px ${theme.colors.accent}) drop-shadow(0 0 20px ${theme.colors.accent}); }
      }
      
      @keyframes comboFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes comboExplode {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); box-shadow: 0 0 40px ${theme.colors.accent}80; }
        100% { transform: scale(1); }
      }
      
      @keyframes flameFlicker {
        0% { transform: scale(1) rotate(-2deg); }
        100% { transform: scale(1.1) rotate(2deg); }
      }
      
      @keyframes powerUpPulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.05); }
      }
    `}</style>
  );
}
