import { MonoBehaviour } from '@/shared/game/monobehaviour';
import { type Object3D } from 'three';
import { GameScene } from '@/shared/game/game.scene';
import { Light } from '@/game/logic/monos/base/light';
import { LightHemisphere } from '@/game/logic/monos/base/light.hemisphere';
import { CameraManager } from '@/game/logic/monos/main/camera.manager';
import { SmashManager } from '@/game/logic/monos/main/smash.manager';
import { findMyPiece } from '@/game/logic/monos/main/functions';
import { TurnEndManager } from '@/game/logic/monos/main/turn.end.manager';
import { GameObjectResolver } from '@/game/logic/monos/main/game.object.resolver';
import {
  type Vector3,
  type GameStatus,
  type GameObject
} from 'physical-sugoroku-common/src/shared';
import { WebsocketResolver } from '@/shared/function/websocket.resolver';
import { Goal } from '@/game/logic/monos/stage/goal';

export class MainLogic extends MonoBehaviour {
  public constructor (
    private readonly roomId: string,
    private readonly memberId: string,
    private status: GameStatus,
    private activeMemberId: string | null,
    private readonly cameraManager = new CameraManager(memberId),
    private readonly smashManager = new SmashManager(memberId),
    private readonly turnEndManager = new TurnEndManager(),
    private readonly gameObjectResolver = new GameObjectResolver()
  ) {
    super();
    this.initWebsocketAddList();
    this.roomId = roomId;
    this.memberId = memberId;
    this.gameObjectResolver.registerPrefabs();
    this.status = status;
    GameScene.setBackgroundColor(0x006644, 1.0);
  }

  public static get () {
    const instances = GameScene.findByType(MainLogic);
    if (instances.length === 0) return null;
    return instances[0];
  }

  public getStatus () {
    return this.status;
  }

  public updateStats (status: GameStatus, activeMemberId?: string | null) {
    this.status = status;
    if (activeMemberId !== undefined) {
      this.activeMemberId = activeMemberId;
    }
  }

  public getRoomId () {
    return this.roomId;
  }

  public getObject3D (): Object3D | null {
    return null;
  }

  public isMyTurn () {
    return this.memberId === this.activeMemberId;
  }

  override start (): void {
    this.init();
  }

  override update (): void {
    this.cameraManager.setCameraPosition(
      this.isMyTurn(),
      this.activeMemberId,
      this.status
    );
    this.executeTurnEnd();
    this.smashManager.drawSmashDirection(this.status, this.isMyTurn());
  }

  public smashById (id: string, direction: Vector3) {
    this.smashManager.smashById(id, direction);
  }

  public smash (): void {
    if (!this.isMyTurn() || this.getStatus() !== 'DIRECTION') return;
    const myObjId = findMyPiece(this.memberId)?.getId();
    if (myObjId == null) return;
    const result = this.smashManager.smash(this.memberId, (direction) => {
      WebsocketResolver.send('impulse', {
        id: myObjId,
        direction,
        roomId: this.roomId
      });
    });
    if (result) {
      this.status = 'MOVING';
    }
  }

  public changeAngle (horizontal: number) {
    this.cameraManager.changeAngle(horizontal);
  }

  public updateSmashDirection (x: number, y: number) {
    if (this.status === 'DIRECTION' && this.isMyTurn()) {
      this.smashManager.updateDirectionPower(x, y);
    }
  }

  private executeTurnEnd (): void {
    if (!this.isMyTurn() || this.getStatus() !== 'MOVING') return;
    if (this.turnEndManager.isMoveSomePieces()) return;

    this.status = 'WAITING';
    setTimeout(() => {
      if (this.status === 'RESULT') return;

      if (this.turnEndManager.isMoveSomePieces()) {
        this.status = 'MOVING';
        return;
      }
      WebsocketResolver.send('turnEnd', {
        roomId: this.roomId,
        gameObjects: GameScene.allOnline()
      });
      // 遅延させる
    }, 1500);
  }

  public syncAll (gameObjects: GameObject[]) {
    this.gameObjectResolver.syncAll(gameObjects);
  }

  private readonly light = new Light();
  private readonly lightHemisphere = new LightHemisphere();

  private init () {
    GameScene.add(this.light);
    GameScene.add(this.lightHemisphere);
  }

  private initWebsocketAddList () {
    WebsocketResolver.add('fetchGameObjects', {
      id: 'game',
      func: (data) => {
        this.gameObjectResolver.syncAll(data.objects);
      }
    });

    WebsocketResolver.add('impulse', {
      id: 'game',
      func: (data) => {
        this.smashById(data.id, data.direction);
        this.updateStats(data.status, data.activeMemberId);
      }
    });
    WebsocketResolver.add('turnEnd', {
      id: 'game',
      func: (data) => {
        this.syncAll(data.objects);
        this.updateStats(data.status, data.activeMemberId);
      }
    });
    WebsocketResolver.add('goal', {
      id: 'game',
      func: (data) => {
        this.syncAll(data.objects);
        this.updateStats(data.status, data.goalMemberId);
      }
    });
    WebsocketResolver.add('replay', {
      id: 'game',
      func: (_) => {
        GameScene.reset();
      }
    });
    WebsocketResolver.add('updateLastTouchMemberId', {
      id: 'game',
      func: (data) => {
        const goal = GameScene.findByType(Goal);
        if (goal.length !== 1) return;
        goal[0].setLastTouchMemberId(data.lastTouchMemberId);
      }
    });
  }

  public createOnlineObjects (onlineObjects: GameObject[]) {
    onlineObjects.forEach((ol) => {
      this.gameObjectResolver.createInstance(ol);
    });
  }
}
