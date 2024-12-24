import { StageBase } from '@/game/logic/monos/stage/stage.base';
import { type StageMap } from '@/game/logic/monos/stage/stage.maptip';

const SIZE = 11;

export class Stage3 extends StageBase {
  protected mapInfo (): StageMap {
    const mapInfo: StageMap = [];

    for (let y = 0; y < SIZE; y++) {
      mapInfo.push([]);
      for (let x = 0; x < SIZE; x++) {
        mapInfo[y].push({ name: 'box', height: y });
      }
    }

    return mapInfo;
  }

  protected override rate (): number {
    return 1.5;
  }

  getPiece1Position (): { x: number; y: number } {
    return { x: 0, y: 0 };
  }

  getPiece2Position (): { x: number; y: number } {
    return { x: 4, y: 0 };
  }

  getPiece3Position (): { x: number; y: number } {
    return { x: 1, y: 0 };
  }

  getPiece4Position (): { x: number; y: number } {
    return { x: 3, y: 0 };
  }

  getGoalPosition (): { x: number; y: number; height: number } {
    return { x: 2, y: 11, height: 10 };
  }

  getClass (): string {
    return 'Stage3';
  }
}
