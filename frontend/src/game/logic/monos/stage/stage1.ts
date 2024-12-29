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
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 }
      ],
      [
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 }
      ],
      [
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 }
      ],
      [
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 }
      ]
    ];
  }

  protected rate (): number {
    return 3;
  }

  getPiece1Position (): { x: number; y: number } {
    return { x: 0, y: 0 };
  }

  getPiece2Position (): { x: number; y: number } {
    return { x: 4, y: 4 };
  }

  getPiece3Position (): { x: number; y: number } {
    return { x: 0, y: 4 };
  }

  getPiece4Position (): { x: number; y: number } {
    return { x: 4, y: 0 };
  }

  getGoalPosition (): { x: number; y: number; height: number } {
    return { x: 2, y: 2, height: 4 };
  }

  getClass (): string {
    return 'Stage1';
  }
}
