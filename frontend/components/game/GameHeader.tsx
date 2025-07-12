import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Flex } from "../layout/Flex";
import { Text } from "../ui/Text";
import { Card } from "../ui/Card";
import { Zap } from "lucide-react";

export function GameHeader() {
  const { theme } = useTheme();

  const iconContainerStyle: React.CSSProperties = {
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary,
  };

  return (
    <header style={{ padding: `${theme.spacing[6]} 0`, marginBottom: theme.spacing[6] }}>
      <Flex justify="center" align="center">
        <Flex align="center" gap={theme.spacing[3]}>
          <div style={iconContainerStyle}>
            <Zap style={{ width: "2rem", height: "2rem", color: "white" }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <Text variant="heading" size="4xl" as="h1">
              Typing Master
            </Text>
            <Text variant="body" size="lg" color="secondary">
              Test your typing speed and accuracy
            </Text>
          </div>
        </Flex>
      </Flex>
    </header>
  );
}
