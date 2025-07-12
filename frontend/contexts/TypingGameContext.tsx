import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { TypingGameState, TypingGameAction } from "../types/game";
import { typingGameReducer, initialState } from "../reducers/typingGameReducer";

interface TypingGameContextType {
  state: TypingGameState;
  dispatch: React.Dispatch<TypingGameAction>;
}

const TypingGameContext = createContext<TypingGameContextType | undefined>(undefined);

interface TypingGameProviderProps {
  children: ReactNode;
}

export function TypingGameProvider({ children }: TypingGameProviderProps) {
  const [state, dispatch] = useReducer(typingGameReducer, initialState);

  return (
    <TypingGameContext.Provider value={{ state, dispatch }}>
      {children}
    </TypingGameContext.Provider>
  );
}

export function useTypingGame() {
  const context = useContext(TypingGameContext);
  if (context === undefined) {
    throw new Error("useTypingGame must be used within a TypingGameProvider");
  }
  return context;
}
