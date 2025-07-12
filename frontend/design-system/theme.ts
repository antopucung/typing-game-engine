import { designTokens } from "./tokens";

export interface Theme {
  name: string;
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
  spacing: typeof designTokens.spacing;
  borderRadius: typeof designTokens.borderRadius;
  shadows: typeof designTokens.shadows;
  typography: typeof designTokens.typography;
  breakpoints: typeof designTokens.breakpoints;
  zIndex: typeof designTokens.zIndex;
  transitions: typeof designTokens.transitions;
}

export const darkTheme: Theme = {
  name: "dark",
  colors: {
    primary: designTokens.colors.primary[500],
    secondary: designTokens.colors.secondary[500],
    accent: designTokens.colors.accent[400],
    background: designTokens.colors.neutral[900],
    surface: designTokens.colors.neutral[800],
    text: {
      primary: designTokens.colors.neutral[50],
      secondary: designTokens.colors.neutral[300],
      muted: designTokens.colors.neutral[400],
    },
    status: {
      correct: designTokens.colors.success[500],
      incorrect: designTokens.colors.error[500],
      current: designTokens.colors.warning[400],
      pending: designTokens.colors.neutral[500],
    },
    ui: {
      border: designTokens.colors.neutral[700],
      hover: designTokens.colors.neutral[600],
      focus: designTokens.colors.primary[500],
    },
  },
  spacing: designTokens.spacing,
  borderRadius: designTokens.borderRadius,
  shadows: designTokens.shadows,
  typography: designTokens.typography,
  breakpoints: designTokens.breakpoints,
  zIndex: designTokens.zIndex,
  transitions: designTokens.transitions,
};

export const lightTheme: Theme = {
  name: "light",
  colors: {
    primary: designTokens.colors.primary[600],
    secondary: designTokens.colors.secondary[600],
    accent: designTokens.colors.accent[500],
    background: designTokens.colors.neutral[50],
    surface: designTokens.colors.neutral[100],
    text: {
      primary: designTokens.colors.neutral[900],
      secondary: designTokens.colors.neutral[700],
      muted: designTokens.colors.neutral[500],
    },
    status: {
      correct: designTokens.colors.success[600],
      incorrect: designTokens.colors.error[600],
      current: designTokens.colors.warning[500],
      pending: designTokens.colors.neutral[400],
    },
    ui: {
      border: designTokens.colors.neutral[200],
      hover: designTokens.colors.neutral[300],
      focus: designTokens.colors.primary[600],
    },
  },
  spacing: designTokens.spacing,
  borderRadius: designTokens.borderRadius,
  shadows: designTokens.shadows,
  typography: designTokens.typography,
  breakpoints: designTokens.breakpoints,
  zIndex: designTokens.zIndex,
  transitions: designTokens.transitions,
};

export const themes = {
  dark: darkTheme,
  light: lightTheme,
} as const;

export type ThemeName = keyof typeof themes;
