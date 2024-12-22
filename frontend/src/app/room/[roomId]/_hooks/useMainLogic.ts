'use client'

import useGameSceneInitializer from '@/app/room/[roomId]/_hooks/useGameScene'
import { useStatusInfo } from '@/shared/hooks/useStatusInfo'
import useTryJoin from '@/shared/hooks/useTryJoin'
import { MainLogic } from '@/game/logic/monos/main/main.logic'
import { useCommandContext } from '@/shared/components/command.provider'
import { GameScene } from '@/shared/game/game.scene'
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo'
import { type ResultFromName } from 'physical-sugoroku-common/src/event'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { WebsocketResolver } from '@/shared/function/websocket.resolver'

export default function useMainLogic (roomId: string) {
  const mainLogic = useRef<MainLogic | null>(null)
  const router = useRouter()
  const { setCommandText } = useCommandContext()
  const { fetch, status: statusInfo } = useStatusInfo(roomId)

  const { getByRoomId } = useLocalRoomInfo()

  const onSucceed = (data: ResultFromName<'joinRoom'>['value']) => {
    if (!data.ok) return
    if (data.status === 'WAITING') {
      router.push(`/room/${roomId}/lobby`)
    }
    if (
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
        data.objects
      )
      GameScene.add(mainLogic.current)
      // websocketから通信を受けた時の処理
      WebsocketResolver.add('replay', (_) => {
        router.push(`/room/${roomId}/lobby`)
      })
      WebsocketResolver.add('turnEnd', (data) => {
        const text = data.activeMemberName + 'のターンです！'
        if (data.activeMemberId === getByRoomId(roomId)?.myMemberId) {
          setCommandText(
            text + '\n画面をスワイプして駒を飛ばす方向を決めよう！'
          )
          return
        }
        setCommandText(text)
      })
    }
    mainLogic.current?.syncAll(data.objects)
    mainLogic.current?.updateStats(data.status, data.activeMemberId)
  }

  useTryJoin(
    roomId,
    (data) => {
      onSucceed(data)
      fetch().then(() => {})
    },
    (data) => {
      if (!data.ok) return
      setCommandText(data.memberName + 'が参加しました！')
    }
  )

  useEffect(() => {
    useGameSceneInitializer({
      canvasName: 'main_canvas',
      containerName: 'main'
    })
  }, [])

  return {
    mainLogic: mainLogic.current,
    sequence: statusInfo?.sequence ?? []
  }
}
