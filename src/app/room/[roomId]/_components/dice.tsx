import { Button } from '@/chakra/components/ui/button'
import { type GameStatus } from '@/shared/game/type'
import { Box, HStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

interface Props {
  result: number
  onStop: (result: number) => void
  status: GameStatus
}

const basePower = 3

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
      const rand = Math.floor(1 + Math.random() * 10)
      setResult(rand)

      return () => {
        clearInterval(interval)
      }
    }, 50)
  }, [rolling])

  return (
    <Box
      bgColor="white"
      position="absolute"
      w="300px"
      left="calc(50%-300px)"
      top="100px"
    >
      <HStack>
        <Box>威力：{result}</Box>
      </HStack>
      {status === 'DICE' && (
        <Button
          onClick={() => {
            setRolling(false)
            onStop(result + basePower)
          }}
        >
          stop
        </Button>
      )}
    </Box>
  )
}
