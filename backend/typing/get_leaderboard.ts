import { api } from "encore.dev/api";
import { typingDB } from "./db";
import { Query } from "encore.dev/api";

export interface GetLeaderboardRequest {
  limit?: Query<number>;
  metric?: Query<"wpm" | "accuracy">;
}

export interface LeaderboardEntry {
  userId: string;
  wpm: number;
  accuracy: number;
  totalSessions: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
}

// Retrieves the typing leaderboard.
export const getLeaderboard = api<GetLeaderboardRequest, LeaderboardResponse>(
  { expose: true, method: "GET", path: "/typing/leaderboard" },
  async (req) => {
    const limit = req.limit || 10;
    const metric = req.metric || "wpm";
    
    const orderBy = metric === "wpm" ? "best_wpm DESC" : "best_accuracy DESC";
    
    const entries = await typingDB.queryAll<{
      user_id: string;
      best_wpm: number;
      best_accuracy: number;
      total_sessions: number;
    }>`
      SELECT user_id, best_wpm, best_accuracy, total_sessions
      FROM typing_stats 
      WHERE total_sessions > 0
      ORDER BY ${metric === "wpm" ? "best_wpm" : "best_accuracy"} DESC
      LIMIT ${limit}
    `;

    return {
      entries: entries.map(entry => ({
        userId: entry.user_id,
        wpm: entry.best_wpm,
        accuracy: entry.best_accuracy,
        totalSessions: entry.total_sessions,
      })),
    };
  }
);
