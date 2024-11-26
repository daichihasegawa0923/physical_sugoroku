'use client'

import { type GameStatus } from '@/shared/game/type'
import { createContext, type ReactNode, useContext, useRef } from 'react'

interface WebSocketContextStatus {
  sendSync: <T, CbT>(
    name: string,
    event: T,
    callBack?: (data: CbT) => void
  ) => Promise<void>
  add: <CbT2>(name: string, cb: (data: CbT2) => void) => void
}

const WebSocketContextStatusDefault = {
  sendSync: async () => {},
  add: () => {}
} as const satisfies WebSocketContextStatus

const WebSocketContext = createContext<WebSocketContextStatus>(
  WebSocketContextStatusDefault
)

export const useWebSocketContext = () => useContext(WebSocketContext)

export default function WebSocketContextProvider ({
  children
}: {
  children: ReactNode
}): JSX.Element {
  const onMessageMap = useRef<Record<string, (data: any) => void>>({})
  const webSocketRef = useRef<WebSocket | null>(null)

  return (
    <WebSocketContext.Provider
      value={{
        sendSync: async (name, event, cb) => {
          if (!webSocketRef.current) {
            webSocketRef.current = createWebSocket()
            webSocketRef.current.onmessage = (event) => {
              const parsed = JSON.parse(event.data) as { name: string } & {
                value: { status: GameStatus } & unknown
              }
              if (onMessageMap.current[parsed.name]) {
                onMessageMap.current[parsed.name](parsed.value)
              } else {
                console.error(name, event.data)
              }
            }
          }
          if (cb) {
            onMessageMap.current = { ...onMessageMap.current, [name]: cb }
          }
          await webSocketSendMiddy(webSocketRef.current, { name, ...event })
        },
        add: (name, cb) => {
          onMessageMap.current = { ...onMessageMap.current, [name]: cb }
        }
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

async function webSocketSendMiddy (
  websocket: WebSocket,
  event: { name: string } & any
): Promise<WebSocket> {
  await new Promise((resolve, reject) => {
    if (websocket.readyState === WebSocket.OPEN) {
      resolve(websocket)
      return
    }
    if (websocket.readyState === WebSocket.CONNECTING) {
      websocket.onopen = () => {
        resolve(websocket)
      }
      websocket.onerror = (err) => {
        reject(err)
      }
    }
  })
  websocket.send(JSON.stringify(event))
  return websocket
}

function createWebSocket (): WebSocket {
  return new WebSocket(
    process.env.NODE_ENV === 'production'
      ? 'wss://i3nafs00s6.execute-api.ap-northeast-1.amazonaws.com/dev/'
      : 'ws://localhost:3001'
  )
}
