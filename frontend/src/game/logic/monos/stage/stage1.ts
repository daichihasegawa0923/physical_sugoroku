import { StageBase } from '@/game/logic/monos/stage/stage.base';

export class Stage1 extends StageBase {
  protected mapInfo (): number[][] {
    return [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ];
  }

  protected rate (): number {
    return 3;
  }

  getPiece1Position (): { x: number; y: number } {
    return { x: 1, y: 0 };
  }

  getPiece2Position (): { x: number; y: number } {
    return { x: 3, y: 0 };
  }

  getPiece3Position (): { x: number; y: number } {
    return { x: 1, y: 1 };
  }

  getPiece4Position (): { x: number; y: number } {
    return { x: 3, y: 1 };
  }

  getGoalPosition (): { x: number; y: number; height: number } {
    return { x: 2, y: 10, height: 4 };
  }

  getClass (): string {
    return 'Stage1';
  }
}
