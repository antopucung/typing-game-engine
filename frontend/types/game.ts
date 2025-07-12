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
  incorrectChars: Set<number>;
  correctChars: Set<number>;
  totalKeystrokes: number;
  rawWpm: number;
  netWpm: number;
  consistencyScore: number;
  wpmHistory: number[];
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
  | { type: "UPDATE_POWER_UPS" }
  | { type: "UPDATE_WPM_HISTORY" };
