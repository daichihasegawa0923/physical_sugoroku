import { ulid } from 'ulid';
import {
  AddVelocityResult,
  DiceResult,
  TurnEndResult,
  GoalResult,
  GameSequenceInfo,
} from 'physical-sugoroku-common/src/event/result/game';
import gameObjectRepository from 'src/modules/game/game.object.repository';
import gameStatusRepository from 'src/modules/game/game.status.repository';
import memberRepository from 'src/modules/member/member.repository';
import { GameObject, Vector3 } from 'physical-sugoroku-common/src/shared';

export default function gameObjectService() {
  return {
    init,
    findAllObjects,
    upsertObjects,
    addVelocity,
    startGame,
    rollDice,
    shoot,
    turnEnd,
    getSequenceInfo,
    goal,
    replay,
  };
}

async function findAllObjects(roomId: string) {
  const data = await gameObjectRepository().findAll(roomId);
  return data;
}

async function upsertObjects(roomId: string, gameObjects: GameObject[]) {
  await gameObjectRepository().upsertMany(roomId, gameObjects);
  return gameObjectRepository().findAll(roomId);
}

async function addVelocity(
  roomId: string,
  id: string,
  direction: Vector3
): Promise<AddVelocityResult | null> {
  const obj = await gameObjectRepository().find(roomId, id);
  const info = await gameStatusRepository().findOrCreate(roomId);
  info.status = 'MOVING';
  await gameStatusRepository().upsert(roomId, info);
  if (!obj) return null;
  return {
    id,
    direction,
    status: 'MOVING',
    activeMemberId: info.activeMemberId,
    activeMemberName: info.activeMemberName,
  };
}

async function init(roomId: string, stageClassName: string) {
  const info = await gameStatusRepository().findOrCreate(roomId);
  if (info.status !== 'WAITING') return;
  await gameObjectRepository().upsertMany(roomId, [
    {
      id: ulid(),
      className: stageClassName,
      position: { x: 0, y: 0, z: 0 },
      quaternion: { x: 0, y: 0, z: 0, w: 1 },
      size: { x: 1, y: 1, z: 1 },
    },
  ]);
}

async function startGame(roomId: string) {
  const info = await gameStatusRepository().findOrCreate(roomId);
  if (info.status !== 'WAITING') {
    return;
  }
  // ユーザーの順番の決定
  const membersWithIndex = shuffleArray(
    await memberRepository().findAll(roomId)
  ).map((m, index) => {
    m.sequence = index;
    return m;
  });
  await Promise.all(
    membersWithIndex.map(async (member) => {
      await memberRepository().upsert(roomId, member);
    })
  );
  // ゲームの駒の作成
  const objs: GameObject[] = membersWithIndex.map((member) => {
    return {
      id: ulid(),
      className: 'Piece',
      position: { x: 0, y: -999, z: 0 },
      quaternion: { x: 0, y: 0, z: 0, w: 1 },
      size: { x: 1, y: 1, z: 1 },
      other: {
        number: (member.sequence + 1).toString(),
        memberId: member.id,
      },
    };
  });
  await gameObjectRepository().upsertMany(roomId, objs);

  // 最初のターンのユーザーの設定
  const firstMember = membersWithIndex.filter(
    (member) => member.sequence === 0
  )[0];
  info.activeMemberId = firstMember.id;
  info.activeMemberName = firstMember.name;
  info.status = 'DIRECTION';
  await gameStatusRepository().upsert(roomId, info);
}

/**
 * Deprecated.
 */
async function rollDice(roomId: string, diceResult: DiceResult) {
  const info = await gameStatusRepository().findOrCreate(roomId);
  if (info.status !== 'DICE') return;
  info.status = 'DIRECTION';
  info.diceResult = diceResult;
  await gameStatusRepository().upsert(roomId, info);
}

async function shoot(roomId: string) {
  const info = await gameStatusRepository().findOrCreate(roomId);
  if (info.status !== 'DIRECTION') return;
  info.status = 'MOVING';
  info.diceResult = null;
  await gameStatusRepository().upsert(roomId, info);
}

async function turnEnd(
  roomId: string,
  gameObjects: GameObject[]
): Promise<TurnEndResult> {
  const info = await gameStatusRepository().findOrCreate(roomId);
  if (info.status !== 'MOVING') return;
  info.status = 'DIRECTION';
  const nextMember = await findNextMember(roomId, info.activeMemberId);
  if (nextMember.sequence === 0) {
    info.turn += 1;
  }
  info.activeMemberId = nextMember.id;
  info.activeMemberName = nextMember.name;
  gameObjectService().upsertObjects(roomId, gameObjects);
  await gameStatusRepository().upsert(roomId, info);
}

async function goal(
  roomId: string,
  goalMemberId: string,
  gameObjects: GameObject[]
): Promise<GoalResult> {
  const info = await gameStatusRepository().findOrCreate(roomId);
  if (info.status === 'RESULT') {
    const { name, id } = await memberRepository().find(
      roomId,
      info.goalMemberId
    );
    const objects = await gameObjectRepository().findAll(roomId);
    return {
      goalMemberName: name,
      goalMemberId: id,
      status: info.status,
      objects,
    };
  }
  info.status = 'RESULT';
  info.goalMemberId = goalMemberId;
  await gameStatusRepository().upsert(roomId, info);
  await gameObjectRepository().upsertMany(roomId, gameObjects);
  const { id, name } = await memberRepository().find(roomId, goalMemberId);
  return {
    goalMemberName: name,
    goalMemberId: id,
    status: info.status,
    objects: gameObjects,
  };
}

async function getSequenceInfo(roomId: string): Promise<GameSequenceInfo> {
  const members = await memberRepository().findAll(roomId);
  const sequence = members
    .sort((m1, m2) => m1.sequence - m2.sequence)
    .map((m) => ({
      sequence: m.sequence,
      memberName: m.name,
      memberId: m.id,
    }));
  return { sequence };
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = [...array]; // 元の配列を変更しないようコピーを作成
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

async function findNextMember(roomId: string, currentMemberId: string) {
  const members = await memberRepository().findAll(roomId);
  const currentMember = members.find((m) => m.id === currentMemberId);
  if (!currentMember) throw Error('current member cannot be found.');
  const nextCandidates = members.filter(
    (m) => m.sequence > currentMember.sequence
  );
  if (nextCandidates.length === 0) {
    const first = members.find((m) => m.sequence === 0);
    if (!first) throw Error();
    return first;
  }
  return nextCandidates.reduce((min, current) => {
    if (current.sequence < min.sequence) return current;
    return min;
  }, nextCandidates[0]);
}

async function replay(roomId: string) {
  const info = await gameStatusRepository().findOrCreate(roomId);
  if (info.status !== 'RESULT') return;
  const all = await gameObjectRepository().findAll(roomId);
  await gameObjectRepository().upsertMany(
    roomId,
    all.filter((o) => o.className !== 'Piece')
  );
  info.status = 'WAITING';
  await gameStatusRepository().upsert(roomId, info);
  await startGame(roomId);
}
