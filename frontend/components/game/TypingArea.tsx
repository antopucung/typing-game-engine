import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { Flex } from "../layout/Flex";

export function TypingArea() {
  const { theme } = useTheme();
  const { state, typeCharacter, handleBackspace } = useTypingEngine();
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [shakeAnimation, setShakeAnimation] = useState(false);
  const [successPulse, setSuccessPulse] = useState(false);
  const [lastTypedIndex, setLastTypedIndex] = useState(-1);
  const [comboEffect, setComboEffect] = useState(false);
  const [errorEffect, setErrorEffect] = useState(false);

  useEffect(() => {
    if (containerRef.current && state.gameStatus === "playing") {
      containerRef.current.focus();
    }
  }, [state.gameStatus]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (state.gameStatus !== "playing") return;
      
      if (event.ctrlKey || event.altKey || event.metaKey) return;
      
      if (event.key === "Backspace") {
        event.preventDefault();
        handleBackspace();
        return;
      }
      
      if (event.key.length === 1) {
        event.preventDefault();
        typeCharacter(event.key);
        return;
      }
    };

    const container = containerRef.current;
    if (container && state.gameStatus === "playing") {
      container.addEventListener("keydown", handleKeyDown);
      return () => {
        container.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [state.gameStatus, typeCharacter, handleBackspace]);

  // Cursor blinking effect
  useEffect(() => {
    if (state.gameStatus === "playing") {
      const interval = setInterval(() => {
        setCursorVisible(prev => !prev);
      }, 530);
      
      return () => clearInterval(interval);
    } else {
      setCursorVisible(true);
    }
  }, [state.gameStatus]);

  // Reset cursor visibility when typing
  useEffect(() => {
    if (state.gameStatus === "playing") {
      setCursorVisible(true);
    }
  }, [state.currentIndex, state.gameStatus]);

  // Character typing effects
  useEffect(() => {
    if (state.currentIndex > lastTypedIndex) {
      setLastTypedIndex(state.currentIndex);
      
      // Check if last character was correct
      if (state.lastCharacterCorrect) {
        setSuccessPulse(true);
        setTimeout(() => setSuccessPulse(false), 200);
        
        // Combo effect for streaks
        if (state.combo > 0 && state.combo % 10 === 0) {
          setComboEffect(true);
          setTimeout(() => setComboEffect(false), 600);
        }
      } else {
        // Error effect
        setErrorEffect(true);
        setShakeAnimation(true);
        setTimeout(() => {
          setErrorEffect(false);
          setShakeAnimation(false);
        }, 400);
      }
    }
  }, [state.currentIndex, state.lastCharacterCorrect, state.combo, lastTypedIndex]);

  const renderText = () => {
    const words = state.currentText.split(' ');
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
                  transition: "all 0.15s ease-in-out",
                  transformOrigin: "center",
                };
                
                // Character state styling with enhanced effects
                if (currentCharIndex < state.typedText.length) {
                  const typedChar = state.typedText[currentCharIndex];
                  if (typedChar === char) {
                    // Correct character - green with glow
                    charStyle.color = theme.colors.status.correct;
                    charStyle.backgroundColor = `${theme.colors.status.correct}20`;
                    charStyle.boxShadow = `0 0 8px ${theme.colors.status.correct}40`;
                    charStyle.transform = successPulse && currentCharIndex === state.currentIndex - 1 
                      ? "scale(1.2)" : "scale(1)";
                    charStyle.animation = currentCharIndex === state.currentIndex - 1 && state.lastCharacterCorrect
                      ? "correctPulse 0.3s ease-out" : "none";
                  } else {
                    // Incorrect character - red with strong glow and shake
                    charStyle.color = theme.colors.status.incorrect;
                    charStyle.backgroundColor = `${theme.colors.status.incorrect}25`;
                    charStyle.boxShadow = `0 0 12px ${theme.colors.status.incorrect}60`;
                    charStyle.animation = currentCharIndex === state.currentIndex - 1 && !state.lastCharacterCorrect
                      ? "errorShake 0.4s ease-in-out" : "none";
                    charStyle.transform = errorEffect && currentCharIndex === state.currentIndex - 1
                      ? "scale(1.1) rotate(2deg)" : "scale(1)";
                  }
                } else if (currentCharIndex === state.currentIndex) {
                  // Current character - cursor with enhanced visibility
                  charStyle.color = theme.colors.text.primary;
                  charStyle.backgroundColor = state.gameStatus === "playing" && cursorVisible 
                    ? theme.colors.status.current 
                    : `${theme.colors.status.current}30`;
                  charStyle.boxShadow = cursorVisible 
                    ? `0 0 15px ${theme.colors.status.current}70, inset 0 0 10px ${theme.colors.status.current}30`
                    : `0 0 5px ${theme.colors.status.current}30`;
                  charStyle.animation = cursorVisible ? "cursorPulse 1s ease-in-out infinite" : "none";
                  charStyle.transform = "scale(1.05)";
                } else {
                  // Future characters - muted with subtle hover effect
                  charStyle.color = theme.colors.text.muted;
                  charStyle.opacity = 0.6;
                  charStyle.transition = "all 0.2s ease-in-out";
                }
                
                // Combo effect highlighting
                if (comboEffect && currentCharIndex >= state.currentIndex - 10 && currentCharIndex < state.currentIndex) {
                  charStyle.animation = "comboGlow 0.6s ease-out";
                  charStyle.boxShadow = `0 0 20px ${theme.colors.accent}80`;
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
                  transition: "all 0.15s ease-in-out",
                };
                
                if (spaceIndex < state.typedText.length) {
                  const typedChar = state.typedText[spaceIndex];
                  if (typedChar === ' ') {
                    spaceStyle.backgroundColor = `${theme.colors.status.correct}15`;
                    spaceStyle.boxShadow = `0 0 5px ${theme.colors.status.correct}30`;
                  } else {
                    spaceStyle.backgroundColor = `${theme.colors.status.incorrect}20`;
                    spaceStyle.boxShadow = `0 0 8px ${theme.colors.status.incorrect}50`;
                  }
                } else if (spaceIndex === state.currentIndex) {
                  spaceStyle.backgroundColor = state.gameStatus === "playing" && cursorVisible 
                    ? theme.colors.status.current 
                    : `${theme.colors.status.current}30`;
                  spaceStyle.boxShadow = cursorVisible 
                    ? `0 0 10px ${theme.colors.status.current}60`
                    : `0 0 3px ${theme.colors.status.current}30`;
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

  if (state.gameStatus === "paused") {
    return (
      <Card 
        variant="default"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: theme.spacing[8],
          animation: "breathe 2s ease-in-out infinite",
        }}
      >
        <Flex direction="column" align="center" gap={theme.spacing[4]}>
          <div style={{ 
            fontSize: "4rem", 
            animation: "pulse 2s infinite",
            filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
          }}>⏸️</div>
          <Text variant="heading" size="2xl" as="h2">Game Paused</Text>
          <Text variant="body" color="secondary">
            Press Resume to continue
          </Text>
        </Flex>
      </Card>
    );
  }

  const cardStyle: React.CSSProperties = {
    flex: 1,
    padding: theme.spacing[8],
    cursor: "text",
    overflow: "hidden",
    minHeight: "300px",
    maxHeight: "400px",
    border: `2px solid ${
      state.gameStatus === "playing" ? theme.colors.ui.focus : theme.colors.ui.border
    }`,
    boxShadow: state.gameStatus === "playing" 
      ? `0 0 25px ${theme.colors.ui.focus}40, inset 0 0 20px ${theme.colors.ui.focus}10`
      : theme.shadows.sm,
    transition: "all 0.3s ease-in-out",
    animation: state.gameStatus === "playing" ? "focusGlow 3s ease-in-out infinite" : "none",
    transform: shakeAnimation ? "translateY(-1px)" : "translateY(0)",
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Combo effect overlay */}
      {comboEffect && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "3rem",
          fontWeight: "bold",
          color: theme.colors.accent,
          textShadow: `0 0 20px ${theme.colors.accent}`,
          animation: "comboPopup 0.6s ease-out",
          pointerEvents: "none",
          zIndex: theme.zIndex.popover,
        }}>
          COMBO x{state.combo}!
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
          color: theme.colors.status.incorrect,
          textShadow: `0 0 15px ${theme.colors.status.incorrect}`,
          animation: "errorPopup 0.4s ease-out",
          pointerEvents: "none",
          zIndex: theme.zIndex.popover,
        }}>
          ❌
        </div>
      )}

      <Card
        variant="outlined"
        style={cardStyle}
        onClick={() => {
          if (containerRef.current && state.gameStatus === "playing") {
            containerRef.current.focus();
          }
        }}
      >
        <div
          ref={containerRef}
          tabIndex={0}
          style={{
            outline: "none",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ maxWidth: "64rem", width: "100%" }}>
            {renderText()}
          </div>
        </div>
        
        {state.gameStatus === "playing" && (
          <div 
            style={{
              position: "absolute",
              bottom: theme.spacing[4],
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              animation: "pulse 2s infinite",
              opacity: 0.7,
            }}
          >
            <Text variant="caption" color="muted">
              Click here and start typing!
            </Text>
          </div>
        )}
      </Card>

      {/* Global styles for animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        @keyframes correctPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); box-shadow: 0 0 20px ${theme.colors.status.correct}80; }
          100% { transform: scale(1); }
        }
        
        @keyframes errorShake {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-2deg); }
          75% { transform: scale(1.1) rotate(2deg); }
        }
        
        @keyframes cursorPulse {
          0%, 100% { box-shadow: 0 0 15px ${theme.colors.status.current}70, inset 0 0 10px ${theme.colors.status.current}30; }
          50% { box-shadow: 0 0 25px ${theme.colors.status.current}90, inset 0 0 15px ${theme.colors.status.current}50; }
        }
        
        @keyframes comboGlow {
          0% { box-shadow: 0 0 5px ${theme.colors.accent}40; }
          50% { box-shadow: 0 0 30px ${theme.colors.accent}90, 0 0 40px ${theme.colors.accent}60; }
          100% { box-shadow: 0 0 8px ${theme.colors.accent}40; }
        }
        
        @keyframes comboPopup {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
        
        @keyframes errorPopup {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
        
        @keyframes focusGlow {
          0%, 100% { box-shadow: 0 0 25px ${theme.colors.ui.focus}40, inset 0 0 20px ${theme.colors.ui.focus}10; }
          50% { box-shadow: 0 0 35px ${theme.colors.ui.focus}60, inset 0 0 25px ${theme.colors.ui.focus}20; }
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
    </div>
  );
}
