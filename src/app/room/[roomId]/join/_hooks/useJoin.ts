import { useWebSocketContext } from '@/shared/function/websocket.context'
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface JoinRoomInput {
  roomId: string
  memberName: string
}

type JoinRoomResult =
  | { ok: false, message: string }
  | {
    ok: true
    roomId: string
    memberName: string
    memberId: string
  }
export default function useJoin (roomId: string) {
  const { send } = useWebSocketContext()
  const { set } = useLocalRoomInfo()
  const router = useRouter()
  const [name, setName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const onClick = () => {
    send<JoinRoomInput, JoinRoomResult>(
      'joinRoom',
      { roomId, memberName: name },
      (data) => {
        if (!data.ok) {
          setError('参加できませんでした。: ' + data.message)
          return
        }
        set(roomId, data.memberId, data.memberName)
        router.push(`/room/${roomId}`)
      }
    )
  }

  return {
    onClick,
    setName,
    error,
    name
  }
}
