import gameStatusRepository from 'src/modules/game/game.status.repository';
import gameObjectService from 'src/modules/game/game.service';
import query from 'src/modules/query';
import roomService from 'src/modules/room/room.service';
import {
  WebsocketResult,
  WebsocketInput,
} from 'physical-sugoroku-common/src/event';
import memberRepository from 'src/modules/member/member.repository';

export default async function resolve(
  json: string,
  connectionId: string
): Promise<WebsocketResult> {
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
        connectionId
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
    case 'startGame': {
      await gameObjectService().startGame(event.roomId, event.stageClassName);
      const { status, activeMemberId, activeMemberName } =
        await gameStatusRepository().findOrCreate(event.roomId);
      return {
        name: 'startGame',
        value: {
          status,
          activeMemberId,
          activeMemberName,
        },
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
    case 'status': {
      const { status, activeMemberId, activeMemberName } =
        await gameStatusRepository().findOrCreate(event.roomId);
      const { sequence } = await gameObjectService().getSequenceInfo(
        event.roomId
      );
      const hostRoomMemberId = (
        await memberRepository().findAll(event.roomId)
      )?.find((m) => m.host === true)?.id;
      return {
        name: 'status',
        value: {
          status,
          activeMemberId,
          activeMemberName,
          sequence,
          hostRoomMemberId,
        },
        pushTarget: connectionId,
      };
    }
    case 'replay': {
      await gameObjectService().replay(event.roomId);
      const { status, activeMemberId, activeMemberName } =
        await gameStatusRepository().findOrCreate(event.roomId);
      return {
        name: 'replay',
        value: {
          status,
          activeMemberId,
          activeMemberName,
        },
        pushTarget: await roomMemberConnectionIds(event.roomId),
      };
    }
    default:
      break;
  }
}

async function roomMemberConnectionIds(roomId: string) {
  return (await query().roomMembers(roomId)).list.map((m) => m.connectionId);
}
