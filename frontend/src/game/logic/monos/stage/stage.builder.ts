import { SimpleBox } from '@/game/logic/monos/base/simple.box';
import { Goal } from '@/game/logic/monos/stage/goal';
import { StageBuilderHelper } from '@/game/logic/monos/stage/stage.builder.helper';
import { GameScene } from '@/shared/game/game.scene';
import { type MonoBehaviour } from '@/shared/game/monobehaviour';
import * as CANNON from 'cannon-es';
import {
  type Vector3
} from 'physical-sugoroku-common/src/shared';
import * as THREE from 'three';

export class StageBuilder {
  public getPositionFromMapPoint (
    x: number,
    y: number,
    height: number
  ): Vector3 {
    return {
      x: x * this.getRate() + this.getRate() / 2,
      y: height,
      z: y * this.getRate() + this.getRate() / 2
    };
  }

  private readonly boxes: MonoBehaviour[] = [];

  private rate: number = 1;

  protected getRate (): number {
    return this.rate;
  }

  public buildStage (mapInfo: number[][], rate: number) {
    const helper = new StageBuilderHelper();
    const createInfo = helper.create(mapInfo, rate);
    const boxes = createInfo.map((c) => {
      return StageBuilder.createFloor(c.size, c.position);
    });
    boxes.forEach((box) => {
      GameScene.add(box);
    });
    this.rate = rate;
    return this;
  }

  public buildGoal (x: number, y: number, height: number) {
    const goal = new Goal();
    goal.setPosition(this.getPositionFromMapPoint(x, y, height));
    GameScene.add(goal);
    return this;
  }

  protected static createFloor (size: Vector3, position: Vector3) {
    return this.createSimpleBoxFloor(
      new CANNON.Vec3(size.x, size.y, size.z),
      new CANNON.Vec3(position.x, position.y, position.z)
    );
  }

  private static readonly loader: THREE.TextureLoader =
    new THREE.TextureLoader();

  private static createSimpleBoxFloor (
    size: CANNON.Vec3,
    position: CANNON.Vec3
  ) {
    const texture = this.loader.load('/resources/textures/masu.png');
    texture.colorSpace = THREE.SRGBColorSpace;
    const box = new SimpleBox({
      color: 0xe6cd8a,
      size,
      position: this.getPivotPosition(size, position),
      material: new CANNON.Material({
        friction: 0.1
      })
    });
    const mesh = box.getObject3D() as THREE.Mesh;
    mesh.material = new THREE.MeshStandardMaterial({ map: texture });
    return box;
  }

  private static getPivotPosition (size: CANNON.Vec3, position: CANNON.Vec3) {
    const { x, y, z } = size;
    return new CANNON.Vec3(
      position.x + x / 2,
      position.y + y / 2,
      position.z + z / 2
    );
  }
}
