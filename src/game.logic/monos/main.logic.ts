import { MonoBehaviour } from '@/shared/game/monobehaviour'
import { type Object3D } from 'three'
import { GameScene } from '@/shared/game/game.scene'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { Stage1 } from './stage/stage1'
import { SimpleSphere } from './base/simple.sphere'
import { CannonWorld } from '@/shared/game/cannon.world'
import { Light } from './base/light'
import { SimpleBox } from './base/simple.box'
import type GameEvent from '../events/event'
import { type RigidBodyMonoBehaviour } from './base/rigid.body.monobehaviour'

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

  private readonly light: Light = new Light()

  override start (): void {
    GameScene.add(this.p1)
    GameScene.add(new Stage1())
    GameScene.add(this.light)
    GameScene.add(
      new SimpleBox({
        color: 0xff0000,
        size: new CANNON.Vec3(1, 1, 1),
        position: new CANNON.Vec3(-2, 10, -7),
        mass: 3
      })
    )
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
    const height = 5
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

  public onEvent (event: GameEvent): void {
    switch (event.name) {
      case 'impulse': {
        const target = GameScene.findById<RigidBodyMonoBehaviour>(event.id)
        if (!target) return
        const {
          direction: { x, y, z }
        } = event
        target.rigidBody().applyImpulse(new CANNON.Vec3(x, y, z))
        break
      }
      case 'add': {
        const {
          className,
          status: { id, position, quaternion }
        } = event
        const isExist = !!GameScene.findById(id)
        if (!isExist) return
        const instance = this.createInstance(
          className,
          id,
          new CANNON.Vec3(position.x, position.y, position.z),
          new CANNON.Quaternion(
            quaternion.x,
            quaternion.y,
            quaternion.z,
            quaternion.w
          )
        )
        if (!instance) return
        GameScene.add(instance)
        break
      }
      case 'remove': {
        const removeTarget = GameScene.findById(event.id)
        if (removeTarget) {
          GameScene.remove(removeTarget)
        }
        break
      }
      case 'syncRigidBody': {
        event.statuses.forEach((syncStatus) => {
          const syncTarget = GameScene.findById<RigidBodyMonoBehaviour>(
            syncStatus.id
          )
          if (!syncTarget) return
          const { position, quaternion } = syncStatus
          syncTarget
            .rigidBody()
            .position.set(position.x, position.y, position.z)
          syncTarget
            .rigidBody()
            .quaternion.set(
              quaternion.x,
              quaternion.y,
              quaternion.z,
              quaternion.w
            )
        })
        break
      }
      default:
        break
    }
  }

  private createInstance (
    className: string,
    id: string,
    position: CANNON.Vec3,
    quaternion: CANNON.Quaternion
  ): RigidBodyMonoBehaviour | null {
    switch (className) {
      case 'sphere1':
        return new SimpleSphere({ color: 0xffffff, radius: 1, position, id })
      case 'sphere2':
        return new SimpleSphere({ color: 0x00ffff, radius: 1, position, id })
      case 'sphere3':
        return new SimpleSphere({ color: 0xff00ff, radius: 1, position, id })
      case 'sphere4':
        return new SimpleSphere({ color: 0xffff00, radius: 1, position, id })
    }
    return null
  }
}
