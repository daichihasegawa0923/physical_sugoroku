'use client'

import { Box, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'

interface Props {
  text: string
  clearText: VoidFunction
}

function Command ({ text, clearText }: Props) {
  useEffect(() => {
    const x = setTimeout(() => {
      clearText()
    }, 5000)
    return () => {
      clearTimeout(x)
    }
  }, [text])

  if (!text) return null

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
      <Box>{text}</Box>
    </VStack>
  )
}

export default React.memo(Command)
