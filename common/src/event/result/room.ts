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
