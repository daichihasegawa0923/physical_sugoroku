import useGameSceneInitializer from '@/app/room/[roomId]/_hooks/useGameScene'
import useTryJoin, {
  type JoinRoomResult
} from '@/app/room/[roomId]/_hooks/useTryJoin'
import { MainLogic } from '@/game.logic/monos/main.logic'
import { useCommandContext } from '@/shared/components/command.provider'
import { useWebSocketContext } from '@/shared/function/websocket.context'
import { GameScene } from '@/shared/game/game.scene'
import {
  type GameObject,
  type GameStatus,
  type Vector3
} from '@/shared/game/type'
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function useMainLogic (
  roomId: string,
  onLoading: (isLoading: boolean) => void
) {
  const mainLogic = useRef<MainLogic | null>(null)
  const { setCommandText } = useCommandContext()
  const [status, setStatus] = useState<GameStatus>(
    mainLogic.current?.getStatus() ?? 'WAITING'
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
  const onSucceed = (data: JoinRoomResult) => {
    if (!data.ok) return
    if (
      data.isFull &&
      data.activeMemberId === getByRoomId(roomId)?.myMemberId
    ) {
      setCommandText('画面をスワイプして駒を飛ばす方向を決めよう！')
    }
    if (!mainLogic.current) {
      const memberId = getByRoomId(data.roomId)?.myMemberId
      if (!memberId) throw Error('cannot find local memberId')
      mainLogic.current = new MainLogic(
        data.roomId,
        memberId,
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
          goal: (event) => {
            const { goalMemberId, roomId, gameObjects } = event
            send<typeof event>('goal', {
              name: 'goal',
              goalMemberId,
              roomId,
              gameObjects
            })
          },
          turnEnd: (event) => {
            send<{ roomId: string, gameObjects: GameObject[] }>('turnEnd', {
              roomId,
              gameObjects: event.gameObjects
            })
          }
        }
      )
      GameScene.add(mainLogic.current)
      // websocketから通信を受けた時の処理
      add<{
        id: string
        direction: Vector3
        status: GameStatus
        activeMemberId: string
      }>('impulse', (data) => {
        mainLogic.current?.smashById(data.id, data.direction)
        mainLogic.current?.updateStats(
          data.status,
          data.activeMemberId,
          setStatusAndActiveMemberId
        )
      })

      add<{ status: GameStatus, activeMemberId: string }>(
        'rollDice',
        (data) => {
          mainLogic.current?.updateStats(
            data.status,
            data.activeMemberId,
            setStatusAndActiveMemberId
          )
        }
      )

      add<{ objects: GameObject[] }>('updateGameObjects', (data) => {
        mainLogic.current?.syncAll(data.objects)
      })
      add<{
        objects: GameObject[]
        status: GameStatus
        activeMemberId: string
      }>('turnEnd', (data) => {
        mainLogic.current?.syncAll(data.objects)
        mainLogic.current?.updateStats(
          data.status,
          data.activeMemberId,
          setStatusAndActiveMemberId
        )
        if (data.activeMemberId === getByRoomId(roomId)?.myMemberId) {
          setCommandText('画面をスワイプして駒を飛ばす方向を決めよう！')
        }
      })
      add<{
        goalMemberId: string
        goalMemberName: string
        status: GameStatus
        objects: GameObject[]
      }>('goal', (data) => {
        mainLogic.current?.syncAll(data.objects)
        mainLogic.current?.updateStats(
          data.status,
          data.goalMemberId,
          setStatusAndActiveMemberId
        )
        setCommandText(data.goalMemberName + 'が王手！！')
      })
    }
    mainLogic.current?.syncAll(data.objects)
    mainLogic.current?.updateStats(
      data.status,
      data.activeMemberId,
      setStatusAndActiveMemberId
    )
  }

  const { tryReJoin } = useTryJoin(roomId, onSucceed, (data) => {
    if (!data.ok) return
    setCommandText(data.memberName + 'が参加しました！')
  })
  const rollDice = useCallback(
    (height: number, forward: number) => {
      send<DiceInput>('rollDice', { roomId, input: { height, forward } })
    },
    [roomId, send]
  )

  useEffect(() => {
    useGameSceneInitializer({
      canvasName: 'main_canvas',
      containerName: 'main'
    });
    (async () => {
      await tryReJoin()
    })()
  }, [])

  return {
    mainLogic: mainLogic.current,
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
