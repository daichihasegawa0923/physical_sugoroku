import { MonoBehaviour } from '@/shared/game/monobehaviour';
import { type Object3D } from 'three';
import { GameScene } from '@/shared/game/game.scene';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Stage1 } from './stage/stage1';
import { SimpleSphere } from './base/simple.sphere';
import { CannonWorld } from '@/shared/game/cannon.world';

export class MainLogic extends MonoBehaviour {
  public getObject3D(): Object3D | null {
    return null;
  }

  private readonly p1: SimpleSphere = new SimpleSphere({
    color: 0x00f0f0,
    radius: 1,
    mass: 1,
    position: new CANNON.Vec3(0, 10, 0),
  });

  override start(): void {
    GameScene.add(this.p1);
    GameScene.add(new Stage1());
  }

  override update(): void {
    this.setCameraPosition();
    this.reborn();
  }

  private cameraAngle: number = 0.0;

  public changeAngle(dt: number): void {
    this.cameraAngle += dt;
    if (this.cameraAngle > 360 || this.cameraAngle < -360) {
      this.cameraAngle = 0;
    }
  }

  public smash(): void {
    const mainCamera = GameScene.get()?.getMainCamera();
    if (!mainCamera) return;
    const direction = new THREE.Vector3(0, 0, 0);
    mainCamera.getWorldDirection(direction);
    direction.normalize();
    direction.multiplyScalar(10);
    this.p1
      .rigidBody()
      .applyImpulse(
        CannonWorld.parseFrom(direction),
        CannonWorld.parseFrom(this.p1.getObject3D().position)
      );
  }

  private setCameraPosition() {
    const gameScene = GameScene.get();
    if (!gameScene) return;
    const distanceZ = 5;
    const distanceY = 5;
    const mainCamera = gameScene.getMainCamera();
    const p1Position = this.p1.getObject3D()?.position;
    if (!p1Position) return;
    mainCamera.position.set(p1Position.x, distanceY, p1Position.z + distanceZ);

    // 角度に応じてカメラの位置を設定
    mainCamera.position.x =
      p1Position.x + distanceZ * Math.cos(this.cameraAngle);
    mainCamera.position.z =
      p1Position.x + distanceZ * Math.sin(this.cameraAngle);

    // オブジェクトの方を見続ける
    mainCamera.lookAt(this.p1.getObject3D()?.position);
  }

  private reborn() {
    if (this.p1.getObject3D()?.position.y < -10) {
      this.p1.rigidBody().position.set(0, 10, 0);
      this.p1.rigidBody().velocity.set(0, 0, 0);
      this.p1.rigidBody().angularVelocity.set(0, 0, 0);
    }
  }
}
