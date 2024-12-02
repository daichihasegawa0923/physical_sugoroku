import { SimpleBoxOnline } from '@/game.logic/monos/base/simple.box.online'
import { type GameObject, type Vector3 } from '@/shared/game/type'
import * as CANNON from 'cannon-es'

const playerColor: Array<{ memberNumber: string, color: number }> = [
  { memberNumber: '1', color: 0xff0000 },
  { memberNumber: '2', color: 0x00ff00 },
  { memberNumber: '3', color: 0x0000ff },
  { memberNumber: '4', color: 0x0ff000 }
]

export interface PieceGenerateProps {
  number: string
  position: Vector3
  memberId: string
  id?: string
}

export class Piece extends SimpleBoxOnline {
  public constructor ({ number, position, id, memberId }: PieceGenerateProps) {
    super({
      color:
        playerColor.find((p) => p.memberNumber === number)?.color ?? 0x000000,
      size: new CANNON.Vec3(1, 0.5, 1),
      position: new CANNON.Vec3(position.x, position.y, position.z),
      mass: 1,
      id
    })
    this.memberId = memberId
    this.number = number
  }

  private memberId: string
  private readonly number: string

  public getNumber () {
    return this.number
  }

  public getMemberId () {
    return this.memberId
  }

  override start (): void {
    super.start()
  }

  override update (): void {
    super.update()
  }

  override syncFromOnline (gameObject: GameObject): void {
    super.syncFromOnline(gameObject)
    if (!gameObject.other) throw Error()
    if (!gameObject.other.memberId) throw Error()

    this.memberId = gameObject.other.memberId as string
  }

  public override online (): GameObject {
    const go = super.online()
    if (!go) throw Error()
    return {
      ...go,
      other: {
        memberId: this.memberId,
        number: this.number
      }
    }
  }
}
