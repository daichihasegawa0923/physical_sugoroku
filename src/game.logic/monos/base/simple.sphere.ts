import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { RigidBodyMonoBehaviour } from './rigid.body.monobehaviour'

interface Props {
  color: THREE.ColorRepresentation
  radius: number
  position?: CANNON.Vec3
  material?: CANNON.Material
  mass?: number
}

export class SimpleSphere extends RigidBodyMonoBehaviour {
  private readonly rb: CANNON.Body

  public rigidBody (): CANNON.Body {
    return this.rb
  }

  constructor ({ color, radius, position, material, mass }: Props) {
    super()
    this.rb = new CANNON.Body({
      mass: mass ?? 0,
      shape: new CANNON.Sphere(radius / 2),
      position: position ?? CANNON.Vec3.ZERO,
      material: material ?? new CANNON.Material({})
    })
    const geometry = new THREE.SphereGeometry(radius)
    const viewMaterial = new THREE.MeshBasicMaterial({ color })
    this.sphere = new THREE.Mesh(geometry, viewMaterial)
  }

  private readonly sphere: THREE.Object3D

  public getObject3D (): THREE.Object3D {
    return this.sphere
  }
}
