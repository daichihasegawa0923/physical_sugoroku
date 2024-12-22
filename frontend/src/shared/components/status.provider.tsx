'use client'

import { WebsocketResolver } from '@/shared/function/websocket.resolver'
import { type GameStatus } from 'physical-sugoroku-common/src/shared'
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

interface State {
  status: GameStatus
  activeMemberId: string | null
}

const DefaultState: State = {
  status: 'WAITING',
  activeMemberId: null
} as const satisfies State

const StatusContext = createContext<State>(DefaultState)

export const useStatusContext = () => useContext(StatusContext)

export function StatusContextProvider ({
  roomId,
  children
}: {
  roomId: string
  children: ReactNode
}) {
  const [status, setStatus] = useState<GameStatus>('WAITING')
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null)

  useEffect(() => {
    WebsocketResolver.send('status', { roomId }, undefined, (data) => {
      setStatus(() => data.status)
      setActiveMemberId(() => data.activeMemberId)
    })
    WebsocketResolver.addAny((data) => {
      setStatus(() => data.status)
      setActiveMemberId(() => data.activeMemberId)
    })
  }, [])

  return (
    <StatusContext.Provider value={{ status, activeMemberId }}>
      {children}
    </StatusContext.Provider>
  )
}
