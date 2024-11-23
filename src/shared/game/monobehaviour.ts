import { type GameObject } from '@/shared/game/type'
import type * as THREE from 'three'
import { ulid } from 'ulid'

export abstract class MonoBehaviour {
  public constructor (id?: string) {
    this.id = id ?? ulid()
  }

  private readonly id: string

  public getId (): string {
    return this.id
  }

  public start (): void {}
  public update (): void {}
  public onRemove (): void {}
  public abstract getObject3D (): THREE.Object3D | null
  public online (): GameObject | null {
    return null
  }

  public syncFromOnline (gameObject: GameObject) {

  }
}
