'use client';

import JoystickBall from '@/app/room/[roomId]/_components/joystick/joystick.ball';
import { Box, type BoxProps } from '@chakra-ui/react';
import React from 'react';

interface Props extends BoxProps {
  size: number;
  joyStickColor: string;
  onMove?: (x: number, y: number, maxVector: number) => void;
  onLeave?: (x: number, y: number, maxVector: number) => void;
}

function JoyStick ({ size, joyStickColor, onMove, onLeave, ...rest }: Props) {
  return (
    <Box
      {...rest}
      w={`${size}px`}
      h={`${size}px`}
      borderRadius={`${size / 2}px`}
      border={`1px solid ${joyStickColor}`}
      position="relative"
    >
      <JoystickBall
        size={size / 2}
        joyStickColor={joyStickColor}
        onMove={onMove}
        onLeave={onLeave}
      />
    </Box>
  );
}

export default React.memo(JoyStick);
