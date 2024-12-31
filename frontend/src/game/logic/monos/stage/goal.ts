import type * as THREE from 'three';
import { MainLogic } from '@/game/logic/monos/main/main.logic';
import { Piece } from '@/game/logic/monos/player/piece';
import {
  type ModelPath,
  ShougiPieceRigidBodyMesh
} from '@/game/logic/monos/player/shougi.piece';
import { GameScene } from '@/shared/game/game.scene';
import * as CANNON from 'cannon-es';
import {
  type GameObject,
  type Vector3
} from 'physical-sugoroku-common/src/shared';
import { RigidBodyOnlineMonoBehaviour } from '@/game/logic/monos/base/rigid.body.monobehaviour.onine.ts';
import { WebsocketResolver } from '@/shared/function/websocket.resolver';

export class Goal extends RigidBodyOnlineMonoBehaviour {
  public constructor (id?: string) {
    super(id);
    const shougi = new ShougiPieceRigidBodyMesh(
      '/resources/piece_king.gltf',
      1.5
    );

    this.rb = new CANNON.Body({
      shape: shougi.getConvex(),
      mass: 1
    });

    shougi.onLoad((data) => {
      this.model = data.scene;
      data.scene.scale.set(1.5, 1.5, 1.5);
      GameScene.addModel(this.model);
    });
  }

  getClass (): string {
    return 'Goal';
  }

  private model: THREE.Object3D | null = null;

  public getObject3D (): THREE.Object3D | null {
    return this.model;
  }

  private readonly rb: CANNON.Body;

  public rigidBody (): CANNON.Body {
    return this.rb;
  }

  private lastTouchMemberId: string | null = null;

  public setLastTouchMemberId (memberId: string | null) {
    this.lastTouchMemberId = memberId;
    this.changeModelByLastTouchMemberId();
  }

  private firstPosition: Vector3 = { x: 0, y: 0, z: 0 };

  start (): void {
    super.start();
    this.addCollisionEventListenerWithRigidBodyMonobehaviour((target) => {
      if (!MainLogic.get()?.isMyTurn()) return;
      const roomId = MainLogic.get()?.getRoomId();
      if (!roomId) return;
      if (
        !(target instanceof Piece) ||
        target.getMemberId() === this.lastTouchMemberId
      ) {
        return;
      }
      WebsocketResolver.send('updateLastTouchMemberId', {
        roomId,
        lastTouchMemberId: target.getMemberId()
      });
    });
  }

  public setFirstPosition (position: Vector3) {
    const mainLogic = MainLogic.get();
    if (!mainLogic) return;
    this.firstPosition = position;
    WebsocketResolver.send('updateGameObjects', {
      roomId: mainLogic.getRoomId(),
      gameObjects: [this.online()]
    });
  }

  public setPosition (position: Vector3) {
    const { x, y, z } = position;
    this.rigidBody().position.set(x, y, z);
    this.rigidBody().velocity.set(0, 0, 0);
    this.rigidBody().quaternion.set(1, 0, 0, 1);
  }

  override update (): void {
    // 無限に落ちるのを防止する
    if (this.rigidBody().position.y < -100) {
      return;
    }
    super.update();
    this.judgeEnd();
  }

  // 終了判定
  private judgeEnd (): void {
    if (this.rigidBody().position.y > -10) {
      return;
    }
    if (!this.lastTouchMemberId) {
      const { x, y, z } = this.firstPosition;
      this.rigidBody().position.set(x, y, z);
      return;
    }
    const mainLogic = MainLogic.get();
    if (mainLogic && mainLogic.getStatus() !== 'RESULT') {
      mainLogic.updateStats('RESULT');
      WebsocketResolver.send('goal', {
        roomId: mainLogic.getRoomId(),
        gameObjects: GameScene.allOnline()
      });
    }
  }

  override syncFromOnline (gameObject: GameObject): void {
    super.syncFromOnline(gameObject);
    if (!gameObject.other) throw Error();
    this.setLastTouchMemberId(
      gameObject.other.lastTouchMemberId == null
        ? null
        : (gameObject.other.lastTouchMemberId as string)
    );
    const firstPosition = JSON.parse(
      gameObject.other.firstPosition as string
    ) as Vector3;
    if (!firstPosition) throw Error();
    this.firstPosition = firstPosition;
  }

  override online (): GameObject {
    const go = super.online();
    return {
      ...go,
      other: {
        lastTouchMemberId: this.lastTouchMemberId,
        firstPosition: JSON.stringify(this.firstPosition)
      }
    };
  }

  changeModelByLastTouchMemberId () {
    const number = GameScene.findByType(Piece)
      .find((p) => p.getMemberId() === this.lastTouchMemberId)
      ?.getNumber();
    if (!number) return;
    const modelPath = this.getModelByNumber(number);
    if (this.model) {
      GameScene.removeModel(this.model);
    }
    const shougi = new ShougiPieceRigidBodyMesh(modelPath, 1.5);
    shougi.onLoad((data) => {
      this.model = data.scene;
      data.scene.scale.set(1.5, 1.5, 1.5);
      GameScene.addModel(this.model);
    });
  }

  private getModelByNumber (
    number: string
  ): Extract<
    ModelPath,
    | '/resources/piece_king.gltf'
    | '/resources/piece_king_red.gltf'
    | '/resources/piece_king_blue.gltf'
    | '/resources/piece_king_green.gltf'
    | '/resources/piece_king_purple.gltf'
    > {
    switch (number) {
      case '1':
        return '/resources/piece_king_red.gltf';
      case '2':
        return '/resources/piece_king_blue.gltf';
      case '3':
        return '/resources/piece_king_green.gltf';
      case '4':
        return '/resources/piece_king_purple.gltf';
    }
    return '/resources/piece_king.gltf';
  }
}
