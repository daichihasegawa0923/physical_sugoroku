'use client'

import { Box, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

interface Props {
  text: string
}

function Command ({ text }: Props) {
  const [textDisplay, setTextDisplay] = useState('')
  useEffect(() => {
    setTextDisplay(text)
    const x = setTimeout(() => { setTextDisplay('') }, 2000)
    return () => { clearTimeout(x) }
  }, [text])

  if (!textDisplay) return null

  return (
    <VStack
      position="absolute"
      right="0"
      minH="80px"
      minW="160px"
      bgColor="#000000cc"
      color="#fff"
      borderRadius="24px"
      borderWidth="4px"
      borderColor="#fff"
      zIndex={999}
      padding="8px"
      alignItems="start"
    >
      <Box>{textDisplay}</Box>
    </VStack>
  )
}

export default React.memo(Command)
