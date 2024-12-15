import { StageBuilder } from '@/game/logic/monos/stage/stage.builder'

export class StageTest extends StageBuilder {
  protected mapInfo (): number[][] {
    return [
      [1, 1, 1, 1],
      [1, 1, 1, 1]
    ]
  }

  protected override getRate (): { w: number, h: number } {
    return { w: 1, h: 1 }
  }

  getPiece1Position (): { x: number, y: number } {
    return { x: 0, y: 0 }
  }

  getPiece2Position (): { x: number, y: number } {
    return { x: 1, y: 0 }
  }

  getPiece3Position (): { x: number, y: number } {
    return { x: 2, y: 0 }
  }

  getPiece4Position (): { x: number, y: number } {
    return { x: 3, y: 0 }
  }

  getGoalPosition (): { x: number, y: number, height: number } {
    return { x: 1, y: 1, height: 1.5 }
  }

  getClass (): string {
    return 'StageTest'
  }
}
