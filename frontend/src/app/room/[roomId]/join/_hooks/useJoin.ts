import { WebsocketResolver } from '@/shared/function/websocket.resolver'
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo'
import { useLocalUserName } from '@/shared/hooks/useLocalUserName'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function useJoin (roomId: string) {
  const { getName: getLocalUserName, setName: setLocalUserName } =
    useLocalUserName()
  const { set, getByRoomId } = useLocalRoomInfo()
  const router = useRouter()
  const [name, setNameState] = useState<string>(getLocalUserName())
  const [error, setError] = useState<string | null>(null)
  const onClick = () => {
    const localInfo = getByRoomId(roomId)
    WebsocketResolver.sendSync<'joinRoom'>(
      'joinRoom',
      { roomId, memberName: name, memberId: localInfo?.myMemberId },
      (data) => {
        if (!data.ok) {
          setError('参加できませんでした。: ' + data.message)
          return
        }
        set(roomId, data.memberId, data.memberName)
        router.push(`/room/${roomId}/lobby`)
      }
    )
  }

  return {
    onClick,
    setName: (value: string) => {
      setNameState(value)
      setLocalUserName(value)
    },
    error,
    name
  }
}
