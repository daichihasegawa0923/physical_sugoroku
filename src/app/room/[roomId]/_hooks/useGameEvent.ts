import type GameEvent from '@/game.logic/events/event'
import { type MainLogic } from '@/game.logic/monos/main.logic'
import { useWebSocketContext } from '@/shared/function/websocket.context'
import { type GameObject, type Vector3 } from '@/shared/game/type'
import { useEffect } from 'react'

export interface AddVelocityResult {
  id: string
  direction: Vector3
}

export default function useGameEvent (
  roomId: string,
  mainLogic: MainLogic | null
) {
  const { send, add } = useWebSocketContext()

  useEffect(() => {
    if (!mainLogic) return
    add<AddVelocityResult>('impulse', (data) => {
      mainLogic.smashById(data.id, data.direction)
    })
  }, [mainLogic])

  const gameEventCb = (event: GameEvent, mainLogic: MainLogic) => {
    if (!mainLogic) return
    switch (event.name) {
      case 'add': {
        send<{ roomId: string, gameObjects: GameObject[] }, GameObject[]>(
          'updateGameObjects',
          { roomId, gameObjects: event.input },
          (fetchGameObjects) => {
            mainLogic.syncAll(fetchGameObjects)
          }
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
        AddVelocityResult
        >('impulse', { roomId, direction: event.direction, id: event.id })
      }
    }
  }

  return { gameEventCb }
}
