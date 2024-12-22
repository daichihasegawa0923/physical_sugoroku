import { Box, Text } from '@chakra-ui/react'
import React, { type ReactNode } from 'react'

interface Props {
  title?: string
  children: ReactNode
  height?: string
}

function ContentBox ({ title, children, height }: Props) {
  return (
    <Box
      position="relative"
      w="100%"
      height={height || 'max-content'}
      color="black"
    >
      {title && (
        <Box
          position="absolute"
          w="max-content"
          h="16px"
          top="0"
          left="24px"
          bgColor="#fff"
          transform="translate(0, -50%)"
          lineHeight="100%"
          fontSize="11px"
          padding="0 8px"
          border="1px solid #000"
          borderRadius="8px"
        >
          <Text>{title}</Text>
        </Box>
      )}
      <Box
        w="100%"
        gap="8px"
        borderRadius="4px"
        border="1px solid #000"
        bgColor="#fff"
        padding={4}
      >
        {children}
      </Box>
    </Box>
  )
}

export default React.memo(ContentBox)
