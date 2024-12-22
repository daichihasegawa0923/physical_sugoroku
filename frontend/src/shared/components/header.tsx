'use client'

import Heading from '@/shared/components/heading'
import { Box, HStack, Separator } from '@chakra-ui/react'
import React from 'react'

const Header = () => {
  return (
    <>
      <Box w="100%" h="54px" backgroundColor="#A83F89">
        <HStack w="100%" h="100%" justifyContent={'center'} padding={4}>
          <Box w="max-content">
            <a href="/">
              <Heading as="h2" color="white">
                将棋王
              </Heading>
            </a>
          </Box>
        </HStack>
      </Box>
      <Separator borderColor="#000" />
    </>
  )
}

export default React.memo(Header)
