import React from "react";
import { useTypingEngine } from "../hooks/useTypingEngine";
import { GameLayout } from "./layout/GameLayout";
import { GameHeader } from "./game/GameHeader";
import { GameIdleScreen } from "./game/GameIdleScreen";
import { GamePlayingScreen } from "./game/GamePlayingScreen";
import { GamePausedScreen } from "./game/GamePausedScreen";
import { GameFinishedScreen } from "./game/GameFinishedScreen";

export function TypingGameApp() {
  const { state } = useTypingEngine();

  const renderGameScreen = () => {
    switch (state.gameStatus) {
      case "idle":
        return <GameIdleScreen />;
      case "playing":
        return <GamePlayingScreen />;
      case "paused":
        return <GamePausedScreen />;
      case "finished":
        return <GameFinishedScreen />;
      default:
        return <GameIdleScreen />;
    }
  };

  return (
    <GameLayout>
      <GameHeader />
      {renderGameScreen()}
    </GameLayout>
  );
}
