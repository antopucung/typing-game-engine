import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Grid } from "../layout/Grid";
import { Flex } from "../layout/Flex";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { Trophy, Target, Gauge, Clock, Flame, Star, Award, Zap, Activity, TrendingUp } from "lucide-react";

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

  const getPerformanceRating = () => {
    if (state.wpm >= 80 && state.accuracy >= 95) return { 
      rating: "LEGENDARY!", 
      icon: "🏆", 
      color: theme.colors.accent,
      glow: true,
      particles: "✨🎉⭐",
    };
    if (state.wpm >= 60 && state.accuracy >= 90) return { 
      rating: "EXCELLENT!", 
      icon: "⭐", 
      color: theme.colors.status.correct,
      glow: true,
      particles: "🎉✨💫",
    };
    if (state.wpm >= 40 && state.accuracy >= 85) return { 
      rating: "GREAT!", 
      icon: "👍", 
      color: theme.colors.primary,
      glow: false,
      particles: "👏🎊",
    };
    if (state.wpm >= 25 && state.accuracy >= 80) return { 
      rating: "GOOD", 
      icon: "👌", 
      color: theme.colors.status.current,
      glow: false,
      particles: "👍",
    };
    return { 
      rating: "KEEP PRACTICING", 
      icon: "💪", 
      color: theme.colors.text.secondary,
      glow: false,
      particles: "💪",
    };
  };

  const performance = getPerformanceRating();

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
      {/* Confetti effect */}
      {showConfetti && (
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          pointerEvents: "none", 
          zIndex: theme.zIndex.popover,
          overflow: "hidden",
        }}>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `confettiFall ${2 + Math.random() * 3}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
                fontSize: "1.5rem",
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              {performance.particles.split('')[Math.floor(Math.random() * performance.particles.length)]}
            </div>
          ))}
        </div>
      )}

      {/* Fireworks effect */}
      {fireworksActive && (
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          pointerEvents: "none", 
          zIndex: theme.zIndex.popover,
        }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: [theme.colors.accent, theme.colors.primary, theme.colors.status.correct][i % 3],
                animation: `firework ${1 + Math.random()}s ease-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Performance rating */}
      <Flex direction="column" align="center" gap={theme.spacing[4]} style={{
        animation: "resultEnter 0.8s ease-out",
      }}>
        <div 
          style={{
            fontSize: "6rem",
            marginBottom: theme.spacing[4],
            transition: theme.transitions.slow,
            filter: performance.glow ? `drop-shadow(0 0 30px ${performance.color})` : "none",
            animation: performance.glow ? "iconCelebrate 2s ease-in-out infinite" : "iconBounce 0.8s ease-out",
            transform: animateStats ? "scale(1)" : "scale(0.5)",
          }}
        >
          {performance.icon}
        </div>
        <Text 
          variant="heading" 
          size="4xl" 
          as="h2"
          style={{ 
            color: performance.color,
            textShadow: performance.glow ? `0 0 30px ${performance.color}60` : "none",
            animation: performance.glow ? "textGlow 2s ease-in-out infinite" : "textSlideIn 0.8s ease-out",
            marginBottom: theme.spacing[2],
            background: performance.glow ? `linear-gradient(45deg, ${performance.color}, ${theme.colors.accent})` : "none",
            backgroundClip: performance.glow ? "text" : "none",
            WebkitBackgroundClip: performance.glow ? "text" : "none",
            WebkitTextFillColor: performance.glow ? "transparent" : performance.color,
          }}
        >
          {performance.rating}
        </Text>
        <Text variant="body" color="secondary" style={{
          animation: "fadeInUp 0.8s ease-out 0.3s both",
        }}>
          Game completed on {state.difficulty} difficulty
        </Text>
      </Flex>

      {/* Stats grid */}
      <Grid columns={4} gap="lg" style={{ 
        width: "100%", 
        maxWidth: "96rem",
        animation: "gridSlideIn 0.8s ease-out 0.5s both",
      }}>
        {results.map((result, index) => (
          <Card
            key={index}
            variant="default"
            hover
            style={{
              textAlign: "center",
              border: `2px solid ${result.highlight ? result.color : theme.colors.ui.border}`,
              boxShadow: result.highlight 
                ? `0 0 30px ${result.color}40, inset 0 0 20px ${result.color}20` 
                : theme.shadows.sm,
              transform: animateStats ? "translateY(0)" : "translateY(3rem)",
              opacity: animateStats ? 1 : 0,
              transition: `all ${theme.transitions.slow}`,
              transitionDelay: `${index * 100}ms`,
              animation: result.highlight ? "statCelebrate 2s ease-in-out infinite" : "none",
              backgroundColor: result.highlight ? `${result.color}08` : theme.colors.surface,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Milestone badge */}
            {result.milestone && (
              <div style={{
                position: "absolute",
                top: theme.spacing[2],
                right: theme.spacing[2],
                fontSize: "0.7rem",
                padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                backgroundColor: result.color,
                color: "white",
                borderRadius: theme.borderRadius.full,
                fontWeight: "bold",
                animation: "badgePop 0.5s ease-out",
                boxShadow: `0 0 10px ${result.color}50`,
              }}>
                {result.milestone}
              </div>
            )}

            <Flex direction="column" align="center" gap={theme.spacing[3]}>
              <result.icon 
                style={{ 
                  width: "2rem", 
                  height: "2rem",
                  color: result.color,
                  animation: result.highlight ? "iconSpin 3s linear infinite" : "iconPop 0.5s ease-out",
                  filter: result.highlight ? `drop-shadow(0 0 10px ${result.color})` : "none",
                }} 
              />
              <Text 
                variant="heading" 
                size="3xl" 
                style={{ 
                  color: result.color,
                  textShadow: result.highlight ? `0 0 15px ${result.color}50` : "none",
                  animation: result.highlight ? "numberGlow 2s ease-in-out infinite" : "numberCount 0.8s ease-out",
                  fontWeight: result.highlight ? "800" : "600",
                }}
              >
                {result.value}{result.suffix}
              </Text>
              <Text variant="caption" color="muted">
                {result.label}
              </Text>
              {result.highlight && (
                <Award 
                  style={{ 
                    width: "1.2rem", 
                    height: "1.2rem", 
                    color: result.color,
                    animation: "awardSpin 3s linear infinite",
                    filter: `drop-shadow(0 0 8px ${result.color})`,
                  }} 
                />
              )}
            </Flex>
          </Card>
        ))}
      </Grid>

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

      {/* Achievements */}
      {state.achievements.length > 0 && (
        <div style={{ 
          width: "100%", 
          maxWidth: "32rem",
          animation: "achievementSlideIn 0.8s ease-out 1s both",
        }}>
          <Flex direction="column" align="center" gap={theme.spacing[4]}>
            <Flex align="center" gap={theme.spacing[2]}>
              <Zap style={{ 
                width: "1.5rem", 
                height: "1.5rem", 
                color: theme.colors.accent,
                animation: "sparkle 1s ease-in-out infinite",
              }} />
              <Text variant="heading" size="xl" style={{
                background: `linear-gradient(45deg, ${theme.colors.accent}, ${theme.colors.primary})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                New Achievements!
              </Text>
              <Zap style={{ 
                width: "1.5rem", 
                height: "1.5rem", 
                color: theme.colors.accent,
                animation: "sparkle 1s ease-in-out infinite",
                animationDelay: "0.5s",
              }} />
            </Flex>
            <Grid columns={2} gap="md" style={{ width: "100%" }}>
              {state.achievements.slice(-3).map((achievement, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  hover
                  style={{
                    border: `2px solid ${theme.colors.accent}`,
                    boxShadow: `0 0 20px ${theme.colors.accent}40`,
                    animation: "achievementPulse 2s ease-in-out infinite",
                    animationDelay: `${index * 0.2}s`,
                    backgroundColor: `${theme.colors.accent}10`,
                  }}
                >
                  <Flex align="center" gap={theme.spacing[3]}>
                    <div style={{ 
                      fontSize: "3rem", 
                      animation: "medalBounce 2s ease-in-out infinite",
                      filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))",
                    }}>🏅</div>
                    <div>
                      <Text variant="body" weight="semibold" style={{ color: theme.colors.accent }}>
                        {achievement}
                      </Text>
                      <Text variant="caption" color="muted">
                        Achievement unlocked!
                      </Text>
                    </div>
                  </Flex>
                </Card>
              ))}
            </Grid>
          </Flex>
        </div>
      )}

      {/* Performance badges */}
      <Grid columns={3} gap="md" style={{ 
        width: "100%", 
        maxWidth: "32rem",
        animation: "badgeSlideIn 0.8s ease-out 1.2s both",
      }}>
        {state.netWpm >= 60 && (
          <Card 
            variant="outlined"
            style={{ 
              textAlign: "center",
              backgroundColor: `${theme.colors.accent}15`,
              border: `2px solid ${theme.colors.accent}`,
              animation: "badgeGlow 2s ease-in-out infinite",
              boxShadow: `0 0 20px ${theme.colors.accent}50`,
            }}
          >
            <div style={{ 
              fontSize: "2.5rem",
              animation: "rocketFly 2s ease-in-out infinite",
            }}>🚀</div>
            <Text variant="caption" weight="bold" style={{ color: theme.colors.accent }}>
              SPEED DEMON
            </Text>
          </Card>
        )}
        
        {state.accuracy >= 95 && (
          <Card 
            variant="outlined"
            style={{ 
              textAlign: "center",
              backgroundColor: `${theme.colors.status.correct}15`,
              border: `2px solid ${theme.colors.status.correct}`,
              animation: "badgeGlow 2s ease-in-out infinite",
              animationDelay: "0.3s",
              boxShadow: `0 0 20px ${theme.colors.status.correct}50`,
            }}
          >
            <div style={{ 
              fontSize: "2.5rem",
              animation: "targetSpin 3s linear infinite",
            }}>🎯</div>
            <Text variant="caption" weight="bold" style={{ color: theme.colors.status.correct }}>
              PRECISION MASTER
            </Text>
          </Card>
        )}
        
        {state.consistencyScore >= 90 && (
          <Card 
            variant="outlined"
            style={{ 
              textAlign: "center",
              backgroundColor: `${theme.colors.primary}15`,
              border: `2px solid ${theme.colors.primary}`,
              animation: "badgeGlow 2s ease-in-out infinite",
              animationDelay: "0.6s",
              boxShadow: `0 0 20px ${theme.colors.primary}50`,
            }}
          >
            <div style={{ 
              fontSize: "2.5rem",
              animation: "chartGrow 2s ease-in-out infinite",
            }}>📈</div>
            <Text variant="caption" weight="bold" style={{ color: theme.colors.primary }}>
              CONSISTENCY KING
            </Text>
          </Card>
        )}
      </Grid>

      {/* Global styles for animations */}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        
        @keyframes firework {
          0% { transform: scale(0); opacity: 1; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes resultEnter {
          0% { opacity: 0; transform: translateY(-50px) scale(0.8); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes iconCelebrate {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-5deg); }
          75% { transform: scale(1.1) rotate(5deg); }
        }
        
        @keyframes iconBounce {
          0% { transform: scale(0.5) translateY(20px); }
          50% { transform: scale(1.2) translateY(-10px); }
          100% { transform: scale(1) translateY(0); }
        }
        
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 30px ${performance.color}60; }
          50% { text-shadow: 0 0 40px ${performance.color}80, 0 0 60px ${performance.color}40; }
        }
        
        @keyframes textSlideIn {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gridSlideIn {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes statCelebrate {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        @keyframes badgePop {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(0deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        @keyframes iconSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes iconPop {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        @keyframes numberGlow {
          0%, 100% { text-shadow: 0 0 15px ${theme.colors.accent}50; }
          50% { text-shadow: 0 0 25px ${theme.colors.accent}70, 0 0 35px ${theme.colors.accent}30; }
        }
        
        @keyframes numberCount {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes awardSpin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        
        @keyframes slideInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes achievementSlideIn {
          0% { opacity: 0; transform: translateY(40px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
        }
        
        @keyframes achievementPulse {
          0%, 100% { box-shadow: 0 0 20px ${theme.colors.accent}40; }
          50% { box-shadow: 0 0 30px ${theme.colors.accent}60, 0 0 40px ${theme.colors.accent}20; }
        }
        
        @keyframes medalBounce {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(10deg); }
        }
        
        @keyframes badgeSlideIn {
          0% { opacity: 0; transform: translateY(30px) scale(0.8); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes badgeGlow {
          0%, 100% { box-shadow: 0 0 20px ${theme.colors.accent}50; }
          50% { box-shadow: 0 0 30px ${theme.colors.accent}70, 0 0 40px ${theme.colors.accent}30; }
        }
        
        @keyframes rocketFly {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-10deg); }
        }
        
        @keyframes targetSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes chartGrow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </Flex>
  );
}
