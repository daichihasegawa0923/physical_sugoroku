import { Button } from '@/chakra/components/ui/button'
import { type GameStatus } from '@/shared/game/type'
import { Box, Center, HStack, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

interface Props {
  result: number
  onStop: (result: number) => void
  status: GameStatus
}

const basePower = 3
const maxPower = 10

export default function Dice ({
  result: defaultResult,
  onStop,
  status
}: Props): JSX.Element {
  const [result, setResult] = useState(
    defaultResult ? defaultResult - basePower : 0
  )
  const [rolling, setRolling] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!rolling || status !== 'DICE') return
      const rand = Math.floor(1 + Math.random() * maxPower)
      setResult(rand)

      return () => {
        clearInterval(interval)
      }
    }, 50)
  }, [rolling])

  return (
    <VStack
      bgColor="white"
      position="absolute"
      w="300px"
      left="50%"
      transform="translateX(-50%)"
      top="100px"
      padding="16px"
      borderRadius="8px"
      gap="16px"
    >
      <HStack w="100%">
        <Box>power</Box>
        <Box w="100%">
          <Box
            position="relative"
            h="20px"
            w="100%"
            borderRadius="10px"
            border="solid 1px #666"
          >
            <Box
              h="100%"
              w={`${(result / maxPower) * 100}%`}
              bgColor="#00ff00"
              borderRadius="10px"
            />
          </Box>
        </Box>
      </HStack>
      {status === 'DICE' && (
        <Center>
          <Button
            onClick={() => {
              setRolling(false)
              onStop(result + basePower)
            }}
          >
            stop
          </Button>
        </Center>
      )}
    </VStack>
  )
}
