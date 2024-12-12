'use client'

import { Box } from '@chakra-ui/react'
import Canvas from '@/app/room/[roomId]/_components/canvas'
import useMainLogic from '@/app/room/[roomId]/_hooks/useMainLogic'
import Loading from '@/shared/components/loading'
import { useState } from 'react'
import useCanvasSwipeEvent from '@/app/room/[roomId]/_hooks/useSwipeEvent'

export default function Page ({ params }: { params: { roomId: string } }) {
  const [loading, setLoading] = useState(false)
  const { mainLogic, status } = useMainLogic(params.roomId, setLoading)
  useCanvasSwipeEvent({
    canvasName: 'main_canvas',
    onMoveCb: (x, y) => {
      mainLogic?.changeAngle(x)
      mainLogic?.updateSmashDirection(x, y)
    },
    onReleaseCb: function (): void {
      mainLogic?.smash()
    }
  })

  return (
    <>
      <Loading open={loading || status === 'WAITING'} />
      <Box id="main" w="100%" height="100%" position="relative">
        <Canvas id="main_canvas" />
      </Box>
    </>
  )
}
