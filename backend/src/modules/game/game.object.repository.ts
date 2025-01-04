import { GameObject } from 'physical-sugoroku-common/src/shared';
import gameRepository from 'src/shared/game.repository';

const ID = 'game';

export default function gameObjectRepository() {
  return {
    findAll,
    find,
    upsertMany,
    remove,
    removeAll,
  };
}

async function findAll(roomId: string): Promise<GameObject[]> {
  const data = await gameRepository.find({ id: ID, subId: roomId });
  if (!data) return [];
  const objectsStr = data.objects;
  const objects = objectsStr ? JSON.parse(data.objects) : [];
  return objects;
}

async function find(roomId: string, id: string): Promise<GameObject> {
  return (await findAll(roomId)).find((o) => o.id === id);
}

async function upsertMany(
  roomId: string,
  upsertObjects: GameObject[]
): Promise<void> {
  const currentObjects = await findAll(roomId);
  const createdObjects = currentObjects.filter(
    (currentObject) =>
      upsertObjects.findIndex((upsertGameObject) => {
        return upsertGameObject.id === currentObject.id;
      }) === -1
  );
  await gameRepository.upsert(
    { id: ID, subId: roomId },
    { objects: JSON.stringify([...createdObjects, ...upsertObjects]) }
  );
}

async function remove(roomId: string, gameObject: GameObject) {
  const remainObjects = (await findAll(roomId)).filter(
    (go) => go.id !== gameObject.id
  );
  await gameRepository.upsert(
    {
      id: ID,
      subId: roomId,
    },
    { objects: JSON.stringify(remainObjects) }
  );
}

async function removeAll(roomId: string) {
  await gameRepository.upsert(
    { id: ID, subId: roomId },
    { objects: JSON.stringify([]) }
  );
}
