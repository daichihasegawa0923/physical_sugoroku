import { MonoBehaviour } from '@/shared/game/monobehaviour'
import { type Object3D } from 'three'
import { Box } from './base/box'
import { GameScene } from '@/shared/game/game.scene'
import * as CANNON from 'cannon-es'

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

  private readonly p2: Box = new Box({
    color: 0x00ff00,
    size: new CANNON.Vec3(10, 1, 10),
    mass: 0,
    position: new CANNON.Vec3(0, 0, 0)
  })

  override start (): void {
    GameScene.get()?.add(this.p1)
    GameScene.get()?.add(this.p2)
    window.addEventListener('click', () => {
      this.p1.rigidBody().velocity.set(2, 0, 0)
    })
  }

  override update (): void {
    const gameScene = GameScene.get()
    if (!gameScene) return

    const mainCamera = gameScene.getMainCamera()
    mainCamera.position.set(0, 10, -5)
    mainCamera.lookAt(this.p1.getObject3D()?.position)
  }
}
