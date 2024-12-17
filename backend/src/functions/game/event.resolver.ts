import gameStatusRepository from 'src/modules/game/game.status.repository';
import gameObjectService from 'src/modules/game/game.service';
import query from 'src/modules/query';
import roomService from 'src/modules/room/room.service';
import gameObjectRepository from 'src/modules/game/game.object.repository';
import {
  WebsocketResult,
  WebsocketInput,
} from 'physical-sugoroku-common/src/event';

export default async function resolve(
  json: string,
  connectionId: string
): Promise<WebsocketResult> {
  try {
    const event = JSON.parse(json) as WebsocketInput;
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
  } catch (e) {
    console.log(e);
    throw Error(e);
  }
}

async function roomMemberConnectionIds(roomId: string) {
  return (await query().roomMembers(roomId)).list.map((m) => m.connectionId);
}
