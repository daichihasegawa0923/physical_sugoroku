import { useWebSocketContext } from '@/shared/function/websocket.context'
import { type GameStatus } from '@/shared/game/type'
import { useState } from 'react'

export interface GameSequence {
  sequence: Array<{
    memberId: string
    memberName: string
    sequence: number
  }>
}

interface GameSequenceResult extends GameSequence {
  activeMemberId: string
  activeMemberName: string
  status: GameStatus
}

export function useSequence (roomId: string) {
  const [sequence, setSequence] = useState<GameSequence>({ sequence: [] })
  const { sendSync } = useWebSocketContext()

  const fetch = async () => {
    sendSync<{ roomId: string }, GameSequenceResult>(
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
