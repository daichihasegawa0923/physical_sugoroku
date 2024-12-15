import { RigidBodyMonoBehaviour } from '@/game/logic/monos/base/rigid.body.monobehaviour';
import type IOnline from '@/shared/game/i.online';
import { type GameObject } from '@/shared/game/type';
import * as THREE from 'three';

export abstract class RigidBodyOnlineMonoBehaviour
  extends RigidBodyMonoBehaviour
  implements IOnline
{
  abstract getClass(): string;

  public online(): GameObject {
    const { position, quaternion } = this.rigidBody();
    const size = this.getObject3D()?.scale ?? new THREE.Vector3(0, 0, 0);
    return {
      className: this.getClass(),
      id: this.getId(),
      position: { x: position.x, y: position.y, z: position.z },
      quaternion: {
        x: quaternion.x,
        y: quaternion.y,
        z: quaternion.z,
        w: quaternion.w,
      },
      size: { x: size.x, y: size.y, z: size.z },
    };
  }

  public syncFromOnline(gameObject: GameObject) {
    this.rigidBody().position.set(
      gameObject.position.x,
      gameObject.position.y,
      gameObject.position.z
    );
    this.rigidBody().quaternion.set(
      gameObject.quaternion.x,
      gameObject.quaternion.y,
      gameObject.quaternion.z,
      gameObject.quaternion.w
    );
    const object3D = this.getObject3D();
    if (object3D) {
      object3D.scale.set(
        gameObject.size.x,
        gameObject.size.y,
        gameObject.size.z
      );
    }
  }
}
