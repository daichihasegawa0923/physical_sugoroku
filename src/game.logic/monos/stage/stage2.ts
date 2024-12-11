import { StageBuilder } from '@/game.logic/monos/stage/stage.builder'

export class Stage2 extends StageBuilder {
  protected mapInfo (): number[][] {
    return [
      [8, 1, 1, 1, 1, 1, 1, 1, 8],
      [8, 0, 0, 1, 0, 1, 0, 0, 8],
      [8, 0, 0, 1, 0, 1, 0, 0, 8],
      [8, 1, 1, 1, 1, 1, 1, 1, 8],
      [8, 0, 0, 1, 0, 1, 0, 0, 8],
      [8, 0, 0, 1, 0, 1, 0, 0, 8],
      [8, 2, 2, 2, 2, 2, 2, 2, 8],
      [8, 0, 3, 3, 3, 3, 3, 0, 8],
      [8, 0, 0, 4, 4, 4, 0, 0, 8],
      [8, 1, 2, 3, 3, 3, 2, 1, 8],
      [8, 8, 8, 4, 5, 4, 8, 8, 8]
    ]
  }

  protected override getRate (): { w: number, h: number } {
    return { w: 3, h: 1.5 }
  }

  getPiece1Position (): { x: number, y: number } {
    return { x: 1, y: 0 }
  }

  getPiece2Position (): { x: number, y: number } {
    return { x: 2, y: 0 }
  }

  getPiece3Position (): { x: number, y: number } {
    return { x: 6, y: 0 }
  }

  getPiece4Position (): { x: number, y: number } {
    return { x: 7, y: 0 }
  }

  getGoalPosition (): { x: number, y: number, height: number } {
    return { x: 4, y: 10, height: 10 }
  }

  getClass (): string {
    return 'Stage2'
  }
}
