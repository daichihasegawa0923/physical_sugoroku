import { MonoBehaviour } from '@/shared/game/monobehaviour'
import { HemisphereLight, type Object3D } from 'three'

export class LightHemisphere extends MonoBehaviour {
  public constructor () {
    super()
    this.light = new HemisphereLight(0xddddff, 0x666666, 1)
  }

  private readonly light: HemisphereLight

  public getObject3D (): Object3D | null {
    return this.light
  }
}
