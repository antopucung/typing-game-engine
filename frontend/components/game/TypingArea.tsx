import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { TypingText } from "./typing/TypingText";
import { TypingEffects } from "./typing/TypingEffects";
import { TypingAnimations } from "./animations/TypingAnimations";

export function TypingArea() {
  const { theme } = useTheme();
  const { state, typeCharacter, handleBackspace } = useTypingEngine();
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [shakeAnimation, setShakeAnimation] = useState(false);
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
      <TypingEffects 
        comboEffect={comboEffect}
        errorEffect={errorEffect}
        combo={state.combo}
      />

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
            <TypingText
              currentText={state.currentText}
              typedText={state.typedText}
              currentIndex={state.currentIndex}
              cursorVisible={cursorVisible}
              gameStatus={state.gameStatus}
              recentlyTyped={recentlyTyped}
              comboEffect={comboEffect}
              shakeAnimation={shakeAnimation}
            />
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

      <TypingAnimations />
    </div>
  );
}
