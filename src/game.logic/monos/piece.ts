import * as THREE from 'three';

import { MonoBehaviour } from '@/shared/game/monobehaviour';
import { Object3D } from 'three';
import { GameScene } from '@/shared/game/game.scene';

export class Piece extends MonoBehaviour {
  constructor(color: THREE.ColorRepresentation) {
    super();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color });
    this.cube = new THREE.Mesh(geometry, material);
  }

  private readonly cube: THREE.Object3D;

  public getObject3D(): Object3D {
    return this.cube;
  }
}
