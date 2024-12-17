import { useWebSocketContext } from '@/shared/function/websocket.context'
import { type ResultFromName } from 'physical-sugoroku-common/src/event'
import { useState } from 'react'

export function useSequence (roomId: string) {
  const [sequence, setSequence] = useState<
  Pick<ResultFromName<'sequence'>['value'], 'sequence'>
  >({ sequence: [] })
  const { sendSync } = useWebSocketContext()

  const fetch = async () => {
    sendSync<'sequence'>('sequence', { roomId }, (data) => {
      setSequence(() => {
        return { sequence: data.sequence }
      })
    })
  }
  return {
    fetch,
    sequence
  }
}
