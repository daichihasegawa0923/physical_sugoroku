import { StageBuilder } from '@/game.logic/monos/stage/stage.builder'

export class Stage1 extends StageBuilder {
  protected mapInfo (): number[][] {
    return [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 2, 1, 1],
      [1, 1, 1, 1, 1]
    ]
  }

  protected override getRate (): { w: number, h: number } {
    return { w: 3, h: 1 }
  }

  getPiece1Position (): { x: number, y: number } {
    return { x: 0, y: 0 }
  }

  getPiece2Position (): { x: number, y: number } {
    return { x: 1, y: 0 }
  }

  getPiece3Position (): { x: number, y: number } {
    return { x: 3, y: 0 }
  }

  getPiece4Position (): { x: number, y: number } {
    return { x: 4, y: 0 }
  }

  getGoalPosition (): { x: number, y: number, height: number } {
    return { x: 2, y: 9, height: 3 }
  }

  getClass (): string {
    return 'Stage1'
  }
}
