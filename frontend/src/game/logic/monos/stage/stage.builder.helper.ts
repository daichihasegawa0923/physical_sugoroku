import { type Vector3 } from 'physical-sugoroku-common/src/shared';

export class StageBuilderHelper {
  public create (
    mapInfo: number[][],
    rate: number
  ): Array<{ size: Vector3; position: Vector3 }> {
    const initializedList: number[][] = this.init(mapInfo);
    const generateInfo: Array<{ size: Vector3; position: Vector3 }> = [];
    for (let i = 0; i < mapInfo.length; i++) {
      for (let j = 0; j < mapInfo[i].length; j++) {
        if (initializedList[i][j] !== -1 || mapInfo[i][j] < 1) continue;
        generateInfo.push({
          size: {
            x: rate,
            y: mapInfo[i][j] * rate,
            z: rate
          },
          position: { x: j * rate, y: 0, z: i * rate }
        });
      }
    }
    return generateInfo;
  }

  private init (mapInfo: number[][]): number[][] {
    const list: number[][] = [];
    for (let i = 0; i < mapInfo.length; i++) {
      list.push([]);
      for (let j = 0; j < mapInfo[i].length; j++) {
        list[i].push(-1);
      }
    }
    return list;
  }
}
