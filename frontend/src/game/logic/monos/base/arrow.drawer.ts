import { MonoBehaviour } from '@/shared/game/monobehaviour'
import * as THREE from 'three'

export class ArrowDrawer extends MonoBehaviour {
  constructor (
    private points: { from: THREE.Vector3, to: THREE.Vector3 },
    color: THREE.ColorRepresentation,
    id?: string
  ) {
    super(id)
    const material = new THREE.LineBasicMaterial({ color })
    const geometry = new THREE.BufferGeometry().setFromPoints(
      this.calcPoints()
    )
    const line = new THREE.Line(geometry, material)
    this.model = line
  }

  private readonly model: THREE.Line

  updatePoints (from: THREE.Vector3, to: THREE.Vector3) {
    this.points = { from, to }
  }

  override update (): void {
    super.update()
    this.model.geometry.setFromPoints(this.calcPoints())
  }

  public getObject3D (): THREE.Object3D | null {
    return this.model
  }

  private calcPoints (): THREE.Vector3[] {
    const { from, to } = this.points
    const headLength2 = 0.4
    const headLength1 = 0.2
    const direction = new THREE.Vector3().subVectors(to, from).normalize()
    const arrowBase = new THREE.Vector3()
      .copy(to)
      .addScaledVector(direction, -headLength2)

    const perpVector2 = new THREE.Vector3(0, 1, 0)
      .cross(direction)
      .multiplyScalar(headLength2 / 2)

    const perpVector1 = new THREE.Vector3(0, 1, 0)
      .cross(direction)
      .multiplyScalar(headLength1 / 2)

    const corner1Pre = new THREE.Vector3().addVectors(arrowBase, perpVector1)
    const corner1 = new THREE.Vector3().addVectors(arrowBase, perpVector2)
    const corner2Pre = new THREE.Vector3().subVectors(arrowBase, perpVector1)
    const corner2 = new THREE.Vector3().subVectors(arrowBase, perpVector2)

    return [from, corner1Pre, corner1, to, corner2, corner2Pre, from]
  }
}
