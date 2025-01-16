import { Vector3 } from '..';

export type StageClasses =
  | 'Stage1'
  | 'Stage2'
  | 'Stage3'
  | 'Stage4'
  | 'StageTest';

export interface GameStageCommon {
  rate: number;
  goalPosition: { x: number; y: number; height: number };
  piece1Position: { x: number; y: number };
  piece2Position: { x: number; y: number };
  piece3Position: { x: number; y: number };
  piece4Position: { x: number; y: number };
}

export class StageCommon {
  public constructor(
    public readonly rate: number,
    public readonly goalPosition: { x: number; y: number; height: number },
    public readonly piece1Position: { x: number; y: number },
    public readonly piece2Position: { x: number; y: number },
    public readonly piece3Position: { x: number; y: number },
    public readonly piece4Position: { x: number; y: number }
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

  public getPiecePosition(number: string): Vector3 {
    switch (number) {
      case '1':
        return this.getPositionFromMapPoint(
          this.piece1Position.x,
          10,
          this.piece1Position.y
        );
      case '2':
        return this.getPositionFromMapPoint(
          this.piece2Position.x,
          10,
          this.piece2Position.y
        );
      case '3':
        return this.getPositionFromMapPoint(
          this.piece3Position.x,
          10,
          this.piece3Position.y
        );
      case '4':
        return this.getPositionFromMapPoint(
          this.piece4Position.x,
          10,
          this.piece4Position.y
        );
    }
    throw Error('invalid number');
  }
}

export const Commons: Record<StageClasses, StageCommon> = {
  Stage1: new StageCommon(
    3,
    { x: 2, y: 2, height: 4 },
    { x: 0, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
    { x: 4, y: 0 }
  ),
  Stage2: new StageCommon(
    3,
    { x: 3, y: 3, height: 5 },
    { x: 1, y: 1 },
    { x: 5, y: 5 },
    { x: 1, y: 5 },
    { x: 5, y: 1 }
  ),
  Stage3: new StageCommon(
    3,
    { x: 3, y: 3, height: 5 },
    { x: 1, y: 1 },
    { x: 5, y: 5 },
    { x: 1, y: 5 },
    { x: 5, y: 1 }
  ),
  Stage4: new StageCommon(
    3,
    { x: 2, y: 2, height: 8 },
    { x: 0, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
    { x: 4, y: 0 }
  ),
  StageTest: new StageCommon(
    2,
    { x: 0, y: 1, height: 3 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 }
  ),
};
