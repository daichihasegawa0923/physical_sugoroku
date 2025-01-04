'use client';

import Heading from '@/shared/components/heading';
import { Box, HStack, Separator } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React from 'react';

const Header = () => {
  const router = useRouter();

  return (
    <>
      <Box w="100%" h="54px" backgroundColor="#A83F89">
        <HStack w="100%" h="100%" justifyContent={'center'} padding={4}>
          <Box w="max-content">
            <Heading
              as="h2"
              color="white"
              onClick={() => {
                router.push('/');
              }}
            >
              将棋王
            </Heading>
          </Box>
        </HStack>
      </Box>
      <Separator borderColor="#000" />
    </>
  );
};

export default React.memo(Header);
