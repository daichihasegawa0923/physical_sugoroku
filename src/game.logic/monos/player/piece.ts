import { SimpleSphere } from '@/game.logic/monos/base/simple.sphere'
import { type GameObject } from '@/shared/game/mono.container'
import { type Vector3 } from '@/shared/game/type'
import * as CANNON from 'cannon-es'

const color1P = 0xff0000
const color2P = 0x00ff00
const color3P = 0x0000ff
const color4P = 0x0ff000

export type MemberNumber = '1' | '2' | '3' | '4'

export interface PieceGenerateProps {
  number: MemberNumber
  position: Vector3
  memberId: string
  id?: string
}

export class Piece extends SimpleSphere {
  public constructor ({ number, position, id, memberId }: PieceGenerateProps) {
    super({
      color: getPlayerColor(number),
      radius: 1,
      position: new CANNON.Vec3(position.x, position.y, position.z),
      mass: 1,
      id
    })
    this.memberId = memberId
    this.number = number
  }

  private memberId: string
  private readonly number: MemberNumber

  public getMemberId () {
    return this.memberId
  }

  override update (): void {
    super.update()
    if (this.getObject3D().position.y < -10) {
      this.rigidBody().position.set(0, 20, 0)
      this.rigidBody().velocity.set(0, 0, 0)
      this.rigidBody().angularVelocity.set(0, 0, 0)
    }
  }

  override sync (gameObject: GameObject): void {
    super.sync(gameObject)
    if (!gameObject.other) throw Error()
    if (!gameObject.other.memberId) throw Error()

    this.memberId = gameObject.other.memberId as string
  }

  override getGameObject (className: string): GameObject {
    const go = super.getGameObject(className)
    return {
      ...go,
      other: {
        memberId: this.memberId,
        number: this.number
      }
    }
  }
}

function getPlayerColor (playerNumber: MemberNumber) {
  switch (playerNumber) {
    case '1':
      return color1P
    case '2':
      return color2P
    case '3':
      return color3P
    case '4':
      return color4P
  }
}
