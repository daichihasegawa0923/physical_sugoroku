'use client'

import { useCallback, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { GameScene } from '@/shared/game/game.scene'
import { MainLogic } from '@/game.logic/monos/main.logic'
import TryJoin from '@/app/room/[roomId]/_components/try.join'
import Canvas from '@/app/room/[roomId]/_components/canvas'
import ButtonController from '@/app/room/[roomId]/_components/button.controller'
import { type JoinRoomResult } from '@/app/room/[roomId]/_hooks/useTryJoin'
import { useWebSocketContext } from '@/shared/function/websocket.context'
import { type GameObject } from '@/shared/game/mono.container'

export default function Page ({ params }: { params: { roomId: string } }) {
  const [mainLogic, setMainLogic] = useState<MainLogic | null>(null)
  const { send } = useWebSocketContext()
  const onSucceed = useCallback(
    (data: JoinRoomResult) => {
      if (!data.ok || mainLogic != null) return
      const mc = document.getElementById('main_canvas')
      const mainC = document.getElementById('main')
      if (!mc || !mainC) return
      GameScene.init(mc)
      const createdMainLogic = new MainLogic(
        data.roomId,
        data.memberId,
        data.objects,
        (gos) => {
          send<{ roomId: string, gameObjects: GameObject[] }, GameObject[]>(
            'updateGameObjects',
            { roomId: params.roomId, gameObjects: gos },
            (fetchGameObjects) => {}
          )
            .then(() => {})
            .catch((e) => { console.log(e) })
        }
      )
      GameScene.add(createdMainLogic)

      window.addEventListener('resize', () => {
        const rect = mainC.getBoundingClientRect()
        GameScene.onResize(rect.width, rect.height)
      })

      setMainLogic(createdMainLogic)
    },
    [mainLogic]
  )

  return (
    <>
      <TryJoin roomId={params.roomId} onSucceed={onSucceed}>
        <Box id="main" w="100%" height="100%">
          <Canvas id="main_canvas" />
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
        </Box>
      </TryJoin>
    </>
  )
}
