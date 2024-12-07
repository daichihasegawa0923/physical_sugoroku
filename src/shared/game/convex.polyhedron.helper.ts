import { GameScene } from '@/shared/game/game.scene'
import { type Vector3 } from '@/shared/game/type'
import * as CANNON from 'cannon-es'
import * as THREE from 'three'

export class ConvexPolyhedronHelper {
  public constructor (
    private readonly vertices: Array<[string, Vector3]>,
    private readonly faces: string[][],
    private readonly rate: number = 1
  ) {}

  private getVertices () {
    return this.vertices
  }

  private getFaces () {
    return this.faces
  }

  public generate (): CANNON.ConvexPolyhedron {
    const verticesParsed = this.getVertices().map((vertices) =>
      ConvexPolyhedronHelper.parseToVec3(vertices, this.rate)
    )
    const names = this.getVertices().map((vertices) =>
      ConvexPolyhedronHelper.parseToNames(vertices)
    )
    const facesParsed = ConvexPolyhedronHelper.parseNameToNum(
      this.getFaces(),
      names
    )
    return new CANNON.ConvexPolyhedron({
      vertices: verticesParsed,
      faces: facesParsed
    })
  }

  public debugPolygon (position?: Vector3) {
    const geometry = new THREE.BufferGeometry()
    // 頂点情報をThree.js形式に変換
    const threeVertices: number[] = []
    this.getVertices()
      .map((vertices) =>
        ConvexPolyhedronHelper.parseToVec3(vertices, this.rate)
      )
      .forEach((vertex) => {
        threeVertices.push(vertex.x, vertex.y, vertex.z)
      })

    // 面情報をThree.js形式に変換
    const indices: number[] = []
    const names = this.getVertices().map((vertices) =>
      ConvexPolyhedronHelper.parseToNames(vertices)
    )
    const facesParsed = ConvexPolyhedronHelper.parseNameToNum(
      this.getFaces(),
      names
    )
    facesParsed.forEach((face) => {
      // ConvexPolyhedronは三角形に限定されていないため、三角形分割する
      for (let i = 1; i < face.length - 1; i++) {
        indices.push(face[0], face[i], face[i + 1])
      }
    })
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(threeVertices, 3)
    )
    geometry.setIndex(indices)
    geometry.computeVertexNormals()
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshNormalMaterial({ wireframe: false })
    )
    GameScene.getScene().add(mesh)
    if (position) {
      mesh.position.set(position.x, position.y, position.z)
    }
    return mesh
  }

  private static parseToVec3 (
    vector3: [string, Vector3],
    rate: number
  ): CANNON.Vec3 {
    const { x, y, z } = vector3[1]
    return new CANNON.Vec3(x * rate, y * rate, z * rate)
  }

  private static parseToNames (vector3: [string, Vector3]): string {
    return vector3[0]
  }

  private static parseNameToNum (origin: string[][], names: string[]) {
    const numbers: number[][] = []
    for (let i = 0; i < origin.length; i++) {
      numbers.push([])
      for (let j = 0; j < origin[i].length; j++) {
        numbers[i].push(names.indexOf(origin[i][j]))
      }
    }
    return numbers
  }
}
