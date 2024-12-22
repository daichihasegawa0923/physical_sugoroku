import { WebsocketResolver } from '@/shared/function/websocket.resolver'
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo'
import { type ResultFromName } from 'physical-sugoroku-common/src/event'
import { useState } from 'react'

export function useStatusInfo (roomId: string) {
  const [status, setStatus] = useState<
  ResultFromName<'status'>['value'] | null
  >(null)
  const { getByRoomId } = useLocalRoomInfo()

  const fetch = async () => {
    WebsocketResolver.sendSync('status', { roomId }, (data) => {
      setStatus(() => {
        return data
      })
    })
  }
  return {
    fetch,
    status,
    isHost:
      status && getByRoomId(roomId)?.myMemberId === status?.hostRoomMemberId
  }
}
