export type GameStatus = 'WAITING' | 'DICE' | 'DIRECTION' | 'MOVING' | 'RESULT';

export type GameObject = {
  id: string;
  className: string;
  position: Vector3;
  quaternion: Quaternion;
  size: Vector3;
  other?: PlaneObject;
};

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Quaternion extends Vector3 {
  w: number;
}

interface PlaneObject {
  [name: string]: string | number;
}
