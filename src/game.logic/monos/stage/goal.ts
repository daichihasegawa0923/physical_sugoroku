import { SimpleBox } from '@/game.logic/monos/base/simple.box'
import { type SimpleBoxProps } from '@/game.logic/monos/base/simple.box.online'
import { MainLogic } from '@/game.logic/monos/main.logic'
import { type Piece } from '@/game.logic/monos/player/piece'
import { GameScene } from '@/shared/game/game.scene'
import { type Vector3 } from '@/shared/game/type'
import * as CANNON from 'cannon-es'

export class Goal extends SimpleBox {
  public constructor (props: Omit<SimpleBoxProps, 'color' | 'size'>) {
    super({
      ...props,
      mass: 0,
      color: 0xff00ff,
      size: new CANNON.Vec3(1, 1, 1)
    })
  }

  start (): void {
    super.start()
    this.rigidBody().addEventListener(
      'collide',
      ({ body }: { body: CANNON.Body }) => {
        const target = GameScene.allRigidBodies().find(
          (rig) => rig.rigidBody() === body
        )
        const piece = target as Piece
        if (piece == null) {
          return
        }
        const mainLogic = GameScene.findByType(MainLogic)[0]
        if (mainLogic.getStatus() === 'RESULT') {
          return
        }
        mainLogic.goal(piece.getMemberId())
      }
    )
  }

  public setPosition (position: Vector3) {
    const { x, y, z } = position
    this.rigidBody().position.set(x, y, z)
  }

  update (): void {
    super.update()
  }
}
