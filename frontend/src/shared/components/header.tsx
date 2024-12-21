'use client'

import Heading from '@/shared/components/heading'
import { Box, HStack } from '@chakra-ui/react'
import React from 'react'

const Header = () => {
  return (
    <Box
      w="100%"
      h="54px"
      left={0}
      top={0}
      borderBottom={'1px solid #000'}
      marginBottom={1}
    >
      <HStack
        w="100%"
        h="100%"
        justifyContent={'center'}
        padding={4}
        bgColor="green"
      >
        <Box w="max-content">
          <a href="/">
            <Heading as="h2" color="white">
              将棋王
            </Heading>
          </a>
        </Box>
      </HStack>
    </Box>
  )
}

export default React.memo(Header)
