import { ArrowDrawer } from '@/game.logic/monos/base/arrow.drawer'
import { type RigidBodyMonoBehaviour } from '@/game.logic/monos/base/rigid.body.monobehaviour'
import { findMyPiece } from '@/game.logic/monos/main/functions'
import { GameScene } from '@/shared/game/game.scene'
import { type GameStatus, type Vector3 } from '@/shared/game/type'
import * as THREE from 'three'

const MAX_POWER = 20

export class SmashManager {
  public constructor (
    private readonly myMemberId: string,
    private readonly directionPower = {
      dX: 0,
      dY: 0
    },
    private arrowModel: ArrowDrawer | null = SmashManager.generateArrow()
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
    const from = new THREE.Vector3(x, y, z)
    const to = new THREE.Vector3(
      x + calc.x / 10,
      y + calc.y / 10,
      z + calc.z / 10
    )
    if (this.arrowModel == null) {
      this.arrowModel = SmashManager.generateArrow(from, to)
    }
    this.arrowModel.updatePoints(from, to)
  }

  public calcSmashDirection (): Vector3 {
    const currentPosition = findMyPiece(this.myMemberId)?.rigidBody()
    if (!currentPosition) return { x: 0, y: 0, z: 0 }
    const { dX, dY } = this.directionPower
    const diffX = Math.max(-MAX_POWER, Math.min(dX * 0.1, MAX_POWER))
    const diffY = Math.max(-MAX_POWER, Math.min(dY * 0.1, MAX_POWER))

    return {
      x: diffX,
      y: 0,
      z: diffY
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
    return Math.abs(x) + Math.abs(y) + Math.abs(z) < 0.2
  }

  public reset () {
    if (this.arrowModel != null) {
      if (GameScene.findById(this.arrowModel.getId())) {
        GameScene.remove(this.arrowModel)
      }
    }
    this.arrowModel = null
    this.updateDirectionPower(0, 0)
  }

  private static generateArrow (from?: THREE.Vector3, to?: THREE.Vector3) {
    const arrow = new ArrowDrawer(
      {
        from: from ?? new THREE.Vector3(0, 0, 0),
        to: to ?? new THREE.Vector3(0, 0)
      },
      0xff00cc
    )
    GameScene.add(arrow)
    return arrow
  }
}
