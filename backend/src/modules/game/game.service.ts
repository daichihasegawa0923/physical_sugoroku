import { ulid } from 'ulid';
import {
  AddVelocityResult,
  TurnEndResult,
  GoalResult,
  GameSequenceInfo,
} from 'physical-sugoroku-common/src/event/result/game';
import gameObjectRepository from 'src/modules/game/game.object.repository';
import gameStatusRepository from 'src/modules/game/game.status.repository';
import memberRepository from 'src/modules/member/member.repository';
import { GameObject, Vector3 } from 'physical-sugoroku-common/src/shared';
import {
  Commons,
  StageClasses,
} from 'physical-sugoroku-common/src/shared/stage';

export default function gameService() {
  return {
    findAllObjects,
    upsertObjects,
    addVelocity,
    startGame,
    shoot,
    turnEnd,
    getSequenceInfo,
    goal,
    replay,
    setLastTouchMemberId,
  };
}

async function findAllObjects(roomId: string) {
  const data = await gameObjectRepository().findAll(roomId);
  return data;
}

async function upsertObjects(roomId: string, gameObjects: GameObject[]) {
  await gameObjectRepository().upsertMany(roomId, gameObjects);
  await Promise.all(
    getDeadPiece(gameObjects).map(async (go) => {
      await gameObjectRepository().remove(roomId, go);
    })
  );
  return gameObjectRepository().findAll(roomId);
}

