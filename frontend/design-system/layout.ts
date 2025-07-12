import { Theme } from "./theme";

export interface LayoutConfig {
  maxWidth: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  container: {
    padding: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
  };
  grid: {
    columns: {
      1: string;
      2: string;
      3: string;
      4: string;
      6: string;
      12: string;
    };
    gap: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
  flex: {
    direction: {
      row: string;
      column: string;
    };
    justify: {
      start: string;
      center: string;
      end: string;
      between: string;
      around: string;
    };
    align: {
      start: string;
      center: string;
      end: string;
      stretch: string;
    };
  };
}

export const layoutConfig: LayoutConfig = {
  maxWidth: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    full: "100%",
  },
  container: {
    padding: {
      mobile: "1rem",
      tablet: "1.5rem",
      desktop: "2rem",
    },
  },
  grid: {
    columns: {
      1: "repeat(1, minmax(0, 1fr))",
      2: "repeat(2, minmax(0, 1fr))",
      3: "repeat(3, minmax(0, 1fr))",
      4: "repeat(4, minmax(0, 1fr))",
      6: "repeat(6, minmax(0, 1fr))",
      12: "repeat(12, minmax(0, 1fr))",
    },
    gap: {
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
    },
  },
  flex: {
    direction: {
      row: "row",
      column: "column",
    },
    justify: {
      start: "flex-start",
      center: "center",
      end: "flex-end",
      between: "space-between",
      around: "space-around",
    },
    align: {
      start: "flex-start",
      center: "center",
      end: "flex-end",
      stretch: "stretch",
    },
  },
};

export function createLayoutStyles(theme: Theme) {
  return {
    container: {
      maxWidth: layoutConfig.maxWidth.xl,
      margin: "0 auto",
      padding: `0 ${layoutConfig.container.padding.mobile}`,
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        padding: `0 ${layoutConfig.container.padding.tablet}`,
      },
      [`@media (min-width: ${theme.breakpoints.lg})`]: {
        padding: `0 ${layoutConfig.container.padding.desktop}`,
      },
    },
    grid: {
      display: "grid",
      gap: layoutConfig.grid.gap.md,
    },
    flex: {
      display: "flex",
    },
  };
}
