import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Grid } from "../layout/Grid";
import { Flex } from "../layout/Flex";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { Trophy, Target, Gauge, Clock, Flame, Star, Award, Zap, Activity, TrendingUp } from "lucide-react";
import { ResultsHeader } from "./results/ResultsHeader";
import { ResultsStats } from "./results/ResultsStats";
import { ResultsAchievements } from "./results/ResultsAchievements";
import { ResultsBadges } from "./results/ResultsBadges";
import { ResultsAnimations } from "./animations/ResultsAnimations";

export function GameResults() {
  const { theme } = useTheme();
  const { state } = useTypingEngine();
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const [fireworksActive, setFireworksActive] = useState(false);
  const [celebrationLevel, setCelebrationLevel] = useState(0);

  const timeTaken = state.startTime && state.endTime 
    ? Math.round((state.endTime - state.startTime) / 1000)
    : 0;

  useEffect(() => {
    // Determine celebration level based on performance
    let level = 0;
    if (state.wpm >= 80 || state.accuracy >= 95 || state.maxCombo >= 25) level = 3; // Epic
    else if (state.wpm >= 60 || state.accuracy >= 90 || state.maxCombo >= 15) level = 2; // Great
    else if (state.wpm >= 40 || state.accuracy >= 85 || state.maxCombo >= 10) level = 1; // Good
    
    setCelebrationLevel(level);
    
    setTimeout(() => setAnimateStats(true), 300);
    
    if (level >= 2) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
    
    if (level >= 3) {
      setFireworksActive(true);
      setTimeout(() => setFireworksActive(false), 6000);
    }
  }, [state.wpm, state.accuracy, state.maxCombo]);

  const results = [
    {
      icon: Gauge,
      label: "Net WPM",
      value: state.netWpm,
      suffix: "WPM",
      color: state.netWpm >= 60 ? theme.colors.accent : theme.colors.primary,
      highlight: state.netWpm >= 60,
      milestone: state.netWpm >= 80 ? "SPEED DEMON!" : state.netWpm >= 60 ? "FAST TYPER!" : "",
    },
    {
      icon: Activity,
      label: "Raw WPM",
      value: state.rawWpm,
      suffix: "WPM",
      color: theme.colors.text.secondary,
      highlight: false,
      milestone: "",
    },
    {
      icon: Target,
      label: "Accuracy",
      value: state.accuracy,
      suffix: "%",
      color: state.accuracy >= 95 ? theme.colors.status.correct : theme.colors.primary,
      highlight: state.accuracy >= 95,
      milestone: state.accuracy === 100 ? "PERFECT!" : state.accuracy >= 95 ? "PRECISE!" : "",
    },
    {
      icon: TrendingUp,
      label: "Consistency",
      value: state.consistencyScore,
      suffix: "%",
      color: state.consistencyScore >= 90 ? theme.colors.status.correct : theme.colors.status.current,
      highlight: state.consistencyScore >= 90,
      milestone: state.consistencyScore >= 95 ? "STEADY!" : "",
    },
    {
      icon: Trophy,
      label: "Score",
      value: state.score,
      suffix: "pts",
      color: theme.colors.accent,
      highlight: state.score >= 1000,
      milestone: state.score >= 2000 ? "HIGH SCORER!" : state.score >= 1000 ? "SCORER!" : "",
    },
    {
      icon: Flame,
      label: "Max Combo",
      value: state.maxCombo,
      suffix: "",
      color: state.maxCombo >= 25 ? theme.colors.accent : theme.colors.status.current,
      highlight: state.maxCombo >= 25,
      milestone: state.maxCombo >= 50 ? "COMBO MASTER!" : state.maxCombo >= 25 ? "ON FIRE!" : "",
    },
    {
      icon: Clock,
      label: "Time Taken",
      value: timeTaken,
      suffix: "s",
      color: theme.colors.text.primary,
      highlight: false,
      milestone: "",
    },
    {
      icon: Star,
      label: "Errors",
      value: state.errors,
      suffix: "",
      color: state.errors === 0 ? theme.colors.status.correct : theme.colors.status.incorrect,
      highlight: state.errors === 0,
      milestone: state.errors === 0 ? "FLAWLESS!" : "",
    },
  ];

  return (
    <Flex direction="column" align="center" gap={theme.spacing[8]} style={{ position: "relative" }}>
      <ResultsHeader 
        showConfetti={showConfetti}
        fireworksActive={fireworksActive}
        state={state}
        animateStats={animateStats}
      />

      <ResultsStats 
        results={results}
        animateStats={animateStats}
      />

      {/* Additional stats */}
      <Grid columns={3} gap="md" style={{ 
        width: "100%", 
        maxWidth: "64rem",
        animation: "slideInUp 0.8s ease-out 0.8s both",
      }}>
        <Card variant="default" style={{ 
          textAlign: "center",
          animation: "cardFloat 3s ease-in-out infinite",
          animationDelay: "0s",
        }}>
          <Text variant="heading" size="2xl" color="primary">
            {state.totalKeystrokes}
          </Text>
          <Text variant="caption" color="muted">
            Total Keystrokes
          </Text>
        </Card>
        
        <Card variant="default" style={{ 
          textAlign: "center",
          animation: "cardFloat 3s ease-in-out infinite",
          animationDelay: "0.5s",
        }}>
          <Text variant="heading" size="2xl" color="success">
            {state.correctChars.size}
          </Text>
          <Text variant="caption" color="muted">
            Correct Characters
          </Text>
        </Card>
        
        <Card variant="default" style={{ 
          textAlign: "center",
          animation: "cardFloat 3s ease-in-out infinite",
          animationDelay: "1s",
        }}>
          <Text variant="heading" size="2xl" color="error">
            {state.incorrectChars.size}
          </Text>
          <Text variant="caption" color="muted">
            Incorrect Characters
          </Text>
        </Card>
      </Grid>

      <ResultsAchievements achievements={state.achievements} />
      <ResultsBadges state={state} />
      <ResultsAnimations />
    </Flex>
  );
}
