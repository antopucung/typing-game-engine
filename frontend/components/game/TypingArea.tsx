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
  const [recentlyTyped, setRecentlyTyped] = useState<Set<number>>(new Set());

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
      
      // Add to recently typed for fade effect
      setRecentlyTyped(prev => {
        const newSet = new Set(prev);
        newSet.add(state.currentIndex - 1);
        return newSet;
      });
      
      // Remove from recently typed after animation
      setTimeout(() => {
        setRecentlyTyped(prev => {
          const newSet = new Set(prev);
          newSet.delete(state.currentIndex - 1);
          return newSet;
        });
      }, 1000);
      
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
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transformOrigin: "center",
                };
                
                // Character state styling with enhanced gradient effects
                if (currentCharIndex < state.typedText.length) {
                  const typedChar = state.typedText[currentCharIndex];
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
                } else if (currentCharIndex === state.currentIndex) {
                  // Current character - cursor with enhanced visibility and gradient
                  const cursorColor = theme.colors.status.current;
                  const lightCursor = "#fbbf24";
                  const darkCursor = "#d97706";
                  
                  charStyle.color = "white";
                  charStyle.background = state.gameStatus === "playing" && cursorVisible 
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
                if (comboEffect && currentCharIndex >= state.currentIndex - 10 && currentCharIndex < state.currentIndex) {
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
                
                if (spaceIndex < state.typedText.length) {
                  const typedChar = state.typedText[spaceIndex];
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
                } else if (spaceIndex === state.currentIndex) {
                  const cursorColor = theme.colors.status.current;
                  spaceStyle.background = state.gameStatus === "playing" && cursorVisible 
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
          background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.primary}, ${theme.colors.status.correct})`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: `0 0 30px ${theme.colors.accent}80`,
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

      {/* Global styles for enhanced animations */}
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
