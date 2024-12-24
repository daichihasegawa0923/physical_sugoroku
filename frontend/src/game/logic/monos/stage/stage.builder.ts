import { SimpleBox } from '@/game/logic/monos/base/simple.box';
import { TriPrism } from '@/game/logic/monos/base/tri.prism';
import { Goal } from '@/game/logic/monos/stage/goal';
import {
  type StageMap,
  type StageMapTip,
  type StageMapTipBasicType
} from '@/game/logic/monos/stage/stage.maptip';
import { GameScene } from '@/shared/game/game.scene';
import { type MonoBehaviour } from '@/shared/game/monobehaviour';
import { paintTexture } from '@/shared/game/texture.painter';
import * as CANNON from 'cannon-es';
import { type Vector3 } from 'physical-sugoroku-common/src/shared';
import * as THREE from 'three';

export class StageBuilder {
  public constructor (
    private readonly mapInfo: StageMap,
    private readonly rate: number
  ) {}

  public buildStage () {
    const data = this.mapInfo
      .map((array, y) => array.map((info, x) => ({ x, y, info })))
      .flat();
    const boxes = data.map((c) => {
      if (c.info == null) return null;
      return this.createFloor(c.info, c.x, c.y);
    });
    boxes.forEach((box) => {
      if (box != null) GameScene.add(box);
    });
    return this;
  }

  public buildGoal (x: number, y: number, height: number) {
    const goal = new Goal();
    goal.setPosition(this.getPositionFromMapPoint(x, height, y));
    GameScene.add(goal);
    return this;
  }

  public getPositionFromMapPoint (x: number, y: number, z: number): Vector3 {
    return {
      x: x * this.rate + this.rate / 2,
      y: y * this.rate + this.rate / 2,
      z: z * this.rate + this.rate / 2
    };
  }

  protected createFloor (
    info: StageMapTipBasicType,
    x: number,
    y: number
  ): MonoBehaviour {
    switch (info.name) {
      case 'box':
        return this.createSimpleBoxFloor(info, x, y);
      case 'slope':
        return this.createSimpleSlope(info, x, y);
    }
  }

  private static readonly loader: THREE.TextureLoader =
    new THREE.TextureLoader();

  private createSimpleBoxFloor (info: StageMapTip<'box'>, x: number, y: number) {
    const box = new SimpleBox({
      color: 0xffffff,
      size: new CANNON.Vec3(this.rate, this.rate, this.rate),
      position: this.getPivotPosition(x, info.height, y),
      material: new CANNON.Material({
        friction: 0.1
      })
    });
    paintTexture('/resources/textures/masu.png', box.getObject3D());
    return box;
  }

  private createSimpleSlope (info: StageMapTip<'slope'>, x: number, y: number) {
    const getPi = () => {
      switch (info.direction) {
        case 'l':
          return 0;
        case 'f':
          return Math.PI * 1.5;
        case 'r':
          return Math.PI;
        case 'b':
          return Math.PI / 2;
      }
    };
    const quaternion = new CANNON.Quaternion().setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      getPi()
    );

    const slope = new TriPrism({
      color: 0xffffff,
      options: {
        rate: this.rate,
        position: this.getPivotPosition(x, info.height, y),
        quaternion,
        material: new CANNON.Material({
          friction: 0.1
        })
      }
    });
    paintTexture('/resources/textures/masu.png', slope.getObject3D());
    return slope;
  }

  private getPivotPosition (x: number, y: number, z: number) {
    const position = this.getPositionFromMapPoint(x, y, z);
    return new CANNON.Vec3(position.x, position.y, position.z);
  }
}
