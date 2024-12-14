import { useWebSocketContext } from '@/shared/function/websocket.context'
import { type GameStatus } from '@/shared/game/type'
import { useState } from 'react'

export interface Sequence {
  sequence: Array<{
    memberId: string
    memberName: string
    sequence: number
  }>
}

interface SequenceResult extends Sequence {
  activeMemberId: string
  activeMemberName: string
  status: GameStatus
}

export function useSequence (roomId: string) {
  const [sequence, setSequence] = useState<Sequence>({ sequence: [] })
  const { sendSync } = useWebSocketContext()

  const fetch = async () => {
    sendSync<{ roomId: string }, SequenceResult>(
      'sequence',
      { roomId },
      (data) => {
        setSequence(() => {
          return { sequence: data.sequence }
        })
      }
    )
  }
  return {
    fetch,
    sequence
  }
}
