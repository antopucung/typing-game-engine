import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";

export function TypingArea() {
  const { theme } = useTheme();
  const { state, typeCharacter, handleBackspace } = useTypingEngine();
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Focus the container when game starts
  useEffect(() => {
    if (containerRef.current && state.gameStatus === "playing") {
      containerRef.current.focus();
    }
  }, [state.gameStatus]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keyboard input when game is playing
      if (state.gameStatus !== "playing") return;
      
      // Don't interfere with browser shortcuts (Ctrl+R, Ctrl+T, etc.)
      if (event.ctrlKey || event.altKey || event.metaKey) return;
      
      // Handle backspace
      if (event.key === "Backspace") {
        event.preventDefault();
        handleBackspace();
        return;
      }
      
      // Handle printable characters (letters, numbers, symbols, spaces, punctuation)
      if (event.key.length === 1) {
        event.preventDefault();
        typeCharacter(event.key);
        return;
      }
    };

    // Add event listener to the container element instead of document
    const container = containerRef.current;
    if (container && state.gameStatus === "playing") {
      container.addEventListener("keydown", handleKeyDown);
      return () => {
        container.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [state.gameStatus, typeCharacter, handleBackspace]);

  // Blinking cursor effect
  useEffect(() => {
    if (state.gameStatus === "playing") {
      const interval = setInterval(() => {
        setCursorVisible(prev => !prev);
      }, 530); // Standard cursor blink rate
      
      return () => clearInterval(interval);
    } else {
      setCursorVisible(true);
    }
  }, [state.gameStatus]);

  // Reset cursor visibility on typing
  useEffect(() => {
    if (state.gameStatus === "playing") {
      setCursorVisible(true);
    }
  }, [state.currentIndex, state.gameStatus]);

  const renderText = () => {
    const words = state.currentText.split(' ');
    let charIndex = 0;

    return (
      <div className="text-center leading-relaxed">
        {words.map((word, wordIndex) => {
          const wordStart = charIndex;
          const wordEnd = charIndex + word.length;
          const wordChars = word.split('');
          
          const wordElement = (
            <span key={wordIndex} className="inline-block mx-1 my-1">
              {wordChars.map((char, charInWordIndex) => {
                const currentCharIndex = wordStart + charInWordIndex;
                let className = "relative inline-block transition-all duration-100 ";
                let style: React.CSSProperties = {
                  fontSize: '1.5rem',
                  fontFamily: 'monospace',
                  padding: '2px 1px',
                  borderRadius: '3px',
                };
                
                if (currentCharIndex < state.typedText.length) {
                  // Already typed characters
                  const typedChar = state.typedText[currentCharIndex];
                  if (typedChar === char) {
                    // Correct character
                    style.color = theme.colors.status.correct;
                    style.backgroundColor = `${theme.colors.status.correct}15`;
                  } else {
                    // Incorrect character
                    style.color = theme.colors.status.incorrect;
                    style.backgroundColor = `${theme.colors.status.incorrect}15`;
                  }
                } else if (currentCharIndex === state.currentIndex) {
                  // Current character (cursor position)
                  style.color = theme.colors.text.primary;
                  style.backgroundColor = state.gameStatus === "playing" && cursorVisible 
                    ? theme.colors.status.current 
                    : `${theme.colors.status.current}30`;
                } else {
                  // Future characters (not yet typed)
                  style.color = theme.colors.text.muted;
                  style.opacity = 0.6;
                }
                
                return (
                  <span key={charInWordIndex} className={className} style={style}>
                    {char}
                  </span>
                );
              })}
              
              {/* Space character handling */}
              {wordIndex < words.length - 1 && (() => {
                const spaceIndex = wordEnd;
                let spaceStyle: React.CSSProperties = {
                  fontSize: '1.5rem',
                  fontFamily: 'monospace',
                  padding: '2px 4px',
                  borderRadius: '3px',
                  display: 'inline-block',
                  minWidth: '8px',
                };
                
                if (spaceIndex < state.typedText.length) {
                  // Space already typed
                  const typedChar = state.typedText[spaceIndex];
                  if (typedChar === ' ') {
                    spaceStyle.backgroundColor = `${theme.colors.status.correct}15`;
                  } else {
                    spaceStyle.backgroundColor = `${theme.colors.status.incorrect}15`;
                  }
                } else if (spaceIndex === state.currentIndex) {
                  // Current space (cursor position)
                  spaceStyle.backgroundColor = state.gameStatus === "playing" && cursorVisible 
                    ? theme.colors.status.current 
                    : `${theme.colors.status.current}30`;
                }
                
                return <span style={spaceStyle}> </span>;
              })()}
            </span>
          );
          
          charIndex = wordEnd + 1; // +1 for the space
          return wordElement;
        })}
      </div>
    );
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
          <div className="text-4xl mb-4 animate-pulse">⏸️</div>
          <h2 className="text-2xl font-bold mb-2">Game Paused</h2>
          <p style={{ color: theme.colors.text.secondary }}>
            Press Resume to continue
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="flex-1 p-8 rounded-lg focus:outline-none cursor-text overflow-hidden transition-all duration-200"
        style={{ 
          backgroundColor: theme.colors.surface,
          border: `2px solid ${
            state.gameStatus === "playing" ? theme.colors.ui.focus : theme.colors.ui.border
          }`,
          minHeight: "300px",
          maxHeight: "400px",
          boxShadow: state.gameStatus === "playing" 
            ? `0 0 15px ${theme.colors.ui.focus}30`
            : 'none'
        }}
        tabIndex={0}
        onClick={() => {
          // Ensure focus when clicked
          if (containerRef.current && state.gameStatus === "playing") {
            containerRef.current.focus();
          }
        }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="max-w-4xl w-full">
            {renderText()}
          </div>
        </div>
        
        {state.gameStatus === "playing" && (
          <div 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-center animate-pulse"
            style={{ color: theme.colors.text.muted }}
          >
            Click here and start typing!
          </div>
        )}
      </div>
    </div>
  );
}
