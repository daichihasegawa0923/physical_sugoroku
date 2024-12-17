import useGameSceneInitializer from '@/app/room/[roomId]/_hooks/useGameScene'
import { useSequence } from '@/app/room/[roomId]/_hooks/useSequence'
import useTryJoin from '@/app/room/[roomId]/_hooks/useTryJoin'
import { MainLogic } from '@/game/logic/monos/main/main.logic'
import { useCommandContext } from '@/shared/components/command.provider'
import { useWebSocketContext } from '@/shared/function/websocket.context'
import { GameScene } from '@/shared/game/game.scene'
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo'
import {
  type InputFromNameOmitName,
  type ResultFromName
} from 'physical-sugoroku-common/src/event'
import { type GameStatus } from 'physical-sugoroku-common/src/shared'
import { useEffect, useRef, useState } from 'react'

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
  const { fetch, sequence } = useSequence(roomId)
  const setStatusAndActiveMemberId = (
    status: GameStatus,
    activeMemberId: string | null
  ) => {
    setStatus(() => status)
    setActiveMemberId(() => activeMemberId)
  }

  const { getByRoomId } = useLocalRoomInfo()
  const { sendSync, add } = useWebSocketContext()

  function send<Key extends string> (name: Key, ev: InputFromNameOmitName<Key>) {
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
  const onSucceed = (data: ResultFromName<'joinRoom'>['value']) => {
    if (!data.ok) return
    if (
      data.isFull &&
      data.activeMemberId === getByRoomId(roomId)?.myMemberId &&
      data.status === 'DIRECTION'
    ) {
      setCommandText('画面をスワイプして駒を飛ばす方向を決めよう！')
    }
    if (!mainLogic.current) {
      const memberId = getByRoomId(data.roomId)?.myMemberId
      if (!memberId) throw Error('cannot find local memberId')
      mainLogic.current = new MainLogic(
        data.roomId,
        memberId,
        data.status,
        {
          add: (event) => {
            send('updateGameObjects', { roomId, gameObjects: event.input })
          },
          impulse: (event) => {
            send('impulse', {
              roomId,
              direction: event.direction,
              id: event.id
            })
          },
          remove: (_event) => {},
          goal: (event) => {
            const { goalMemberId, roomId, gameObjects } = event
            send('goal', {
              goalMemberId,
              roomId,
              gameObjects
            })
          },
          turnEnd: (event) => {
            send('turnEnd', {
              roomId,
              gameObjects: event.gameObjects
            })
          }
        },
        data.objects
      )
      GameScene.add(mainLogic.current)
      // websocketから通信を受けた時の処理
      add('impulse', (data) => {
        mainLogic.current?.smashById(data.id, data.direction)
        mainLogic.current?.updateStats(
          data.status,
          data.activeMemberId,
          setStatusAndActiveMemberId
        )
      })
      add('updateGameObjects', (data) => {
        mainLogic.current?.syncAll(data.objects)
      })
      add('turnEnd', (data) => {
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
      add('goal', (data) => {
        mainLogic.current?.syncAll(data.objects)
        mainLogic.current?.updateStats(
          data.status,
          data.goalMemberId,
          setStatusAndActiveMemberId
        )
      })
      add('replay', (data) => {
        mainLogic.current?.updateStats(
          data.status,
          data.activeMemberId,
          setStatusAndActiveMemberId
        )
        mainLogic.current?.syncAll(data.objects)
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
    fetch().then(() => {})
  })

  useEffect(() => {
    useGameSceneInitializer({
      canvasName: 'main_canvas',
      containerName: 'main'
    });
    (async () => {
      await tryReJoin()
      await fetch()
    })()
  }, [])

  return {
    mainLogic: mainLogic.current,
    status,
    activeMemberId,
    sequence
  }
}
