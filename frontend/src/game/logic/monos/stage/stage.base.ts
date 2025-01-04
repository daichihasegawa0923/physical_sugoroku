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
import { MainLogic } from '@/game/logic/monos/main/main.logic';
import { WebsocketResolver } from '@/shared/function/websocket.resolver';

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
    if (!MainLogic.get()?.isMyTurn()) return;
    GameScene.findByType(Piece).forEach((p) => {
      const obj = p.getObject3D();
      if (!obj) return;
      if (obj.position.y < -20) {
        const position = this.builder
          .getCommon()
          .getPiecePosition(p.getNumber());
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
        p.rigidBody().velocity.set(0, p.rigidBody().velocity.y * 0.1, 0);
        const roomId = MainLogic.get()?.getRoomId();
        if (!roomId) throw Error();
        p.damage();
        WebsocketResolver.send('updateGameObject', {
          roomId,
          gameObject: p.online()
        });
      }
    });
  }

  protected abstract mapInfo (): StageMap;

  public getObject3D (): THREE.Object3D | null {
    return null;
  }
}
