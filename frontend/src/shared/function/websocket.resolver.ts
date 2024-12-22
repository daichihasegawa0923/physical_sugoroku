import {
  type EventKeys,
  type InputFromNameOmitName,
  type ResultFromName
} from 'physical-sugoroku-common/src/event'

export class WebsocketResolver {
  private constructor (
    private readonly websocket: WebSocket = WebsocketResolver.createWebSocket(),
    private onMessageMap: Record<
    string,
    Record<string, (data: any) => void>
    > = {}
  ) {}

  private static readonly instance: WebsocketResolver = new WebsocketResolver()

  public static getWebSocket (): WebSocket {
    return WebsocketResolver.instance.websocket
  }

  public static async sendSync<Key extends string>(
    name: Key,
    event: InputFromNameOmitName<Key>,
    cb?: TypedCallbackOpt<Key>
  ) {
    const websocket = WebsocketResolver.getWebSocket()
    if (!websocket.onmessage) {
      websocket.onmessage = (event) => {
        const parsed = JSON.parse(event.data) as ResultFromName<typeof name>
        if (WebsocketResolver.instance.onMessageMap[parsed.name]) {
          const funcs = WebsocketResolver.instance.onMessageMap[parsed.name]
          Object.entries(funcs).forEach(([, func]) => {
            func(parsed.value)
          })
          if (WebsocketResolver.instance.onMessageMap.any) {
            const funcs = WebsocketResolver.instance.onMessageMap.any
            Object.entries(funcs).forEach(([, func]) => {
              func(parsed.value)
            })
          }
        } else {
          console.error(name, event.data)
        }
      }
    }
    if (cb) {
      const prev = WebsocketResolver.instance.onMessageMap[name]
      const parsedCb = WebsocketResolver.parse(cb)
      if (prev == null) {
        WebsocketResolver.instance.onMessageMap = {
          ...WebsocketResolver.instance.onMessageMap,
          [name]: { [parsedCb.id]: parsedCb.func }
        }
      } else {
        WebsocketResolver.instance.onMessageMap = {
          ...WebsocketResolver.instance.onMessageMap,
          [name]: { ...prev, [parsedCb.id]: parsedCb.func }
        }
      }
    }
    await WebsocketResolver.webSocketSendMiddy({ ...event, name })
  }

  public static send<Key extends string>(
    name: Key,
    event: InputFromNameOmitName<Key>,
    then?: VoidFunction,
    cb?: TypedCallbackOpt<Key>
  ) {
    WebsocketResolver.sendSync(name, event, cb)
      .then(() => {
        if (then) {
          then()
        }
      })
      .catch((e) => {
        console.error(e)
      })
  }

  public static add<Key extends string>(name: Key, cb: TypedCallbackOpt<Key>) {
    const prev = WebsocketResolver.instance.onMessageMap[name]
    const parsedCb = WebsocketResolver.parse(cb)
    WebsocketResolver.instance.onMessageMap = {
      ...WebsocketResolver.instance.onMessageMap,
      [name]:
        prev == null
          ? { [parsedCb.id]: parsedCb.func }
          : { ...prev, [parsedCb.id]: parsedCb.func }
    }
  }

  public static addAny (cb: TypedCallbackOpt<EventKeys>) {
    const prev = WebsocketResolver.instance.onMessageMap.any
    const parsedCb = WebsocketResolver.parse(cb)
    WebsocketResolver.instance.onMessageMap = {
      ...WebsocketResolver.instance.onMessageMap,
      any:
        prev == null
          ? { [parsedCb.id]: parsedCb.func }
          : { ...prev, [parsedCb.id]: parsedCb.func }
    }
  }

  private static parse<Key extends string>(
    value: TypedCallbackOpt<Key>
  ): TypedCallback<Key> {
    if (WebsocketResolver.isNotOpt(value)) return value
    return { id: 'default', func: value }
  }

  private static isNotOpt<Key extends string>(
    value: TypedCallbackOpt<Key>
  ): value is TypedCallback<Key> {
    return 'id' in value && 'func' in value
  }

  private static async webSocketSendMiddy (
    event: { name: string } & any
  ): Promise<WebSocket> {
    const websocket = WebsocketResolver.getWebSocket()
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

  private static createWebSocket (): WebSocket {
    return new WebSocket(
      process.env.NODE_ENV === 'production'
        ? 'wss://i3nafs00s6.execute-api.ap-northeast-1.amazonaws.com/dev/'
        : 'ws://localhost:3001'
    )
  }
}

type Callback<Key extends string> = (
  data: ResultFromName<Key>['value']
) => void

interface TypedCallback<Key extends string> {
  id: string
  func: Callback<Key>
}

export type TypedCallbackOpt<Key extends string> =
  | TypedCallback<Key>
  | Callback<Key>
