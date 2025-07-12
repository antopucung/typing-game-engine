import React from "react";
import { useTypingEngine } from "../hooks/useTypingEngine";
import { GameLayout } from "./layout/GameLayout";
import { GameHeader } from "./game/GameHeader";
import { TypingArea } from "./game/TypingArea";
import { GameStats } from "./game/GameStats";
import { GameControls } from "./game/GameControls";
import { GameResults } from "./game/GameResults";

export function TypingGameApp() {
  const { state } = useTypingEngine();

  return (
    <GameLayout>
      <GameHeader />
      
      {state.gameStatus === "idle" && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <GameControls />
        </div>
      )}
      
      {(state.gameStatus === "playing" || state.gameStatus === "paused") && (
        <div className="flex-1 flex flex-col">
          <GameStats />
          <TypingArea />
          <GameControls />
        </div>
      )}
      
      {state.gameStatus === "finished" && (
        <div className="flex-1 flex flex-col space-y-6">
          <GameResults />
          <GameControls />
        </div>
      )}
    </GameLayout>
  );
}
