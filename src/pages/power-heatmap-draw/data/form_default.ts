import { CustomOptionsItems } from "../components/FormEditor";
import { nodeKeyReflect, defaultNodeConfig } from "../types/node";
import { linkKeyReflect, defaultLinkConfig } from "../types/link";

const defaultValue: CustomOptionsItems = {
  title: "电网节点图",
  bgColor: "#ffffff00",
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
    nodeSize: 50,
    lineWidth: 2,
    lineFontSize: 12,
  },
  heatmapConfig: {
    radius: 25,
    opacity: .6,
    blur: .85,
    isPowerHeatmap: true,
    // gradient: {
    //   '0.25': '#0000ff',
    //   '0.45': '#00ffff',
    //   '0.65': '#00ff00',
    //   '0.85': '#ffff00',
    //   '1.0': '#ff0000',
    // },
  }
};

export default defaultValue;
