'use client'

import { Box } from '@chakra-ui/react'
import Canvas from '@/app/room/[roomId]/_components/canvas'
import useMainLogic from '@/app/room/[roomId]/_hooks/useMainLogic'
import Loading from '@/shared/components/loading'
import useCanvasSwipeEvent from '@/app/room/[roomId]/_hooks/useSwipeEvent'
import Sequence from '@/app/room/[roomId]/_components/sequence'
import Goal from '@/app/room/[roomId]/_components/goal'

export default function Page ({ params }: { params: { roomId: string } }) {
  const { mainLogic, status, sequence } = useMainLogic(params.roomId)
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
      <Loading open={status === 'WAITING'} />
      <Sequence sequence={sequence} />
      <Goal roomId={params.roomId} />
      <Box id="main" w="100%" height="100%" position="relative">
        <Canvas id="main_canvas" />
      </Box>
    </>
  )
}
