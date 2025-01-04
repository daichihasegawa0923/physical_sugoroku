import gameStatusRepository from 'src/modules/game/game.status.repository';
import gameService from 'src/modules/game/game.service';
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
      const objects = await gameService().findAllObjects(event.roomId);
      const { status, activeMemberId, activeMemberName } =
        await gameStatusRepository().findOrCreate(event.roomId);
      const { sequence } = await gameService().getSequenceInfo(event.roomId);
      return {
        name: 'fetchGameObjects',
        value: { status, activeMemberId, activeMemberName, objects, sequence },
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
      const objects = await gameService().findAllObjects(event.roomId);
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
      await gameService().startGame(event.roomId, event.stageClassName);
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
      const result = await gameService().addVelocity(
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
    case 'updateGameObject': {
      await gameService().upsertObjects(event.roomId, [event.gameObject]);
      const { status, activeMemberId, activeMemberName } =
        await gameStatusRepository().findOrCreate(event.roomId);
      const { sequence } = await gameService().getSequenceInfo(event.roomId);
      return {
        name: 'updateGameObject',
        value: {
          // findの処理を割愛するために、eventで受け取った値をそのまま使用する.
          gameObject: event.gameObject,
          status,
          activeMemberId,
          activeMemberName,
          sequence,
        },
        pushTarget: await roomMemberConnectionIds(event.roomId),
      };
    }
    case 'updateGameObjects': {
      const result = await gameService().upsertObjects(
        event.roomId,
        event.gameObjects
      );
      const { status, activeMemberId, activeMemberName } =
        await gameStatusRepository().findOrCreate(event.roomId);
      const { sequence } = await gameService().getSequenceInfo(event.roomId);
      return {
        name: 'fetchGameObjects',
        value: {
          objects: result,
          status,
          activeMemberId,
          activeMemberName,
          sequence,
        },
        // 即時反映しない場合がある
        pushTarget: event.syncDelay
          ? []
          : await roomMemberConnectionIds(event.roomId),
      };
    }
    case 'turnEnd': {
      const result = await gameService().turnEnd(
        event.roomId,
        event.gameObjects
      );
      const { activeMemberId, activeMemberName } =
        await gameStatusRepository().findOrCreate(event.roomId);
      if (result.status === 'RESULT') {
        return {
          name: 'goal',
          value: {
            objects: result.objects,
            status: 'RESULT',
            activeMemberId,
            activeMemberName,
            goalMemberId: result.goalMemberId,
            goalMemberName: result.goalMemberName,
          },
          pushTarget: await roomMemberConnectionIds(event.roomId),
        };
      }
      return {
        name: 'turnEnd',
        value: {
          objects: await gameService().findAllObjects(event.roomId),
          status: 'DIRECTION',
          activeMemberId,
          activeMemberName,
        },
        pushTarget: await roomMemberConnectionIds(event.roomId),
      };
    }
    case 'goal': {
      const result = await gameService().goal(event.roomId, event.gameObjects);
      const { activeMemberId, activeMemberName } =
        await gameStatusRepository().findOrCreate(event.roomId);
      return {
        name: 'goal',
        value: {
          ...result,
          status: 'RESULT',
          activeMemberId,
          activeMemberName,
        },
        pushTarget: await roomMemberConnectionIds(event.roomId),
      };
    }
    case 'status': {
      const { status, activeMemberId, activeMemberName } =
        await gameStatusRepository().findOrCreate(event.roomId);
      const { sequence } = await gameService().getSequenceInfo(event.roomId);
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
      await gameService().replay(event.roomId);
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
    case 'updateLastTouchMemberId': {
      const result = await gameService().setLastTouchMemberId(
        event.roomId,
        event.lastTouchMemberId
      );
      const { status, activeMemberId, activeMemberName } =
        await gameStatusRepository().findOrCreate(event.roomId);
      return {
        name: 'updateLastTouchMemberId',
        value: {
          status,
          activeMemberId,
          activeMemberName,
          lastTouchMemberId: result,
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
