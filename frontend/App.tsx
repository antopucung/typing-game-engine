import React from "react";
import { TypingGameProvider } from "./contexts/TypingGameContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TypingGameApp } from "./components/TypingGameApp";

export default function App() {
  return (
    <ThemeProvider>
      <TypingGameProvider>
        <TypingGameApp />
      </TypingGameProvider>
    </ThemeProvider>
  );
}
