import { Button } from '@/chakra/components/ui/button'
import { type GameStatus } from '@/shared/game/type'
import { Box, HStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

interface Props {
  result: { forward: number, height: number }
  onStop: (result: { forward: number, height: number }) => void
  status: GameStatus
}

export default function Dice ({
  result: defaultResult,
  onStop,
  status
}: Props): JSX.Element {
  const [result, setResult] = useState<{ forward: number, height: number }>(
    defaultResult
  )
  const [rolling, setRolling] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!rolling || status !== 'DICE') return
      setResult({
        forward: Math.floor(1 + Math.random() * 20),
        height: Math.floor(1 + Math.random() * 20)
      })

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
        <Box>高さ：{result.height}</Box>
        <Box>前方：{result.forward}</Box>
      </HStack>
      {status === 'DICE' && (
        <Button
          onClick={() => {
            setRolling(false)
            onStop(result)
          }}
        >
          stop
        </Button>
      )}
    </Box>
  )
}
