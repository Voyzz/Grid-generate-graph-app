export enum linkKeyReflect {
  sourceName = '节点1',
  targetName = '节点2',
  activePower = '有功功率（MW）',
  reactivePower = '无功功率（MVar）',
}

export interface linkOriginKey {
  [linkKeyReflect.sourceName]: string;
  [linkKeyReflect.targetName]: string;
  [linkKeyReflect.activePower]: string | number;
  [linkKeyReflect.reactivePower]: string | number;
}