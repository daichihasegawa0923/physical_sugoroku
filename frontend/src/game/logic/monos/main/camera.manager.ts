import { findMyPiece } from '@/game/logic/monos/main/functions';
import { MainLogic } from '@/game/logic/monos/main/main.logic';
import { Piece } from '@/game/logic/monos/player/piece';
import { GameScene } from '@/shared/game/game.scene';
import type * as THREE from 'three';

const HEIGHT = 14;

export class CameraManager {
  public constructor (
    private readonly myMemberId: string,
    private readonly camera = GameScene.get().getMainCamera()
  ) {}

  public setCameraPosition () {
    const targetPosition = this.getTargetPosition();
    if (!targetPosition) {
      this.camera.position.set(0, HEIGHT, 0);
      this.camera.rotation.set(90, this.camera.rotation.y + 0.01, 0);
      return;
    }
    const { x, y, z } = targetPosition;
    this.camera.position.set(x, y + HEIGHT, z - 0.5);
    this.camera.lookAt(targetPosition);
  }

  private getTargetPosition (): THREE.Vector3 | undefined {
    if (MainLogic.get()?.isMyTurn()) {
      return findMyPiece(this.myMemberId)?.getObject3D()?.position;
    }
    const activeMemberId = MainLogic.get()?.getActiveMemberId();
    if (!activeMemberId) return;
    return GameScene.findByType(Piece)
      .find((p) => p.getMemberId() === activeMemberId)
      ?.getObject3D()?.position;
  }
}
