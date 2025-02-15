import * as CANNON from 'cannon-es'
import * as THREE from 'three'

export class CannonWorld {
  private static readonly instance: CannonWorld = new CannonWorld()

  public static get () {
    return this.instance
  }

  public static reset () {
    CannonWorld.get().reset()
  }

  public static getWorld (): CANNON.World {
    return this.get().world
  }

  public static add (body: CANNON.Body) {
    this.get().world.addBody(body)
  }

  public static parse (vec3: CANNON.Vec3): THREE.Vector3 {
    return new THREE.Vector3(vec3.x, vec3.y, vec3.z)
  }

  public static parseFrom (vec3: THREE.Vector3): CANNON.Vec3 {
    return new CANNON.Vec3(vec3.x, vec3.y, vec3.z)
  }

  public static remove (body: CANNON.Body) {
    this.get().world.removeBody(body)
  }

  private static init (): CANNON.World {
    const world = new CANNON.World()
    world.gravity.set(0, -9.82, 0)
    return world
  }

  private reset () {
    this.world = CannonWorld.init()
  }

  private world: CANNON.World = CannonWorld.init()
}
