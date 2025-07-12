import React, { createContext, useContext, useReducer, ReactNode } from "react";

export interface TypingGameState {
  gameStatus: "idle" | "playing" | "paused" | "finished";
  currentText: string;
  typedText: string;
  currentIndex: number;
  startTime: number | null;
  endTime: number | null;
  errors: number;
  wpm: number;
  accuracy: number;
  score: number;
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number;
  remainingTime: number;
  combo: number;
  maxCombo: number;
  streak: number;
  maxStreak: number;
  powerUps: {
    timeFreeze: number;
    doubleScore: number;
    errorImmunity: number;
  };
  achievements: string[];
  level: number;
  experience: number;
  lastCharacterCorrect: boolean;
  perfectRounds: number;
}

export type TypingGameAction =
  | { type: "START_GAME"; payload: { text: string; timeLimit: number } }
  | { type: "TYPE_CHARACTER"; payload: { character: string } }
  | { type: "BACKSPACE" }
  | { type: "PAUSE_GAME" }
  | { type: "RESUME_GAME" }
  | { type: "END_GAME" }
  | { type: "RESET_GAME" }
  | { type: "SET_DIFFICULTY"; payload: { difficulty: "easy" | "medium" | "hard" } }
  | { type: "UPDATE_TIME"; payload: { remainingTime: number } }
  | { type: "ACTIVATE_POWER_UP"; payload: { powerUp: keyof TypingGameState["powerUps"] } }
  | { type: "UPDATE_STATS"; payload: { wpm: number; accuracy: number; score: number } }
  | { type: "ADD_ACHIEVEMENT"; payload: { achievement: string } }
  | { type: "LEVEL_UP" }
  | { type: "UPDATE_POWER_UPS" };

const initialState: TypingGameState = {
  gameStatus: "idle",
  currentText: "",
  typedText: "",
  currentIndex: 0,
  startTime: null,
  endTime: null,
  errors: 0,
  wpm: 0,
  accuracy: 100,
  score: 0,
  difficulty: "medium",
  timeLimit: 60,
  remainingTime: 60,
  combo: 0,
  maxCombo: 0,
  streak: 0,
  maxStreak: 0,
  powerUps: {
    timeFreeze: 0,
    doubleScore: 0,
    errorImmunity: 0,
  },
  achievements: [],
  level: 1,
  experience: 0,
  lastCharacterCorrect: true,
  perfectRounds: 0,
};

function checkAchievements(state: TypingGameState): string[] {
  const newAchievements: string[] = [];
  
  // Speed achievements
  if (state.wpm >= 100 && !state.achievements.includes("Century Club")) {
    newAchievements.push("Century Club");
  }
  if (state.wpm >= 80 && !state.achievements.includes("Speed Demon")) {
    newAchievements.push("Speed Demon");
  }
  if (state.wpm >= 60 && !state.achievements.includes("Fast Fingers")) {
    newAchievements.push("Fast Fingers");
  }
  
  // Accuracy achievements
  if (state.accuracy === 100 && state.currentIndex >= 50 && !state.achievements.includes("Perfectionist")) {
    newAchievements.push("Perfectionist");
  }
  if (state.accuracy >= 95 && !state.achievements.includes("Precision Master")) {
    newAchievements.push("Precision Master");
  }
  
  // Combo achievements
  if (state.combo >= 100 && !state.achievements.includes("Combo Master")) {
    newAchievements.push("Combo Master");
  }
  if (state.combo >= 50 && !state.achievements.includes("Combo King")) {
    newAchievements.push("Combo King");
  }
  if (state.combo >= 25 && !state.achievements.includes("On Fire")) {
    newAchievements.push("On Fire");
  }
  
  // Score achievements
  if (state.score >= 5000 && !state.achievements.includes("High Scorer")) {
    newAchievements.push("High Scorer");
  }
  if (state.score >= 2000 && !state.achievements.includes("Point Collector")) {
    newAchievements.push("Point Collector");
  }
  
  // Special achievements
  if (state.errors === 0 && state.currentIndex >= 100 && !state.achievements.includes("Flawless Victory")) {
    newAchievements.push("Flawless Victory");
  }
  
  return newAchievements;
}

