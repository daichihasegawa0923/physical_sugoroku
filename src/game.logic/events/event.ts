interface Vector3 {
  x: number
  y: number
  z: number
}

interface Quaternion extends Vector3 {
  w: number
}

interface GameObjectStatus {
  id: string
  position: Vector3
  quaternion: Quaternion
}

type GameEvent =
  | {
    name: 'impulse'
    id: string
    direction: Vector3
  }
  | {
    name: 'syncRigidBody'
    statuses: GameObjectStatus[]
  }
  | {
    name: 'add'
    className: string
    status: GameObjectStatus
  }
  | {
    name: 'remove'
    id: string
  }

export default GameEvent
