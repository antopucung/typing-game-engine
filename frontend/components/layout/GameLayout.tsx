import React, { ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Container } from "./Container";
import { Flex } from "./Flex";

interface GameLayoutProps {
  children: ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
  const { theme } = useTheme();

  const layoutStyle: React.CSSProperties = {
    minHeight: "100vh",
    width: "100%",
    backgroundColor: theme.colors.background,
    color: theme.colors.text.primary,
    overflow: "hidden",
  };

  return (
    <div style={layoutStyle}>
      <Container maxWidth="xl">
        <Flex 
          direction="column" 
          style={{ 
            minHeight: "100vh",
            padding: `${theme.spacing[4]} 0`,
          }}
        >
          {children}
        </Flex>
      </Container>
    </div>
  );
}
