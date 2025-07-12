import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";

export function TypingArea() {
  const { theme } = useTheme();
  const { state } = useTypingEngine();
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; type: 'correct' | 'incorrect' }>>([]);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState<'correct' | 'incorrect' | null>(null);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    if (containerRef.current && state.gameStatus === "playing") {
      containerRef.current.focus();
    }
  }, [state.gameStatus]);

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

  // Add particle effect when typing
  useEffect(() => {
    if (state.currentIndex > 0) {
      const lastTypedChar = state.typedText[state.currentIndex - 1];
      const expectedChar = state.currentText[state.currentIndex - 1];
      const isCorrect = lastTypedChar === expectedChar;
      
      // Add particle
      const newParticle = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        type: isCorrect ? 'correct' as const : 'incorrect' as const
      };
      
      setParticles(prev => [...prev, newParticle]);
      
      // Flash effect
      setFlash(isCorrect ? 'correct' : 'incorrect');
      setTimeout(() => setFlash(null), 150);
      
      // Shake on error
      if (!isCorrect) {
        setShake(true);
        setTimeout(() => setShake(false), 300);
      }
      
      // Remove particle after animation
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 1000);
    }
  }, [state.currentIndex, state.typedText, state.currentText]);

  const getComboColor = () => {
    if (state.combo >= 50) return theme.colors.accent;
    if (state.combo >= 25) return theme.colors.status.correct;
    if (state.combo >= 10) return theme.colors.primary;
    return theme.colors.text.muted;
  };

  const getComboScale = () => {
    if (state.combo >= 50) return "scale-125";
    if (state.combo >= 25) return "scale-110";
    if (state.combo >= 10) return "scale-105";
    return "scale-100";
  };

  const renderText = () => {
    const words = state.currentText.split(' ');
    let charIndex = 0;
    
    return (
      <div className="leading-relaxed tracking-wide text-lg md:text-xl font-mono">
        {words.map((word, wordIndex) => {
          const wordStart = charIndex;
          const wordEnd = charIndex + word.length;
          const spaceIndex = wordEnd;
          
          const wordElement = (
            <span key={wordIndex} className="inline-block mr-2 mb-1">
              {word.split('').map((char, charInWordIndex) => {
                const currentCharIndex = wordStart + charInWordIndex;
                let className = "relative inline-block transition-all duration-150 ";
                let style: React.CSSProperties = {};
                
                if (currentCharIndex < state.currentIndex) {
                  // Typed characters
                  const typedChar = state.typedText[currentCharIndex];
                  if (typedChar === char) {
                    className += "text-green-400 bg-green-400/20 ";
                    style.textShadow = "0 0 4px rgba(34, 197, 94, 0.5)";
                  } else {
                    className += "text-red-400 bg-red-400/20 ";
                    style.textShadow = "0 0 4px rgba(239, 68, 68, 0.5)";
                  }
                } else if (currentCharIndex === state.currentIndex) {
                  // Current character with blinking cursor
                  className += "text-yellow-400 bg-yellow-400/30 ";
                  style.color = theme.colors.status.current;
                  style.backgroundColor = `${theme.colors.status.current}40`;
                } else {
                  // Untyped characters
                  className += "text-gray-500 ";
                  style.color = theme.colors.text.muted;
                  style.opacity = 0.7;
                }
                
                return (
                  <span key={charInWordIndex} className={className} style={style}>
                    {char}
                    {currentCharIndex === state.currentIndex && state.gameStatus === "playing" && (
                      <span 
                        className={`absolute top-0 bottom-0 w-0.5 bg-current transition-opacity duration-75 ${
                          cursorVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ 
                          left: '100%',
                          backgroundColor: theme.colors.status.current,
                          boxShadow: `0 0 8px ${theme.colors.status.current}`
                        }}
                      />
                    )}
                  </span>
                );
              })}
              
              {/* Handle space character */}
              {wordIndex < words.length - 1 && (() => {
                const spaceCharIndex = spaceIndex;
                let spaceClassName = "inline-block w-2 ";
                let spaceStyle: React.CSSProperties = {};
                
                if (spaceCharIndex < state.currentIndex) {
                  const typedChar = state.typedText[spaceCharIndex];
                  if (typedChar === ' ') {
                    spaceClassName += "bg-green-400/20 ";
                  } else {
                    spaceClassName += "bg-red-400/20 ";
                  }
                } else if (spaceCharIndex === state.currentIndex) {
                  spaceClassName += "bg-yellow-400/30 relative ";
                  spaceStyle.backgroundColor = `${theme.colors.status.current}40`;
                }
                
                charIndex = spaceIndex + 1; // Update for next word
                
                return (
                  <span key={`space-${wordIndex}`} className={spaceClassName} style={spaceStyle}>
                    {spaceCharIndex === state.currentIndex && state.gameStatus === "playing" && (
                      <span 
                        className={`absolute top-0 bottom-0 w-0.5 bg-current transition-opacity duration-75 ${
                          cursorVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ 
                          left: '0',
                          backgroundColor: theme.colors.status.current,
                          boxShadow: `0 0 8px ${theme.colors.status.current}`
                        }}
                      />
                    )}
                    &nbsp;
                  </span>
                );
              })()}
            </span>
          );
          
          if (wordIndex === words.length - 1) {
            charIndex = wordEnd;
          }
          
          return wordElement;
        })}
        
        {/* Cursor at the end of text */}
        {state.currentIndex >= state.currentText.length && state.gameStatus === "playing" && (
          <span 
            className={`inline-block w-0.5 h-6 bg-current transition-opacity duration-75 ${
              cursorVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              backgroundColor: theme.colors.status.current,
              boxShadow: `0 0 8px ${theme.colors.status.current}`
            }}
          />
        )}
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
      {/* Combo Display */}
      {state.combo > 0 && (
        <div 
          className={`absolute -top-16 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-300 ${getComboScale()}`}
          style={{ color: getComboColor() }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold animate-pulse">
              {state.combo}x
            </div>
            <div className="text-sm font-medium">
              COMBO!
            </div>
          </div>
        </div>
      )}

      {/* Streak Indicator */}
      {state.combo >= 10 && (
        <div className="absolute -top-8 right-4 z-20">
          <div 
            className="px-3 py-1 rounded-full text-sm font-bold animate-pulse"
            style={{ 
              backgroundColor: `${getComboColor()}20`,
              color: getComboColor(),
              border: `2px solid ${getComboColor()}`
            }}
          >
            🔥 ON FIRE!
          </div>
        </div>
      )}

      {/* Flash Effect */}
      {flash && (
        <div 
          className="absolute inset-0 rounded-lg pointer-events-none z-10 animate-ping"
          style={{ 
            backgroundColor: flash === 'correct' 
              ? `${theme.colors.status.correct}20` 
              : `${theme.colors.status.incorrect}20`,
            border: `2px solid ${flash === 'correct' 
              ? theme.colors.status.correct 
              : theme.colors.status.incorrect}`
          }}
        />
      )}

      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute pointer-events-none z-15 animate-ping"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            color: particle.type === 'correct' 
              ? theme.colors.status.correct 
              : theme.colors.status.incorrect,
            fontSize: '1.5rem',
            animation: 'float-up 1s ease-out forwards'
          }}
        >
          {particle.type === 'correct' ? '✨' : '💥'}
        </div>
      ))}

      <div 
        ref={containerRef}
        className={`flex-1 p-6 md:p-8 rounded-lg focus:outline-none cursor-text overflow-auto transition-all duration-200 ${
          shake ? 'animate-shake' : ''
        }`}
        style={{ 
          backgroundColor: theme.colors.surface,
          border: `2px solid ${
            flash === 'correct' ? theme.colors.status.correct :
            flash === 'incorrect' ? theme.colors.status.incorrect :
            state.gameStatus === "playing" ? theme.colors.ui.focus : theme.colors.ui.border
          }`,
          minHeight: "200px",
          boxShadow: flash 
            ? `0 0 20px ${flash === 'correct' ? theme.colors.status.correct : theme.colors.status.incorrect}50`
            : state.gameStatus === "playing" 
            ? `0 0 15px ${theme.colors.ui.focus}30`
            : 'none'
        }}
        tabIndex={0}
      >
        <div className="relative">
          {renderText()}
        </div>
        
        {state.gameStatus === "playing" && (
          <div 
            className="mt-6 text-sm text-center animate-pulse"
            style={{ color: theme.colors.text.muted }}
          >
            Click here and start typing...
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-50px) scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
