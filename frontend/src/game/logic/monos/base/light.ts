import { GameScene } from '@/shared/game/game.scene';
import { MonoBehaviour } from '@/shared/game/monobehaviour';
import { DirectionalLight, type Object3D } from 'three';

export class Light extends MonoBehaviour {
  private readonly light: DirectionalLight;

  constructor () {
    super();
    this.light = new DirectionalLight(0xffffff, 1);
    this.light.position.set(5, 10, 10);
    this.light.shadow.mapSize.width = 4096;
    this.light.shadow.mapSize.height = 4096;
    this.light.castShadow = true;
    this.light.shadow.camera.top = 20;
    this.light.shadow.camera.bottom = -20;
    this.light.shadow.camera.right = 20;
    this.light.shadow.camera.left = -20;
  }

  public getObject3D (): Object3D | null {
    return this.light;
  }

  public update (): void {
    super.update();
    const { x, y, z } = GameScene.get().getMainCamera().position;
    this.light.position.set(x + 5, y + 10, z + 10);
  }
}
