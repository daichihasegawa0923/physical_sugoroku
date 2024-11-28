import { Box, Center, Text } from '@chakra-ui/react'

export default function Goal () {
  return (
    <Box
      position="absolute"
      bgColor="#fff"
      borderRadius="8px"
      top="100px"
      width="300px"
      height="100px"
      left="50%"
      transform="translate(-50%)"
    >
      <Center w="100%" h="100%">
        <Text fontSize="16px" fontWeight="bold">
          ゴール！！
        </Text>
      </Center>
    </Box>
  )
}
