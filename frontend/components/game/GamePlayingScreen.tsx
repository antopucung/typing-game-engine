import React from "react";
import { Flex } from "../layout/Flex";
import { GameStats } from "./GameStats";
import { TypingArea } from "./TypingArea";
import { GamePlayingControls } from "./controls/GamePlayingControls";

export function GamePlayingScreen() {
  return (
    <Flex direction="column" style={{ flex: 1 }}>
      <GameStats />
      <TypingArea />
      <GamePlayingControls />
    </Flex>
  );
}
