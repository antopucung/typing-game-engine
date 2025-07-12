import { Theme } from "./theme";

export interface ComponentVariants {
  button: {
    primary: (theme: Theme) => React.CSSProperties;
    secondary: (theme: Theme) => React.CSSProperties;
    outline: (theme: Theme) => React.CSSProperties;
    ghost: (theme: Theme) => React.CSSProperties;
    disabled: (theme: Theme) => React.CSSProperties;
  };
  card: {
    default: (theme: Theme) => React.CSSProperties;
    elevated: (theme: Theme) => React.CSSProperties;
    outlined: (theme: Theme) => React.CSSProperties;
  };
  input: {
    default: (theme: Theme) => React.CSSProperties;
    focused: (theme: Theme) => React.CSSProperties;
    error: (theme: Theme) => React.CSSProperties;
  };
  text: {
    heading: (theme: Theme) => React.CSSProperties;
    body: (theme: Theme) => React.CSSProperties;
    caption: (theme: Theme) => React.CSSProperties;
    mono: (theme: Theme) => React.CSSProperties;
  };
}

export const componentVariants: ComponentVariants = {
  button: {
    primary: (theme) => ({
      backgroundColor: theme.colors.primary,
      color: theme.colors.text.primary,
      border: `1px solid ${theme.colors.primary}`,
      borderRadius: theme.borderRadius.lg,
      padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
      fontFamily: theme.typography.fontFamily.sans.join(", "),
      cursor: "pointer",
      transition: theme.transitions.normal,
      boxShadow: `0 0 15px ${theme.colors.primary}30`,
    }),
    secondary: (theme) => ({
      backgroundColor: theme.colors.surface,
      color: theme.colors.text.primary,
      border: `1px solid ${theme.colors.ui.border}`,
      borderRadius: theme.borderRadius.lg,
      padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
      fontFamily: theme.typography.fontFamily.sans.join(", "),
      cursor: "pointer",
      transition: theme.transitions.normal,
    }),
    outline: (theme) => ({
      backgroundColor: "transparent",
      color: theme.colors.text.primary,
      border: `1px solid ${theme.colors.ui.border}`,
      borderRadius: theme.borderRadius.lg,
      padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
      fontFamily: theme.typography.fontFamily.sans.join(", "),
      cursor: "pointer",
      transition: theme.transitions.normal,
    }),
    ghost: (theme) => ({
      backgroundColor: "transparent",
      color: theme.colors.text.primary,
      border: "1px solid transparent",
      borderRadius: theme.borderRadius.lg,
      padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
      fontFamily: theme.typography.fontFamily.sans.join(", "),
      cursor: "pointer",
      transition: theme.transitions.normal,
    }),
    disabled: (theme) => ({
      backgroundColor: theme.colors.surface,
      color: theme.colors.text.muted,
      border: `1px solid ${theme.colors.ui.border}`,
      borderRadius: theme.borderRadius.lg,
      padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
      fontFamily: theme.typography.fontFamily.sans.join(", "),
      cursor: "not-allowed",
      opacity: 0.5,
    }),
  },
  card: {
    default: (theme) => ({
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.ui.border}`,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[6],
      boxShadow: theme.shadows.sm,
    }),
    elevated: (theme) => ({
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.ui.border}`,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[6],
      boxShadow: theme.shadows.lg,
    }),
    outlined: (theme) => ({
      backgroundColor: "transparent",
      border: `2px solid ${theme.colors.ui.border}`,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[6],
    }),
  },
  input: {
    default: (theme) => ({
      backgroundColor: theme.colors.surface,
      color: theme.colors.text.primary,
      border: `1px solid ${theme.colors.ui.border}`,
      borderRadius: theme.borderRadius.lg,
      padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.sans.join(", "),
      outline: "none",
      transition: theme.transitions.normal,
    }),
    focused: (theme) => ({
      borderColor: theme.colors.ui.focus,
      boxShadow: `0 0 0 2px ${theme.colors.ui.focus}30`,
    }),
    error: (theme) => ({
      borderColor: theme.colors.status.incorrect,
      boxShadow: `0 0 0 2px ${theme.colors.status.incorrect}30`,
    }),
  },
  text: {
    heading: (theme) => ({
      color: theme.colors.text.primary,
      fontFamily: theme.typography.fontFamily.sans.join(", "),
      fontWeight: theme.typography.fontWeight.bold,
      lineHeight: theme.typography.lineHeight.tight,
    }),
    body: (theme) => ({
      color: theme.colors.text.primary,
      fontFamily: theme.typography.fontFamily.sans.join(", "),
      fontWeight: theme.typography.fontWeight.normal,
      lineHeight: theme.typography.lineHeight.normal,
    }),
    caption: (theme) => ({
      color: theme.colors.text.muted,
      fontFamily: theme.typography.fontFamily.sans.join(", "),
      fontWeight: theme.typography.fontWeight.normal,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.normal,
    }),
    mono: (theme) => ({
      color: theme.colors.text.primary,
      fontFamily: theme.typography.fontFamily.mono.join(", "),
      fontWeight: theme.typography.fontWeight.normal,
      lineHeight: theme.typography.lineHeight.normal,
    }),
  },
};

export function getComponentStyle(
  component: keyof ComponentVariants,
  variant: string,
  theme: Theme
): React.CSSProperties {
  const componentStyles = componentVariants[component];
  if (!componentStyles || !(variant in componentStyles)) {
    return {};
  }
  return (componentStyles as any)[variant](theme);
}
