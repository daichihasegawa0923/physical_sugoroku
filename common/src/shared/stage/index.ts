import { Vector3 } from '..';

export type StageClasses = 'Stage1' | 'Stage2' | 'StageTest';

export interface GameStageCommon {
  rate: number;
  goalPosition: { x: number; y: number; height: number };
}

export class StageCommon {
  public constructor(
    public readonly rate: number,
    public readonly goalPosition: { x: number; y: number; height: number }
  ) {}

  public getPositionFromMapPoint(x: number, y: number, z: number): Vector3 {
    return {
      x: x * this.rate + this.rate / 2,
      y: y * this.rate + this.rate / 2,
      z: z * this.rate + this.rate / 2,
    };
  }

  public getGoalPositionFromMapPoint(): Vector3 {
    const { x, y, height } = this.goalPosition;
    return this.getPositionFromMapPoint(x, height, y);
  }
}

export const Commons: Record<StageClasses, StageCommon> = {
  Stage1: new StageCommon(3, { x: 2, y: 2, height: 4 }),
  Stage2: new StageCommon(1.5, { x: 2, y: 11, height: 10 }),
  StageTest: new StageCommon(2, { x: 0, y: 1, height: 3 }),
};
