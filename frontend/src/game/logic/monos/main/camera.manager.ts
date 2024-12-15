import { findMyPiece } from '@/game/logic/monos/main/functions'
import { Piece } from '@/game/logic/monos/player/piece'
import { GameScene } from '@/shared/game/game.scene'
import { type GameStatus } from 'physical-sugoroku-common/src/shared'
import * as THREE from 'three'

export class CameraManager {
  public constructor (
    private readonly myMemberId: string,
    private readonly camera = GameScene.get().getMainCamera(),
    private horizontal = 0
  ) {}

  public changeAngle (horizontal: number) {
    this.horizontal += horizontal * 0.0005
  }

  public setCameraPosition (
    isMyTurn: boolean,
    activeMemberId: string | null,
    status: GameStatus
  ) {
    const myObjPosition = findMyPiece(this.myMemberId)?.getObject3D()?.position
    if (!myObjPosition) {
      this.camera.position.set(0, 5, 0)
      this.camera.rotation.set(0, this.camera.rotation.y + 0.01, 0)
      return
    }
    // 発射位置を決める時は、駒の位置にカメラを移動する
    if (status === 'DIRECTION' && isMyTurn) {
      const { x, y, z } = myObjPosition
      this.camera.position.set(x, y + 10, z - 1)
      this.camera.lookAt(myObjPosition)
      return
    }
    // 角度に応じてカメラの位置を設定
    const distance = 5
    const height = 5
    this.camera.position.set(
      myObjPosition.x + distance * Math.sin(this.horizontal),
      myObjPosition.y + height,
      myObjPosition.z - distance * Math.cos(this.horizontal)
    )
    // 自分のターンでない時は、敵の駒を見る
    const target = isMyTurn
      ? myObjPosition
      : GameScene.findByType(Piece)
        .find((p) => p.getMemberId() === activeMemberId)
        ?.getObject3D()?.position ?? new THREE.Vector3(0, 0, 0)
    this.camera.lookAt(target)
  }
}
