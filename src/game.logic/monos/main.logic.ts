import { MonoBehaviour } from '@/shared/game/monobehaviour'
import { type Object3D } from 'three'
import { GameScene } from '@/shared/game/game.scene'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { Stage1 } from './stage/stage1'
import { SimpleSphere } from './base/simple.sphere'
import { CannonWorld } from '@/shared/game/cannon.world'
import { Light } from './base/light'

export class MainLogic extends MonoBehaviour {
  public getObject3D (): Object3D | null {
    return null
  }

  private readonly p1: SimpleSphere = new SimpleSphere({
    color: 0x00f0f0,
    radius: 1,
    mass: 1,
    position: new CANNON.Vec3(0, 10, 0)
  })

  override start (): void {
    GameScene.add(this.p1)
    GameScene.add(new Stage1())
    GameScene.add(new Light())
  }

  override update (): void {
    this.setCameraPosition()
    this.reborn()
  }

  public smash (): void {
    const mainCamera = GameScene.get()?.getMainCamera()
    if (!mainCamera) return
    const direction = new THREE.Vector3(0, 0, 0)
    mainCamera.getWorldDirection(direction)
    direction.normalize()
    direction.setY(0)
    direction.multiplyScalar(3)
    direction.add(new THREE.Vector3(0, 2, 0))
    this.p1.rigidBody().applyImpulse(CannonWorld.parseFrom(direction))
  }

  private cameraAngle: number = 0.0

  public changeAngle (dt: number): void {
    this.cameraAngle += dt
    if (this.cameraAngle > 360 || this.cameraAngle < -360) {
      this.cameraAngle = 0
    }
  }

  private setCameraPosition () {
    const gameScene = GameScene.get()
    if (!gameScene) return
    const distance = 5
    const height = 10
    const mainCamera = gameScene.getMainCamera()
    const p1Position = this.p1.getObject3D()?.position
    if (!p1Position) return

    // 角度に応じてカメラの位置を設定
    mainCamera.position.set(
      p1Position.x + distance * Math.sin(this.cameraAngle),
      p1Position.y + height,
      p1Position.z + distance * Math.cos(this.cameraAngle)
    )

    // オブジェクトの方を見続ける
    mainCamera.lookAt(p1Position)
  }

  private reborn () {
    if (this.p1.getObject3D()?.position.y < -10) {
      this.p1.rigidBody().position.set(0, 10, 0)
      this.p1.rigidBody().velocity.set(0, 0, 0)
      this.p1.rigidBody().angularVelocity.set(0, 0, 0)
    }
  }
}
