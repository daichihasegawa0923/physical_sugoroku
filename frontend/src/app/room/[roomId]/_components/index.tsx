'use client';

import Canvas from '@/app/room/[roomId]/_components/canvas';
import DirectionController from '@/app/room/[roomId]/_components/direction.controller';
import Goal from '@/app/room/[roomId]/_components/goal';
import Sequence from '@/app/room/[roomId]/_components/sequence';
import useMainLogic from '@/app/room/[roomId]/_hooks/useMainLogic';
import useCanvasSwipeEvent from '@/app/room/[roomId]/_hooks/useSwipeEvent';
import { playBattleBGM } from '@/game/logic/music/bgm.manager';
import { Box } from '@chakra-ui/react';
import React, { useEffect } from 'react';

interface Props {
  roomId: string;
}

function Index ({ roomId }: Props) {
  const { mainLogic, sequence } = useMainLogic(roomId);
  useCanvasSwipeEvent({
    canvasName: 'main_canvas',
    onMoveCb: (x, y) => {
      mainLogic?.updateSmashDirection(x, y);
    },
    onReleaseCb: function (): void {
      mainLogic?.smash();
    }
  });

  useEffect(() => {
    playBattleBGM();
  }, []);

  return (
    <>
      <Sequence sequence={sequence} />
      <DirectionController roomId={roomId} />
      <Goal roomId={roomId} />
      <Box id="main" w="100%" h="100%">
        <Canvas id="main_canvas" />
      </Box>
    </>
  );
}

export default React.memo(Index);
