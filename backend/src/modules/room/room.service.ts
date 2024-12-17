import memberRepository from '../member/member.repository';
import roomRepository from './room.repository';
import {
  JoinRoomResult,
  RoomCreateResult,
} from 'physical-sugoroku-common/src/event/result/room';

export default function roomService() {
  return {
    createRoom,
    joinRoom,
  };
}

async function createRoom(
  createMemberName: string,
  connectionId: string
): Promise<RoomCreateResult> {
  const roomId = await roomRepository().create();
  const memberId = await memberRepository().upsert(roomId, {
    name: createMemberName,
    connectionId,
    sequence: null,
    host: true,
  });
  return {
    roomId,
    memberId,
  };
}

async function joinRoom(
  roomId: string,
  memberName: string,
  connectionId: string,
  memberId?: string
): Promise<JoinRoomResult> {
  const room = await roomRepository().find(roomId);
  if (!room)
    return {
      ok: false,
      message: 'ルームが見つかりませんでした。',
    };
  const members = await memberRepository().findAll(roomId);
  const isFull = (await memberRepository().findAll(roomId)).length === 4;
  const joinedMember = members.find((m) => m.id === memberId);
  if (!joinedMember && isFull) {
    return {
      ok: false,
      message: '参加が締め切られました。',
    };
  }
  const updateMemberId = await memberRepository().upsert(roomId, {
    id: memberId,
    name: memberName,
    connectionId,
    sequence: null,
    // すでに参加済みの場合はhostの場合もあるので注意
    host: joinedMember?.host ?? false,
  });

  return {
    ok: true,
    roomId,
    memberName,
    memberId: updateMemberId,
    rejoin: !!joinedMember,
    isFull,
  };
}
