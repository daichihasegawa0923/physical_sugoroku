import { RigidBodyMonoBehaviour } from '@/game.logic/monos/base/rigid.body.monobehaviour'
import type * as THREE from 'three'
import { MainLogic } from '@/game.logic/monos/main.logic'
import { type Piece } from '@/game.logic/monos/player/piece'
import { ShougiPieceRigidBodyMesh } from '@/game.logic/monos/player/shougi.piece'
import { GameScene } from '@/shared/game/game.scene'
import * as CANNON from 'cannon-es'
import { type Vector3 } from '@/shared/game/type'

export class Goal extends RigidBodyMonoBehaviour {
  public constructor () {
    super()
    const shougi = new ShougiPieceRigidBodyMesh('/piece_king.gltf', 1.5)

    this.rb = new CANNON.Body({
      shape: shougi.getConvex(),
      mass: 1
    })

    shougi.onLoad((data) => {
      this.model = data.scene
      data.scene.scale.set(1.5, 1.5, 1.5)
      GameScene.addModel(this.model)
    })
  }

  private model: THREE.Object3D | null = null

  public getObject3D (): THREE.Object3D | null {
    return this.model
  }

  private readonly rb: CANNON.Body

  public rigidBody (): CANNON.Body {
    return this.rb
  }

  start (): void {
    super.start()
    this.rigidBody().addEventListener(
      'collide',
      ({ body }: { body: CANNON.Body }) => {
        const target = GameScene.allRigidBodies().find(
          (rig) => rig.rigidBody() === body
        )
        const piece = target as Piece
        if (piece == null) {
          return
        }
        const mainLogic = GameScene.findByType(MainLogic)[0]
        if (mainLogic.getStatus() === 'RESULT') {
          return
        }
        if (typeof piece.getMemberId === 'function') {
          mainLogic.goal(piece.getMemberId())
        }
      }
    )
  }

  public setPosition (position: Vector3) {
    const { x, y, z } = position
    this.rigidBody().position.set(x, y, z)
    this.rigidBody().velocity.set(0, 0, 0)
    this.rigidBody().quaternion.set(1, 0, 0, 1)
  }

  override update (): void {
    super.update()
    if (this.rigidBody().position.y < -10) {
      this.rigidBody().mass = 0
      this.rigidBody().velocity.set(0, 0, 0)
    }
  }

  override isSingleton (): boolean {
    return true
  }
}
