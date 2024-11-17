'use client'

import { createContext, type ReactNode, useContext, useRef } from 'react'

interface WebSocketContextStatus {
  send: <T, CbT>(
    name: string,
    event: T,
    callBack: (data: CbT) => void
  ) => Promise<void>
}

const WebSocketContextStatusDefault = {
  send: async () => {}
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
        send: async (name, event, cb) => {
          if (!webSocketRef.current) {
            webSocketRef.current = createWebSocket()
            webSocketRef.current.onmessage = (event) => {
              const parsed = JSON.parse(event.data) as { name: string } & {
                value: unknown
              }
              onMessageMap.current[parsed.name](parsed.value)
            }
          }
          onMessageMap.current = { ...onMessageMap.current, [name]: cb }
          await webSocketSendMiddy(webSocketRef.current, { name, ...event })
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
