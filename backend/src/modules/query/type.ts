export interface RoomMemberList {
  roomId: string;
  count: number;
  list: {
    memberId: string;
    connectionId: string;
    name: string;
  }[];
}
