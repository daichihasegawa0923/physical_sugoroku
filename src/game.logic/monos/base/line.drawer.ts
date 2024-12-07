import { MonoBehaviour } from '@/shared/game/monobehaviour'
import * as THREE from 'three'

export class LineDrawer extends MonoBehaviour {
  constructor (
    points: THREE.Vector3[],
    color: THREE.ColorRepresentation,
    id?: string
  ) {
    super(id)
    const material = new THREE.LineBasicMaterial({ color })
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const line = new THREE.Line(geometry, material)
    this.model = line
  }

  private readonly model: THREE.Object3D

  public getObject3D (): THREE.Object3D | null {
    return this.model
  }
}
