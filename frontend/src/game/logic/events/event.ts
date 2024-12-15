import { type GameObject } from '@/shared/game/type'

interface Vector3 {
  x: number
  y: number
  z: number
}

export type GameEvent =
  | {
    name: 'impulse'
    id: string
    direction: Vector3
  }
  | {
    name: 'add'
    input: GameObject[]
  }
  | {
    name: 'remove'
    id: string
  }
  | {
    name: 'turnEnd'
    roomId: string
    gameObjects: GameObject[]
  }
  | {
    name: 'goal'
    goalMemberId: string
    roomId: string
    gameObjects: GameObject[]
  }

export type GameEventHandlers = {
  [E in GameEvent as E['name']]: (event: E) => void;
}
