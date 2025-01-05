'use client';

import Canvas from '@/app/room/[roomId]/_components/canvas';
import DirectionController from '@/app/room/[roomId]/_components/direction.controller';
import Goal from '@/app/room/[roomId]/_components/goal';
import Sequence from '@/app/room/[roomId]/_components/sequence';
import useMainLogic from '@/app/room/[roomId]/_hooks/useMainLogic';
import { playBattleBGM } from '@/game/logic/music/bgm.manager';
import React, { useEffect } from 'react';

interface Props {
  roomId: string;
}

function Index ({ roomId }: Props) {
  const { mainLogic, sequence } = useMainLogic(roomId);

  useEffect(() => {
    playBattleBGM();
  }, []);

  return (
    <Canvas id="main_canvas">
      <Sequence sequence={sequence} />
      <DirectionController
        roomId={roomId}
        onMove={(x, y, max) => {
          mainLogic?.updateSmashDirection(x, y, max);
        }}
        onLeave={() => {
          mainLogic?.smash();
        }}
      />
      <Goal roomId={roomId} />
    </Canvas>
  );
}

export default React.memo(Index);
