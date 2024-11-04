'use client'

import { useColorMode } from '@/chakra/components/ui/color-mode'
import { Switch } from '@/chakra/components/ui/switch'
import { Box, Center, Heading, HStack } from '@chakra-ui/react'

const Header = () => {
  const { setColorMode, colorMode } = useColorMode()
  return (
    <Box
      position="absolute"
      w="100%"
      h="54px"
      left={0}
      top={0}
      borderBottom="1px solid #000"
    >
      <HStack w="100%" h="100%" padding={4}>
        <Box w="100%">
          <Heading>バカすごろく</Heading>
        </Box>
        <Center w="40px" h="100%">
          <Switch
            onChange={(e) => {
              setColorMode(colorMode === 'light' ? 'dark' : 'light')
            }}
          ></Switch>
        </Center>
      </HStack>
    </Box>
  )
}

export default Header
