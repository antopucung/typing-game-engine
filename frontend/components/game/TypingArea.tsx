import React, { useRef, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";

export function TypingArea() {
  const { theme } = useTheme();
  const { state } = useTypingEngine();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && state.gameStatus === "playing") {
      containerRef.current.focus();
    }
  }, [state.gameStatus]);

  const renderText = () => {
    return state.currentText.split("").map((char, index) => {
      let className = "text-lg md:text-xl ";
      let style: React.CSSProperties = {};

      if (index < state.currentIndex) {
        // Typed characters
        const typedChar = state.typedText[index];
        if (typedChar === char) {
          className += "font-medium";
          style.color = theme.colors.status.correct;
          style.backgroundColor = `${theme.colors.status.correct}20`;
        } else {
          className += "font-medium";
          style.color = theme.colors.status.incorrect;
          style.backgroundColor = `${theme.colors.status.incorrect}20`;
        }
      } else if (index === state.currentIndex) {
        // Current character
        className += "font-bold animate-pulse";
        style.color = theme.colors.status.current;
        style.backgroundColor = `${theme.colors.status.current}30`;
      } else {
        // Untyped characters
        style.color = theme.colors.text.muted;
      }

      return (
        <span key={index} className={className} style={style}>
          {char}
        </span>
      );
    });
  };

  if (state.gameStatus === "paused") {
    return (
      <div 
        className="flex-1 flex items-center justify-center p-8 rounded-lg"
        style={{ 
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.ui.border}` 
        }}
      >
        <div className="text-center">
          <div className="text-4xl mb-4">⏸️</div>
          <h2 className="text-2xl font-bold mb-2">Game Paused</h2>
          <p style={{ color: theme.colors.text.secondary }}>
            Press Resume to continue
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 p-6 md:p-8 rounded-lg focus:outline-none cursor-text overflow-auto"
      style={{ 
        backgroundColor: theme.colors.surface,
        border: `2px solid ${state.gameStatus === "playing" ? theme.colors.ui.focus : theme.colors.ui.border}`,
        minHeight: "200px"
      }}
      tabIndex={0}
    >
      <div className="leading-relaxed tracking-wide">
        {renderText()}
      </div>
      
      {state.gameStatus === "playing" && (
        <div 
          className="mt-6 text-sm text-center"
          style={{ color: theme.colors.text.muted }}
        >
          Click here and start typing...
        </div>
      )}
    </div>
  );
}
