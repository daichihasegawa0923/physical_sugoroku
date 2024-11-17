'use client'

import useTryJoin, {
  type JoinRoomResult
} from '@/app/room/[roomId]/_hooks/useTryJoin'
import { type ReactNode, useEffect } from 'react'

interface Props {
  roomId: string
  children: ReactNode
  onSucceed: (data: JoinRoomResult) => void
}

export default function TryJoin ({ roomId, children, onSucceed }: Props) {
  const { tryReJoin } = useTryJoin(roomId, onSucceed)
  useEffect(() => {
    (async () => {
      await tryReJoin()
    })()
  }, [tryReJoin])
  return <>{children}</>
}
