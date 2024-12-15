import gameRepository from 'src/shared/game.repository';
import { ulid } from 'ulid';

export default function memberRepository() {
  return {
    upsert,
    findAll,
    find,
  };
}

const createMemberId = () => {
  return 'member_' + ulid();
};

async function upsert(
  roomId: string,
  member: Omit<Member, 'id'> & { id?: string }
): Promise<string> {
  const updateMemberId = member.id ?? createMemberId();
  const { name, connectionId, sequence } = member;
  await gameRepository.upsert(
    { id: roomId, subId: updateMemberId },
    { name, connectionId, sequence }
  );
  return updateMemberId;
}

async function findAll(roomId: string): Promise<Member[]> {
  return (await gameRepository.list({ id: roomId })).map((result) => ({
    id: result.subId,
    name: result.name,
    connectionId: result.connectionId,
    sequence: result.sequence,
    host: result.host,
  }));
}

async function find(roomId: string, memberId: string): Promise<Member> {
  const data = await gameRepository.find({ id: roomId, subId: memberId });
  return {
    id: data.subId,
    name: data.name,
    connectionId: data.connectionId,
    sequence: data.sequence,
    host: data.host,
  };
}
