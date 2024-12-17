import { newRoomId } from './roomId';
import gameRepository from 'src/shared/game.repository';

export default function roomRepository() {
  return {
    create,
    find,
  };
}

async function create(): Promise<string> {
  const roomId = newRoomId();
  await gameRepository.upsert({ id: 'room', subId: roomId }, {});
  return roomId;
}

async function find(id: string): Promise<string> {
  const result = await gameRepository.find({
    id: 'room',
    subId: id,
  });
  return result.subId;
}
