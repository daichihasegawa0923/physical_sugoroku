import { RigidBodyOnlineMonoBehaviour } from '@/game/logic/monos/base/rigid.body.monobehaviour.online.ts';
import { ShougiPieceRigidBodyMesh } from '@/game/logic/monos/player/shougi.piece';
import { GameScene } from '@/shared/game/game.scene';
import * as CANNON from 'cannon-es';
import {
  type GameObject,
  type Vector3
} from 'physical-sugoroku-common/src/shared';
import type * as THREE from 'three';

export interface PieceGenerateProps {
  number: string;
  position: Vector3;
  memberId: string;
  life: number;
  id?: string;
}

export class Piece extends RigidBodyOnlineMonoBehaviour {
  getClass (): string {
    return 'Piece';
  }

  public constructor ({
    number,
    position,
    id,
    memberId,
    life
  }: PieceGenerateProps) {
    super(id);
    const shougiPiece = new ShougiPieceRigidBodyMesh(this.getModelPath(number));
    this.rb = new CANNON.Body({
      mass: 1,
      shape: shougiPiece.getConvex(),
      position: new CANNON.Vec3(position.x, position.y, position.z),
      material: new CANNON.Material({
        friction: 0.1
      })
    });
    this.memberId = memberId;
    this.number = number;
    shougiPiece.onLoad((data) => {
      this.model = data.scene;
      GameScene.addModel(this.model);
    });
    this.life = life;
  }

  private getModelPath (number: string) {
    switch (number) {
      case '1':
        return '/resources/piece_red.gltf';
      case '2':
        return '/resources/piece_blue.gltf';
      case '3':
        return '/resources/piece_green.gltf';
      case '4':
        return '/resources/piece_purple.gltf';
      default:
        throw Error();
    }
  }

  public rigidBody (): CANNON.Body {
    return this.rb;
  }

  public getObject3D (): THREE.Object3D | null {
    return this.model;
  }

  private readonly rb: CANNON.Body;

  private model: THREE.Object3D | null = null;

  private memberId: string;
  private readonly number: string;
  private life: number;

  public getNumber () {
    return this.number;
  }

  public getMemberId () {
    return this.memberId;
  }

  public damage () {
    if (this.life > 0) this.life -= 1;
  }

  override start (): void {
    super.start();
  }

  override update (): void {
    super.update();
  }

  override syncFromOnline (gameObject: GameObject): void {
    super.syncFromOnline(gameObject);
    if (!gameObject.other) throw Error();
    if (!gameObject.other.memberId) throw Error();
    if (gameObject.other.life == null) throw Error();

    this.memberId = gameObject.other.memberId as string;
    this.life = gameObject.other.life as number;
  }

  public override online (): GameObject {
    const go = super.online();
    if (!go) throw Error();
    return {
      ...go,
      other: {
        memberId: this.memberId,
        number: this.number,
        life: this.life
      }
    };
  }
}
