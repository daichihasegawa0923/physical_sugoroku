'use client';

import { Box } from '@chakra-ui/react';
import { type ReactNode } from 'react';

interface Props {
  id: string;
  children?: ReactNode;
}

export default function Canvas ({ id, children }: Props) {
  return (
    <Box id="main" w="100svw" h="calc(100svh - 54px)" position="relative">
      <canvas
        id={id}
        style={{
          width: '100%',
          height: '100%',
          touchAction: 'none'
        }}
      />
      {children}
    </Box>
  );
}
