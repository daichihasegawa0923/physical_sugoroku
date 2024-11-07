'use client';

import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { GameScene } from '@/shared/game/game.scene';
import { Piece } from '@/game.logic/monos/piece';
import { MainLogic } from '@/game.logic/monos/main.logic';

export default function Page() {
  useEffect(() => {
    if (GameScene.get()) return;
    const mc = document.getElementById('main_canvas');
    const mainC = document.getElementById('main');
    if (mc && mainC) {
      GameScene.init(mc);
      const instance = GameScene.get();
      if (!instance) throw Error();
      instance.add(new MainLogic());
      window.addEventListener('resize', () => {
        const rect = mainC.getBoundingClientRect();
        instance.onResize(rect.width, rect.height);
      });
    }
  }, []);

  return (
    <Box id="main" w="100%" height="calc(100svh - 54px)">
      <canvas id="main_canvas" style={{ width: '100%', height: '100%' }} />
    </Box>
  );
}
