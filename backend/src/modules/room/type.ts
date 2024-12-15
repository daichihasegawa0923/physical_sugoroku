export interface RoomCreateInput extends Omit<Room, 'id'> {}

export type RoomCreateResult = {
  roomId: string;
  memberId: string;
};

export type JoinRoomResult =
  | { ok: false; message: string }
  | {
      ok: true;
      roomId: string;
      memberName: string;
      memberId: string;
      rejoin: boolean;
      isFull: boolean;
    };

export interface Room {
  id: string;
  name: string;
  isPublic: boolean;
  memberCount: number;
  stageClassName: string;
}
