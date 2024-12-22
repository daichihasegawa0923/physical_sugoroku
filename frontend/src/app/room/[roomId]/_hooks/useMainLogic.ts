'use client'

import useGameSceneInitializer from '@/app/room/[roomId]/_hooks/useGameScene'
import { useStatusInfo } from '@/shared/hooks/useStatusInfo'
import useTryJoin from '@/shared/hooks/useTryJoin'
import { MainLogic } from '@/game/logic/monos/main/main.logic'
import { useCommandContext } from '@/shared/components/command.provider'
import { GameScene } from '@/shared/game/game.scene'
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo'
import { type ResultFromName } from 'physical-sugoroku-common/src/event'
import { type GameStatus } from 'physical-sugoroku-common/src/shared'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { WebsocketResolver } from '@/shared/function/websocket.resolver'

export default function useMainLogic (roomId: string) {
  const mainLogic = useRef<MainLogic | null>(null)
  const router = useRouter()
  const { setCommandText } = useCommandContext()
  const [status, setStatus] = useState<GameStatus>(
    mainLogic.current?.getStatus() ?? 'WAITING'
  )
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null)
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
      WebsocketResolver.addAny((data) => {
        setActiveMemberId(() => data.activeMemberId)
        setStatus(() => data.status)
        switch (data.status) {
          case 'DIRECTION':
            if (data.activeMemberId === getByRoomId(roomId)?.myMemberId) {
              setCommandText('画面をスワイプして駒を飛ばす方向を決めよう！')
            }
            break
          case 'WAITING':
            router.push(`/room/${roomId}/lobby`)
            break
        }
      })
    }
    mainLogic.current?.syncAll(data.objects)
    mainLogic.current?.updateStats(data.status, data.activeMemberId)
    setActiveMemberId(() => data.activeMemberId)
    setStatus(() => data.status)
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
    status,
    activeMemberId,
    sequence: statusInfo?.sequence ?? []
  }
}
