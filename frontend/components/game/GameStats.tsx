import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Grid } from "../layout/Grid";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { Flex } from "../layout/Flex";
import { Clock, Gauge, Target, Trophy, Flame, Zap } from "lucide-react";

export function GameStats() {
  const { theme } = useTheme();
  const { state } = useTypingEngine();
  const [previousStats, setPreviousStats] = useState({
    wpm: 0,
    accuracy: 0,
    score: 0,
    combo: 0,
  });
  const [animatingStats, setAnimatingStats] = useState({
    wpm: false,
    accuracy: false,
    score: false,
    combo: false,
  });

  // Animate stats when they change
  useEffect(() => {
    const changes = {
      wpm: state.wpm !== previousStats.wpm,
      accuracy: state.accuracy !== previousStats.accuracy,
      score: state.score !== previousStats.score,
      combo: state.combo !== previousStats.combo,
    };

    if (Object.values(changes).some(Boolean)) {
      setAnimatingStats(changes);
      
      setTimeout(() => {
        setAnimatingStats({
          wpm: false,
          accuracy: false,
          score: false,
          combo: false,
        });
      }, 300);

      setPreviousStats({
        wpm: state.wpm,
        accuracy: state.accuracy,
        score: state.score,
        combo: state.combo,
      });
    }
  }, [state.wpm, state.accuracy, state.score, state.combo, previousStats]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getWpmColor = () => {
    if (state.wpm >= 80) return theme.colors.accent;
    if (state.wpm >= 60) return theme.colors.status.correct;
    if (state.wpm >= 40) return theme.colors.status.current;
    return theme.colors.primary;
  };

  const getAccuracyColor = () => {
    if (state.accuracy >= 95) return theme.colors.status.correct;
    if (state.accuracy >= 85) return theme.colors.status.current;
    return theme.colors.status.incorrect;
  };

  const getTimeColor = () => {
    if (state.remainingTime <= 10) return theme.colors.status.incorrect;
    if (state.remainingTime <= 30) return theme.colors.status.current;
    return theme.colors.primary;
  };

  const stats = [
    {
      icon: Clock,
      label: "Time",
      value: formatTime(state.remainingTime),
      color: getTimeColor(),
      pulse: state.remainingTime <= 10,
      glow: state.remainingTime <= 5,
      animating: false,
    },
    {
      icon: Gauge,
      label: "WPM",
      value: state.wpm.toString(),
      color: getWpmColor(),
      pulse: state.wpm >= 60,
      glow: state.wpm >= 80,
      animating: animatingStats.wpm,
    },
    {
      icon: Target,
      label: "Accuracy",
      value: `${state.accuracy}%`,
      color: getAccuracyColor(),
      pulse: state.accuracy >= 95,
      glow: state.accuracy === 100,
      animating: animatingStats.accuracy,
    },
    {
      icon: Trophy,
      label: "Score",
      value: state.score.toString(),
      color: theme.colors.accent,
      pulse: false,
      glow: state.score >= 1000,
      animating: animatingStats.score,
    },
  ];

  return (
    <div style={{ marginBottom: theme.spacing[6] }}>
      <Grid columns={4} gap="md">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            variant="default"
            style={{
              textAlign: "center",
              border: `1px solid ${stat.glow ? stat.color : theme.colors.ui.border}`,
              boxShadow: stat.pulse || stat.glow 
                ? `0 0 20px ${stat.color}50, inset 0 0 10px ${stat.color}20` 
                : theme.shadows.sm,
              animation: stat.pulse ? "statPulse 1.5s ease-in-out infinite" : 
                        stat.animating ? "statBounce 0.3s ease-out" : "none",
              transform: stat.animating ? "scale(1.05)" : "scale(1)",
              transition: "all 0.3s ease-in-out",
              backgroundColor: stat.glow ? `${stat.color}10` : theme.colors.surface,
            }}
          >
            <Flex direction="column" align="center" gap={theme.spacing[2]}>
              <stat.icon 
                style={{ 
                  width: "1.5rem", 
                  height: "1.5rem",
                  color: stat.color,
                  animation: stat.pulse ? "iconSpin 2s linear infinite" : 
                           stat.glow ? "iconGlow 1s ease-in-out infinite" : "none",
                  filter: stat.glow ? `drop-shadow(0 0 8px ${stat.color})` : "none",
                }} 
              />
              <Text 
                variant="heading" 
                size="2xl" 
                style={{
                  color: stat.color,
                  textShadow: stat.glow ? `0 0 10px ${stat.color}60` : "none",
                  animation: stat.animating ? "numberPop 0.3s ease-out" : "none",
                  fontWeight: stat.glow ? "800" : "600",
                }}
              >
                {stat.value}
              </Text>
              <Text variant="caption" color="muted">
                {stat.label}
              </Text>
            </Flex>
          </Card>
        ))}
      </Grid>

      {/* Combo indicator */}
      {state.combo > 5 && (
        <div style={{
          position: "fixed",
          top: "20%",
          right: theme.spacing[6],
          zIndex: theme.zIndex.popover,
          animation: "comboFloat 2s ease-in-out infinite",
        }}>
          <Card 
            variant="elevated"
            style={{
              padding: theme.spacing[4],
              border: `2px solid ${theme.colors.accent}`,
              boxShadow: `0 0 25px ${theme.colors.accent}60`,
              backgroundColor: `${theme.colors.accent}15`,
              animation: state.combo % 10 === 0 ? "comboExplode 0.5s ease-out" : "none",
            }}
          >
            <Flex align="center" gap={theme.spacing[2]}>
              <Flame style={{ 
                width: "1.5rem", 
                height: "1.5rem", 
                color: theme.colors.accent,
                animation: "flameFlicker 0.5s ease-in-out infinite alternate",
              }} />
              <div>
                <Text variant="heading" size="lg" style={{ color: theme.colors.accent }}>
                  {state.combo}x
                </Text>
                <Text variant="caption" color="muted">
                  COMBO
                </Text>
              </div>
            </Flex>
          </Card>
        </div>
      )}

      {/* Power-up indicators */}
      {Object.entries(state.powerUps).some(([_, duration]) => duration > 0) && (
        <div style={{
          position: "fixed",
          top: "30%",
          right: theme.spacing[6],
          zIndex: theme.zIndex.popover,
        }}>
          <Flex direction="column" gap={theme.spacing[2]}>
            {state.powerUps.timeFreeze > 0 && (
              <Card style={{
                padding: theme.spacing[2],
                backgroundColor: `${theme.colors.primary}20`,
                border: `1px solid ${theme.colors.primary}`,
                animation: "powerUpPulse 1s ease-in-out infinite",
              }}>
                <Flex align="center" gap={theme.spacing[1]}>
                  <Clock style={{ width: "1rem", height: "1rem", color: theme.colors.primary }} />
                  <Text variant="caption" style={{ color: theme.colors.primary }}>
                    Freeze {state.powerUps.timeFreeze}s
                  </Text>
                </Flex>
              </Card>
            )}
            {state.powerUps.doubleScore > 0 && (
              <Card style={{
                padding: theme.spacing[2],
                backgroundColor: `${theme.colors.accent}20`,
                border: `1px solid ${theme.colors.accent}`,
                animation: "powerUpPulse 1s ease-in-out infinite",
              }}>
                <Flex align="center" gap={theme.spacing[1]}>
                  <Zap style={{ width: "1rem", height: "1rem", color: theme.colors.accent }} />
                  <Text variant="caption" style={{ color: theme.colors.accent }}>
                    2x Score {state.powerUps.doubleScore}s
                  </Text>
                </Flex>
              </Card>
            )}
            {state.powerUps.errorImmunity > 0 && (
              <Card style={{
                padding: theme.spacing[2],
                backgroundColor: `${theme.colors.status.correct}20`,
                border: `1px solid ${theme.colors.status.correct}`,
                animation: "powerUpPulse 1s ease-in-out infinite",
              }}>
                <Flex align="center" gap={theme.spacing[1]}>
                  <Target style={{ width: "1rem", height: "1rem", color: theme.colors.status.correct }} />
                  <Text variant="caption" style={{ color: theme.colors.status.correct }}>
                    Shield {state.powerUps.errorImmunity}s
                  </Text>
                </Flex>
              </Card>
            )}
          </Flex>
        </div>
      )}

      {/* Global styles for animations */}
      <style>{`
        @keyframes statPulse {
          0%, 100% { 
            box-shadow: 0 0 20px ${theme.colors.status.incorrect}50, inset 0 0 10px ${theme.colors.status.incorrect}20;
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 30px ${theme.colors.status.incorrect}70, inset 0 0 15px ${theme.colors.status.incorrect}30;
            transform: scale(1.02);
          }
        }
        
        @keyframes statBounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1.05); }
        }
        
        @keyframes numberPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        @keyframes iconSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes iconGlow {
          0%, 100% { filter: drop-shadow(0 0 8px ${theme.colors.accent}); }
          50% { filter: drop-shadow(0 0 15px ${theme.colors.accent}) drop-shadow(0 0 20px ${theme.colors.accent}); }
        }
        
        @keyframes comboFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes comboExplode {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); box-shadow: 0 0 40px ${theme.colors.accent}80; }
          100% { transform: scale(1); }
        }
        
        @keyframes flameFlicker {
          0% { transform: scale(1) rotate(-2deg); }
          100% { transform: scale(1.1) rotate(2deg); }
        }
        
        @keyframes powerUpPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
