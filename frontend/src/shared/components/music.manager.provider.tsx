'use client';

import {
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle
} from '@/components/ui/dialog';
import { bgmManager } from '@/shared/game/music.manager';
import { Button } from '@chakra-ui/react';
import { createContext, type ReactNode, useContext, useState } from 'react';

interface State {
  checked: boolean;
}

const DefaultState = {
  checked: false
} as const satisfies State;

const MusicManagerContext = createContext<State>(DefaultState);

export const useMusicManagerContext = () => useContext(MusicManagerContext);

export function MusicManagerProvider ({ children }: { children?: ReactNode }) {
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <MusicManagerContext.Provider value={{ checked }}>
      <DialogRoot open={!checked} placement="center">
        <DialogBackdrop />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>音声の設定</DialogTitle>
          </DialogHeader>
          <DialogBody>音声を流しますか？</DialogBody>
          <DialogFooter>
            <Button
              onClick={() => {
                bgmManager().enableMusic();
                setChecked(true);
              }}
            >
              音声を流す
            </Button>
            <Button
              onClick={() => {
                setChecked(true);
              }}
            >
              音声を流さない
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
      {children}
    </MusicManagerContext.Provider>
  );
}
