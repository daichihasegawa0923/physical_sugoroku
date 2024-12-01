import { MonoBehaviour } from '@/shared/game/monobehaviour'
import { type Object3D } from 'three'
import { GameScene } from '@/shared/game/game.scene'
import * as THREE from 'three'
import { Stage1 } from './stage/stage1'
import { CannonWorld } from '@/shared/game/cannon.world'
import { type GameEventHandlers } from '../events/event'
import { type RigidBodyMonoBehaviour } from './base/rigid.body.monobehaviour'
import { MonoContainer } from '@/shared/game/mono.container'
import { Piece } from '@/game.logic/monos/player/piece'
import { Light } from '@/game.logic/monos/base/light'
import {
  type GameStatus,
  type GameObject,
  type Vector3
} from '@/shared/game/type'
import type IOnline from '@/shared/game/i.online'
import { LightHemisphere } from '@/game.logic/monos/base/light.hemisphere'
import { Goal } from '@/game.logic/monos/stage/goal'

export class MainLogic extends MonoBehaviour {
  public constructor (
    roomId: string,
    memberId: string,
    objects: GameObject[],
    status: GameStatus,
    handler: GameEventHandlers
  ) {
    super()
    this.roomId = roomId
    this.memberId = memberId
    this.registerPrefabs()
    objects.forEach((obj) => {
      MonoContainer.createInstance(obj.className, obj)
    })
    this.eventHandler = handler
    this.status = status
  }

  private readonly roomId: string
  private readonly memberId: string
  private status: GameStatus
  private activeMemberId: string | null = null

  private rotateOnDirection = { vertical: 0, horizontal: 0 }

  public getStatus () {
    return this.status
  }

  public updateStats (
    status: GameStatus,
    activeMemberId: string,
    onChange: (gs: GameStatus, activeMemberId: string) => void
  ) {
    onChange(status, activeMemberId)
    this.status = status
    this.activeMemberId = activeMemberId
  }

  public getObject3D (): Object3D | null {
    return null
  }

  public isMyTurn () {
    return this.memberId === this.activeMemberId
  }

  private readonly eventHandler: GameEventHandlers

  override start (): void {
    this.init()
  }

  override update (): void {
    this.setCameraPosition()
    this.judgeTurnEnd()
  }

  public smashById (id: string, direction: Vector3) {
    const target = GameScene.findById(id);

    (target as RigidBodyMonoBehaviour)
      ?.rigidBody()
      .velocity.set(direction.x, direction.y, direction.z)
  }

  public smash (): void {
    if (!this.isMyTurn()) return
    const mainCamera = GameScene.get().getMainCamera()
    const direction = new THREE.Vector3(0, 0, 0)
    mainCamera.getWorldDirection(direction)
    direction.normalize()
    const directionResult = CannonWorld.parseFrom(direction)
    const myObj = this.getMyObject()
    if (!myObj) return
    this.eventHandler.impulse({
      name: 'impulse',
      id: myObj.getId(),
      direction: { ...directionResult }
    })
    this.rotateOnDirection = { horizontal: 0, vertical: 0 }
  }

  public changeAngle (x: number, y: number) {
    const { vertical, horizontal } = this.rotateOnDirection
    const newVertical = vertical + y * 0.0005
    const newHorizontal = horizontal + x * 0.0005
    this.rotateOnDirection = {
      vertical: newVertical,
      horizontal: newHorizontal
    }
  }

