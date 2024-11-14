'use client'

import { createContext, type ReactNode, useRef } from 'react'

interface WebSocketContextStatus {
  send: (event: { name: string } & any) => Promise<void>
  addCb: <T>(eventName: string, cb: (data: T) => void) => void
}

const WebSocketContextStatusDefault = {
  send: async () => {},
  addCb: () => {}
} as const satisfies WebSocketContextStatus

export const WebSocketContext = createContext<WebSocketContextStatus>(
  WebSocketContextStatusDefault
)

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
        send: async (event) => {
          if (!webSocketRef.current) {
            webSocketRef.current = createWebSocket()
            webSocketRef.current.onmessage = (event) => {
              const parsed = JSON.parse(event.data) as { name: string } & {
                value: unknown
              }
              if (onMessageMap.current[parsed.name]) {
                onMessageMap.current[parsed.name](parsed.value)
              } else {
                console.log(parsed)
              }
            }
          }
          await webSocketSendMiddy(webSocketRef.current, event)
        },
        addCb: (eventName, cb) => {
          onMessageMap.current = { ...onMessageMap.current, [eventName]: cb }
        }
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

async function webSocketSendMiddy (
  websocket: WebSocket,
  event: any
): Promise<WebSocket> {
  await new Promise((resolve, reject) => {
    if (websocket.readyState === WebSocket.OPEN) {
      resolve(websocket)
      return
    }
    if (websocket.readyState === WebSocket.CONNECTING) {
      websocket.onopen = () => { resolve(websocket) }
      websocket.onerror = (err) => { reject(err) }
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
