import {
  AddVelocityResult,
  GameInfoResult,
  GameSequenceInfo,
  GoalResult,
  TurnEndResult,
} from '../event/result/game';
import { JoinRoomResult, RoomCreateResult } from '../event/result/room';
import { GameObject, Vector3 } from '../shared';

export type EventKeys = keyof EventTypeMap;
export type WebsocketInput = EventTypeMap[EventKeys]['input'];
export type WebsocketResult = EventTypeMap[EventKeys]['result'];
export type InputFromName<K extends string> = K extends EventKeys
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
        memberName: string;
      }
    >;
    result: Result<'createRoom', RoomCreateResult>;
  };
  startGame: {
    input: Input<'startGame', { roomId: string; stageClassName: string }>;
    result: Result<'startGame', {}>;
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
        syncDelay?: boolean;
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
    input: Input<'goal', { roomId: string; gameObjects: GameObject[] }>;
    result: Result<'goal', GoalResult>;
  };
  status: {
    input: Input<'status', { roomId: string }>;
    result: Result<'status', GameSequenceInfo & { hostRoomMemberId: string }>;
  };
  replay: {
    input: Input<'replay', { roomId: string }>;
    result: Result<'replay', {}>;
  };
  updateLastTouchMemberId: {
    input: Input<
      'updateLastTouchMemberId',
      { roomId: string; lastTouchMemberId: string }
    >;
    result: Result<'updateLastTouchMemberId', { lastTouchMemberId: string }>;
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
