import gameStatusRepository from 'src/modules/game/game.status.repository';
import gameObjectService from 'src/modules/game/game.service';
import {
  AddVelocityResult,
  DiceResult,
  GameInfoResult,
  GameObject,
  GameSequenceInfo,
  GoalResult,
  TurnEndResult,
  Vector3,
} from 'src/modules/game/type';
import query from 'src/modules/query';
import roomService from 'src/modules/room/room.service';
import { JoinRoomResult, RoomCreateResult } from 'src/modules/room/type';
import gameObjectRepository from 'src/modules/game/game.object.repository';

export default async function resolve(
  json: string,
  connectionId: string
): Promise<ResolvedTypeExtends> {
  try {
    const event = JSON.parse(json) as EventType;
    switch (event.name) {
      case 'fetchGameObjects': {
        const objects = await gameObjectService().findAllObjects(event.roomId);
        const { status, activeMemberId, activeMemberName } =
          await gameStatusRepository().findOrCreate(event.roomId);
        return {
          name: 'fetchGameObjects',
          value: { status, activeMemberId, activeMemberName, objects },
          pushTarget: connectionId,
        };
      }
      case 'createRoom': {
        const result = await roomService().createRoom(
          event.memberName,
          connectionId,
          {
            name: event.roomName,
            isPublic: event.public,
            memberCount: event.memberCount,
            stageClassName: event.stageClassName,
          }
        );
        return {
          name: 'createRoom',
          value: {
            ...result,
            status: 'WAITING',
            activeMemberId: null,
            activeMemberName: null,
          },
          pushTarget: connectionId,
        };
      }
      case 'joinRoom': {
        const result = await roomService().joinRoom(
          event.roomId,
          event.memberName,
          connectionId,
          event.memberId
        );
        if (result.ok && result.isFull) {
          await gameObjectService().startGame(event.roomId);
        }
        const objects = await gameObjectService().findAllObjects(event.roomId);
        const { status, activeMemberId, activeMemberName } =
          await gameStatusRepository().findOrCreate(event.roomId);
        return {
          name: 'joinRoom',
          value: {
            ...result,
            status,
            activeMemberId,
            activeMemberName,
            objects,
          },
          pushTarget:
            // 参加成功かつ、再参加でない場合は全員に通知する
            result.ok && !result.rejoin
              ? await roomMemberConnectionIds(result.roomId)
              : connectionId,
        };
      }
      case 'rollDice': {
        await gameObjectService().rollDice(event.roomId, event.input);
        const { status, activeMemberId, activeMemberName } =
          await gameStatusRepository().findOrCreate(event.roomId);
        return {
          name: 'rollDice',
          value: { ...event.input, status, activeMemberId, activeMemberName },
          pushTarget: await roomMemberConnectionIds(event.roomId),
        };
      }
      case 'impulse': {
        const result = await gameObjectService().addVelocity(
          event.roomId,
          event.id,
          event.direction
        );
        const { status, activeMemberId } =
          await gameStatusRepository().findOrCreate(event.roomId);
        return {
          name: 'impulse',
          value: { ...result, status, activeMemberId },
          pushTarget: await roomMemberConnectionIds(event.roomId),
        };
      }
      case 'updateGameObjects': {
        const result = await gameObjectService().upsertObjects(
          event.roomId,
          event.gameObjects
        );
        const { status, activeMemberId, activeMemberName } =
          await gameStatusRepository().findOrCreate(event.roomId);
        return {
          name: 'fetchGameObjects',
          value: { objects: result, status, activeMemberId, activeMemberName },
          pushTarget: await roomMemberConnectionIds(event.roomId),
        };
      }
      case 'turnEnd': {
        await gameObjectService().turnEnd(event.roomId, event.gameObjects);
        const { status, activeMemberId, activeMemberName } =
          await gameStatusRepository().findOrCreate(event.roomId);
        return {
          name: 'turnEnd',
          value: {
            objects: await gameObjectService().findAllObjects(event.roomId),
            status,
            activeMemberId,
            activeMemberName,
          },
          pushTarget: await roomMemberConnectionIds(event.roomId),
        };
      }
      case 'goal': {
        const result = await gameObjectService().goal(
          event.roomId,
          event.goalMemberId,
          event.gameObjects
        );
        const { status, activeMemberId, activeMemberName } =
          await gameStatusRepository().findOrCreate(event.roomId);
        return {
          name: 'goal',
          value: { ...result, status, activeMemberId, activeMemberName },
          pushTarget: await roomMemberConnectionIds(event.roomId),
        };
      }
      case 'sequence': {
        const { status, activeMemberId, activeMemberName } =
          await gameStatusRepository().findOrCreate(event.roomId);
        const { sequence } = await gameObjectService().getSequenceInfo(
          event.roomId
        );
        return {
          name: 'sequence',
          value: {
            status,
            activeMemberId,
            activeMemberName,
            sequence,
          },
          pushTarget: connectionId,
        };
      }
      case 'replay': {
        await gameObjectService().replay(event.roomId);
        const { status, activeMemberId, activeMemberName } =
          await gameStatusRepository().findOrCreate(event.roomId);
        const objects = await gameObjectRepository().findAll(event.roomId);
        return {
          name: 'replay',
          value: {
            status,
            activeMemberId,
            activeMemberName,
            objects,
          },
          pushTarget: await roomMemberConnectionIds(event.roomId),
        };
      }
      default:
        break;
    }
    return {
      name: 'not found',
      value: {},
      pushTarget: connectionId,
    };
  } catch (e) {
    console.log(e);
    throw Error(e);
  }
}

