import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

interface TypingTextProps {
  currentText: string;
  typedText: string;
  currentIndex: number;
  cursorVisible: boolean;
  gameStatus: string;
  recentlyTyped: Set<number>;
  comboEffect: boolean;
  shakeAnimation: boolean;
}

export function TypingText({
  currentText,
  typedText,
  currentIndex,
  cursorVisible,
  gameStatus,
  recentlyTyped,
  comboEffect,
  shakeAnimation,
}: TypingTextProps) {
  const { theme } = useTheme();

  const renderText = () => {
    const words = currentText.split(' ');
    let charIndex = 0;

    return (
      <div style={{ 
        textAlign: "center", 
        lineHeight: theme.typography.lineHeight.relaxed,
        transform: shakeAnimation ? "translateX(-2px)" : "translateX(0)",
        transition: "transform 0.1s ease-in-out",
        animation: shakeAnimation ? "shake 0.4s ease-in-out" : "none",
      }}>
        {words.map((word, wordIndex) => {
          const wordStart = charIndex;
          const wordEnd = charIndex + word.length;
          const wordChars = word.split('');
          
          const wordElement = (
            <span key={wordIndex} style={{ 
              display: "inline-block", 
              margin: `${theme.spacing[1]} ${theme.spacing[1]}`,
            }}>
              {wordChars.map((char, charInWordIndex) => {
                const currentCharIndex = wordStart + charInWordIndex;
                let charStyle: React.CSSProperties = {
                  fontSize: theme.typography.fontSize["2xl"],
                  fontFamily: theme.typography.fontFamily.mono.join(", "),
                  padding: `${theme.spacing[1]} 2px`,
                  borderRadius: theme.borderRadius.sm,
                  position: "relative",
                  display: "inline-block",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transformOrigin: "center",
                };
                
                // Character state styling with enhanced gradient effects
                if (currentCharIndex < typedText.length) {
                  const typedChar = typedText[currentCharIndex];
                  const isRecent = recentlyTyped.has(currentCharIndex);
                  
                  if (typedChar === char) {
                    // Correct character - green gradient with glow and fade
                    const baseGreen = theme.colors.status.correct;
                    const lightGreen = "#4ade80";
                    const darkGreen = "#16a34a";
                    
                    charStyle.color = "white";
                    charStyle.background = isRecent 
                      ? `linear-gradient(135deg, ${lightGreen}, ${baseGreen}, ${darkGreen})`
                      : `linear-gradient(135deg, ${baseGreen}80, ${baseGreen}60)`;
                    charStyle.boxShadow = isRecent
                      ? `0 0 20px ${baseGreen}80, 0 0 40px ${baseGreen}40, inset 0 0 10px ${baseGreen}60`
                      : `0 0 8px ${baseGreen}40`;
                    charStyle.transform = isRecent ? "scale(1.1)" : "scale(1)";
                    charStyle.animation = isRecent ? "correctGradientPulse 1s ease-out" : "none";
                    charStyle.opacity = isRecent ? 1 : 0.85;
                    charStyle.fontWeight = isRecent ? "600" : "500";
                  } else {
                    // Incorrect character - red gradient with strong glow and shake
                    const baseRed = theme.colors.status.incorrect;
                    const lightRed = "#f87171";
                    const darkRed = "#dc2626";
                    
                    charStyle.color = "white";
                    charStyle.background = isRecent
                      ? `linear-gradient(135deg, ${lightRed}, ${baseRed}, ${darkRed})`
                      : `linear-gradient(135deg, ${baseRed}80, ${baseRed}60)`;
                    charStyle.boxShadow = isRecent
                      ? `0 0 25px ${baseRed}90, 0 0 50px ${baseRed}50, inset 0 0 15px ${baseRed}70`
                      : `0 0 12px ${baseRed}60`;
                    charStyle.animation = isRecent ? "errorGradientShake 0.6s ease-in-out" : "none";
                    charStyle.transform = isRecent ? "scale(1.15) rotate(1deg)" : "scale(1)";
                    charStyle.opacity = isRecent ? 1 : 0.9;
                    charStyle.fontWeight = isRecent ? "700" : "600";
                  }
                } else if (currentCharIndex === currentIndex) {
                  // Current character - cursor with enhanced visibility and gradient
                  const cursorColor = theme.colors.status.current;
                  const lightCursor = "#fbbf24";
                  const darkCursor = "#d97706";
                  
                  charStyle.color = "white";
                  charStyle.background = gameStatus === "playing" && cursorVisible 
                    ? `linear-gradient(135deg, ${lightCursor}, ${cursorColor}, ${darkCursor})`
                    : `linear-gradient(135deg, ${cursorColor}40, ${cursorColor}20)`;
                  charStyle.boxShadow = cursorVisible 
                    ? `0 0 25px ${cursorColor}90, 0 0 50px ${cursorColor}50, inset 0 0 15px ${cursorColor}60`
                    : `0 0 8px ${cursorColor}30`;
                  charStyle.animation = cursorVisible ? "cursorGradientPulse 1.2s ease-in-out infinite" : "none";
                  charStyle.transform = "scale(1.08)";
                  charStyle.fontWeight = "600";
                } else {
                  // Future characters - muted with subtle hover effect
                  charStyle.color = theme.colors.text.muted;
                  charStyle.opacity = 0.6;
                  charStyle.transition = "all 0.2s ease-in-out";
                  charStyle.background = "transparent";
                }
                
                // Combo effect highlighting with rainbow gradient
                if (comboEffect && currentCharIndex >= currentIndex - 10 && currentCharIndex < currentIndex) {
                  charStyle.animation = "comboRainbowGlow 0.8s ease-out";
                  charStyle.background = `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.primary}, ${theme.colors.status.correct})`;
                  charStyle.boxShadow = `0 0 30px ${theme.colors.accent}90, 0 0 60px ${theme.colors.primary}60`;
                }
                
                return (
                  <span key={charInWordIndex} style={charStyle}>
                    {char}
                  </span>
                );
              })}
              
              {wordIndex < words.length - 1 && (() => {
                const spaceIndex = wordEnd;
                let spaceStyle: React.CSSProperties = {
                  fontSize: theme.typography.fontSize["2xl"],
                  fontFamily: theme.typography.fontFamily.mono.join(", "),
                  padding: `${theme.spacing[1]} ${theme.spacing[1]}`,
                  borderRadius: theme.borderRadius.sm,
                  display: "inline-block",
                  minWidth: "8px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                };
                
                if (spaceIndex < typedText.length) {
                  const typedChar = typedText[spaceIndex];
                  const isRecent = recentlyTyped.has(spaceIndex);
                  
                  if (typedChar === ' ') {
                    const baseGreen = theme.colors.status.correct;
                    spaceStyle.background = isRecent
                      ? `linear-gradient(135deg, ${baseGreen}60, ${baseGreen}40)`
                      : `${baseGreen}20`;
                    spaceStyle.boxShadow = isRecent
                      ? `0 0 15px ${baseGreen}50`
                      : `0 0 5px ${baseGreen}30`;
                    spaceStyle.opacity = isRecent ? 1 : 0.7;
                  } else {
                    const baseRed = theme.colors.status.incorrect;
                    spaceStyle.background = isRecent
                      ? `linear-gradient(135deg, ${baseRed}70, ${baseRed}50)`
                      : `${baseRed}30`;
                    spaceStyle.boxShadow = isRecent
                      ? `0 0 20px ${baseRed}60`
                      : `0 0 8px ${baseRed}50`;
                    spaceStyle.opacity = isRecent ? 1 : 0.8;
                  }
                } else if (spaceIndex === currentIndex) {
                  const cursorColor = theme.colors.status.current;
                  spaceStyle.background = gameStatus === "playing" && cursorVisible 
                    ? `linear-gradient(135deg, ${cursorColor}, ${cursorColor}80)`
                    : `${cursorColor}30`;
                  spaceStyle.boxShadow = cursorVisible 
                    ? `0 0 15px ${cursorColor}70`
                    : `0 0 5px ${cursorColor}30`;
                }
                
                return <span style={spaceStyle}> </span>;
              })()}
            </span>
          );
          
          charIndex = wordEnd + 1;
          return wordElement;
        })}
      </div>
    );
  };

  return renderText();
}
