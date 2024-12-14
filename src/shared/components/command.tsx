'use client'

import { useCommandContext } from '@/shared/components/command.provider'
import { Box, VStack } from '@chakra-ui/react'
import React from 'react'

function Command () {
  const { text, status } = useCommandContext()

  // 初期表示時のための調整
  if (!text) return null

  return (
    <VStack
      data-state={status === 'DISPLAY' ? 'open' : 'closed'}
      _open={{
        animationName: 'fade-in, slide-from-top',
        animationDuration: '400ms'
      }}
      _closed={{
        animationName: 'fade-out, slide-from-bottom',
        animationDuration: '400ms'
      }}
      position="absolute"
      left="50%"
      top="0%"
      minH="80px"
      w="max-content"
      maxW="80%"
      bgColor="#000000cc"
      color="#fff"
      borderRadius="24px"
      borderWidth="4px"
      borderColor="#fff"
      zIndex={999}
      padding="8px"
      transform="translate(-50%, 100%)"
      justifyContent="center"
    >
      <Box>{text}</Box>
    </VStack>
  )
}

export default React.memo(Command)
