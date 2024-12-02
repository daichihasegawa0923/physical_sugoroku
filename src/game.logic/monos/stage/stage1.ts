import { type GameObject } from '@/shared/game/type'
import type IOnline from '@/shared/game/i.online'
import { StageBuilder } from '@/game.logic/monos/stage/stage.builder'

export class Stage1 extends StageBuilder implements IOnline {
  protected mapInfo (): number[][] {
    return [
      [1, 1, 1, 0, 0, 0, 0, 0, 1],
      [0, 0, 1, 0, 0, 0, 0, 0, 1],
      [0, 0, 2, 1, 1, 0, 2, 1, 1],
      [0, 0, 0, 0, 2, 0, 1, 0, 0],
      [0, 0, 1, 2, 3, 2, 1, 0, 0],
      [0, 0, 1, 0, 2, 0, 0, 0, 0],
      [0, 2, 1, 0, 1, 1, 2, 0, 0],
      [0, 1, 0, 0, 0, 0, 1, 0, 0],
      [1, 1, 0, 0, 0, 0, 1, 1, 1]
    ]
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

  protected override getRate (): { w: number, h: number } {
    return { w: 2, h: 1 }
  }

  getPiece1Position (): { x: number, y: number } {
    return { x: 0, y: 0 }
  }

  getPiece2Position (): { x: number, y: number } {
    return { x: this.mapInfo()[0].length - 1, y: this.mapInfo().length - 1 }
  }

  getPiece3Position (): { x: number, y: number } {
    return { x: 0, y: this.mapInfo().length - 1 }
  }

  getPiece4Position (): { x: number, y: number } {
    return { x: this.mapInfo()[0].length - 1, y: 0 }
  }

  getGoalPosition (): { x: number, y: number, height: number } {
    return { x: 4, y: 4, height: 4 }
  }
}
