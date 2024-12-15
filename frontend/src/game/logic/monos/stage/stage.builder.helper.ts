import { type Vector3 } from '@/shared/game/type'

export class StageBuilderHelper {
  public create (
    mapInfo: number[][],
    rate: { w: number, h: number }
  ): Array<{ size: Vector3, position: Vector3 }> {
    const list: number[][] = this.init(mapInfo)
    const generateInfo: Array<{ size: Vector3, position: Vector3 }> = []
    for (let i = 0; i < mapInfo.length; i++) {
      for (let j = 0; j < mapInfo[i].length; j++) {
        if (list[i][j] !== -1 || mapInfo[i][j] < 1) continue
        const count = this.countToX(mapInfo, i, j)
        generateInfo.push({
          size: {
            x: (1 + count) * rate.w,
            y: mapInfo[i][j] * rate.h,
            z: rate.w
          },
          position: { x: j * rate.w, y: 0, z: i * rate.w }
        })
        for (let g = 0; g < count; g++) {
          list[i][j + g] = 0
        }
      }
    }
    return generateInfo
  }

  private countToX (mapInfo: number[][], i: number, j: number) {
    let count = 0
    const height = mapInfo[i][j]
    const targetArray = mapInfo[i]
    const maxLength = targetArray.length
    for (let x = j + 1; x < maxLength; x++) {
      if (targetArray[x] !== height) return count
      count++
    }
    return count
  }

  private init (mapInfo: number[][]): number[][] {
    const list: number[][] = []
    for (let i = 0; i < mapInfo.length; i++) {
      list.push([])
      for (let j = 0; j < mapInfo[i].length; j++) {
        list[i].push(-1)
      }
    }
    return list
  }
}
