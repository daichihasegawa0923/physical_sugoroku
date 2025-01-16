import { StageBase } from '@/game/logic/monos/stage/stage.base';
import { type StageMap } from '@/game/logic/monos/stage/stage.maptip';

export class Stage4 extends StageBase {
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
        { name: 'slope', height: 2, direction: 'f' },
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
        { name: 'slope', height: 2, direction: 'b' },
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

  getClass (): string {
    return 'Stage2';
  }
}
