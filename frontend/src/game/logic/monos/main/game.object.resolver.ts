import { Piece } from '@/game/logic/monos/player/piece';
import { Goal } from '@/game/logic/monos/stage/goal';
import { Stage1 } from '@/game/logic/monos/stage/stage1';
import { Stage2 } from '@/game/logic/monos/stage/stage2';
import { StageTest } from '@/game/logic/monos/stage/stageTest';
import { GameScene } from '@/shared/game/game.scene';
import type IOnline from '@/shared/game/i.online';
import { MonoContainer } from '@/shared/game/mono.container';
import { type GameObject } from 'physical-sugoroku-common/src/shared';

export class GameObjectResolver {
  public syncAll (gameObjects: GameObject[]) {
    const addTarget = gameObjects.filter(
      (go) => GameScene.findById(go.id) == null
    );
    const removeTarget = GameScene.allOnline().filter(
      (local) => gameObjects.find((go) => go.id === local.id) == null
    );
    addTarget.forEach((t) => {
      MonoContainer.createInstance(t.className, t);
    });
    removeTarget.forEach((r) => {
      const target = GameScene.findById(r.id);
      if (target) {
        GameScene.remove(target);
      }
    });
    GameScene.all().forEach((r) => {
      const targetGo = gameObjects.find((go) => go.id === r.getId());
      if (!targetGo) return;
      const iOnline = r as unknown as IOnline;
      iOnline.syncFromOnline(targetGo);
    });
  }

  public registerPrefabs () {
    MonoContainer.registerPrefab('Stage1', (input) => {
      const stage1 = GameScene.findById(input.id);
      if (stage1) {
        return stage1;
      }
      const created = new Stage1(input.id);
      GameScene.add(created);
      return created;
    });
    MonoContainer.registerPrefab('Stage2', (input) => {
      const stage2 = GameScene.findById(input.id);
      if (stage2) {
        return stage2;
      }
      const created = new Stage2(input.id);
      GameScene.add(created);
      return created;
    });

    MonoContainer.registerPrefab('StageTest', (input) => {
      const stageTest = GameScene.findById(input.id);
      if (stageTest) {
        return stageTest;
      }
      const created = new StageTest(input.id);
      GameScene.add(created);
      return created;
    });
    MonoContainer.registerPrefab('Piece', (input) => {
      const pieces = GameScene.findByType(Piece);
      const target = pieces.find((p) => p.getId() === input.id);
      if (target) {
        return target;
      }
      if (!input.other) {
        throw new Error();
      }
      if (!input.other.number) {
        throw new Error();
      }
      if (!input.other.memberId) {
        throw new Error();
      }
      const created = new Piece({
        id: input.id,
        number: input.other.number as string,
        memberId: input.other.memberId as string,
        position: input.position
      });
      GameScene.add(created);
      return created;
    });
    MonoContainer.registerPrefab('Goal', (input) => {
      const goals = GameScene.findByType(Goal);
      if (goals.length > 0) {
        const goal = goals[0];
        return goal;
      }

      const created = new Goal(input.id);
      created.syncFromOnline(input);
      GameScene.add(created);
      return created;
    });
  }

  createInstance (obj: GameObject): void {
    MonoContainer.createInstance(obj.className, obj);
  }
}
