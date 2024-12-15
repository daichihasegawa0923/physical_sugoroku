import { GameObject, GameStatus, Vector3 } from '@/shared';

export type AddVelocityResult = {
  id: string;
  direction: Vector3;
} & GameInfoResult;

export interface GameStatusInfo {
  status: GameStatus;
  activeMemberName: string | null;
  activeMemberId: string | null;
  turn: number;
  diceResult: DiceResult | null;
  goalMemberId: string | null;
}

export interface DiceResult {
  height: number;
  forward: number;
}

export interface TurnEndResult {
  objects: GameObject[];
}

export interface GoalResult {
  goalMemberId: string;
  goalMemberName: string;
  status: GameStatus;
  objects: GameObject[];
}

export interface GameInfoResult {
  status: GameStatus;
  activeMemberId: string | null;
  activeMemberName: string | null;
}
