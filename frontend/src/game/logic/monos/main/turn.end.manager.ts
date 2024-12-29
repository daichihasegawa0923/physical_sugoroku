import { type RigidBodyMonoBehaviour } from '@/game/logic/monos/base/rigid.body.monobehaviour';
import { Piece } from '@/game/logic/monos/player/piece';
import { Goal } from '@/game/logic/monos/stage/goal';
import { GameScene } from '@/shared/game/game.scene';

const MIN_MOTION = 0.1;

export class TurnEndManager {
  public isMoveSomePieces () {
    return this.calculatePieceMotionMass() >= MIN_MOTION;
  }

  private calculatePieceMotionMass () {
    const pieces = GameScene.findByType(Piece) as RigidBodyMonoBehaviour[];
    const goal = GameScene.findByType(Goal) as RigidBodyMonoBehaviour[];
    return [...pieces, ...goal]
      .map(
        (mono) =>
          mono.rigidBody().velocity.lengthSquared() +
          mono.rigidBody().angularVelocity.lengthSquared()
      )
      .reduce((prev, current) => {
        return prev + current;
      });
  }
}
