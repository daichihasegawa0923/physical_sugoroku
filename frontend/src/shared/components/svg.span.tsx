'use client'

import { Box } from '@chakra-ui/react'
import React from 'react'

interface Props {
  size: { w: number, h: number }
  src: string
}

function SvgSpan ({ src, size }: Props) {
  return (
    <Box
      as="span"
      display="block"
      backgroundImage={src}
      backgroundColor="#00000000"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      backgroundPosition="bottom center"
      w={`${size.w}px`}
      h={`${size.h}px`}
    />
  )
}

export default React.memo(SvgSpan)
