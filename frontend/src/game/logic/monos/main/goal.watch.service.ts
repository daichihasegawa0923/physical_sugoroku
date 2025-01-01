import { Goal } from '@/game/logic/monos/stage/goal';
import { GameScene } from '@/shared/game/game.scene';
import * as THREE from 'three';

export class GoalWatchService {
  public constructor (
    private readonly endCallBack: VoidFunction,
    private readonly camera = GameScene.get().getMainCamera()
  ) {
    this.originalCameraPosition = new THREE.Vector3(0, 0, 0);
    this.originalCameraPosition.copy(this.camera.position);
  }

  private readonly originalCameraPosition: THREE.Vector3;

  private isClosing: boolean = true;

  public closeToOsho () {
    if (this.originalCameraPosition == null) return;
    const goal = GameScene.findByType(Goal);
    if (goal.length !== 1) return;
    const goalPosition = goal[0].getObject3D()?.position;
    if (goalPosition == null) return;
    const { x, z } = goalPosition;
    const { x: cameraX, y: cameraY, z: cameraZ } = this.camera.position;
    const diffX = this.isClosing
      ? x - cameraX
      : this.originalCameraPosition.x - cameraX;
    const diffZ = this.isClosing
      ? z - cameraZ
      : this.originalCameraPosition.z - cameraZ;
    const dx = diffX / 10;
    const dz = diffZ / 10;
    this.camera.position.set(cameraX + dx, cameraY, cameraZ + dz);
    if (Math.abs(diffX) + Math.abs(diffZ) < 1) {
      if (this.isClosing) {
        setInterval(() => {
          this.isClosing = false;
        }, 1000);
      } else {
        this.endCallBack();
        this.isClosing = true;
      }
    }
  }
}
