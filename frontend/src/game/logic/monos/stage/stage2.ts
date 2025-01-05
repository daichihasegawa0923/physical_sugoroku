import { StageBase } from '@/game/logic/monos/stage/stage.base';
import { type StageMap } from '@/game/logic/monos/stage/stage.maptip';

export class Stage2 extends StageBase {
  protected mapInfo (): StageMap {
    return [
      [
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 }
      ],
      [
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        null,
        { name: 'box', height: 1 },
        null,
        { name: 'box', height: 1 },
        { name: 'box', height: 1 }
      ],
      [
        { name: 'box', height: 1 },
        null,
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        null,
        { name: 'box', height: 1 }
      ],
      [
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 }
      ],
      [
        { name: 'box', height: 1 },
        null,
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        null,
        { name: 'box', height: 1 }
      ],
      [
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        null,
        { name: 'box', height: 1 },
        null,
        { name: 'box', height: 1 },
        { name: 'box', height: 1 }
      ],
      [
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
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
