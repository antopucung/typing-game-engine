import React from "react";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { Flex } from "../layout/Flex";
import { GameResults } from "./GameResults";
import { GameFinishedControls } from "./controls/GameFinishedControls";

export function GameFinishedScreen() {
  return (
    <Flex direction="column" style={{ flex: 1 }}>
      <GameResults />
      <GameFinishedControls />
    </Flex>
  );
}
