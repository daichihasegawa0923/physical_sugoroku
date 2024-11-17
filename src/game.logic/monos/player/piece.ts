import { SimpleSphere } from '@/game.logic/monos/base/simple.sphere'
import { type Vector3 } from '@/shared/game/type'
import * as CANNON from 'cannon-es'

const color1P = 0xff0000
const color2P = 0x00ff00
const color3P = 0x0000ff
const color4P = 0x0ff000

export type PlayerNumber = '1' | '2' | '3' | '4'

export interface PieceGenerateProps {
  playerNumber: PlayerNumber
  position: Vector3
  memberId: string
  id?: string
}

export class Piece extends SimpleSphere {
  public constructor ({
    playerNumber,
    position,
    id,
    memberId
  }: PieceGenerateProps) {
    super({
      color: getPlayerColor(playerNumber),
      radius: 1,
      position: new CANNON.Vec3(position.x, position.y, position.z),
      mass: 1,
      id
    })
    this.memberId = memberId
  }

  private readonly memberId: string

  public getMemberId () {
    return this.memberId
  }
}

function getPlayerColor (playerNumber: PlayerNumber) {
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
