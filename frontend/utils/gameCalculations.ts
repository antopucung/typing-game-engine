import { TypingGameState } from "../types/game";

export function calculateConsistency(wpmHistory: number[]): number {
  if (wpmHistory.length < 2) return 100;
  
  const mean = wpmHistory.reduce((sum, wpm) => sum + wpm, 0) / wpmHistory.length;
  const variance = wpmHistory.reduce((sum, wpm) => sum + Math.pow(wpm - mean, 2), 0) / wpmHistory.length;
  const standardDeviation = Math.sqrt(variance);
  
  // Convert to consistency score (lower deviation = higher consistency)
  const consistencyScore = Math.max(0, 100 - (standardDeviation * 2));
  return Math.round(consistencyScore);
}

export function checkAchievements(state: TypingGameState): string[] {
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
  
  // Consistency achievements
  if (state.consistencyScore >= 95 && state.wpmHistory.length >= 10 && !state.achievements.includes("Steady Hands")) {
    newAchievements.push("Steady Hands");
  }
  
  return newAchievements;
}
