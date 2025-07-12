import React, { createContext, useContext, ReactNode } from "react";

interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    status: {
      correct: string;
      incorrect: string;
      current: string;
      pending: string;
    };
    ui: {
      border: string;
      hover: string;
      focus: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

const theme: Theme = {
  colors: {
    primary: "rgb(59 130 246)",
    secondary: "rgb(99 102 241)",
    accent: "rgb(168 85 247)",
    background: "rgb(15 23 42)",
    surface: "rgb(30 41 59)",
    text: {
      primary: "rgb(248 250 252)",
      secondary: "rgb(203 213 225)",
      muted: "rgb(148 163 184)",
    },
    status: {
      correct: "rgb(34 197 94)",
      incorrect: "rgb(239 68 68)",
      current: "rgb(251 191 36)",
      pending: "rgb(100 116 139)",
    },
    ui: {
      border: "rgb(51 65 85)",
      hover: "rgb(71 85 105)",
      focus: "rgb(59 130 246)",
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  },
};

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
