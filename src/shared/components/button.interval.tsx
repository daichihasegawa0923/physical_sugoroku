import { Button } from '@/chakra/components/ui/button'
import { type ButtonProps } from '@chakra-ui/react'
import { useState } from 'react'

interface Props extends ButtonProps {
  onTouch: VoidFunction
  freq: number
}

const ButtonInterval = ({ onTouch, freq, ...props }: Props) => {
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  return (
    <Button
      {...props}
      onPointerDown={() => {
        setIntervalId(setInterval(onTouch, freq))
      }}
      onPointerUp={() => {
        if (intervalId) {
          clearInterval(intervalId)
        }
      }}
    />
  )
}

export default ButtonInterval
