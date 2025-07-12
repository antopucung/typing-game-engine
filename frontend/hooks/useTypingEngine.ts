import { useEffect, useCallback } from "react";
import { useTypingGame } from "../contexts/TypingGameContext";
import { generateText } from "../utils/textGenerator";

export function useTypingEngine() {
  const { state, dispatch } = useTypingGame();

  const startGame = useCallback((difficulty?: "easy" | "medium" | "hard") => {
    if (difficulty) {
      dispatch({ type: "SET_DIFFICULTY", payload: { difficulty } });
    }
    
    const currentDifficulty = difficulty || state.difficulty;
    const text = generateText(currentDifficulty);
    const timeLimit = currentDifficulty === "easy" ? 90 : currentDifficulty === "medium" ? 60 : 45;
    
    dispatch({ type: "START_GAME", payload: { text, timeLimit } });
  }, [state.difficulty, dispatch]);

  const typeCharacter = useCallback((character: string) => {
    if (state.gameStatus === "playing") {
      dispatch({ type: "TYPE_CHARACTER", payload: { character } });
    }
  }, [dispatch, state.gameStatus]);

  const handleBackspace = useCallback(() => {
    if (state.gameStatus === "playing") {
      dispatch({ type: "BACKSPACE" });
    }
  }, [dispatch, state.gameStatus]);

  const pauseGame = useCallback(() => {
    dispatch({ type: "PAUSE_GAME" });
  }, [dispatch]);

  const resumeGame = useCallback(() => {
    dispatch({ type: "RESUME_GAME" });
  }, [dispatch]);

  const endGame = useCallback(() => {
    dispatch({ type: "END_GAME" });
  }, [dispatch]);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
  }, [dispatch]);

  const activatePowerUp = useCallback((powerUp: "timeFreeze" | "doubleScore" | "errorImmunity") => {
    dispatch({ type: "ACTIVATE_POWER_UP", payload: { powerUp } });
  }, [dispatch]);

  // Timer effect with power-up consideration
  useEffect(() => {
    if (state.gameStatus !== "playing") return;

    const interval = setInterval(() => {
      const timeFreezed = state.powerUps.timeFreeze > 0;
      if (!timeFreezed) {
        const newRemainingTime = Math.max(0, state.remainingTime - 1);
        dispatch({ type: "UPDATE_TIME", payload: { remainingTime: newRemainingTime } });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.gameStatus, state.remainingTime, state.powerUps.timeFreeze, dispatch]);

  // Power-up countdown effect
  useEffect(() => {
    if (state.gameStatus !== "playing") return;

    const interval = setInterval(() => {
      dispatch({ type: "UPDATE_POWER_UPS" });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.gameStatus, dispatch]);

  // Keyboard event handling - Fixed to work properly
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keyboard input when game is playing
      if (state.gameStatus !== "playing") return;
      
      // Don't interfere with browser shortcuts
      if (event.ctrlKey || event.altKey || event.metaKey) return;
      
      // Prevent default behavior for typing keys
      if (event.key === "Backspace") {
        event.preventDefault();
        handleBackspace();
      } else if (event.key.length === 1) {
        // Only handle single character keys (letters, numbers, symbols, spaces)
        event.preventDefault();
        typeCharacter(event.key);
      }
    };

    // Add event listener to the document to ensure it captures all key events
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [state.gameStatus, typeCharacter, handleBackspace]);

  // Focus management - ensure the game area can receive focus
  useEffect(() => {
    if (state.gameStatus === "playing") {
      // Small delay to ensure the DOM is ready
      const timer = setTimeout(() => {
        // Try to focus the document body to ensure keyboard events are captured
        document.body.focus();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [state.gameStatus]);

  return {
    state,
    startGame,
    typeCharacter,
    handleBackspace,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,
    activatePowerUp,
  };
}
