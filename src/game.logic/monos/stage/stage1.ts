import { type GameObject } from '@/shared/game/type'
import type IOnline from '@/shared/game/i.online'
import { StageBuilder } from '@/game.logic/monos/stage/stage.builder'
import { Goal } from '@/game.logic/monos/stage/goal'
import { Vec3 } from 'cannon-es'

export class Stage1 extends StageBuilder implements IOnline {
  protected mapInfo (): Array<Array<number | { height: number }>> {
    return [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
      [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
      [1, 4, 4, 4, 4, 5, 4, 4, 4, 4, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
  }

  protected getGoal (): Goal {
    const goal = new Goal({
      position: new Vec3(5.5, 7, 21)
    })
    return goal
  }

  public online (): GameObject {
    return {
      id: this.getId(),
      className: this.getClass(),
      position: { x: 0, y: 0, z: 0 },
      quaternion: { x: 0, y: 0, z: 0, w: 1 },
      size: { x: 1, y: 1, z: 1 }
    }
  }

  syncFromOnline (_gameObject: GameObject): void {}

  override isSingleton (): boolean {
    return true
  }
}
