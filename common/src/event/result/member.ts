export interface Member {
  id: string;
  name: string;
  connectionId: string;
  sequence: number | null;
  host: boolean;
}

export interface RoomMemberList {
  roomId: string;
  count: number;
  list: {
    memberId: string;
    connectionId: string;
    name: string;
  }[];
}
