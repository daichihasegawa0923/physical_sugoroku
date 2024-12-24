interface StageMapTipMap {
  box: {
    name: 'box';
    height: number;
  };
  slope: {
    name: 'slope';
    height: number;
    direction: 'f' | 'b' | 'l' | 'r';
  };
}

export type StageMapKey = keyof StageMapTipMap;

export type StageMapTip<Key extends StageMapKey> = StageMapTipMap[Key];

export type StageMapTipBasicType = StageMapTip<StageMapKey>;

export type StageMap = Array<Array<StageMapTipBasicType | null>>;
