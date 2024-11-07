import { MonoBehaviour } from '@/shared/game/monobehaviour'
import { type Object3D } from 'three'
import { Box } from './base/box'
import { GameScene } from '@/shared/game/game.scene'
import * as CANNON from 'cannon-es'
import { Stage1 } from './stage/stage1'

export class MainLogic extends MonoBehaviour {
  public getObject3D (): Object3D | null {
    return null
  }

  private readonly p1: Box = new Box({
    color: 0xff0000,
    size: new CANNON.Vec3(1, 1, 1),
    mass: 1,
    position: new CANNON.Vec3(0, 10, 0)
  })

  override start (): void {
    GameScene.add(this.p1)
    GameScene.add(new Stage1())
    window.addEventListener('click', () => {
      this.p1.rigidBody().velocity.set(2, 0, 0)
    })
  }

  override update (): void {
    this.setCameraPosition()
    this.reborn()
  }

  private setCameraPosition () {
    const gameScene = GameScene.get()
    if (!gameScene) return
    const mainCamera = gameScene.getMainCamera()
    const p1Position = this.p1.getObject3D()?.position
    if (!p1Position) return
    mainCamera.position.set(p1Position.x, 10, p1Position.z + 5)
    mainCamera.lookAt(this.p1.getObject3D()?.position)
  }

  private reborn () {
    if (this.p1.getObject3D()?.position.y < -10) {
      this.p1.rigidBody().position.set(0, 10, 0)
    }
  }
}
