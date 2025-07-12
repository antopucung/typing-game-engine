import React, { createContext, useContext, useState, ReactNode } from "react";
import { Theme, ThemeName, themes, darkTheme } from "../design-system/theme";

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
}

export function ThemeProvider({ children, defaultTheme = "dark" }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<ThemeName>(defaultTheme);
  const theme = themes[themeName];

  const setTheme = (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
  };

  const toggleTheme = () => {
    setThemeName(current => current === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme, toggleTheme }}>
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
