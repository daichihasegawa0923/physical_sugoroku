import { GameScene } from '@/shared/game/game.scene';
import { MonoBehaviour } from '@/shared/game/monobehaviour';
import { HemisphereLight, type Object3D } from 'three';

export class LightHemisphere extends MonoBehaviour {
  public constructor () {
    super();
    this.light = new HemisphereLight(0xddddff, 0x666666, 1);
  }

  private readonly light: HemisphereLight;

  public getObject3D (): Object3D | null {
    return this.light;
  }

  public update (): void {
    super.update();
    const { x, y, z } = GameScene.get().getMainCamera().position;
    this.light.position.set(x, y, z);
  }
}
