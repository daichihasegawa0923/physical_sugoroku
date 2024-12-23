import { RigidBodyMonoBehaviour } from '@/game/logic/monos/base/rigid.body.monobehaviour';
import { ConvexPolyhedronHelper } from '@/shared/game/convex.polyhedron.helper';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';

export interface TriPrismProps {
  color: THREE.ColorRepresentation;
  options?: {
    rate?: number;
    position?: CANNON.Vec3;
    quaternion?: CANNON.Quaternion;
    mass?: number;
    material?: CANNON.Material;
  };
}

export class TriPrism extends RigidBodyMonoBehaviour {
  constructor (props: TriPrismProps) {
    super();
    const geometry = TriPrism.createGeometry(1);
    const material = new THREE.MeshStandardMaterial({ color: props.color });
    this.model = new THREE.Mesh(geometry, material);
    this.model.castShadow = true;
    this.model.receiveShadow = true;
    this.body = TriPrism.createRigidBody(props.options);
  }

  private readonly model: THREE.Object3D;
  private readonly body: CANNON.Body;

  public rigidBody (): CANNON.Body {
    return this.body;
  }

  public getObject3D (): THREE.Object3D | null {
    return this.model;
  }

  private static createGeometry (rate: number) {
    // 三角柱の頂点データを作成
    const vertices = new Float32Array([
      // pの三角形
      0, 0, 0,
      // 頂点1
      1, 0, 0,
      // 頂点2
      1, 1, 0,
      // 頂点3

      // 上面の三角形
      0, 0, 1,
      // 頂点4
      1, 0, 1,
      // 頂点5
      1, 1, 1
      // 頂点6
    ]);

    // 三角形の面を定義
    const indices = [
      // p
      0, 1, 2,
      // 上面
      3, 5, 4,
      // 側面1-1
      0, 2, 3,
      // 側面1-2
      3, 2, 5,
      // 側面1
      2, 1, 5,
      // 側面1
      5, 1, 4,
      // 側面1
      1, 0, 4,
      // 側面1
      4, 0, 3
    ];

    // ジオメトリの作成
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(
        vertices.map((v) => v * rate),
        3
      )
    );
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }

  private static createRigidBody (options: TriPrismProps['options']) {
    const helper = new ConvexPolyhedronHelper(
      [
        ['p0', { x: 0, y: 0, z: 0 }],
        ['p1', { x: 1, y: 0, z: 0 }],
        ['p2', { x: 1, y: 1, z: 0 }],
        ['p3', { x: 0, y: 0, z: 1 }],
        ['p4', { x: 1, y: 0, z: 1 }],
        ['p5', { x: 1, y: 1, z: 1 }]
      ],
      [
        // 両底面
        ['p2', 'p1', 'p0'],
        ['p4', 'p5', 'p3'],
        // 側面
        ['p5', 'p2', 'p0', 'p3'],
        ['p5', 'p4', 'p1', 'p2'],
        ['p4', 'p3', 'p0', 'p1']
      ],
      options?.rate ?? 1
    );
    const poly = helper.generate();
    return new CANNON.Body({
      shape: poly,
      position: options?.position,
      mass: options?.mass,
      quaternion: options?.quaternion,
      material: options?.material
    });
  }
}
