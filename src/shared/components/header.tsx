'use client'

import { useColorMode } from '@/chakra/components/ui/color-mode'
import { Switch } from '@/chakra/components/ui/switch'
import { Box, Center, Heading, HStack } from '@chakra-ui/react'

const Header = () => {
  const { setColorMode, colorMode } = useColorMode()
  const borderColor = colorMode === 'light' ? '#000' : '#fff'
  return (
    <Box
      w="100%"
      h="54px"
      left={0}
      top={0}
      borderBottom={`1px solid ${borderColor}`}
      marginBottom={8}
    >
      <HStack w="100%" h="100%" padding={4}>
        <Box w="100%">
          <a href="/">
            <Heading>バカすごろく</Heading>
          </a>
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
