import { type GameObject } from '@/shared/game/type'

export default interface IOnline {
  online: () => GameObject
  syncFromOnline: (gameObject: GameObject) => void
  getClass: () => string
}
