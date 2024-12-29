import { Piece } from '@/game/logic/monos/player/piece';
import { StageBuilder } from '@/game/logic/monos/stage/stage.builder';
import { GameScene } from '@/shared/game/game.scene';
import type IOnline from '@/shared/game/i.online';
import { MonoBehaviour } from '@/shared/game/monobehaviour';
import { type GameObject } from 'physical-sugoroku-common/src/shared';
import * as CANNON from 'cannon-es';
import type * as THREE from 'three';
import { type StageMap } from '@/game/logic/monos/stage/stage.maptip';
import { type StageClasses } from 'physical-sugoroku-common/src/shared/stage';

export abstract class StageBase extends MonoBehaviour implements IOnline {
  public constructor (id?: string) {
    super(id);
    this.builder = new StageBuilder(
      this.mapInfo(),
      this.getClass() as StageClasses
    ).buildStage();
  }

  syncFromOnline (_gameObject: GameObject): void {}

  public abstract getClass (): string;

  public online (): GameObject {
    return {
      id: this.getId(),
      className: this.getClass(),
      position: { x: 0, y: 0, z: 0 },
      quaternion: { x: 0, y: 0, z: 0, w: 1 },
      size: { x: 1, y: 1, z: 1 }
    };
  }

  protected readonly builder: StageBuilder;

  public update (): void {
    super.update();
    this.rebornPiece();
  }

  private rebornPiece (): void {
    GameScene.findByType(Piece).forEach((p) => {
      const obj = p.getObject3D();
      if (!obj) return;
      if (obj.position.y < -20) {
        const getPosition = () => {
          switch (p.getNumber()) {
            case '1':
              return this.getPiece1Position();
            case '2':
              return this.getPiece2Position();
            case '3':
              return this.getPiece3Position();
            case '4':
              return this.getPiece4Position();
          }
          throw Error();
        };
        const { x, y } = getPosition();
        const position = this.builder
          .getCommon()
          .getPositionFromMapPoint(x, 10, y);
        const quaternion = new CANNON.Quaternion().setFromAxisAngle(
          new CANNON.Vec3(0, 1, 0),
          Math.PI
        );
        p.rigidBody().position.set(position.x, position.y, position.z);
        p.rigidBody().angularVelocity.set(0, 0, 0);
        p.rigidBody().quaternion.set(
          quaternion.x,
          quaternion.y,
          quaternion.z,
          quaternion.w
        );
        p.rigidBody().velocity.set(0, p.rigidBody().velocity.y, 0);
      }
    });
  }

  protected abstract mapInfo (): StageMap;

  protected abstract rate (): number;

  abstract getPiece1Position (): { x: number; y: number };
  abstract getPiece2Position (): { x: number; y: number };
  abstract getPiece3Position (): { x: number; y: number };
  abstract getPiece4Position (): { x: number; y: number };

  abstract getGoalPosition (): { x: number; y: number; height: number };

  public getObject3D (): THREE.Object3D | null {
    return null;
  }
}
