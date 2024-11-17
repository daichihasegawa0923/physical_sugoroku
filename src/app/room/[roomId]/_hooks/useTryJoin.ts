import { useWebSocketContext } from '@/shared/function/websocket.context'
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo'
import { useRouter } from 'next/navigation'

interface JoinRoomInput {
  roomId: string
  memberName: string
  memberId?: string
}

type JoinRoomResult =
  | { ok: false, message: string }
  | {
    ok: true
    roomId: string
    memberName: string
    memberId: string
  }

export default function useTryJoin (roomId: string) {
  const { getByRoomId } = useLocalRoomInfo()
  const { send } = useWebSocketContext()
  const router = useRouter()

  async function tryReJoin (): Promise<void> {
    const data = getByRoomId(roomId)
    if (data == null) {
      router.push(`/room/${roomId}/join`)
      return
    }
    await send<JoinRoomInput, JoinRoomResult>(
      'joinRoom',
      {
        roomId,
        memberId: data.myMemberId,
        memberName: data.myMemberName
      },
      (result) => {
        if (!result.ok) {
          router.push(`/room/${roomId}/join`)
        }
      }
    )
  }

  return {
    tryReJoin
  }
}
