import React from "react";
import { useTypingEngine } from "../hooks/useTypingEngine";
import { GameLayout } from "./layout/GameLayout";
import { GameHeader } from "./game/GameHeader";
import { TypingArea } from "./game/TypingArea";
import { GameStats } from "./game/GameStats";
import { GameControls } from "./game/GameControls";
import { GameResults } from "./game/GameResults";
import { Flex } from "./layout/Flex";

export function TypingGameApp() {
  const { state } = useTypingEngine();

  return (
    <GameLayout>
      <GameHeader />
      
      {state.gameStatus === "idle" && (
        <Flex direction="column" align="center" justify="center" style={{ flex: 1 }}>
          <GameControls />
        </Flex>
      )}
      
      {(state.gameStatus === "playing" || state.gameStatus === "paused") && (
        <Flex direction="column" style={{ flex: 1 }}>
          <GameStats />
          <TypingArea />
          <GameControls />
        </Flex>
      )}
      
      {state.gameStatus === "finished" && (
        <Flex direction="column" style={{ flex: 1 }}>
          <GameResults />
          <GameControls />
        </Flex>
      )}
    </GameLayout>
  );
}
