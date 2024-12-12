import { type RigidBodyMonoBehaviour } from '@/game.logic/monos/base/rigid.body.monobehaviour'
import { Piece } from '@/game.logic/monos/player/piece'
import { GameScene } from '@/shared/game/game.scene'

const MIN_MOTION = 0.1

export class TurnEndManager {
  public isMoveSomePieces () {
    return this.calculatePieceMotionMass() >= MIN_MOTION
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
}
