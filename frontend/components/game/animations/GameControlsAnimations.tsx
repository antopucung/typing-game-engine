import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export function GameControlsAnimations() {
  const { theme } = useTheme();

  return (
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
      
      @keyframes breathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
    `}</style>
  );
}
