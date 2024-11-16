import { useWebSocketContext } from '@/shared/function/websocket.context'
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo'

interface JoinRoomInput {
  roomId: string
  memberName: string
  memberId?: string
}

export default function useRoom (roomId: string) {
  const { getByRoomId } = useLocalRoomInfo()
  const { send } = useWebSocketContext()

  async function tryReJoin (): Promise<boolean> {
    const data = getByRoomId(roomId)
    if (data == null) {
      return false
    }
    await send<JoinRoomInput, any>(
      {
        name: 'joinRoom',
        roomId,
        memberId: data.myMemberId,
        memberName: data.myMemberName
      },
      'joinRoom',
      () => {}
    )
    return true
  }

  async function join (memberName: string) {
    await send<JoinRoomInput, any>(
      {
        name: 'joinRoom',
        roomId,
        memberName
      },
      'joinRoom',
      () => {}
    )
  }

  return {
    tryReJoin,
    join
  }
}