function typingGameReducer(state: TypingGameState, action: TypingGameAction): TypingGameState {
  switch (action.type) {
    case "START_GAME":
      return {
        ...state,
        gameStatus: "playing",
        currentText: action.payload.text,
        typedText: "",
        currentIndex: 0,
        startTime: Date.now(),
        endTime: null,
        errors: 0,
        timeLimit: action.payload.timeLimit,
        remainingTime: action.payload.timeLimit,
        combo: 0,
        score: 0,
        streak: 0,
        lastCharacterCorrect: true,
      };

    case "TYPE_CHARACTER": {
      if (state.gameStatus !== "playing") return state;
      
      const { character } = action.payload;
      const expectedChar = state.currentText[state.currentIndex];
      const isCorrect = character === expectedChar;
      const hasErrorImmunity = state.powerUps.errorImmunity > 0;
      
      // If error immunity is active, treat incorrect characters as correct
      const effectivelyCorrect = isCorrect || hasErrorImmunity;
      
      const newTypedText = state.typedText + character;
      const newIndex = state.currentIndex + 1;
      const newErrors = effectivelyCorrect ? state.errors : state.errors + 1;
      const newCombo = effectivelyCorrect ? state.combo + 1 : 0;
      const newMaxCombo = Math.max(state.maxCombo, newCombo);
      const newStreak = effectivelyCorrect ? state.streak + 1 : 0;
      const newMaxStreak = Math.max(state.maxStreak, newStreak);
      
      const timeElapsed = (Date.now() - (state.startTime || 0)) / 1000 / 60;
      const wordsTyped = newTypedText.split(" ").length;
      const newWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
      const newAccuracy = newIndex > 0 ? Math.round(((newIndex - newErrors) / newIndex) * 100) : 100;
      
      let newScore = state.score;
      if (effectivelyCorrect) {
        const basePoints = state.difficulty === "easy" ? 1 : state.difficulty === "medium" ? 2 : 3;
        const comboMultiplier = Math.floor(newCombo / 10) + 1;
        const streakBonus = Math.floor(newStreak / 20);
        const powerUpMultiplier = state.powerUps.doubleScore > 0 ? 2 : 1;
        newScore += (basePoints + streakBonus) * comboMultiplier * powerUpMultiplier;
      }

      const gameFinished = newIndex >= state.currentText.length;
      
      // Check for new achievements
      const newAchievements = checkAchievements({
        ...state,
        wpm: newWpm,
        accuracy: newAccuracy,
        combo: newCombo,
        score: newScore,
        errors: newErrors,
        currentIndex: newIndex,
      });

      return {
        ...state,
        typedText: newTypedText,
        currentIndex: newIndex,
        errors: newErrors,
        combo: newCombo,
        maxCombo: newMaxCombo,
        streak: newStreak,
        maxStreak: newMaxStreak,
        wpm: newWpm,
        accuracy: newAccuracy,
        score: newScore,
        gameStatus: gameFinished ? "finished" : state.gameStatus,
        endTime: gameFinished ? Date.now() : null,
        lastCharacterCorrect: effectivelyCorrect,
        achievements: [...state.achievements, ...newAchievements],
      };
    }

    case "BACKSPACE": {
      if (state.gameStatus !== "playing" || state.currentIndex === 0) return state;
      
      const newTypedText = state.typedText.slice(0, -1);
      const newIndex = state.currentIndex - 1;
      
      return {
        ...state,
        typedText: newTypedText,
        currentIndex: newIndex,
        combo: Math.max(0, state.combo - 1),
        streak: Math.max(0, state.streak - 1),
      };
    }

    case "PAUSE_GAME":
      return {
        ...state,
        gameStatus: state.gameStatus === "playing" ? "paused" : state.gameStatus,
      };

    case "RESUME_GAME":
      return {
        ...state,
        gameStatus: state.gameStatus === "paused" ? "playing" : state.gameStatus,
      };

    case "END_GAME":
      return {
        ...state,
        gameStatus: "finished",
        endTime: Date.now(),
      };

    case "RESET_GAME":
      return {
        ...initialState,
        difficulty: state.difficulty,
        level: state.level,
        experience: state.experience,
        achievements: state.achievements,
        maxCombo: state.maxCombo,
        maxStreak: state.maxStreak,
      };

    case "SET_DIFFICULTY":
      return {
        ...state,
        difficulty: action.payload.difficulty,
        timeLimit: action.payload.difficulty === "easy" ? 90 : action.payload.difficulty === "medium" ? 60 : 45,
      };

    case "UPDATE_TIME": {
      const newRemainingTime = action.payload.remainingTime;
      const timeFreezed = state.powerUps.timeFreeze > 0;
      
      return {
        ...state,
        remainingTime: timeFreezed ? state.remainingTime : newRemainingTime,
        gameStatus: newRemainingTime <= 0 && !timeFreezed ? "finished" : state.gameStatus,
        endTime: newRemainingTime <= 0 && !timeFreezed ? Date.now() : state.endTime,
      };
    }

    case "ACTIVATE_POWER_UP": {
      const powerUpCosts = {
        timeFreeze: 100,
        doubleScore: 200,
        errorImmunity: 300,
      };
      
      const cost = powerUpCosts[action.payload.powerUp];
      if (state.score < cost || state.powerUps[action.payload.powerUp] > 0) {
        return state;
      }
      
      return {
        ...state,
        score: state.score - cost,
        powerUps: {
          ...state.powerUps,
          [action.payload.powerUp]: 10,
        },
      };
    }

    case "UPDATE_POWER_UPS": {
      const newPowerUps = { ...state.powerUps };
      let updated = false;
      
      Object.keys(newPowerUps).forEach(key => {
        const powerUpKey = key as keyof typeof newPowerUps;
        if (newPowerUps[powerUpKey] > 0) {
          newPowerUps[powerUpKey] = Math.max(0, newPowerUps[powerUpKey] - 1);
          updated = true;
        }
      });
      
      return updated ? { ...state, powerUps: newPowerUps } : state;
    }

    case "UPDATE_STATS":
      return {
        ...state,
        wpm: action.payload.wpm,
        accuracy: action.payload.accuracy,
        score: action.payload.score,
      };

    case "ADD_ACHIEVEMENT":
      if (state.achievements.includes(action.payload.achievement)) return state;
      return {
        ...state,
        achievements: [...state.achievements, action.payload.achievement],
      };

    case "LEVEL_UP":
      return {
        ...state,
        level: state.level + 1,
        experience: 0,
      };

    default:
      return state;
  }
}

interface TypingGameContextType {
  state: TypingGameState;
  dispatch: React.Dispatch<TypingGameAction>;
}

const TypingGameContext = createContext<TypingGameContextType | undefined>(undefined);

interface TypingGameProviderProps {
  children: ReactNode;
}

export function TypingGameProvider({ children }: TypingGameProviderProps) {
  const [state, dispatch] = useReducer(typingGameReducer, initialState);

  return (
    <TypingGameContext.Provider value={{ state, dispatch }}>
      {children}
    </TypingGameContext.Provider>
  );
}

export function useTypingGame() {
  const context = useContext(TypingGameContext);
  if (context === undefined) {
    throw new Error("useTypingGame must be used within a TypingGameProvider");
  }
  return context;
}
