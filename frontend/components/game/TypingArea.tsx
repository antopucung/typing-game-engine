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

  useEffect(() => {
    if (state.gameStatus === "playing") {
      setCursorVisible(true);
    }
  }, [state.currentIndex, state.gameStatus]);

  const renderText = () => {
    const words = state.currentText.split(' ');
    let charIndex = 0;

    return (
      <div style={{ textAlign: "center", lineHeight: theme.typography.lineHeight.relaxed }}>
        {words.map((word, wordIndex) => {
          const wordStart = charIndex;
          const wordEnd = charIndex + word.length;
          const wordChars = word.split('');
          
          const wordElement = (
            <span key={wordIndex} style={{ display: "inline-block", margin: `${theme.spacing[1]} ${theme.spacing[1]}` }}>
              {wordChars.map((char, charInWordIndex) => {
                const currentCharIndex = wordStart + charInWordIndex;
                let charStyle: React.CSSProperties = {
                  fontSize: theme.typography.fontSize["2xl"],
                  fontFamily: theme.typography.fontFamily.mono.join(", "),
                  padding: `${theme.spacing[1]} 1px`,
                  borderRadius: theme.borderRadius.sm,
                  position: "relative",
                  display: "inline-block",
                  transition: theme.transitions.fast,
                };
                
                if (currentCharIndex < state.typedText.length) {
                  const typedChar = state.typedText[currentCharIndex];
                  if (typedChar === char) {
                    charStyle.color = theme.colors.status.correct;
                    charStyle.backgroundColor = `${theme.colors.status.correct}15`;
                  } else {
                    charStyle.color = theme.colors.status.incorrect;
                    charStyle.backgroundColor = `${theme.colors.status.incorrect}15`;
                  }
                } else if (currentCharIndex === state.currentIndex) {
                  charStyle.color = theme.colors.text.primary;
                  charStyle.backgroundColor = state.gameStatus === "playing" && cursorVisible 
                    ? theme.colors.status.current 
                    : `${theme.colors.status.current}30`;
                } else {
                  charStyle.color = theme.colors.text.muted;
                  charStyle.opacity = 0.6;
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
                };
                
                if (spaceIndex < state.typedText.length) {
                  const typedChar = state.typedText[spaceIndex];
                  if (typedChar === ' ') {
                    spaceStyle.backgroundColor = `${theme.colors.status.correct}15`;
                  } else {
                    spaceStyle.backgroundColor = `${theme.colors.status.incorrect}15`;
                  }
                } else if (spaceIndex === state.currentIndex) {
                  spaceStyle.backgroundColor = state.gameStatus === "playing" && cursorVisible 
                    ? theme.colors.status.current 
                    : `${theme.colors.status.current}30`;
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
        }}
      >
        <Flex direction="column" align="center" gap={theme.spacing[4]}>
          <div style={{ fontSize: "4rem", animation: "pulse 2s infinite" }}>⏸️</div>
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
      ? `0 0 15px ${theme.colors.ui.focus}30`
      : theme.shadows.sm,
  };

  return (
    <div style={{ position: "relative" }}>
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
            }}
          >
            <Text variant="caption" color="muted">
              Click here and start typing!
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
}
