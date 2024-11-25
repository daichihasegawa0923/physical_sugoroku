import { CannonWorld } from '@/shared/game/cannon.world'
import { MonoBehaviour } from '@/shared/game/monobehaviour'
import type * as CANNON from 'cannon-es'

export abstract class RigidBodyMonoBehaviour extends MonoBehaviour {
  public abstract rigidBody (): CANNON.Body

  override start (): void {
    CannonWorld.add(this.rigidBody())
  }

  override onRemove (): void {
    CannonWorld.remove(this.rigidBody())
  }

  override update (): void {
    const obj3D = this.getObject3D()
    if (!obj3D) return

    obj3D.position.set(
      this.rigidBody().position.x,
      this.rigidBody().position.y,
      this.rigidBody().position.z
    )

    obj3D.quaternion.set(
      this.rigidBody().quaternion.x,
      this.rigidBody().quaternion.y,
      this.rigidBody().quaternion.z,
      this.rigidBody().quaternion.w
    )
  }
}
