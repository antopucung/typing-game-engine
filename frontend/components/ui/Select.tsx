import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-left rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.ui.border,
          color: theme.colors.text.primary,
          focusRingColor: theme.colors.ui.focus,
        }}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown 
          className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          style={{ color: theme.colors.text.muted }}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-50 overflow-hidden"
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.ui.border,
            boxShadow: theme.shadows.lg,
          }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="w-full px-4 py-3 text-left hover:bg-opacity-80 transition-colors"
              style={{
                color: theme.colors.text.primary,
                backgroundColor: option.value === value ? `${theme.colors.primary}20` : "transparent",
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
