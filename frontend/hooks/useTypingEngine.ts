import { useEffect, useCallback } from "react";
import { useTypingGame } from "../contexts/TypingGameContext";
import { generateText } from "../utils/textGenerator";

export function useTypingEngine() {
  const { state, dispatch } = useTypingGame();

  const startGame = useCallback((difficulty?: "easy" | "medium" | "hard") => {
    if (difficulty) {
      dispatch({ type: "SET_DIFFICULTY", payload: { difficulty } });
    }
    
    const text = generateText(state.difficulty);
    const timeLimit = difficulty === "easy" ? 90 : difficulty === "medium" ? 60 : 45;
    
    dispatch({ type: "START_GAME", payload: { text, timeLimit } });
  }, [state.difficulty, dispatch]);

  const typeCharacter = useCallback((character: string) => {
    dispatch({ type: "TYPE_CHARACTER", payload: { character } });
  }, [dispatch]);

  const handleBackspace = useCallback(() => {
    dispatch({ type: "BACKSPACE" });
  }, [dispatch]);

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

  // Keyboard event handling
  useEffect(() => {
    if (state.gameStatus !== "playing") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.altKey || event.metaKey) return;

      if (event.key === "Backspace") {
        event.preventDefault();
        handleBackspace();
      } else if (event.key.length === 1) {
        event.preventDefault();
        typeCharacter(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.gameStatus, typeCharacter, handleBackspace]);

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
