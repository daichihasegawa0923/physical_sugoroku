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
    const geometry = TriPrism.createGeometry(props?.options?.rate ?? 1);
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

  public getObject3D (): THREE.Object3D {
    return this.model;
  }

  private static createGeometry (rate: number) {
    // 三角柱の頂点データを作成
    const vertices = new Float32Array([
      // pの三角形
      -0.5, -0.5, -0.5,
      // 頂点1
      0.5, -0.5, -0.5,
      // 頂点2
      0.5, 0.5, -0.5,
      // 頂点3

      // 上面の三角形
      -0.5, -0.5, 0.5,
      // 頂点4
      0.5, -0.5, 0.5,
      // 頂点5
      0.5, 0.5, 0.5
      // 頂点6
    ]);

    // 三角形の面を定義
    const indices = [
      // p
      2, 1, 0,
      // 上面
      4, 5, 3,
      // 側面1-1
      3, 2, 0,
      // 側面1-2
      5, 2, 3,
      // 側面1
      5, 1, 2,
      // 側面1
      4, 1, 5,
      // 側面1
      4, 0, 1,
      // 側面1
      3, 0, 4
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
        ['p0', { x: -0.5, y: -0.5, z: -0.5 }],
        ['p1', { x: 0.5, y: -0.5, z: -0.5 }],
        ['p2', { x: 0.5, y: 0.5, z: -0.5 }],
        ['p3', { x: -0.5, y: -0.5, z: 0.5 }],
        ['p4', { x: 0.5, y: -0.5, z: 0.5 }],
        ['p5', { x: 0.5, y: 0.5, z: 0.5 }]
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
