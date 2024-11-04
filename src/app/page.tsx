import { Box, Center, Text } from '@chakra-ui/react'

export default function Home () {
  return (
    <Center h="100svh">
      <Box w="300px" h="200px" borderRadius="8px" bgColor="white">
        <Center w="100%" h="100%">
          <Text color="black">Hello!</Text>
        </Center>
      </Box>
    </Center>
  )
}
