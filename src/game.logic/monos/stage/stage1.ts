import { GameScene } from '@/shared/game/game.scene'
import { MonoBehaviour } from '@/shared/game/monobehaviour'
import type * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { SimpleBox } from '../base/simple.box'
import { type GameObject } from '@/shared/game/type'

export class Stage1 extends MonoBehaviour {
  public getObject3D (): THREE.Object3D | null {
    return null
  }

  private add (array: Array<{ size: CANNON.Vec3, position: CANNON.Vec3 }>) {
    array
      .map((item, index) => {
        const color = index % 2 === 0 ? 0x0f700f : 0x000ff0
        return new SimpleBox({
          color,
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
        size: new CANNON.Vec3(10, 1, 5),
        position: new CANNON.Vec3(0, 0, 0)
      },
      {
        size: new CANNON.Vec3(2, 1, 6),
        position: new CANNON.Vec3(-4, 0, -5.5)
      },
      {
        size: new CANNON.Vec3(2, 1, 6),
        position: new CANNON.Vec3(4, 0, -5.5)
      },
      {
        size: new CANNON.Vec3(10, 1, 6),
        position: new CANNON.Vec3(0, 0, -11.5)
      },
      {
        size: new CANNON.Vec3(2, 1, 6),
        position: new CANNON.Vec3(0, 0, -17.5)
      }
    ])
  }

  override online (): GameObject | null {
    return {
      id: this.getId(),
      className: 'Stage1',
      position: { x: 0, y: 0, z: 0 },
      quaternion: { x: 0, y: 0, z: 0, w: 1 },
      size: { x: 1, y: 1, z: 1 }
    }
  }
}
