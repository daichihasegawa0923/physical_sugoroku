import { MonoBehaviour } from '@/shared/game/monobehaviour'
import { type Object3D } from 'three'
import { GameScene } from '@/shared/game/game.scene'
import { type GameEventHandlers } from '../../events/event'
import { Light } from '@/game.logic/monos/base/light'
import {
  type GameStatus,
  type GameObject,
  type Vector3
} from '@/shared/game/type'
import { LightHemisphere } from '@/game.logic/monos/base/light.hemisphere'
import { CameraManager } from '@/game.logic/monos/main/camera.manager'
import { SmashManager } from '@/game.logic/monos/main/smash.manager'
import { findMyPiece } from '@/game.logic/monos/main/functions'
import { TurnEndManager } from '@/game.logic/monos/main/turn.end.manager'
import { GameObjectResolver } from '@/game.logic/monos/main/game.object.resolver'

export class MainLogic extends MonoBehaviour {
  public constructor (
    private readonly roomId: string,
    private readonly memberId: string,
    private status: GameStatus,
    private readonly eventHandler: GameEventHandlers,
    objects: GameObject[],
    private readonly cameraManager = new CameraManager(memberId),
    private readonly smashManager = new SmashManager(memberId),
    private readonly turnEndManager = new TurnEndManager(),
    private readonly gameObjectResolver = new GameObjectResolver()
  ) {
    super()
    this.roomId = roomId
    this.memberId = memberId
    this.gameObjectResolver.registerPrefabs()
    objects.forEach((obj) => {
      this.gameObjectResolver.createInstance(obj)
    })
    this.status = status
    GameScene.setBackgroundColor(0x006644, 1.0)
  }

  private activeMemberId: string | null = null

  public getStatus () {
    return this.status
  }

  public updateStats (
    status: GameStatus,
    activeMemberId: string,
    onChange: (gs: GameStatus, activeMemberId: string) => void
  ) {
    onChange(status, activeMemberId)
    this.status = status
    this.activeMemberId = activeMemberId
  }

  public getObject3D (): Object3D | null {
    return null
  }

  public isMyTurn () {
    return this.memberId === this.activeMemberId
  }

  override start (): void {
    this.init()
  }

  override update (): void {
    this.cameraManager.setCameraPosition(
      this.isMyTurn(),
      this.activeMemberId,
      this.status
    )
    this.executeTurnEnd()
    this.smashManager.drawSmashDirection(this.status, this.isMyTurn())
  }

  public smashById (id: string, direction: Vector3) {
    this.smashManager.smashById(id, direction)
  }

  public smash (): void {
    if (!this.isMyTurn() || this.getStatus() !== 'DIRECTION') return
    const myObjId = findMyPiece(this.memberId)?.getId()
    if (myObjId == null) return
    const result = this.smashManager.smash(this.memberId, (direction) => {
      this.eventHandler.impulse({
        name: 'impulse',
        id: myObjId,
        direction
      })
    })
    if (result) {
      this.status = 'MOVING'
    }
  }

  public changeAngle (horizontal: number) {
    this.cameraManager.changeAngle(horizontal)
  }

  public updateSmashDirection (x: number, y: number) {
    if (this.status === 'DIRECTION' && this.isMyTurn()) {
      this.smashManager.updateDirectionPower(x, y)
    }
  }

  private executeTurnEnd (): void {
    if (!this.isMyTurn() || this.getStatus() !== 'MOVING') return
    if (this.turnEndManager.isMoveSomePieces()) return

    this.status = 'WAITING'
    setTimeout(() => {
      // ゲーム終了時は何もしない
      if (this.status === 'RESULT') return

      if (this.turnEndManager.isMoveSomePieces()) {
        this.status = 'MOVING'
        return
      }
      this.eventHandler.turnEnd({
        name: 'turnEnd',
        roomId: this.roomId,
        gameObjects: GameScene.allOnline()
      })
      // 遅延させる
    }, 1500)
  }

  public goal (goalMemberId: string) {
    this.eventHandler.goal({
      name: 'goal',
      goalMemberId,
      roomId: this.roomId,
      gameObjects: GameScene.allOnline()
    })
    this.status = 'RESULT'
  }

  public syncAll (gameObjects: GameObject[]) {
    this.gameObjectResolver.syncAll(gameObjects)
  }

  private readonly light = new Light()
  private readonly lightHemisphere = new LightHemisphere()

  private init () {
    GameScene.add(this.light)
    GameScene.add(this.lightHemisphere)
  }
}