function getDeadPiece(gameObjects: GameObject[]) {
  return gameObjects.filter(
    (go) => go.className === 'Piece' && ((go.other?.life as number) ?? 0) <= 0
  );
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

async function startGame(roomId: string, stageClassName: string) {
  const info = await gameStatusRepository().findOrCreate(roomId);
  if (info.status !== 'WAITING') {
    return;
  }
  const stageCommon = Commons[stageClassName as StageClasses];
  const { x, y, z } = stageCommon.getGoalPositionFromMapPoint();
  const goal: GameObject = {
    id: ulid(),
    className: 'Goal',
    position: { x, y, z },
    quaternion: { x: 0, y: 0, z: 0, w: 1 },
    size: { x: 1.5, y: 1.5, z: 1.5 },
    other: {
      firstPosition: JSON.stringify({ x, y, z }),
      lastTouchMemberId: null,
    },
  };

  const stage = {
    id: ulid(),
    className: stageClassName,
    position: { x: 0, y: 0, z: 0 },
    quaternion: { x: 0, y: 0, z: 0, w: 1 },
    size: { x: 1, y: 1, z: 1 },
  };

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
  const pieces: GameObject[] = membersWithIndex.map((member) => {
    return {
      id: ulid(),
      className: 'Piece',
      position: stageCommon.getPiecePosition((member.sequence + 1).toString()),
      quaternion: { x: 0, y: 0, z: 0, w: 1 },
      velocity: { x: 0, y: 0, z: 0 },
      size: { x: 1, y: 1, z: 1 },
      other: {
        number: (member.sequence + 1).toString(),
        memberId: member.id,
        life: 3,
      },
    };
  });
  await gameObjectRepository().upsertMany(roomId, [stage, goal, ...pieces]);

  // 最初のターンのユーザーの設定
  const firstMember = membersWithIndex.filter(
    (member) => member.sequence === 0
  )[0];
  info.activeMemberId = firstMember.id;
  info.activeMemberName = firstMember.name;
  info.status = 'DIRECTION';
  await gameStatusRepository().upsert(roomId, info);
}

async function shoot(roomId: string) {
  const info = await gameStatusRepository().findOrCreate(roomId);
  if (info.status !== 'DIRECTION') return;
  info.status = 'MOVING';
  await gameStatusRepository().upsert(roomId, info);
}

async function turnEnd(
  roomId: string,
  gameObjects: GameObject[]
): Promise<TurnEndResult> {
  const info = await gameStatusRepository().findOrCreate(roomId);
  if (info.status !== 'MOVING') return;
  // pieceのライフ残機の確認
  const all = await gameObjectRepository().findAll(roomId);
  const livePieces = all
    .filter((go) => go.className === 'Piece')
    .filter((piece) => (piece.other?.life as number) > 0);

  if (livePieces.length <= 1) {
    info.status = 'RESULT';
    await gameStatusRepository().upsert(roomId, info);
    // 一人だけ生き残っている場合は、その人を優勝とする
    if (livePieces.length === 1) {
      const winPiece = livePieces[0];
      const memberId = winPiece.other.memberId as string;
      const member = await memberRepository().find(roomId, memberId);
      return {
        goalMemberId: memberId,
        goalMemberName: member.name,
        status: 'RESULT',
        objects: all,
      };
    }
    return {
      goalMemberId: null,
      goalMemberName: null,
      status: 'RESULT',
      objects: all,
    };
  }

  info.status = 'DIRECTION';
  const loveMemberIds = livePieces.map((go) => go.other.memberId as string);
  const { nextMember, newTurn } = await findNextMemberRecursion(
    roomId,
    info.activeMemberId,
    loveMemberIds
  );
  if (newTurn) {
    info.turn += 1;
  }
  info.activeMemberId = nextMember.id;
  info.activeMemberName = nextMember.name;
  const objects = await gameService().upsertObjects(roomId, gameObjects);
  await gameStatusRepository().upsert(roomId, info);
  return {
    objects,
    status: info.status,
  };
}

async function findNextMemberRecursion(
  roomId: string,
  currentMemberId: string,
  liveMemberIds: string[],
  isNewTurn?: boolean
) {
  const nextMember = await findNextMember(roomId, currentMemberId);
  const newTurn = isNewTurn || nextMember.sequence === 0;
  if (!liveMemberIds.includes(nextMember.id)) {
    return await findNextMemberRecursion(
      roomId,
      nextMember.id,
      liveMemberIds,
      newTurn
    );
  }
  return { nextMember, newTurn };
}

async function goal(
  roomId: string,
  gameObjects: GameObject[]
): Promise<GoalResult> {
  const info = await gameStatusRepository().findOrCreate(roomId);
  const objects = await gameObjectRepository().findAll(roomId);
  if (info.status === 'RESULT') {
    const { name, id } = await memberRepository().find(
      roomId,
      info.goalMemberId
    );
    return {
      goalMemberName: name,
      goalMemberId: id,
      status: info.status,
      objects,
    };
  }
  const goal = objects.find((o) => o.className === 'Goal');
  if (!goal || goal.other.lastTouchMemberId == null)
    throw Error('Goal cannot be found.');
  if (goal.other.lastTouchMemberId == null)
    throw Error('lastTouchMemberId is not set.');
  info.status = 'RESULT';
  info.goalMemberId = goal.other.lastTouchMemberId as string;
  await gameStatusRepository().upsert(roomId, info);
  await gameObjectRepository().upsertMany(roomId, gameObjects);
  const { id, name } = await memberRepository().find(roomId, info.goalMemberId);
  return {
    goalMemberName: name,
    goalMemberId: id,
    status: info.status,
    objects: gameObjects,
  };
}

async function getSequenceInfo(roomId: string): Promise<GameSequenceInfo> {
  const members = await memberRepository().findAll(roomId);
  const pieces = (await gameObjectRepository().findAll(roomId)).filter(
    (go) => go.className === 'Piece'
  );
  const sequence = members
    .sort((m1, m2) => m1.sequence - m2.sequence)
    .map((m) => ({
      sequence: m.sequence,
      memberName: m.name,
      memberId: m.id,
      life:
        pieces.length === 0
          ? 0
          : (pieces.find((p) => p?.other?.memberId === m.id)?.other
              ?.life as number) ?? 0,
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

async function setLastTouchMemberId(roomId: string, lastTouchMemberId: string) {
  const objs = await gameObjectRepository().findAll(roomId);
  const goal = objs.find((o) => o.className === 'Goal');
  if (!goal || goal.other.lastTouchMemberId === undefined) {
    throw Error('goal cannot be found.');
  }
  goal.other.lastTouchMemberId = lastTouchMemberId;
  await gameObjectRepository().upsertMany(roomId, [goal]);
  return lastTouchMemberId;
}

async function replay(roomId: string) {
  const members = await memberRepository().findAll(roomId);
  await Promise.all(
    members.map(async (m) => {
      // 順番をリセット
      m.sequence = null;
      await memberRepository().upsert(roomId, m);
    })
  );

  // ゲームオブジェクトを初期化
  await gameObjectRepository().removeAll(roomId);
  const statusInfo = await gameStatusRepository().findOrCreate(roomId);
  statusInfo.status = 'WAITING';
  statusInfo.activeMemberId = null;
  statusInfo.activeMemberName = null;
  statusInfo.goalMemberId = null;
  statusInfo.turn = 0;
  await gameStatusRepository().upsert(roomId, statusInfo);
}
