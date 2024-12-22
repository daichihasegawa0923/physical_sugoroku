'use client';

import Canvas from '@/app/room/[roomId]/_components/canvas';
import Goal from '@/app/room/[roomId]/_components/goal';
import Sequence from '@/app/room/[roomId]/_components/sequence';
import useMainLogic from '@/app/room/[roomId]/_hooks/useMainLogic';
import useCanvasSwipeEvent from '@/app/room/[roomId]/_hooks/useSwipeEvent';
import { Box } from '@chakra-ui/react';
import React from 'react';

interface Props {
  roomId: string;
}

function Index ({ roomId }: Props) {
  const { mainLogic, sequence } = useMainLogic(roomId);
  useCanvasSwipeEvent({
    canvasName: 'main_canvas',
    onMoveCb: (x, y) => {
      mainLogic?.changeAngle(x);
      mainLogic?.updateSmashDirection(x, y);
    },
    onReleaseCb: function (): void {
      mainLogic?.smash();
    }
  });

  return (
    <>
      <Sequence sequence={sequence} />
      <Goal roomId={roomId} />
      <Box id="main" w="100%" height="100%" position="relative">
        <Canvas id="main_canvas" />
      </Box>
    </>
  );
}

export default React.memo(Index);
