import { useWebSocketContext } from '@/shared/function/websocket.context'
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo'
import { useRouter } from 'next/navigation'
import { type ResultFromName } from 'physical-sugoroku-common/src/event'

export default function useTryJoin (
  roomId: string,
  onSucceed: (data: ResultFromName<'joinRoom'>['value']) => void,
  onOtherMemberSucceed: (data: ResultFromName<'joinRoom'>['value']) => void
) {
  const { getByRoomId } = useLocalRoomInfo()
  const { sendSync } = useWebSocketContext()
  const router = useRouter()

  async function tryReJoin (): Promise<void> {
    const data = getByRoomId(roomId)
    if (data == null) {
      router.push(`/room/${roomId}/join`)
      return
    }
    await sendSync(
      'joinRoom',
      {
        roomId,
        memberId: data.myMemberId,
        memberName: data.myMemberName
      },
      (result) => {
        if (!result.ok) {
          router.push(`/room/${roomId}/join`)
          return
        }
        onSucceed(result)
        if (result.memberId !== data.myMemberId) {
          onOtherMemberSucceed(result)
        }
      }
    )
  }

  return {
    tryReJoin
  }
}
