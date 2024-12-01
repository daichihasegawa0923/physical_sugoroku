import { SimpleBox } from '@/game.logic/monos/base/simple.box'
import { type Goal } from '@/game.logic/monos/stage/goal'
import { GameScene } from '@/shared/game/game.scene'
import { MonoBehaviour } from '@/shared/game/monobehaviour'
import { type Vector3 } from '@/shared/game/type'
import { Vec3 } from 'cannon-es'
import { type Object3D } from 'three'

export abstract class StageBuilder extends MonoBehaviour {
  public getObject3D (): Object3D | null {
    return null
  }

  override start (): void {
    super.start()
    this.build()
  }

  private readonly boxes: MonoBehaviour[] = []

  protected abstract mapInfo (): Array<Array<number | { height: number }>>

  protected abstract getGoal (): Goal

  protected build () {
    const mapInfo = this.mapInfo()
    for (let i = 0; i < mapInfo.length; i++) {
      for (let j = 0; j < mapInfo[i].length; j++) {
        const height = mapInfo[i][j]
        if (typeof height === 'number' && height > 0) {
          this.createFloor({ x: 1, y: height, z: 1 }, { x: j, y: 0, z: i })
          continue
        }
      }
    }
    this.boxes.forEach((box) => { GameScene.add(box) })
    GameScene.add(this.getGoal())
  }

  protected createFloor (size: Vector3, position: Vector3) {
    this.createSimpleBoxFloor(
      new Vec3(size.x, size.y, size.z),
      new Vec3(position.x, position.y, position.z)
    )
  }

  private createSimpleBoxFloor (size: Vec3, position: Vec3) {
    const box = new SimpleBox({
      color: 0xcccccc,
      size,
      position: this.getPivotPosition(size, position)
    })
    this.boxes.push(box)
  }

  getPivotPosition (size: Vec3, position: Vec3) {
    const { x, y, z } = size
    return new Vec3(position.x + x / 2, position.y + y / 2, position.z + z / 2)
  }

  override isSingleton (): boolean {
    return true
  }
}
