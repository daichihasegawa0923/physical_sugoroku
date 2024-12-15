import { ArrowDrawer } from '@/game/logic/monos/base/arrow.drawer'
import { type RigidBodyMonoBehaviour } from '@/game/logic/monos/base/rigid.body.monobehaviour'
import { findMyPiece } from '@/game/logic/monos/main/functions'
import { GameScene } from '@/shared/game/game.scene'
import { type Vector3 } from '@/shared/game/type'
import { type GameStatus } from 'physical-sugoroku-common/src/shared'
import * as THREE from 'three'

export class SmashManager {
  public constructor (
    private readonly myMemberId: string,
    private readonly directionPower = {
      dX: 0,
      dY: 0
    },
    private arrowModel: ArrowDrawer = SmashManager.generateArrow()
  ) {}

  public updateDirectionPower (x: number, y: number) {
    this.directionPower.dX = x
    this.directionPower.dY = y
  }

  public drawSmashDirection (status: GameStatus, isMyTurn: boolean): void {
    const isMyDirectionTurn = status === 'DIRECTION' && isMyTurn
    if (!isMyDirectionTurn) {
      return
    }
    const currentPosition = findMyPiece(this.myMemberId)?.rigidBody()?.position
    if (!currentPosition) return

    const calc = this.calcSmashDirection()
    const { x, y, z } = currentPosition
    const from = new THREE.Vector3(x, y + 2, z)
    const to = new THREE.Vector3(x + calc.x / 10, y + 2, z + calc.z / 10)
    GameScene.remove(this.arrowModel)
    this.arrowModel = SmashManager.generateArrow(from, to)
    GameScene.add(this.arrowModel)
  }

  public calcSmashDirection (): Vector3 {
    const MAX_SPEED = 25
    const { dX, dY } = this.directionPower
    const length = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2))
    if (length > 0) {
      const normalizeX = dX / length
      const normalizeY = dY / length
      const speed = Math.min(MAX_SPEED, length * 0.1)
      const diffX = normalizeX * speed
      const diffY = normalizeY * speed
      return {
        x: diffX,
        y: 0,
        z: diffY
      }
    }
    return {
      x: 0,
      y: 0,
      z: 0
    }
  }

  public smash (
    memberId: string,
    callback: (direction: Vector3) => void
  ): boolean {
    // あまりにも小さい場合は処理しない
    if (this.isTooSmall()) return false
    const myObj = findMyPiece(memberId)
    if (!myObj) return false
    callback(this.calcSmashDirection())
    this.reset()
    return true
  }

  public smashById (id: string, direction: Vector3) {
    const target = GameScene.findById(id);

    (target as RigidBodyMonoBehaviour)
      ?.rigidBody()
      .velocity.set(direction.x, direction.y, direction.z)
  }

  public isTooSmall () {
    const { x, y, z } = this.calcSmashDirection()
    return Math.abs(x) + Math.abs(y) + Math.abs(z) < 1
  }

  public reset () {
    GameScene.remove(this.arrowModel)
    this.updateDirectionPower(0, 0)
  }

  private static generateArrow (from?: THREE.Vector3, to?: THREE.Vector3) {
    const arrow = new ArrowDrawer(
      {
        from: from ?? new THREE.Vector3(0, 0, 0),
        to: to ?? new THREE.Vector3(0, 0, 0)
      },
      0xff00cc
    )
    return arrow
  }
}
