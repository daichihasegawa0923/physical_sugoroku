import {
  AddVelocityResult,
  GameInfoResult,
  GameSequenceInfo,
  GoalResult,
  TurnEndResult,
} from '../event/result/game';
import { JoinRoomResult, RoomCreateResult } from '../event/result/room';
import { GameObject, Vector3 } from '../shared';

export type WebsocketInput = EventTypeMap[keyof EventTypeMap]['input'];
export type WebsocketResult = EventTypeMap[keyof EventTypeMap]['result'];
export type InputFromName<K extends string> = K extends keyof EventTypeMap
  ? EventTypeMap[K]['input']
  : never;
export type InputFromNameOmitName<K extends string> = Omit<
  InputFromName<K>,
  'name'
>;
export type ResultFromName<K extends string> = K extends keyof EventTypeMap
  ? EventTypeMap[K]['result']
  : never;

export type EventTypeMap = {
  fetchGameObjects: {
    input: Input<'fetchGameObjects', { roomId: string }>;
    result: Result<'fetchGameObjects', { objects: GameObject[] }>;
  };
  createRoom: {
    input: Input<
      'createRoom',
      {
        roomName: string;
        memberName: string;
        memberCount: number;
        public: boolean;
        stageClassName: string;
      }
    >;
    result: Result<'createRoom', RoomCreateResult>;
  };
  joinRoom: {
    input: Input<
      'joinRoom',
      {
        roomId: string;
        memberName: string;
        memberId?: string;
      }
    >;
    result: Result<'joinRoom', JoinRoomResult & { objects: GameObject[] }>;
  };
  impulse: {
    input: Input<
      'impulse',
      {
        roomId: string;
        id: string;
        direction: Vector3;
      }
    >;
    result: Result<'impulse', AddVelocityResult>;
  };
  updateGameObjects: {
    input: Input<
      'updateGameObjects',
      {
        roomId: string;
        gameObjects: GameObject[];
      }
    >;
    result: Result<'updateGameObjects', { objects: GameObject[] }>;
  };
  turnEnd: {
    input: Input<
      'turnEnd',
      {
        roomId: string;
        gameObjects: GameObject[];
      }
    >;
    result: Result<'turnEnd', TurnEndResult>;
  };
  goal: {
    input: Input<
      'goal',
      { roomId: string; goalMemberId: string; gameObjects: GameObject[] }
    >;
    result: Result<'goal', GoalResult>;
  };
  sequence: {
    input: Input<'sequence', { roomId: string }>;
    result: Result<'sequence', GameSequenceInfo>;
  };
  replay: {
    input: Input<'replay', { roomId: string }>;
    result: Result<'replay', { objects: GameObject[] }>;
  };
};

export type Input<K extends string, T> = {
  name: K;
} & T;

export type Result<K extends string, T> = {
  name: K;
  value: GameInfoResult & T;
  pushTarget: string | string[];
};