import gameObjectRepository from '../game/game.object.repository';
import { GameObject } from '../game/type';
import memberRepository from '../member/member.repository';
import roomRepository from '../room/room.repository';
import { RoomMemberList } from './type';

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
