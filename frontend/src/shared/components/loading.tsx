import { Box, Center, Spinner, Text } from '@chakra-ui/react'

interface Props {
  text?: string
  open?: boolean
}

export default function Loading ({ text, open }: Props) {
  if (!open) return null
  return (
    <Box
      w="100svw"
      h="100svh"
      position="absolute"
      left={0}
      right={0}
      top={0}
      bottom={0}
      zIndex={9999}
      backgroundColor="#00000066"
    >
      <Center w="100%" h="100%">
        <Spinner />
        <Text>{text ?? 'loading'}</Text>
      </Center>
    </Box>
  )
}
