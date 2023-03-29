import { uniqBy } from "lodash";
// import oriLinkData from "../../data/link_data.json";
// import oriNodesData from "../../data/node_data.json";
import { CustomOptionsItems } from "../FormEditor";
import {
  nodeKeyReflect as defaultNodeKeyReflect,
  nodeOriginKey,
  defaultNodeConfig,
} from "../../types/node";
import {
  linkKeyReflect as defaultLinkKeyReflect,
  linkOriginKey,
  defaultLinkConfig,
} from "../../types/link";

export const getNodesData = (customOptions: CustomOptionsItems) => {
  const { nodesData: oriNodesData = [], reflectKeys, customConfig } =
    customOptions || {};

  if (!oriNodesData) {
    return [];
  }

  const nodeKeyReflect = reflectKeys?.node
    ? reflectKeys?.node
    : defaultNodeKeyReflect;

  const nodeConfig = customConfig?.node
    ? customConfig?.node
    : defaultNodeConfig;

  const { amplitudeRange } = nodeConfig;

  // 根据幅值筛选node
  const girdNodeFilter = (oriNodes: nodeOriginKey[]) =>
    uniqBy(
      oriNodes?.filter((_node: nodeOriginKey) => {
        const nodeAmplitude = _node[nodeKeyReflect.amplitude];
        return (
          nodeAmplitude &&
          nodeAmplitude >= amplitudeRange[0] &&
          nodeAmplitude < amplitudeRange[1]
        );
      }),
      nodeKeyReflect.name
    );
  const pureNodeList = girdNodeFilter(oriNodesData);

  // node转换为option.data数据
  const girdNodeWrapper = (oriNodes: nodeOriginKey[]) =>
    oriNodes.map((_node: nodeOriginKey, idx) => {
      const amp = Math.ceil(_node[nodeKeyReflect.amplitude]);
      const min = amplitudeRange[0];
      const max = amplitudeRange[1];
      // 大小范围10 ~ 110;
      const symbolSize = ((amp - min) / (max - min)) * 100 + 10;
      return {
        id: _node[nodeKeyReflect.name],
        name: `${_node[nodeKeyReflect.name]}(${
          _node[nodeKeyReflect.amplitude]
        })`,
        symbolSize,
        // ...(idx === 0 ? {x: '50%', y: '50%'} : {})
      };
    });
  const graphNode = girdNodeWrapper(pureNodeList);
  console.log("=====NodesData", graphNode);

  return graphNode;
};

export const getLinkData = (customOptions: CustomOptionsItems) => {
  const { linkData: oriLinkData = [], reflectKeys, customConfig } =
    customOptions || {};

  if (!oriLinkData) {
    return [];
  }

  const linkKeyReflect = reflectKeys?.node
    ? reflectKeys?.link
    : defaultLinkKeyReflect;

  const linkConfig = customConfig?.link
    ? customConfig?.link
    : defaultLinkConfig;

  const { activePowerRange } = linkConfig;

  // 根据有功功率筛选link
  const gridLinkFilter = (oriLinkData: linkOriginKey[]) =>
    uniqBy(
      oriLinkData?.map((_link: linkOriginKey) => {
        const linkActivePower = _link[linkKeyReflect.activePower];
        const linkActivePowerNumber = Math.abs(Number(linkActivePower));
        if (
          linkActivePower &&
          linkActivePowerNumber > activePowerRange[0] &&
          linkActivePowerNumber < activePowerRange[1]
        ) {
          return {
            ..._link,
            uniqKey: JSON.stringify(
              [
                _link[linkKeyReflect.sourceName],
                _link[linkKeyReflect.targetName],
              ].sort()
            ),
          };
        }
        return null;
      }),
      "uniqKey"
    ).filter((it) => it);
  const pureLinkList = gridLinkFilter(oriLinkData);

  // link转换为option.edges数据
  const linkNodeWrapper = (oriLinkData: linkOriginKey[]) =>
    oriLinkData.map((_link: linkOriginKey) => {
      const act = Math.abs(_link[linkKeyReflect.activePower]);
      const min = activePowerRange[0];
      const max = activePowerRange[1];
      // 宽度范围1 ~ 4;
      const lineWidth = ((act - min) / (max - min)) * 3 + 1;

      return {
        source: _link[linkKeyReflect.sourceName],
        target: _link[linkKeyReflect.targetName],
        value: Number(_link[linkKeyReflect.activePower]),
        lineStyle: {
          width: Math.ceil(lineWidth),
        },
        label: {
          show: true,
          formatter: "{c}",
        },
      };
    });
  const graphLink = linkNodeWrapper(pureLinkList);
  console.log("=====linkData", graphLink);

  return graphLink;
};
