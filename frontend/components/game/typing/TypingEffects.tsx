import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

interface TypingEffectsProps {
  comboEffect: boolean;
  errorEffect: boolean;
  combo: number;
}

export function TypingEffects({ comboEffect, errorEffect, combo }: TypingEffectsProps) {
  const { theme } = useTheme();

  return (
    <>
      {/* Combo effect overlay */}
      {comboEffect && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "3rem",
          fontWeight: "bold",
          background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.primary}, ${theme.colors.status.correct})`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: `0 0 30px ${theme.colors.accent}80`,
          animation: "comboPopup 0.6s ease-out",
          pointerEvents: "none",
          zIndex: theme.zIndex.popover,
        }}>
          COMBO x{combo}!
        </div>
      )}

      {/* Error effect overlay */}
      {errorEffect && (
        <div style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "2rem",
          background: `linear-gradient(135deg, ${theme.colors.status.incorrect}, #dc2626)`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: `0 0 20px ${theme.colors.status.incorrect}90`,
          animation: "errorPopup 0.4s ease-out",
          pointerEvents: "none",
          zIndex: theme.zIndex.popover,
        }}>
          ❌
        </div>
      )}
    </>
  );
}
