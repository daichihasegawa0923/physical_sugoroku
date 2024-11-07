import { MonoBehaviour } from '@/shared/game/monobehaviour';
import { Object3D } from 'three';
import { Piece } from './piece';
import { GameScene } from '@/shared/game/game.scene';

export class MainLogic extends MonoBehaviour {
  public getObject3D(): Object3D | null {
    return null;
  }

  private p1: Piece = new Piece(0xff0000);
  private p2: Piece = new Piece(0x000ff0);

  override start(): void {
    GameScene.get()?.add(this.p1);
    GameScene.get()?.add(this.p2);
  }

  override update(): void {
    const gameScene = GameScene.get();
    if (!gameScene) return;

    const mainCamera = gameScene.getMainCamera();
    this.p1.getObject3D().position.x += 0.01;
    this.p1.getObject3D().position.y += 0.01;
    this.p2.getObject3D().position.y += 0.01;
    mainCamera.lookAt(this.p2.getObject3D().position);
  }
}
