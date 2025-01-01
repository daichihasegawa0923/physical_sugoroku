import { useCommandContext } from '@/shared/components/command.provider';
import { Box, Center } from '@chakra-ui/react';
import React from 'react';

function CommandAll () {
  const { text, status } = useCommandContext();

  if (status !== 'DISPLAY') return null;

  return (
    <Box
      position="absolute"
      w="100svw"
      h="100svh"
      zIndex={9999}
      backgroundColor="#00000066"
    >
      <Center w="100%" h="100%" color="white" fontWeight={600} fontSize="lg">
        {text}
      </Center>
    </Box>
  );
}

export default React.memo(CommandAll);
