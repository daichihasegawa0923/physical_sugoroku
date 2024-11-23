'use client'

import { Box } from '@chakra-ui/react'
import Canvas from '@/app/room/[roomId]/_components/canvas'
import ButtonController from '@/app/room/[roomId]/_components/button.controller'
import useMainLogic from '@/app/room/[roomId]/_hooks/useMainLogic'
import Loading from '@/shared/components/loading'
import { Button } from '@/chakra/components/ui/button'
import { useCallback } from 'react'
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo'

export default function Page ({ params }: { params: { roomId: string } }) {
  const { mainLogic, status, activeMemberId, rollDice } = useMainLogic(
    params.roomId,
    'main_canvas',
    'main'
  )
  const { getByRoomId } = useLocalRoomInfo()

  const ComponentByStatus = useCallback((): JSX.Element | null => {
    const isMyTurn = getByRoomId(params.roomId)?.myMemberId === activeMemberId
    switch (status) {
      case 'DICE':
        if (!isMyTurn) return null
        return (
          <Box
            position="absolute"
            top="30px"
            left="calc(50% - 200px)"
            bgColor="#ff0"
            w="200px"
            h="50px"
          >
            <Button
              onClick={() => {
                rollDice(3, 3)
              }}
            >
              click me!
            </Button>
          </Box>
        )
      case 'DIRECTION':
        if (!isMyTurn) return null
        return (
          <ButtonController
            rightButtonEvent={() => {
              mainLogic?.changeAngle(-0.01)
            }}
            leftButtonEvent={() => {
              mainLogic?.changeAngle(0.01)
            }}
            submitEvent={() => {
              mainLogic?.smash()
            }}
          />
        )
      case 'MOVING':
        return null
    }
    return <Loading open />
  }, [status])

  return (
    <>
      <Box id="main" w="100%" height="100%" position="relative">
        <Canvas id="main_canvas" />
        <ComponentByStatus />
      </Box>
    </>
  )
}
