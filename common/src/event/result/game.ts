import { GameObject, GameStatus, Vector3 } from '../../shared';

export type AddVelocityResult = {
  id: string;
  direction: Vector3;
} & GameInfoResult;

export interface GameStatusInfo {
  status: GameStatus;
  activeMemberName: string | null;
  activeMemberId: string | null;
  turn: number;
  goalMemberId: string | null;
}

export type TurnEndResult =
  | {
      status: 'DIRECTION';
      objects: GameObject[];
    }
  | GoalResult;

export interface GoalResult {
  goalMemberId: string;
  goalMemberName: string;
  status: 'RESULT';
  objects: GameObject[];
}

export interface GameSequenceInfo {
  sequence: {
    sequence: number;
    memberId: string;
    memberName: string;
    life: number;
  }[];
}

export interface GameInfoResult {
  status: GameStatus;
  activeMemberId: string | null;
  activeMemberName: string | null;
}
