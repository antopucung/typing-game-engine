import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export function TypingAnimations() {
  const { theme } = useTheme();

  return (
    <style>{`
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
      }
      
      @keyframes correctGradientPulse {
        0% { 
          transform: scale(1); 
          box-shadow: 0 0 8px ${theme.colors.status.correct}40;
          opacity: 0.85;
        }
        30% { 
          transform: scale(1.2); 
          box-shadow: 0 0 30px ${theme.colors.status.correct}90, 0 0 60px ${theme.colors.status.correct}50;
          opacity: 1;
        }
        70% { 
          transform: scale(1.1); 
          box-shadow: 0 0 25px ${theme.colors.status.correct}80, 0 0 50px ${theme.colors.status.correct}40;
          opacity: 0.95;
        }
        100% { 
          transform: scale(1); 
          box-shadow: 0 0 8px ${theme.colors.status.correct}40;
          opacity: 0.85;
        }
      }
      
      @keyframes errorGradientShake {
        0% { 
          transform: scale(1) rotate(0deg); 
          box-shadow: 0 0 12px ${theme.colors.status.incorrect}60;
          opacity: 0.9;
        }
        15% { 
          transform: scale(1.2) rotate(-2deg); 
          box-shadow: 0 0 35px ${theme.colors.status.incorrect}95, 0 0 70px ${theme.colors.status.incorrect}60;
          opacity: 1;
        }
        30% { 
          transform: scale(1.15) rotate(2deg); 
          box-shadow: 0 0 30px ${theme.colors.status.incorrect}90, 0 0 60px ${theme.colors.status.incorrect}50;
        }
        45% { 
          transform: scale(1.1) rotate(-1deg); 
          box-shadow: 0 0 25px ${theme.colors.status.incorrect}85, 0 0 50px ${theme.colors.status.incorrect}45;
        }
        60% { 
          transform: scale(1.05) rotate(1deg); 
          box-shadow: 0 0 20px ${theme.colors.status.incorrect}80, 0 0 40px ${theme.colors.status.incorrect}40;
        }
        100% { 
          transform: scale(1) rotate(0deg); 
          box-shadow: 0 0 12px ${theme.colors.status.incorrect}60;
          opacity: 0.9;
        }
      }
      
      @keyframes cursorGradientPulse {
        0%, 100% { 
          box-shadow: 0 0 25px ${theme.colors.status.current}90, 0 0 50px ${theme.colors.status.current}50, inset 0 0 15px ${theme.colors.status.current}60;
          transform: scale(1.08);
        }
        50% { 
          box-shadow: 0 0 35px ${theme.colors.status.current}95, 0 0 70px ${theme.colors.status.current}70, inset 0 0 20px ${theme.colors.status.current}80;
          transform: scale(1.12);
        }
      }
      
      @keyframes comboRainbowGlow {
        0% { 
          box-shadow: 0 0 15px ${theme.colors.accent}60;
          background: linear-gradient(135deg, ${theme.colors.accent}80, ${theme.colors.primary}80);
        }
        25% { 
          box-shadow: 0 0 40px ${theme.colors.accent}90, 0 0 80px ${theme.colors.primary}70;
          background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.status.correct}, ${theme.colors.accent});
        }
        50% { 
          box-shadow: 0 0 50px ${theme.colors.status.correct}95, 0 0 100px ${theme.colors.accent}80;
          background: linear-gradient(135deg, ${theme.colors.status.correct}, ${theme.colors.accent}, ${theme.colors.primary});
        }
        75% { 
          box-shadow: 0 0 45px ${theme.colors.primary}90, 0 0 90px ${theme.colors.status.correct}75;
          background: linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.primary}, ${theme.colors.status.correct});
        }
        100% { 
          box-shadow: 0 0 20px ${theme.colors.accent}70;
          background: linear-gradient(135deg, ${theme.colors.accent}80, ${theme.colors.primary}80);
        }
      }
      
      @keyframes comboPopup {
        0% { 
          transform: translate(-50%, -50%) scale(0.5); 
          opacity: 0; 
          filter: blur(10px);
        }
        30% { 
          transform: translate(-50%, -50%) scale(1.3); 
          opacity: 1; 
          filter: blur(0px);
        }
        70% { 
          transform: translate(-50%, -50%) scale(1.1); 
          opacity: 0.9; 
        }
        100% { 
          transform: translate(-50%, -50%) scale(1); 
          opacity: 0; 
          filter: blur(5px);
        }
      }
      
      @keyframes errorPopup {
        0% { 
          transform: translate(-50%, -50%) scale(0.8); 
          opacity: 0; 
          filter: blur(8px);
        }
        40% { 
          transform: translate(-50%, -50%) scale(1.4); 
          opacity: 1; 
          filter: blur(0px);
        }
        70% { 
          transform: translate(-50%, -50%) scale(1.2); 
          opacity: 0.8; 
        }
        100% { 
          transform: translate(-50%, -50%) scale(1); 
          opacity: 0; 
          filter: blur(4px);
        }
      }
      
      @keyframes focusGlow {
        0%, 100% { box-shadow: 0 0 25px ${theme.colors.ui.focus}40, inset 0 0 20px ${theme.colors.ui.focus}10; }
        50% { box-shadow: 0 0 35px ${theme.colors.ui.focus}60, inset 0 0 25px ${theme.colors.ui.focus}20; }
      }
    `}</style>
  );
}
