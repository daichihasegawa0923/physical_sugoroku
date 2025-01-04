import { Box } from '@chakra-ui/react';
import React from 'react';

interface Props {
  color: string;
  size: number;
}

function Koma ({ size, color }: Props) {
  return (
    <Box>
      <Box
        w={`${size}px`}
        h={`${size}px`}
        borderWidth={`${size / 2}px`}
        borderColor="transparent"
        borderBottomColor={color}
      />
      <Box w={`${size}px`} h={`${size}px`} bgColor={color} />
    </Box>
  );
}

export default React.memo(Koma);
