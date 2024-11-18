'use client'

import { Box, Heading, HStack } from '@chakra-ui/react'

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
      <HStack w="100%" h="100%" padding={4}>
        <Box w="100%">
          <a href="/">
            <Heading>ダイナミックすごろく</Heading>
          </a>
        </Box>
      </HStack>
    </Box>
  )
}

export default Header
