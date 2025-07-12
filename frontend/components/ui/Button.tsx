import React, { ReactNode, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getComponentStyle } from "../../design-system/components";
import { LucideIcon } from "lucide-react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "disabled";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  className?: string;
  style?: React.CSSProperties;
}

export function Button({ 
  children, 
  onClick, 
  disabled = false, 
  variant = "primary", 
  size = "md",
  icon: Icon,
  className = "",
  style = {}
}: ButtonProps) {
  const { theme } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle = getComponentStyle("button", disabled ? "disabled" : variant, theme);
  
  const sizeStyles = {
    sm: {
      padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
      fontSize: theme.typography.fontSize.sm,
    },
    md: {
      padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
      fontSize: theme.typography.fontSize.base,
    },
    lg: {
      padding: `${theme.spacing[4]} ${theme.spacing[8]}`,
      fontSize: theme.typography.fontSize.lg,
    },
  };

  const interactiveStyles: React.CSSProperties = !disabled && variant !== "disabled" ? {
    transform: isPressed ? "scale(0.95)" : isHovered ? "scale(1.05)" : "scale(1)",
    boxShadow: isHovered 
      ? `${baseStyle.boxShadow}, 0 8px 25px rgba(0, 0, 0, 0.15)` 
      : baseStyle.boxShadow || theme.shadows.sm,
    filter: isHovered ? "brightness(1.1)" : "brightness(1)",
  } : {};

  const combinedStyle: React.CSSProperties = {
    ...baseStyle,
    ...sizeStyles[size],
    ...interactiveStyles,
    ...style,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing[2],
    outline: "none",
    userSelect: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
  };

  const handleMouseDown = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      // Add click ripple effect
      const button = document.activeElement as HTMLButtonElement;
      if (button) {
        button.style.animation = "buttonClick 0.3s ease-out";
        setTimeout(() => {
          if (button.style) {
            button.style.animation = "";
          }
        }, 300);
      }
      onClick();
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled}
        className={className}
        style={combinedStyle}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Ripple effect overlay */}
        {!disabled && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
              opacity: isPressed ? 1 : 0,
              transform: `scale(${isPressed ? 1 : 0})`,
              transition: "all 0.3s ease-out",
              pointerEvents: "none",
            }}
          />
        )}
        
        {Icon && (
          <Icon 
            style={{ 
              width: "1.25rem", 
              height: "1.25rem",
              transition: "transform 0.2s ease-in-out",
              transform: isHovered ? "scale(1.1)" : "scale(1)",
            }} 
          />
        )}
        <span style={{
          transition: "transform 0.2s ease-in-out",
          transform: isPressed ? "translateY(1px)" : "translateY(0)",
        }}>
          {children}
        </span>
      </button>

      {/* Global button animation styles */}
      <style>{`
        @keyframes buttonClick {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
      `}</style>
    </>
  );
}
