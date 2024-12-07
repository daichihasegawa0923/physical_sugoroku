import { ConvexPolyhedronHelper } from '@/shared/game/convex.polyhedron.helper'
import { type Vector3 } from '@/shared/game/type'
import {
  type GLTF,
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js'

export type ModelPath =
  | '/piece_red.gltf'
  | '/piece_blue.gltf'
  | '/piece_green.gltf'
  | '/piece_purple.gltf'
  | '/piece_king.gltf'

export class ShougiPieceRigidBodyMesh {
  constructor (
    private readonly modelPath: ModelPath,
    private readonly rate: number = 1
  ) {}

  private readonly modelLoader: GLTFLoader = new GLTFLoader()
  private readonly convexHelper = this.getConvexHelper()

  public onLoad (handler: (data: GLTF) => void) {
    this.modelLoader.load(this.modelPath, (d: GLTF) => {
      d.scene.traverse((obj) => {
        obj.castShadow = true
        obj.receiveShadow = true
      })
      handler(d)
    })
  }

  public getConvex () {
    return this.convexHelper.generate()
  }

  public debugConvex (position?: Vector3) {
    return this.convexHelper.debugPolygon(position)
  }

  private getConvexHelper () {
    const vertices: Array<[string, Vector3]> = [
      ['top', { x: 0, y: 0, z: -0.7 }], // 頂点 0
      ['left_up_pos', { x: -0.32, y: 0.1, z: -0.3 }], // 左上（表）
      ['right_up_pos', { x: 0.32, y: 0.1, z: -0.3 }], // 右上（表）
      ['left_up_neg', { x: -0.32, y: -0.1, z: -0.3 }], // 左下（裏）
      ['right_up_neg', { x: 0.32, y: -0.1, z: -0.3 }], // 右下（裏）
      ['left_pos', { x: -0.35, y: 0.125, z: 0.3 }], // 左下（表）
      ['right_pos', { x: 0.35, y: 0.125, z: 0.3 }], // 右下（表）
      ['left_neg', { x: -0.35, y: -0.125, z: 0.3 }], // 左下（裏）
      ['right_neg', { x: 0.35, y: -0.125, z: 0.3 }] // 右下（裏）
    ]
    const faces = [
      ['top', 'left_up_pos', 'right_up_pos'],
      ['top', 'right_up_neg', 'left_up_neg'],
      ['top', 'left_up_neg', 'left_up_pos'],
      ['top', 'right_up_pos', 'right_up_neg'],
      ['left_pos', 'right_pos', 'right_up_pos', 'left_up_pos'],
      ['left_up_neg', 'right_up_neg', 'right_neg', 'left_neg'],
      ['left_up_pos', 'left_up_neg', 'left_neg', 'left_pos'],
      ['right_pos', 'right_neg', 'right_up_neg', 'right_up_pos'],
      ['left_pos', 'left_neg', 'right_neg', 'right_pos']
    ]
    return new ConvexPolyhedronHelper(vertices, faces, this.rate)
  }
}
