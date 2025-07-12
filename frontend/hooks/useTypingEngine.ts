import { useEffect, useCallback } from "react";
import { useTypingGame } from "../contexts/TypingGameContext";
import { generateText } from "../utils/textGenerator";
import backend from "~backend/client";

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

  const saveSession = useCallback(async () => {
    if (state.gameStatus === "finished" && state.endTime && state.startTime) {
      try {
        const timeTaken = Math.round((state.endTime - state.startTime) / 1000);
        const result = await backend.typing.saveSession({
          wpm: state.wpm,
          accuracy: state.accuracy,
          score: state.score,
          wordsTyped: Math.round(state.typedText.length / 5),
          timeTaken,
          difficulty: state.difficulty,
        });
        
        if (result.isNewRecord) {
          dispatch({ type: "ADD_ACHIEVEMENT", payload: { achievement: "New Personal Record!" } });
        }
        
        return result;
      } catch (error) {
        console.error("Failed to save session:", error);
      }
    }
  }, [state, dispatch]);

  // Auto-save session when game finishes
  useEffect(() => {
    if (state.gameStatus === "finished" && state.endTime) {
      saveSession();
    }
  }, [state.gameStatus, state.endTime, saveSession]);

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
    saveSession,
  };
}
