import gameObjectService from 'src/modules/game/game.service';
import memberRepository from '../member/member.repository';
import query from '../query';
import roomRepository from './room.repository';
import { JoinRoomResult, RoomCreateInput, RoomCreateResult } from './type';

export default function roomService() {
  return {
    createRoom,
    joinRoom,
  };
}

async function createRoom(
  createMemberName: string,
  connectionId: string,
  roomSettingInput: RoomCreateInput
): Promise<RoomCreateResult> {
  const roomId = await roomRepository().create(roomSettingInput);
  const memberId = await memberRepository().upsert(roomId, {
    name: createMemberName,
    connectionId,
    sequence: null,
    host: true,
  });
  await gameObjectService().init(roomId, roomSettingInput.stageClassName);
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
  const joinedMember = members.find((m) => m.id === memberId);
  if (
    !joinedMember &&
    room.memberCount === (await query().roomMembers(roomId)).count
  ) {
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
    host: joinedMember.host ?? false,
  });

  return {
    ok: true,
    roomId,
    memberName,
    memberId: updateMemberId,
    rejoin: !!joinedMember,
    isFull:
      (await memberRepository().findAll(roomId)).length ===
      (await roomRepository().find(roomId)).memberCount,
  };
}
