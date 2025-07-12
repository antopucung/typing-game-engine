import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export function ResultsAnimations() {
  const { theme } = useTheme();

  return (
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
        0%, 100% { text-shadow: 0 0 30px ${theme.colors.accent}60; }
        50% { text-shadow: 0 0 40px ${theme.colors.accent}80, 0 0 60px ${theme.colors.accent}40; }
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
  );
}
