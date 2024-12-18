import { useWebSocketContext } from '@/shared/function/websocket.context'
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo'
import { type ResultFromName } from 'physical-sugoroku-common/src/event'
import { useState } from 'react'

export function useStatusInfo (roomId: string) {
  const [status, setStatus] = useState<
  ResultFromName<'status'>['value'] | null
  >(null)
  const { sendSync } = useWebSocketContext()
  const { getByRoomId } = useLocalRoomInfo()

  const fetch = async () => {
    sendSync('status', { roomId }, (data) => {
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
