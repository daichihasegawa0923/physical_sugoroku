'use client'

import useTryJoin, {
  type JoinRoomResult
} from '@/app/room/[roomId]/_hooks/useTryJoin'
import { memo, type ReactNode, useEffect } from 'react'

interface Props {
  roomId: string
  children: ReactNode
  onSucceed: (data: JoinRoomResult) => void
}

function TryJoin ({ roomId, children, onSucceed }: Props) {
  const { tryReJoin } = useTryJoin(roomId, onSucceed)
  useEffect(() => {
    (async () => {
      await tryReJoin()
    })()
  }, [tryReJoin])
  return <>{children}</>
}

export default memo(TryJoin)
