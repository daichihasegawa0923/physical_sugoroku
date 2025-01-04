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
        { name: 'box', height: 1 }
      ],
      [null, null, { name: 'slope', height: 2, direction: 'f' }, null, null],
      [],
      [
        null,
        { name: 'slope', height: 2, direction: 'l' },
        { name: 'box', height: 2 },
        { name: 'slope', height: 2, direction: 'r' },
        null
      ],
      [
        null,
        { name: 'slope', height: 2, direction: 'l' },
        { name: 'box', height: 2 },
        { name: 'slope', height: 2, direction: 'r' },
        null
      ],
      [],
      [
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 },
        { name: 'box', height: 1 }
      ],
      [
        { name: 'slope', height: 2, direction: 'f' },
        null,
        null,
        null,
        { name: 'slope', height: 2, direction: 'f' }
      ],
      [
        { name: 'slope', height: 3, direction: 'f' },
        null,
        null,
        null,
        { name: 'slope', height: 3, direction: 'f' }
      ],
      [
        { name: 'box', height: 3 },
        { name: 'box', height: 3 },
        null,
        { name: 'box', height: 3 },
        { name: 'box', height: 3 }
      ],
      [
        { name: 'box', height: 3 },
        { name: 'box', height: 3 },
        null,
        { name: 'box', height: 3 },
        { name: 'box', height: 3 }
      ],
      [
        { name: 'box', height: 3 },
        { name: 'box', height: 3 },
        { name: 'box', height: 3 },
        { name: 'box', height: 3 },
        { name: 'box', height: 3 }
      ]
    ];
  }

  getClass (): string {
    return 'Stage2';
  }
}
