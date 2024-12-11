import { MonoBehaviour } from '@/shared/game/monobehaviour'
import { DirectionalLight, type Object3D } from 'three'

export class Light extends MonoBehaviour {
  private readonly light: DirectionalLight

  constructor () {
    super()
    this.light = new DirectionalLight(0xffffff, 1)
    this.light.position.set(5, 10, 10)
    this.light.shadow.mapSize.width = 4096
    this.light.shadow.mapSize.height = 4096
    this.light.castShadow = true
    this.light.shadow.camera.top = 50
    this.light.shadow.camera.bottom = -50
    this.light.shadow.camera.right = 50
    this.light.shadow.camera.left = -50
  }

  public getObject3D (): Object3D | null {
    return this.light
  }
}
