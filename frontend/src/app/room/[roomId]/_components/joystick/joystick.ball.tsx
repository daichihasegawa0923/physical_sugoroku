'use client';

import { Box } from '@chakra-ui/react';
import React, { useState } from 'react';

interface Props {
  size: number;
  joyStickColor: string;
  onMove?: (x: number, y: number, maxVector: number) => void;
  onLeave?: (x: number, y: number, maxVector: number) => void;
}

interface Position {
  x: number;
  y: number;
}

function JoyStickBall ({ size, joyStickColor, onLeave, onMove }: Props) {
  const [diff, setDiff] = useState<Position | null>(null);
  const [diffV, setDiffV] = useState<Position | null>(null);
  const [pivot, setPivot] = useState<Position | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  const onMoveFunc = (diffX: number, diffY: number) => {
    // ジョイスティックの大きさを超えないようにする
    const length = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    if (length <= size) {
      setDiff(() => ({ x: diffX, y: diffY }));
    } else {
      setDiff(() => ({
        x: diffX * (size / length),
        y: diffY * (size / length)
      }));
    }
    setDiffV(() => ({ x: diffX, y: diffY }));
    onMove && onMove(diff?.x ?? 0, diff?.y ?? 0, size);
  };

  return (
    <>
      <Box
        bgColor={joyStickColor}
        w={`${size}px`}
        h={`${size}px`}
        borderRadius={`${size / 2}px`}
        position="absolute"
        left={`${size / 2 - 1 + (diff?.x ?? 0)}px`}
        top={`${size / 2 - 1 + (diff?.y ?? 0)}px`}
      />
      <Box
        bgColor="transparent"
        w={`${size}px`}
        h={`${size}px`}
        borderRadius={`${size / 2}px`}
        position="absolute"
        left={`${size / 2 - 1 + (diffV?.x ?? 0)}px`}
        top={`${size / 2 - 1 + (diffV?.y ?? 0)}px`}
        // 下に引っ張ってリロードなどにならないようにしたい。
        touchAction="none"
        // PC
        onMouseDown={(e) => {
          setPivot(() => ({ x: e.clientX, y: e.clientY }));
          setIsMoving(() => true);
        }}
        onTouchStart={(e) => {
          setPivot(() => ({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
          }));
          setIsMoving(() => true);
        }}
        onMouseUp={() => {
          onLeave && onLeave(diff?.x ?? 0, diff?.y ?? 0, size);
          setIsMoving(() => false);
          setPivot(() => null);
          setDiffV(() => null);
          setDiff(() => null);
        }}
        onTouchEnd={() => {
          onLeave && onLeave(diff?.x ?? 0, diff?.y ?? 0, size);
          setIsMoving(() => false);
          setPivot(() => null);
          setDiffV(() => null);
          setDiff(() => null);
        }}
        onMouseMove={(e) => {
          if (!isMoving) return;
          if (pivot == null) throw Error();
          const diffX = e.clientX - pivot.x;
          const diffY = e.clientY - pivot.y;
          onMoveFunc(diffX, diffY);
        }}
        onTouchMove={(e) => {
          if (!isMoving) return;
          if (pivot == null) throw Error();
          const diffX = e.touches[0].clientX - pivot.x;
          const diffY = e.touches[0].clientY - pivot.y;
          onMoveFunc(diffX, diffY);
        }}
      />
    </>
  );
}

export default React.memo(JoyStickBall);