async function roomMemberConnectionIds(roomId: string) {
  return (await query().roomMembers(roomId)).list.map((m) => m.connectionId);
}

type EventType =
  | {
      name: 'fetchGameObjects';
      roomId: string;
    }
  | {
      name: 'createRoom';
      roomName: string;
      memberName: string;
      memberCount: number;
      public: boolean;
      stageClassName: string;
    }
  | {
      name: 'joinRoom';
      roomId: string;
      memberName: string;
      memberId?: string;
    }
  | {
      name: 'getRoomMembers';
      roomId: string;
    }
  | {
      name: 'rollDice';
      roomId: string;
      input: DiceResult;
    }
  | {
      name: 'impulse';
      roomId: string;
      id: string;
      direction: Vector3;
    }
  | {
      name: 'updateGameObjects';
      roomId: string;
      gameObjects: GameObject[];
    }
  | {
      name: 'turnEnd';
      roomId: string;
      gameObjects: GameObject[];
    }
  | {
      name: 'goal';
      roomId: string;
      goalMemberId: string;
      gameObjects: GameObject[];
    }
  | {
      name: 'sequence';
      roomId: string;
    }
  | {
      name: 'replay';
      roomId: string;
    };

type ResolvedType<T> = {
  name: string;
  value: GameInfoResult & T;
  pushTarget: string | string[];
};

type ResolvedTypeExtends =
  | (ResolvedType<RoomCreateResult> & { name: 'createRoom' })
  | (ResolvedType<JoinRoomResult & { objects: GameObject[] }> & {
      name: 'joinRoom';
    })
  | (ResolvedType<DiceResult> & { name: 'rollDice' })
  | (ResolvedType<AddVelocityResult> & { name: 'impulse' })
  | (ResolvedType<{ objects: GameObject[] }> & { name: 'fetchGameObjects' })
  | (ResolvedType<TurnEndResult> & { name: 'turnEnd' })
  | (ResolvedType<GoalResult> & { name: 'goal' })
  | (ResolvedType<GameSequenceInfo> & { name: 'sequence' })
  | (ResolvedType<{ objects: GameObject[] }> & { name: 'replay' })
  | (ResolvedType<any> & { name: 'not found' | 'error' });
