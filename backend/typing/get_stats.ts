import { api } from "encore.dev/api";
import { typingDB } from "./db";

export interface GetStatsRequest {
  userId: string;
}

export interface TypingStats {
  totalSessions: number;
  bestWpm: number;
  bestAccuracy: number;
  totalWordsTyped: number;
  totalTimePlayed: number;
  averageWpm: number;
  averageAccuracy: number;
}

// Retrieves typing statistics for a user.
export const getStats = api<GetStatsRequest, TypingStats>(
  { expose: true, method: "GET", path: "/typing/stats/:userId" },
  async (req) => {
    const stats = await typingDB.queryRow<{
      total_sessions: number;
      best_wpm: number;
      best_accuracy: number;
      total_words_typed: number;
      total_time_played: number;
      average_wpm: number;
      average_accuracy: number;
    }>`
      SELECT total_sessions, best_wpm, best_accuracy, total_words_typed, total_time_played, average_wpm, average_accuracy
      FROM typing_stats 
      WHERE user_id = ${req.userId}
    `;

    if (!stats) {
      return {
        totalSessions: 0,
        bestWpm: 0,
        bestAccuracy: 0,
        totalWordsTyped: 0,
        totalTimePlayed: 0,
        averageWpm: 0,
        averageAccuracy: 0,
      };
    }

    return {
      totalSessions: stats.total_sessions,
      bestWpm: stats.best_wpm,
      bestAccuracy: stats.best_accuracy,
      totalWordsTyped: stats.total_words_typed,
      totalTimePlayed: stats.total_time_played,
      averageWpm: stats.average_wpm,
      averageAccuracy: stats.average_accuracy,
    };
  }
);
