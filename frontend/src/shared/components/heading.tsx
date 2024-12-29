import {
  type HeadingProps as ChakraHeadingProps,
  Heading as ChakraHeading
} from '@chakra-ui/react';
import font from '@/shared/font';
import React, { useMemo } from 'react';

function Heading (props: ChakraHeadingProps) {
  const fontSize = useMemo(() => {
    switch (props.as) {
      case 'h1':
        return '48px';
      case 'h2':
        return '24px';
    }
    return '16px';
  }, [props.as]);

  return <ChakraHeading {...props} fontSize={fontSize} className={font} />;
}

export default React.memo(Heading);
