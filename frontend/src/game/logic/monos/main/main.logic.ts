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
import {
  type Callback,
  WebsocketResolver
} from '@/shared/function/websocket.resolver';
import { Goal } from '@/game/logic/monos/stage/goal';
import { type EventKeys } from 'physical-sugoroku-common/src/event';

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

  public getActiveMemberId (): string | null {
    return this.activeMemberId;
  }

  override start (): void {
    this.init();
  }

  override update (): void {
    this.cameraManager.setCameraPosition();
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
    this.addWebsocket('fetchGameObjects', (data) => {
      this.gameObjectResolver.syncAll(data.objects);
    });
    this.addWebsocket('impulse', (data) => {
      this.smashById(data.id, data.direction);
      this.updateStats(data.status, data.activeMemberId);
    });
    this.addWebsocket('turnEnd', (data) => {
      this.syncAll(data.objects);
      this.updateStats(data.status, data.activeMemberId);
    });
    this.addWebsocket('goal', (data) => {
      this.syncAll(data.objects);
      this.updateStats(data.status, data.goalMemberId);
    });
    this.addWebsocket('replay', (_) => {
      GameScene.reset();
    });
    this.addWebsocket('updateLastTouchMemberId', (data) => {
      const goal = GameScene.findByType(Goal);
      if (goal.length !== 1) return;
      goal[0].setLastTouchMemberId(data.lastTouchMemberId);
    });
  }

  private addWebsocket<K extends EventKeys>(name: K, cb: Callback<K>) {
    WebsocketResolver.add(name, { id: 'game', func: cb });
  }

  public createOnlineObjects (onlineObjects: GameObject[]) {
    onlineObjects.forEach((ol) => {
      this.gameObjectResolver.createInstance(ol);
    });
  }

  public watchGoal (endCb: VoidFunction): void {
    this.cameraManager.startOshoClosiing(endCb);
  }
}
