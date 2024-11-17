'use client'

import useTryJoin from '@/app/room/[roomId]/_hooks/useTryJoin'
import { type ReactNode, useEffect } from 'react'

interface Props {
  roomId: string
  children: ReactNode
}

export default function TryJoin ({ roomId, children }: Props) {
  const { tryReJoin } = useTryJoin(roomId)
  useEffect(() => {
    (async () => {
      await tryReJoin()
    })()
  }, [tryReJoin])
  return <>{children}</>
}
