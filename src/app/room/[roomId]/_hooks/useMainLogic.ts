import useTryJoin, {
  type JoinRoomResult
} from '@/app/room/[roomId]/_hooks/useTryJoin'
import { MainLogic } from '@/game.logic/monos/main.logic'
import { useWebSocketContext } from '@/shared/function/websocket.context'
import { GameScene } from '@/shared/game/game.scene'
import {
  type GameObject,
  type GameStatus,
  type Vector3
} from '@/shared/game/type'
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo'
import { useCallback, useEffect, useState } from 'react'

export default function useMainLogic (
  roomId: string,
  mainCanvasName: string,
  mainContainerName: string,
  onLoading: (isLoading: boolean) => void
) {
  const [mainLogic, setMainLogic] = useState<MainLogic | null>(null)
  const [status, setStatus] = useState<GameStatus>(
    mainLogic?.getStatus() ?? 'WAITING'
  )
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null)
  const setStatusAndActiveMemberId = (
    status: GameStatus,
    activeMemberId: string
  ) => {
    setStatus(() => status)
    setActiveMemberId(() => activeMemberId)
  }
  const { getByRoomId } = useLocalRoomInfo()
  const { sendSync, add } = useWebSocketContext()
  function send<T> (name: string, ev: T) {
    onLoading(true)
    sendSync(name, ev)
      .then(() => {})
      .catch((e) => {
        console.log(e, { name, event: ev })
      })
      .finally(() => {
        onLoading(false)
      })
  }
  const onSucceed = useCallback(
    (data: JoinRoomResult) => {
      if (!data.ok) return
      setMainLogic((prev) => {
        if (prev != null) {
          prev.syncAll(data.objects)
          prev.updateStats(
            data.status,
            data.activeMemberId,
            setStatusAndActiveMemberId
          )
          return prev
        }
        if (GameScene.get() !== null) return prev
        const mc = document.getElementById(mainCanvasName)
        const mainC = document.getElementById(mainContainerName)
        if (!mc || !mainC) throw Error()
        const myId = getByRoomId(data.roomId)?.myMemberId
        if (!myId) throw Error()
        GameScene.init(mc)
        const newMainLogic = new MainLogic(
          data.roomId,
          myId,
          data.objects,
          data.status,
          {
            add: (event) => {
              send<{ roomId: string, gameObjects: GameObject[] }>(
                'updateGameObjects',
                { roomId, gameObjects: event.input }
              )
            },
            impulse: (event) => {
              send<{ roomId: string, direction: Vector3, id: string }>(
                'impulse',
                {
                  roomId,
                  direction: event.direction,
                  id: event.id
                }
              )
            },
            remove: (_event) => {},
            turnEnd: (event) => {
              send<{ roomId: string, gameObjects: GameObject[] }>('turnEnd', {
                roomId,
                gameObjects: event.gameObjects
              })
            }
          }
        )
        GameScene.add(newMainLogic)
        window.addEventListener('resize', () => {
          const rect = mainC.getBoundingClientRect()
          GameScene.onResize(rect.width, rect.height)
        })

        // websocketから通信を受けた時の処理
        add<{
          id: string
          direction: Vector3
          status: GameStatus
          activeMemberId: string
        }>('impulse', (data) => {
          newMainLogic.smashById(data.id, data.direction)
          setMainLogic((prev) => {
            prev?.updateStats(
              data.status,
              data.activeMemberId,
              setStatusAndActiveMemberId
            )
            return prev
          })
        })

        add<{ status: GameStatus, activeMemberId: string }>(
          'rollDice',
          (data) => {
            setMainLogic((prev) => {
              prev?.updateStats(
                data.status,
                data.activeMemberId,
                setStatusAndActiveMemberId
              )
              return prev
            })
          }
        )

        add<{ objects: GameObject[] }>('updateGameObjects', (data) => {
          newMainLogic.syncAll(data.objects)
        })
        add<{
          objects: GameObject[]
          status: GameStatus
          activeMemberId: string
        }>('turnEnd', (data) => {
          setMainLogic((prev) => {
            prev?.syncAll(data.objects)
            prev?.updateStats(
              data.status,
              data.activeMemberId,
              setStatusAndActiveMemberId
            )
            return prev
          })
        })
        newMainLogic.syncAll(data.objects)
        newMainLogic.updateStats(
          data.status,
          data.activeMemberId,
          setStatusAndActiveMemberId
        )
        return newMainLogic
      })
    },
    [roomId, mainCanvasName, mainContainerName, getByRoomId, send, add]
  )

  const { tryReJoin } = useTryJoin(roomId, onSucceed)
  const rollDice = useCallback(
    (height: number, forward: number) => {
      send<DiceInput>('rollDice', { roomId, input: { height, forward } })
    },
    [roomId, send]
  )

  useEffect(() => {
    (async () => {
      await tryReJoin()
    })()
  }, [])

  return {
    mainLogic,
    status,
    activeMemberId,
    rollDice
  }
}

interface DiceResult {
  height: number
  forward: number
}

interface DiceInput {
  roomId: string
  input: DiceResult
}
