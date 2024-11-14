import { Button } from '@/chakra/components/ui/button'
import ButtonInterval from '@/shared/components/button.interval'
import { Box, HStack } from '@chakra-ui/react'

interface Props {
  rightButtonEvent: VoidFunction
  leftButtonEvent: VoidFunction
  submitEvent: VoidFunction
}

const ButtonController = ({
  rightButtonEvent,
  leftButtonEvent,
  submitEvent
}: Props) => {
  return (
    <Box
      position="absolute"
      width="200px"
      zIndex={999}
      left="calc(50% - 100px)"
      bottom="100px"
    >
      <HStack w="100%" justify="center">
        <ButtonInterval w="60px" onTouch={rightButtonEvent} freq={10}>
          ←
        </ButtonInterval>
        <Button onClick={submitEvent} w="60px">
          ◯
        </Button>
        <ButtonInterval w="60px" onTouch={leftButtonEvent} freq={10}>
          →
        </ButtonInterval>
      </HStack>
    </Box>
  )
}

export default ButtonController
