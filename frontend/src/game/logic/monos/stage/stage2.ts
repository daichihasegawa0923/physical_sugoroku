import { StageBase } from '@/game/logic/monos/stage/stage.base';
import { type StageMap } from '@/game/logic/monos/stage/stage.maptip';

export class Stage2 extends StageBase {
  protected mapInfo (): StageMap {
    return [
      [
        { name: 'box', height: 1 },
        { name: 'slope', direction: 'b', height: 2 },
        { name: 'box', height: 1 },
        { name: 'slope', direction: 'b', height: 2 },
        { name: 'box', height: 1 },
        { name: 'slope', direction: 'b', height: 2 },
        { name: 'box', height: 1 }
      ],
      [
        { name: 'slope', direction: 'r', height: 2 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'slope', direction: 'l', height: 2 }
      ],
      [
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'slope', direction: 'f', height: 2 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 }
      ],
      [
        { name: 'slope', direction: 'r', height: 2 },
        { name: 'box', height: 1 },
        { name: 'slope', direction: 'l', height: 2 },
        { name: 'box', height: 2 },
        { name: 'slope', direction: 'r', height: 2 },
        { name: 'box', height: 1 },
        { name: 'slope', direction: 'l', height: 2 }
      ],
      [
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'slope', direction: 'b', height: 2 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 }
      ],
      [
        { name: 'slope', direction: 'r', height: 2 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'slope', direction: 'l', height: 2 }
      ],
      [
        { name: 'box', height: 1 },
        { name: 'slope', direction: 'f', height: 2 },
        { name: 'box', height: 1 },
        { name: 'slope', direction: 'f', height: 2 },
        { name: 'box', height: 1 },
        { name: 'slope', direction: 'f', height: 2 },
        { name: 'box', height: 1 }
      ]
    ];
  }

  getClass (): string {
    return 'Stage2';
  }
}
