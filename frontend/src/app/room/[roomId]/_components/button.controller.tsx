import { Button } from '@/chakra/components/ui/button'
import { Box, HStack } from '@chakra-ui/react'

interface Props {
  submitEvent: VoidFunction
}

const ButtonController = ({ submitEvent }: Props) => {
  return (
    <Box
      position="absolute"
      width="200px"
      zIndex={999}
      left="calc(50% - 100px)"
      bottom="100px"
    >
      <HStack w="100%" justify="center">
        <Button onClick={submitEvent} w="60px">
          ◯
        </Button>
      </HStack>
    </Box>
  )
}

export default ButtonController
