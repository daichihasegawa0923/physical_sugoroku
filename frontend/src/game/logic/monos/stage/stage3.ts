import { StageBase } from '@/game/logic/monos/stage/stage.base';
import { type StageMap } from '@/game/logic/monos/stage/stage.maptip';

const SIZE = 11;

export class Stage3 extends StageBase {
  protected mapInfo (): StageMap {
    const mapInfo: StageMap = [];

    for (let y = 0; y < SIZE; y++) {
      mapInfo.push([]);
      for (let x = 0; x < SIZE; x++) {
        mapInfo[y].push(null);
      }
    }

    let index = 0;
    while (index < Math.floor(SIZE / 2)) {
      for (let y = index; y < SIZE - index; y++) {
        for (let x = index; x < SIZE - index; x++) {
          mapInfo[y][x] = { name: 'box', height: index };
        }
      }
      index++;
    }
    return mapInfo;
  }

  protected override rate (): number {
    return 3;
  }

  getPiece1Position (): { x: number; y: number } {
    return { x: SIZE - 1, y: 0 };
  }

  getPiece2Position (): { x: number; y: number } {
    return { x: SIZE - 2, y: 0 };
  }

  getPiece3Position (): { x: number; y: number } {
    return { x: SIZE - 3, y: 0 };
  }

  getPiece4Position (): { x: number; y: number } {
    return { x: SIZE - 4, y: 0 };
  }

  getGoalPosition (): { x: number; y: number; height: number } {
    return { x: Math.floor(SIZE / 2), y: Math.floor(SIZE / 2), height: 20 };
  }

  getClass (): string {
    return 'Stage3';
  }
}
