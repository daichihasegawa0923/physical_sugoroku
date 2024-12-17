import { GameStatusInfo } from 'physical-sugoroku-common/src/event/result/game';
import gameRepository from 'src/shared/game.repository';

const ID = 'game';

export default function gameStatusRepository() {
  return {
    findOrCreate,
    upsert,
  };
}

async function findOrCreate(roomId: string): Promise<GameStatusInfo> {
  const statusStr = (await gameRepository.find({ id: ID, subId: roomId }))
    ?.status;
  const data = statusStr ? JSON.parse(statusStr) : null;
  if (!data) {
    const initData: GameStatusInfo = {
      status: 'WAITING',
      activeMemberName: null,
      activeMemberId: null,
      turn: 0,
      goalMemberId: null,
    };
    gameRepository.upsert(
      { id: ID, subId: roomId },
      { status: JSON.stringify(initData) }
    );
    return initData;
  }
  return {
    status: data.status,
    activeMemberName: data.activeMemberName,
    activeMemberId: data.activeMemberId,
    turn: data.turn,
    goalMemberId: data.goalMemberId,
  };
}

async function upsert(roomId: string, info: GameStatusInfo): Promise<void> {
  await gameRepository.upsert(
    { id: ID, subId: roomId },
    {
      status: JSON.stringify(info),
    }
  );
}
