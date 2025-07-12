import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getComponentStyle } from "../../design-system/components";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onValueChange: (value: any) => void;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({ value, onValueChange, options, placeholder = "Select..." }: SelectProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  const inputStyle = getComponentStyle("input", "default", theme);
  const focusedStyle = getComponentStyle("input", "focused", theme);

  const buttonStyle: React.CSSProperties = {
    ...inputStyle,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    cursor: "pointer",
    ...(isOpen ? focusedStyle : {}),
  };

  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: theme.spacing[1],
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.ui.border}`,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.lg,
    zIndex: theme.zIndex.dropdown,
    overflow: "hidden",
  };

  const optionStyle: React.CSSProperties = {
    width: "100%",
    padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
    textAlign: "left",
    backgroundColor: "transparent",
    border: "none",
    color: theme.colors.text.primary,
    cursor: "pointer",
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.sans.join(", "),
    transition: theme.transitions.fast,
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={buttonStyle}
        onFocus={(e) => {
          Object.assign(e.currentTarget.style, focusedStyle);
        }}
        onBlur={(e) => {
          if (!isOpen) {
            Object.assign(e.currentTarget.style, inputStyle);
          }
        }}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown 
          style={{ 
            width: "1.25rem", 
            height: "1.25rem",
            color: theme.colors.text.muted,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: theme.transitions.fast,
          }}
        />
      </button>

      {isOpen && (
        <div style={dropdownStyle}>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              style={{
                ...optionStyle,
                backgroundColor: option.value === value ? `${theme.colors.primary}20` : "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${theme.colors.ui.hover}50`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = option.value === value ? `${theme.colors.primary}20` : "transparent";
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
