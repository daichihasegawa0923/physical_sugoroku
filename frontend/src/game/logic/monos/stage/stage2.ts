import { StageBase } from '@/game/logic/monos/stage/stage.base';

export class Stage2 extends StageBase {
  protected mapInfo (): number[][] {
    return [
      [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 1, 2, 1],
      [0, 1, 0, 0, 0, 0, 0, 1, 1, 1],
      [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [2, 2, 2, 0, 0, 0, 0, 2, 2, 2]
    ];
  }

  protected override rate (): number {
    return 1.5;
  }

  getPiece1Position (): { x: number; y: number } {
    return { x: 0, y: 0 };
  }

  getPiece2Position (): { x: number; y: number } {
    return { x: 2, y: 0 };
  }

  getPiece3Position (): { x: number; y: number } {
    return { x: 0, y: 1 };
  }

  getPiece4Position (): { x: number; y: number } {
    return { x: 2, y: 1 };
  }

  getGoalPosition (): { x: number; y: number; height: number } {
    return { x: 8, y: 0, height: 4 };
  }

  getClass (): string {
    return 'Stage2';
  }
}