  private setCameraPosition () {
    const mainCamera = GameScene.get().getMainCamera()
    const p1Position = this.getMyObject()?.getObject3D()?.position
    const goal = GameScene.findByType(Goal)[0]
    if (this.isMyTurn() && this.status === 'DIRECTION') {
      if (!p1Position || !goal) return
      const { x, y, z } = p1Position
      mainCamera.position.set(x, y, z)
      mainCamera.lookAt(goal.getObject3D().position)
      mainCamera.rotateOnWorldAxis(
        new THREE.Vector3(0, 1, 0),
        mainCamera.quaternion.y + this.rotateOnDirection.vertical
      )
      console.log(mainCamera.rotation)
      mainCamera.rotateX(
        mainCamera.quaternion.x + this.rotateOnDirection.horizontal
      )
      return
    }

    if (!p1Position) {
      mainCamera.position.set(0, 5, 0)
      mainCamera.rotation.set(0, mainCamera.rotation.y + 0.01, 0)
      return
    }
    // 角度に応じてカメラの位置を設定
    const distance = 5
    const height = 5
    mainCamera.position.set(
      p1Position.x + distance * Math.sin(this.rotateOnDirection.vertical),
      p1Position.y + height,
      p1Position.z - distance * Math.cos(this.rotateOnDirection.vertical)
    )
    // 自分のターンでない時は、敵の駒を見る
    if (this.activeMemberId !== this.memberId) {
      mainCamera.lookAt(
        GameScene.findByType(Piece)
          .find((p) => p.getMemberId() === this.activeMemberId)
          ?.getObject3D()?.position ?? new THREE.Vector3(0, 0, 0)
      )
      return
    }
    // オブジェクトの方を見続ける
    mainCamera.lookAt(p1Position)
  }

  private getMyObject (): RigidBodyMonoBehaviour | undefined {
    return GameScene.findByType(Piece).find(
      (p) => p.getMemberId() === this.memberId
    )
  }

  private calculatePieceMotionMass () {
    const pieces = GameScene.findByType(Piece) as RigidBodyMonoBehaviour[]
    return pieces
      .map(
        (piece) =>
          piece.rigidBody().velocity.lengthSquared() +
          piece.rigidBody().angularVelocity.lengthSquared()
      )
      .reduce((prev, current) => {
        return prev + current
      })
  }

  private isMoveSomePieces () {
    return this.calculatePieceMotionMass() >= 0.01
  }

  private judgeTurnEnd (): void {
    if (!this.isMyTurn()) return
    if (this.getStatus() !== 'MOVING') return
    if (!this.isMoveSomePieces()) {
      this.status = 'WAITING'
      setTimeout(() => {
        if (this.isMoveSomePieces()) {
          this.status = 'MOVING'
          return
        }
        this.eventHandler.turnEnd({
          name: 'turnEnd',
          roomId: this.roomId,
          gameObjects: GameScene.allOnline()
        })
        // 遅延させる
      }, 1500)
    }
  }

  public goal (goalMemberId: string) {
    this.eventHandler.goal({
      name: 'goal',
      goalMemberId,
      roomId: this.roomId,
      gameObjects: GameScene.allOnline()
    })
  }

  private registerPrefabs () {
    MonoContainer.registerPrefab('Stage1', (input) => {
      const stage1 = GameScene.findById(input.id)
      if (stage1) {
        return stage1
      }
      const created = new Stage1(input.id)
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
      if (!input.other.number) {
        throw new Error()
      }
      if (!input.other.memberId) {
        throw new Error()
      }
      const created = new Piece({
        id: input.id,
        number: input.other.number as string,
        memberId: input.other.memberId as string,
        position: input.position
      })
      GameScene.add(created)
      return created
    })
  }

  public syncAll (gameObjects: GameObject[]) {
    const addTarget = gameObjects.filter(
      (go) => GameScene.findById(go.id) == null
    )
    // const removeTarget = GameScene.allOnline().filter(
    //   (local) => gameObjects.find((go) => go.id === local.id) == null
    // );
    addTarget.forEach((t) => {
      MonoContainer.createInstance(t.className, t)
    })
    // removeTarget.forEach((r) => {
    //   const target = GameScene.findById(r.id);
    //   if (target) {
    //     GameScene.remove(target);
    //   }
    // });
    GameScene.all().forEach((r) => {
      const targetGo = gameObjects.find((go) => go.id === r.getId())
      if (!targetGo) return
      const iOnline = r as unknown as IOnline
      iOnline.syncFromOnline(targetGo)
    })
  }

  private readonly light = new Light()
  private readonly lightHemisphere = new LightHemisphere()

  private init () {
    GameScene.add(this.light)
    GameScene.add(this.lightHemisphere)
  }
}
