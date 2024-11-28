'use client'

import { Box } from '@chakra-ui/react'
import Canvas from '@/app/room/[roomId]/_components/canvas'
import ButtonController from '@/app/room/[roomId]/_components/button.controller'
import useMainLogic from '@/app/room/[roomId]/_hooks/useMainLogic'
import Loading from '@/shared/components/loading'
import { useCallback, useState } from 'react'
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo'
import Dice from '@/app/room/[roomId]/_components/dice'
import Goal from '@/app/room/[roomId]/_components/goal'

export default function Page ({ params }: { params: { roomId: string } }) {
  const [loading, setLoading] = useState(false)
  const { mainLogic, status, activeMemberId, rollDice } = useMainLogic(
    params.roomId,
    'main_canvas',
    'main',
    setLoading
  )
  const { getByRoomId } = useLocalRoomInfo()

  const [result, setResult] = useState<{ height: number, forward: number }>({
    height: 0,
    forward: 0
  })

  const ComponentByStatus = useCallback((): JSX.Element | null => {
    const isMyTurn = getByRoomId(params.roomId)?.myMemberId === activeMemberId
    switch (status) {
      case 'DICE':
      case 'DIRECTION':
        if (!isMyTurn) return null
        return (
          <>
            <Dice
              result={result.forward}
              onStop={(result) => {
                rollDice(result, result)
                setResult({ forward: result, height: result })
              }}
              status={status}
            />
            {status === 'DIRECTION' && (
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
            )}
          </>
        )
      case 'MOVING':
        return null
      case 'RESULT':
        return <Goal />
    }
    return <Loading open />
  }, [status])

  return (
    <>
      <Loading open={loading} />
      <Box id="main" w="100%" height="100%" position="relative">
        <Canvas id="main_canvas" />
        <ComponentByStatus />
      </Box>
    </>
  )
}
