import { SimpleBox } from '@/game.logic/monos/base/simple.box'
import { Piece } from '@/game.logic/monos/player/piece'
import { Goal } from '@/game.logic/monos/stage/goal'
import { StageBuilderHelper } from '@/game.logic/monos/stage/stage.builder.helper'
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

  override update (): void {
    super.update()
    GameScene.findByType(Piece).forEach((p) => {
      const obj = p.getObject3D()
      if (!obj) return
      if (obj.position.y < -20) {
        const getPosition = () => {
          switch (p.getNumber()) {
            case '1':
              return this.getPiece1Position()
            case '2':
              return this.getPiece2Position()
            case '3':
              return this.getPiece3Position()
            case '4':
              return this.getPiece4Position()
          }
          throw Error()
        }
        const { x, y } = getPosition()
        const position = this.getPositionFromMapPoint(x, y, 10)
        p.rigidBody().position.set(position.x, position.y, position.z)
        p.rigidBody().angularVelocity.set(0, 0, 0)
        p.rigidBody().quaternion.set(0, 0, 0, 1)
        p.rigidBody().velocity.set(0, p.rigidBody().velocity.y, 0)
      }
    })
  }

  protected getPositionFromMapPoint (
    x: number,
    y: number,
    height: number
  ): Vector3 {
    return {
      x: x * this.getRate().w + this.getRate().w / 2,
      y: height,
      z: y * this.getRate().w + this.getRate().w / 2
    }
  }

  private readonly boxes: MonoBehaviour[] = []

  protected abstract mapInfo (): number[][]

  protected getRate (): { w: number, h: number } {
    return { w: 1, h: 1 }
  }

  protected build () {
    const mapInfo = this.mapInfo()
    const helper = new StageBuilderHelper()
    const createInfo = helper.create(mapInfo, this.getRate())
    createInfo.forEach((c) => {
      this.createFloor(c.size, c.position)
    })
    this.boxes.forEach((box) => {
      GameScene.add(box)
    })
    const { x, y, height } = this.getGoalPosition()
    const goal = new Goal()
    goal.setPosition(this.getPositionFromMapPoint(x, y, height))
    GameScene.add(goal)
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

  abstract getPiece1Position (): { x: number, y: number }
  abstract getPiece2Position (): { x: number, y: number }
  abstract getPiece3Position (): { x: number, y: number }
  abstract getPiece4Position (): { x: number, y: number }

  abstract getGoalPosition (): { x: number, y: number, height: number }
}
