import { CustomOptionsItems } from "../components/FormEditor";
import { nodeKeyReflect, defaultNodeConfig } from "../types/node";
import { linkKeyReflect, defaultLinkConfig } from "../types/link";

const defaultValue: CustomOptionsItems = {
  title: "电网节点图",
  nodesData: [],
  linkData: [],
  reflectKeys: {
    node: {
      name: nodeKeyReflect.name,
      amplitude: nodeKeyReflect.amplitude,
    },
    link: {
      sourceName: linkKeyReflect.sourceName,
      targetName: linkKeyReflect.targetName,
      activePower: linkKeyReflect.activePower,
    },
  },
  customConfig: {
    node: defaultNodeConfig,
    link: defaultLinkConfig,
  },
};

export default defaultValue;
