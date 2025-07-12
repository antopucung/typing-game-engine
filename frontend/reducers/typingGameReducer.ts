import { TypingGameState, TypingGameAction } from "../types/game";
import { calculateConsistency, checkAchievements } from "../utils/gameCalculations";

export const initialState: TypingGameState = {
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
  incorrectChars: new Set(),
  correctChars: new Set(),
  totalKeystrokes: 0,
  rawWpm: 0,
  netWpm: 0,
  consistencyScore: 100,
  wpmHistory: [],
};

export function typingGameReducer(state: TypingGameState, action: TypingGameAction): TypingGameState {
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
        incorrectChars: new Set(),
        correctChars: new Set(),
        totalKeystrokes: 0,
        rawWpm: 0,
        netWpm: 0,
        wpmHistory: [],
        consistencyScore: 100,
      };

    case "TYPE_CHARACTER": {
      if (state.gameStatus !== "playing") return state;
      
      const { character } = action.payload;
      
      // Prevent typing beyond the text length
      if (state.currentIndex >= state.currentText.length) {
        return state;
      }
      
      const expectedChar = state.currentText[state.currentIndex];
      const isCorrect = character === expectedChar;
      const hasErrorImmunity = state.powerUps.errorImmunity > 0;
      
      // Track keystrokes
      const newTotalKeystrokes = state.totalKeystrokes + 1;
      
      // Update character tracking sets
      const newIncorrectChars = new Set(state.incorrectChars);
      const newCorrectChars = new Set(state.correctChars);
      
      // Always advance the cursor and add the character to typed text
      const newTypedText = state.typedText + character;
      const newIndex = state.currentIndex + 1;
      
      if (isCorrect) {
        newCorrectChars.add(state.currentIndex);
      } else {
        newIncorrectChars.add(state.currentIndex);
      }
      
      // If error immunity is active, treat incorrect characters as correct for scoring
      const effectivelyCorrect = isCorrect || hasErrorImmunity;
      
      const newErrors = isCorrect ? state.errors : state.errors + 1;
      const newCombo = effectivelyCorrect ? state.combo + 1 : 0;
      const newMaxCombo = Math.max(state.maxCombo, newCombo);
      const newStreak = effectivelyCorrect ? state.streak + 1 : 0;
      const newMaxStreak = Math.max(state.maxStreak, newStreak);
      
      // Calculate WPM based on time elapsed
      const timeElapsed = (Date.now() - (state.startTime || 0)) / 1000 / 60;
      const charactersTyped = newTypedText.length;
      const wordsTyped = charactersTyped / 5; // Standard: 5 characters = 1 word
      
      // Raw WPM (includes errors)
      const newRawWpm = timeElapsed > 0 ? Math.round((newTotalKeystrokes / 5) / timeElapsed) : 0;
      
      // Net WPM (corrected for errors)
      const correctCharacters = newCorrectChars.size;
      const newNetWpm = timeElapsed > 0 ? Math.round((correctCharacters / 5) / timeElapsed) : 0;
      const newWpm = newNetWpm; // Use net WPM as the main WPM metric
      
      // Calculate accuracy based on correct vs total characters typed
      const newAccuracy = newIndex > 0 ? Math.round((newCorrectChars.size / newIndex) * 100) : 100;
      
      let newScore = state.score;
      if (effectivelyCorrect) {
        const basePoints = state.difficulty === "easy" ? 1 : state.difficulty === "medium" ? 2 : 3;
        const comboMultiplier = Math.floor(newCombo / 10) + 1;
        const streakBonus = Math.floor(newStreak / 20);
        const powerUpMultiplier = state.powerUps.doubleScore > 0 ? 2 : 1;
        newScore += (basePoints + streakBonus) * comboMultiplier * powerUpMultiplier;
      }

      const gameFinished = newIndex >= state.currentText.length;
      
      // Update WPM history every few characters for consistency tracking
      let newWpmHistory = [...state.wpmHistory];
      if (newIndex > 0 && newIndex % 10 === 0) {
        newWpmHistory.push(newWpm);
        // Keep only last 20 measurements
        if (newWpmHistory.length > 20) {
          newWpmHistory = newWpmHistory.slice(-20);
        }
      }
      
      const newConsistencyScore = calculateConsistency(newWpmHistory);
      
      // Check for new achievements
      const newAchievements = checkAchievements({
        ...state,
        wpm: newWpm,
        accuracy: newAccuracy,
        combo: newCombo,
        score: newScore,
        errors: newErrors,
        currentIndex: newIndex,
        consistencyScore: newConsistencyScore,
        wpmHistory: newWpmHistory,
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
        rawWpm: newRawWpm,
        netWpm: newNetWpm,
        accuracy: newAccuracy,
        score: newScore,
        gameStatus: gameFinished ? "finished" : state.gameStatus,
        endTime: gameFinished ? Date.now() : null,
        lastCharacterCorrect: effectivelyCorrect,
        achievements: [...state.achievements, ...newAchievements],
        incorrectChars: newIncorrectChars,
        correctChars: newCorrectChars,
        totalKeystrokes: newTotalKeystrokes,
        wpmHistory: newWpmHistory,
        consistencyScore: newConsistencyScore,
      };
    }

    case "BACKSPACE": {
      if (state.gameStatus !== "playing" || state.currentIndex === 0) return state;
      
      // Only allow backspace if we've typed something
      if (state.typedText.length === 0) return state;
      
      const newTypedText = state.typedText.slice(0, -1);
      const newIndex = newTypedText.length; // Set index to match typed text length
      
      // Update character tracking - remove the character we're backspacing over
      const newCorrectChars = new Set(state.correctChars);
      const newIncorrectChars = new Set(state.incorrectChars);
      
      // Remove the character at the current position from tracking
      newCorrectChars.delete(state.currentIndex - 1);
      newIncorrectChars.delete(state.currentIndex - 1);
      
      // Recalculate errors based on the new state
      let newErrors = 0;
      for (let i = 0; i < newTypedText.length; i++) {
        if (newTypedText[i] !== state.currentText[i]) {
          newErrors++;
          newIncorrectChars.add(i);
        } else {
          newCorrectChars.add(i);
        }
      }
      
      // Recalculate accuracy
      const newAccuracy = newIndex > 0 ? Math.round((newCorrectChars.size / newIndex) * 100) : 100;
      
      // Recalculate WPM
      const timeElapsed = (Date.now() - (state.startTime || 0)) / 1000 / 60;
      const newWpm = timeElapsed > 0 ? Math.round((newCorrectChars.size / 5) / timeElapsed) : 0;
      
      return {
        ...state,
        typedText: newTypedText,
        currentIndex: newIndex,
        errors: newErrors,
        accuracy: newAccuracy,
        wpm: newWpm,
        combo: Math.max(0, state.combo - 1),
        streak: Math.max(0, state.streak - 1),
        correctChars: newCorrectChars,
        incorrectChars: newIncorrectChars,
        totalKeystrokes: state.totalKeystrokes + 1, // Backspace counts as a keystroke
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

    case "UPDATE_WPM_HISTORY": {
      const newWpmHistory = [...state.wpmHistory, state.wpm];
      if (newWpmHistory.length > 20) {
        newWpmHistory.shift();
      }
      
      return {
        ...state,
        wpmHistory: newWpmHistory,
        consistencyScore: calculateConsistency(newWpmHistory),
      };
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
