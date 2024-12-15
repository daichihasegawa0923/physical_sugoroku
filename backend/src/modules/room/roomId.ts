import { ulid } from 'ulid';

export type RoomId = string;

export const newRoomId = (): RoomId => {
  return 'room_' + ulid().toString();
};
