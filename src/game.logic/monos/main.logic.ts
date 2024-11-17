import { MonoBehaviour } from '@/shared/game/monobehaviour'
import { type Object3D } from 'three'
import { GameScene } from '@/shared/game/game.scene'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { Stage1 } from './stage/stage1'
import { CannonWorld } from '@/shared/game/cannon.world'
import type GameEvent from '../events/event'
import { type RigidBodyMonoBehaviour } from './base/rigid.body.monobehaviour'
import { type GameObject, MonoContainer } from '@/shared/game/mono.container'
import { Piece, type PlayerNumber } from '@/game.logic/monos/player/piece'
import { Light } from '@/game.logic/monos/base/light'

export class MainLogic extends MonoBehaviour {
  public constructor (
    roomId: string,
    memberId: string,
    objects: GameObject[],
    addObjCb: (gos: GameObject[]) => void
  ) {
    super()
    this.roomId = roomId
    this.memberId = memberId
    this.registerPrefabs()
    objects.forEach((obj) => {
      MonoContainer.createInstance(obj.className, obj)
    })
    this.addObjCb = addObjCb
    this.init()
  }

  private readonly roomId: string
  private readonly memberId: string

  public getObject3D (): Object3D | null {
    return null
  }

  private readonly addObjCb: (go: GameObject[]) => void

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
    this.getMyObject()
      ?.rigidBody()
      .applyImpulse(CannonWorld.parseFrom(direction))
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
    const p1Position = this.getMyObject()?.getObject3D()?.position
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
    const obj = this.getMyObject()
    const obj3d = obj?.getObject3D()
    if (obj3d == null) return
    if (obj3d.position.y < -10) {
      obj?.rigidBody().position.set(0, 10, 0)
      obj?.rigidBody().velocity.set(0, 0, 0)
      obj?.rigidBody().angularVelocity.set(0, 0, 0)
    }
  }

  private getMyObject (): RigidBodyMonoBehaviour | undefined {
    return GameScene.findByType(Piece).find(
      (p) => p.getMemberId() === this.memberId
    )
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
        const { input } = event
        input.forEach((i) => {
          MonoContainer.createInstance(i.className, i)
        })
        break
      }
      case 'remove': {
        const removeTarget = GameScene.findById(event.id)
        if (removeTarget) {
          GameScene.remove(removeTarget)
        }
        break
      }
    }
  }

  private registerPrefabs () {
    MonoContainer.registerPrefab('Stage1', (input) => {
      const stage1 = GameScene.findById(input.id)
      if (stage1) {
        return stage1
      }
      const created = new Stage1()
      GameScene.add(created)
      return created
    })
    MonoContainer.registerPrefab('Piece', (input) => {
      const pieces = GameScene.findByType(Piece)
      const target = pieces.find((p) => p.getId() === input.id)
      if (target) {
        return target
      }
      if (!input.other) {
        throw new Error()
      }
      if (!input.other.playerNumber) {
        throw new Error()
      }
      if (!input.other.memberId) {
        throw new Error()
      }
      const created = new Piece({
        id: input.id,
        playerNumber: input.other.playerNumber as PlayerNumber,
        memberId: input.other.memberId as string,
        position: input.position
      })
      GameScene.add(created)
      return created
    })
  }

  private init () {
    GameScene.add(new Light())
    const stages = GameScene.findByType(Stage1)
    const created: GameObject[] = []
    if (stages.length === 0) {
      const newStage = new Stage1()
      GameScene.add(new Stage1())
      created.push({
        className: 'Stage1',
        id: newStage.getId(),
        position: { x: 0, y: 0, z: 0 },
        quaternion: { x: 0, y: 0, z: 0, w: 1 },
        size: { x: 1, y: 1, z: 1 }
      })
    }
    if (this.getMyObject() == null) {
      const piece = new Piece({
        playerNumber: '1',
        memberId: this.memberId,
        position: { x: 0, y: 20, z: 0 }
      })
      GameScene.add(piece)
      created.push({
        ...piece.getGameObject('Piece'),
        position: { x: 1, y: 20, z: 1 },
        other: {
          memberId: this.memberId,
          playerNumber: '1'
        }
      })
    }
    if (created.length !== 0) {
      this.addObjCb(created)
    }
  }
}
