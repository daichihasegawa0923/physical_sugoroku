export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Quaternion extends Vector3 {
  w: number;
}

interface PlaneObject {
  [name: string]: string | number;
}

export type GameObject = {
  id: string;
  className: string;
  position: Vector3;
  quaternion: Quaternion;
  size: Vector3;
  other?: PlaneObject;
};

export type AddVelocityResult = {
  id: string;
  direction: Vector3;
} & GameInfoResult;

export type GameStatus = 'WAITING' | 'DICE' | 'DIRECTION' | 'MOVING' | 'RESULT';

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

export interface GameSequenceInfo {
  sequence: {
    sequence: number;
    memberId: string;
    memberName: string;
  }[];
}

export interface GameInfoResult {
  status: GameStatus;
  activeMemberId: string | null;
  activeMemberName: string | null;
}
