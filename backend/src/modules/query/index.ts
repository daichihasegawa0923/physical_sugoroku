import { GameObject } from 'physical-sugoroku-common/src/shared';
import gameObjectRepository from 'src/modules/game/game.object.repository';
import memberRepository from 'src/modules/member/member.repository';
import { RoomMemberList } from 'physical-sugoroku-common/src/event/result/member';
import roomRepository from 'src/modules/room/room.repository';

export default function query() {
  return {
    roomMembers,
    gameObjects,
  };
}

async function roomMembers(roomId: string): Promise<RoomMemberList> {
  const room = await roomRepository().find(roomId);
  if (!room) throw new Error();
  const members = await memberRepository().findAll(roomId);
  return {
    roomId: room.id,
    count: members.length,
    list: members.map((member) => ({
      memberId: member.id,
      name: member.name,
      connectionId: member.connectionId,
    })),
  };
}

async function gameObjects(roomId: string): Promise<GameObject[]> {
  return gameObjectRepository().findAll(roomId);
}
