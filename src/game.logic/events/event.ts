import { type GameObject } from '@/shared/game/type'

interface Vector3 {
  x: number
  y: number
  z: number
}

type GameEvent =
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

export default GameEvent
