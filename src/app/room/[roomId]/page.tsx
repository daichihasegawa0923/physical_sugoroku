'use client'

import { useCallback, useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { GameScene } from '@/shared/game/game.scene'
import { MainLogic } from '@/game.logic/monos/main.logic'
import TryJoin from '@/app/room/[roomId]/_components/try.join'
import Canvas from '@/app/room/[roomId]/_components/canvas'
import ButtonController from '@/app/room/[roomId]/_components/button.controller'
import { type JoinRoomResult } from '@/app/room/[roomId]/_hooks/useTryJoin'
import { useWebSocketContext } from '@/shared/function/websocket.context'
import type GameEvent from '@/game.logic/events/event'
import { type GameObject, type Vector3 } from '@/shared/game/type'

export default function Page ({ params }: { params: { roomId: string } }) {
  const [mainLogic, setMainLogic] = useState<MainLogic | null>(null)
  const { send, add } = useWebSocketContext()

  const onSucceed = useCallback(
    (data: JoinRoomResult) => {
      if (!data.ok) return
      if (mainLogic) {
        mainLogic.syncAll(data.objects)
        return
      }
      const mc = document.getElementById('main_canvas')
      const mainC = document.getElementById('main')
      if (!mc || !mainC) return
      GameScene.init(mc)
      const createdMainLogic = new MainLogic(
        data.roomId,
        data.memberId,
        data.objects,
        (event: GameEvent) => {
          switch (event.name) {
            case 'add': {
              send<{ roomId: string, gameObjects: GameObject[] }, GameObject[]>(
                'updateGameObjects',
                { roomId: params.roomId, gameObjects: event.input }
              )
                .then(() => {})
                .catch((e) => {
                  console.log(e)
                })
              return
            }
            case 'impulse': {
              send<
              { roomId: string, direction: Vector3, id: string },
              { id: string, direction: Vector3 }
              >('impulse', {
                roomId: params.roomId,
                direction: event.direction,
                id: event.id
              })
            }
          }
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

  useEffect(() => {
    if (!mainLogic) return
    add<{ id: string, direction: Vector3 }>('impulse', (data) => {
      mainLogic.smashById(data.id, data.direction)
    })
    add<GameObject[]>('add', (data) => {
      mainLogic.syncAll(data)
    })
  }, [mainLogic])

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
