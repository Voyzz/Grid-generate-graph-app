export enum nodeKeyReflect {
  name = "名称",
  amplitude = "幅值（kV）",
}

export interface nodeOriginKey {
  [nodeKeyReflect.name]: string;
  [nodeKeyReflect.amplitude]: number;
}

export const defaultNodeConfig = {
  amplitudeRange: [200, 500],
  nodeColor: "#5c7bd9",
  nodeTextColor: "",
};
