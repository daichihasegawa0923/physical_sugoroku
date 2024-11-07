import { GameScene } from '@/shared/game/game.scene'
import { MonoBehaviour } from '@/shared/game/monobehaviour'
import type * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { Box } from '../base/box'

export class Stage1 extends MonoBehaviour {
  public getObject3D (): THREE.Object3D | null {
    return null
  }

  private add (array: Array<{ size: CANNON.Vec3, position: CANNON.Vec3 }>) {
    array
      .map((item) => {
        return new Box({
          color: 0xff00ff,
          size: item.size,
          position: item.position
        })
      })
      .forEach((box) => {
        GameScene.add(box)
      })
  }

  override start (): void {
    this.add([
      {
        size: new CANNON.Vec3(10, 1, 10),
        position: new CANNON.Vec3(0, 0, 0)
      },
      {
        size: new CANNON.Vec3(5, 1, 10),
        position: new CANNON.Vec3(-2.5, 0, -10)
      },
      {
        size: new CANNON.Vec3(10, 1, 5),
        position: new CANNON.Vec3(5, 0, -12.5)
      }
    ])
  }
}
