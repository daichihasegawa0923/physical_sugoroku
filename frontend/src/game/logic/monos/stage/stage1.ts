import { StageBase } from '@/game/logic/monos/stage/stage.base';
import { type StageMap } from '@/game/logic/monos/stage/stage.maptip';

export class Stage1 extends StageBase {
  protected mapInfo (): StageMap {
    return [
      [
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 }
      ],
      [
        { name: 'box', height: 1 },
        { name: 'slope', height: 2, direction: 'l' },
        { name: 'box', height: 2 },
        { name: 'slope', height: 2, direction: 'r' },
        { name: 'box', height: 1 }
      ],
      [
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 2 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 }
      ],
      [
        { name: 'box', height: 1 },
        { name: 'slope', height: 2, direction: 'l' },
        { name: 'box', height: 2 },
        { name: 'slope', height: 2, direction: 'r' },
        { name: 'box', height: 1 }
      ],
      [
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 2 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 }
      ],
      [
        { name: 'box', height: 1 },
        { name: 'slope', height: 2, direction: 'l' },
        { name: 'box', height: 2 },
        { name: 'slope', height: 2, direction: 'r' },
        { name: 'box', height: 1 }
      ],
      [
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 2 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 }
      ],
      [
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'slope', height: 3, direction: 'f' },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 }
      ],
      [null, null, { name: 'box', height: 3 }, null, null]
    ];
  }

  protected rate (): number {
    return 3;
  }

  getPiece1Position (): { x: number; y: number } {
    return { x: 0, y: 0 };
  }

  getPiece2Position (): { x: number; y: number } {
    return { x: 4, y: 0 };
  }

  getPiece3Position (): { x: number; y: number } {
    return { x: 0, y: 1 };
  }

  getPiece4Position (): { x: number; y: number } {
    return { x: 4, y: 1 };
  }

  getGoalPosition (): { x: number; y: number; height: number } {
    return { x: 2, y: 8, height: 10 };
  }

  getClass (): string {
    return 'Stage1';
  }
}
