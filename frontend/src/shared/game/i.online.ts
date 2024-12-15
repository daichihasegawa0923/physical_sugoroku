import { type GameObject } from 'physical-sugoroku-common/src/shared'

export default interface IOnline {
  online: () => GameObject
  syncFromOnline: (gameObject: GameObject) => void
  getClass: () => string
}
