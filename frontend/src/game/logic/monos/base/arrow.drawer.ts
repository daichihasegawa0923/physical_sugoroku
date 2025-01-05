import { MonoBehaviour } from '@/shared/game/monobehaviour';
import * as THREE from 'three';

export class ArrowDrawer extends MonoBehaviour {
  constructor (points: { from: THREE.Vector3; to: THREE.Vector3 }, id?: string) {
    super(id);
    this.model = ArrowDrawer.createArrow(points.from, points.to);
  }

  private readonly model: THREE.Object3D;

  override update (): void {
    super.update();
  }

  public getObject3D (): THREE.Object3D | null {
    return this.model;
  }

  private static createArrow (from: THREE.Vector3, to: THREE.Vector3) {
    const width = 0.2; // 矢印の幅
    const headHeight = 0.6; // 矢じり部分の高さ

    // 矢印の長さを計算
    const direction = new THREE.Vector3().subVectors(to, from);
    const length = direction.length();

    // カスタムジオメトリの作成
    const geometry = ArrowDrawer.createArrowGeometry(width, length, headHeight);

    // 色を長さに基づいて変える
    const material = new THREE.MeshStandardMaterial({
      color: ArrowDrawer.getColor(length)
    });

    const arrow = new THREE.Mesh(geometry, material);

    // 矢印の向きを調整
    arrow.position.copy(from);
    arrow.lookAt(to);

    return arrow;
  }

  private static getColor (length: number): THREE.ColorRepresentation {
    const rate = length / 3;
    if (rate < 0.25) return 0x0000ff;
    if (rate < 0.5) return 0x00dddd;
    if (rate < 0.75) return 0x00ff00;
    return 0xff0000;
  }

  private static createArrowGeometry (
    width: number,
    height: number,
    headHeight: number
  ) {
    const shape = new THREE.Shape();

    // ベース部分
    shape.moveTo(-width / 2, 0);
    shape.lineTo(width / 2, 0);

    // 矢じり部分
    shape.lineTo((width * 2) / 2, height - headHeight);
    shape.lineTo(width * 2, height - headHeight);
    shape.lineTo(0, height);
    shape.lineTo(-width * 2, height - headHeight);
    shape.lineTo((-width * 2) / 2, height - headHeight);

    shape.lineTo(-width / 2, 0);

    // 押し出しで厚みを追加
    const extrudeSettings = { depth: 0.1, bevelEnabled: false };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // 押し出し方向を Z 軸に合わせるために回転
    geometry.rotateX(Math.PI / 2);

    return geometry;
  }
}
