import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { RigidBodyMonoBehaviour } from './rigid.body.monobehaviour'

interface Props {
  color: THREE.ColorRepresentation
  size: CANNON.Vec3
  position?: CANNON.Vec3
  material?: CANNON.Material
  mass?: number
  id?: string
}

export class SimpleBox extends RigidBodyMonoBehaviour {
  private readonly rb: CANNON.Body

  public rigidBody (): CANNON.Body {
    return this.rb
  }

  constructor ({ color, size, position, material, mass, id }: Props) {
    super(id)
    this.rb = new CANNON.Body({
      mass: mass ?? 0,
      shape: new CANNON.Box(
        new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)
      ),
      position: position ?? CANNON.Vec3.ZERO,
      material: material ?? new CANNON.Material({})
    })
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z)
    const viewMaterial = new THREE.MeshBasicMaterial({ color })
    this.cube = new THREE.Mesh(geometry, viewMaterial)
    this.cube.receiveShadow = true
    this.cube.castShadow = true
  }

  private readonly cube: THREE.Object3D

  public getObject3D (): THREE.Object3D {
    return this.cube
  }
}
