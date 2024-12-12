import { Piece } from '@/game.logic/monos/player/piece'
import { GameScene } from '@/shared/game/game.scene'

export function findMyPiece (myMemberId: string) {
  return GameScene.findByType(Piece).find(
    (p) => p.getMemberId() === myMemberId
  )
}
