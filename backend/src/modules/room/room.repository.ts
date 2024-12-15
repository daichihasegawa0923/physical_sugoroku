import { newRoomId } from './roomId';
import { Room, RoomCreateInput } from './type';
import gameRepository from 'src/shared/game.repository';

export default function roomRepository() {
  return {
    create,
    find,
  };
}

async function create(input: RoomCreateInput): Promise<string> {
  const roomId = newRoomId();
  await gameRepository.upsert({ id: 'room', subId: roomId }, { ...input });
  return roomId;
}

async function find(id: string): Promise<Room> {
  const result = await gameRepository.find({
    id: 'room',
    subId: id,
  });
  return {
    id: result.subId,
    name: result.name,
    isPublic: result.isPublic,
    memberCount: result.memberCount,
  };
}
