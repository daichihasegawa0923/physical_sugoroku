export type GameStatus = 'WAITING' | 'DICE' | 'DIRECTION' | 'MOVING' | 'RESULT';

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Quaternion extends Vector3 {
  w: number;
}

export type PlaneData = Record<string, string | number>;

export interface GameObject {
  id: string;
  className: string;
  position: Vector3;
  quaternion: Quaternion;
  size: Vector3;
  other?: PlaneData;
}
