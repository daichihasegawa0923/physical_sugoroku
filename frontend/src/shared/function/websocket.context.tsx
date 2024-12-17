'use client'

import { createContext, type ReactNode, useContext, useRef } from 'react'
import {
  type InputFromNameOmitName,
  type ResultFromName
} from 'physical-sugoroku-common/src/event'

type Callback<Key extends string> = (
  data: ResultFromName<Key>['value']
) => void

interface TypedCallback<Key extends string> {
  id: string
  func: Callback<Key>
}

type TypedCallbackOpt<Key extends string> = TypedCallback<Key> | Callback<Key>

interface WebSocketContextStatus {
  sendSync: <Key extends string>(
    name: Key,
    event: InputFromNameOmitName<Key>,
    callBack?: TypedCallbackOpt<Key>
  ) => Promise<void>
  add: <Key extends string>(name: Key, cb: TypedCallbackOpt<Key>) => void
}

function parse<Key extends string> (
  value: TypedCallbackOpt<Key>
): TypedCallback<Key> {
  if (isNotOpt(value)) return value
  return { id: 'default', func: value }
}

function isNotOpt<Key extends string> (
  value: TypedCallbackOpt<Key>
): value is TypedCallback<Key> {
  return 'id' in value && 'func' in value
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
  const onMessageMap = useRef<
  Record<string, Record<string, (data: any) => void>>
  >({})
  const webSocketRef = useRef<WebSocket | null>(null)

  return (
    <WebSocketContext.Provider
      value={{
        sendSync: async (name, event, cb) => {
          if (!webSocketRef.current) {
            webSocketRef.current = createWebSocket()
            webSocketRef.current.onmessage = (event) => {
              const parsed = JSON.parse(event.data) as ResultFromName<
                typeof name
              >
              if (onMessageMap.current[parsed.name]) {
                const funcs = onMessageMap.current[parsed.name]
                Object.entries(funcs).forEach(([, func]) => {
                  func(parsed.value)
                })
              } else {
                console.error(name, event.data)
              }
            }
          }
          if (cb) {
            const prev = onMessageMap.current[name]
            const parsedCb = parse(cb)
            if (prev == null) {
              onMessageMap.current = {
                ...onMessageMap.current,
                [name]: { [parsedCb.id]: parsedCb.func }
              }
            } else {
              onMessageMap.current = {
                ...onMessageMap.current,
                [name]: { ...prev, [parsedCb.id]: parsedCb.func }
              }
            }
          }
          await webSocketSendMiddy(webSocketRef.current, { ...event, name })
        },
        add: (name, cb) => {
          const prev = onMessageMap.current[name]
          const parsedCb = parse(cb)
          if (prev == null) {
            onMessageMap.current = {
              ...onMessageMap.current,
              [name]: { [parsedCb.id]: parsedCb.func }
            }
          } else {
            onMessageMap.current = {
              ...onMessageMap.current,
              [name]: { ...prev, [parsedCb.id]: parsedCb.func }
            }
          }
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
