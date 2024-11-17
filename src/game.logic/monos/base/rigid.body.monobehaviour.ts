import { CannonWorld } from '@/shared/game/cannon.world'
import { type GameObject } from '@/shared/game/mono.container'
import { MonoBehaviour } from '@/shared/game/monobehaviour'
import type * as CANNON from 'cannon-es'
import * as THREE from 'three'

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

  public getGameObject (className: string): GameObject {
    const position = this.getObject3D()?.position ?? new THREE.Vector3(0, 0, 0)
    const quaternion =
      this.getObject3D()?.quaternion ?? new THREE.Quaternion(0, 0, 0, 1)
    const size = this.getObject3D()?.scale ?? new THREE.Vector3(0, 0, 0)
    return {
      className,
      id: this.getId(),
      position: { x: position.x, y: position.y, z: position.z },
      quaternion: {
        x: quaternion.z,
        y: quaternion.y,
        z: quaternion.z,
        w: quaternion.w
      },
      size: { x: size.x, y: size.y, z: size.z }
    }
  }

  public sync (gameObject: GameObject) {
    this.rigidBody().position.set(
      gameObject.position.x,
      gameObject.position.y,
      gameObject.position.z
    )
    this.rigidBody().quaternion.set(
      gameObject.quaternion.x,
      gameObject.quaternion.y,
      gameObject.quaternion.z,
      gameObject.quaternion.w
    )
    const object3D = this.getObject3D()
    if (object3D) {
      object3D.scale.set(
        gameObject.size.x,
        gameObject.size.y,
        gameObject.size.z
      )
    }
  }
}
