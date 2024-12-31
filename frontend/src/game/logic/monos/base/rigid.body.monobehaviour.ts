import { CannonWorld } from '@/shared/game/cannon.world';
import { GameScene } from '@/shared/game/game.scene';
import { MonoBehaviour } from '@/shared/game/monobehaviour';
import type * as CANNON from 'cannon-es';

export abstract class RigidBodyMonoBehaviour extends MonoBehaviour {
  public abstract rigidBody (): CANNON.Body;

  override start (): void {
    CannonWorld.add(this.rigidBody());
  }

  override onRemove (): void {
    CannonWorld.remove(this.rigidBody());
  }

  override update (): void {
    const obj3D = this.getObject3D();
    if (!obj3D) return;

    obj3D.position.set(
      this.rigidBody().position.x,
      this.rigidBody().position.y,
      this.rigidBody().position.z
    );

    obj3D.quaternion.set(
      this.rigidBody().quaternion.x,
      this.rigidBody().quaternion.y,
      this.rigidBody().quaternion.z,
      this.rigidBody().quaternion.w
    );
  }

  protected addCollisionEventListenerWithRigidBodyMonobehaviour (
    cb: (other?: RigidBodyMonoBehaviour) => void
  ) {
    this.rigidBody().addEventListener(
      'collide',
      ({ body }: { body: CANNON.Body }) => {
        const target = GameScene.allRigidBodies().find(
          (rig) => rig.rigidBody() === body
        );
        cb(target);
      }
    );
  }
}
