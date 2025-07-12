import { api } from "encore.dev/api";
import { typingDB } from "./db";

export interface SaveSessionRequest {
  userId?: string;
  wpm: number;
  accuracy: number;
  score: number;
  wordsTyped: number;
  timeTaken: number;
  difficulty: string;
}

export interface SaveSessionResponse {
  sessionId: number;
  isNewRecord: boolean;
}

// Saves a typing session and updates user statistics.
export const saveSession = api<SaveSessionRequest, SaveSessionResponse>(
  { expose: true, method: "POST", path: "/typing/sessions" },
  async (req) => {
    const sessionResult = await typingDB.queryRow<{ id: number }>`
      INSERT INTO typing_sessions (user_id, wpm, accuracy, score, words_typed, time_taken, difficulty)
      VALUES (${req.userId || null}, ${req.wpm}, ${req.accuracy}, ${req.score}, ${req.wordsTyped}, ${req.timeTaken}, ${req.difficulty})
      RETURNING id
    `;

    const sessionId = sessionResult!.id;
    let isNewRecord = false;

    if (req.userId) {
      const existingStats = await typingDB.queryRow<{
        best_wpm: number;
        best_accuracy: number;
        total_sessions: number;
        total_words_typed: number;
        total_time_played: number;
      }>`
        SELECT best_wpm, best_accuracy, total_sessions, total_words_typed, total_time_played
        FROM typing_stats 
        WHERE user_id = ${req.userId}
      `;

      if (existingStats) {
        const newTotalSessions = existingStats.total_sessions + 1;
        const newTotalWords = existingStats.total_words_typed + req.wordsTyped;
        const newTotalTime = existingStats.total_time_played + req.timeTaken;
        const newBestWpm = Math.max(existingStats.best_wpm, req.wpm);
        const newBestAccuracy = Math.max(existingStats.best_accuracy, req.accuracy);
        
        isNewRecord = req.wpm > existingStats.best_wpm || req.accuracy > existingStats.best_accuracy;

        const avgWpmResult = await typingDB.queryRow<{ avg_wpm: number }>`
          SELECT AVG(wpm) as avg_wpm FROM typing_sessions WHERE user_id = ${req.userId}
        `;
        
        const avgAccuracyResult = await typingDB.queryRow<{ avg_accuracy: number }>`
          SELECT AVG(accuracy) as avg_accuracy FROM typing_sessions WHERE user_id = ${req.userId}
        `;

        await typingDB.exec`
          UPDATE typing_stats 
          SET 
            total_sessions = ${newTotalSessions},
            best_wpm = ${newBestWpm},
            best_accuracy = ${newBestAccuracy},
            total_words_typed = ${newTotalWords},
            total_time_played = ${newTotalTime},
            average_wpm = ${avgWpmResult?.avg_wpm || 0},
            average_accuracy = ${avgAccuracyResult?.avg_accuracy || 0},
            updated_at = NOW()
          WHERE user_id = ${req.userId}
        `;
      } else {
        await typingDB.exec`
          INSERT INTO typing_stats (user_id, total_sessions, best_wpm, best_accuracy, total_words_typed, total_time_played, average_wpm, average_accuracy)
          VALUES (${req.userId}, 1, ${req.wpm}, ${req.accuracy}, ${req.wordsTyped}, ${req.timeTaken}, ${req.wpm}, ${req.accuracy})
        `;
        isNewRecord = true;
      }
    }

    return { sessionId, isNewRecord };
  }
);
