import * as THREE from 'three';

export abstract class MonoBehaviour {
  constructor() {}

  public start(): void {}
  public update(): void {}
  public onRemove(): void {}
  public abstract getObject3D(): THREE.Object3D | null;
}
