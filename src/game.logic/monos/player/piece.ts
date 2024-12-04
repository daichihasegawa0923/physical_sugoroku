import { RigidBodyOnlineMonoBehaviour } from '@/game.logic/monos/base/rigid.body.monobehaviour.onine.ts'
import { GameScene } from '@/shared/game/game.scene'
import { type GameObject, type Vector3 } from '@/shared/game/type'
import * as CANNON from 'cannon-es'
import type * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export interface PieceGenerateProps {
  number: string
  position: Vector3
  memberId: string
  id?: string
}

export class Piece extends RigidBodyOnlineMonoBehaviour {
  public constructor ({ number, position, id, memberId }: PieceGenerateProps) {
    super(id)
    this.rb = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.25, 0.75)),
      position: new CANNON.Vec3(position.x, position.y, position.z),
      material: new CANNON.Material({})
    })
    this.memberId = memberId
    this.number = number
    this.modelLoader.load(this.getModelPath(number), (data) => {
      this.model = data.scene
      GameScene.getScene().add(this.model)
    })
  }

  private getModelPath (number: string) {
    switch (number) {
      case '1':
        return '/piece_keima.gltf'
      case '2':
        return '/piece_fu.gltf'
      case '3':
        return '/piece_kakugyo.gltf'
      case '4':
        return '/piece_hisha.gltf'
    }
    return ''
  }

  public rigidBody (): CANNON.Body {
    return this.rb
  }

  public getObject3D (): THREE.Object3D | null {
    return this.model
  }

  private readonly rb: CANNON.Body

  private model: THREE.Object3D | null = null

  private readonly modelLoader: GLTFLoader = new GLTFLoader()

  private memberId: string
  private readonly number: string

  public getNumber () {
    return this.number
  }

  public getMemberId () {
    return this.memberId
  }

  override start (): void {
    super.start()
  }

  override update (): void {
    super.update()
  }

  override syncFromOnline (gameObject: GameObject): void {
    super.syncFromOnline(gameObject)
    if (!gameObject.other) throw Error()
    if (!gameObject.other.memberId) throw Error()

    this.memberId = gameObject.other.memberId as string
  }

  public override online (): GameObject {
    const go = super.online()
    if (!go) throw Error()
    return {
      ...go,
      other: {
        memberId: this.memberId,
        number: this.number
      }
    }
  }
}
