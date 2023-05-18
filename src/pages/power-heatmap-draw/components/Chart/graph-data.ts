// import { uniqBy } from "lodash";
// import demoLinkData from "../../data/link_data.json";
// import demoNodesData from "../../data/node_data.json";
import { CustomOptionsItems } from "../FormEditor";
import {
  // nodeKeyReflect as defaultNodeKeyReflect,
  nodeOriginKey,
  // defaultNodeConfig,
} from "../../types/node";
import {
  // linkKeyReflect as defaultLinkKeyReflect,
  linkOriginKey,
  // defaultLinkConfig,
} from "../../types/link";

const getNodeName = (it: any) => {
  let _text = "";
  try {
    // const item = it["$"];
    const item = it;
    const subText = item.Label[0].SubText;
    subText.forEach((text: any) => {
      const Text = text["$"]?.Text;
      if (Text) {
        _text = _text + `${Text}\n`;
      }
    });
  } catch (e) {
    console.error(e);
  }
  return _text;
};

const zoom = 1;

export const getNodesData = (customOptions: CustomOptionsItems) => {
  const { nodesData: _oriNodesData = [] } = customOptions || {};

  let oriNodesData = null;
  try {
    oriNodesData = _oriNodesData["NR_POWER_DRAW"]?.Canvas[0].StaSet[0].Station;
  } catch (e) {
    console.error(e);
  }

  console.info("========oriNodesData", oriNodesData);

  if (!oriNodesData) {
    return [];
  }

  // node转换为option.data数据
  const girdNodeWrapper = (oriNodes: nodeOriginKey[]) =>
    oriNodes.map((_node: any, idx) => {
      const item = _node["$"];

      return {
        // id: idx,
        name: getNodeName(_node),
        symbolSize: 50,
        x: parseInt(item.Pos_x) / zoom,
        y: parseInt(item.Pos_y) / zoom,
      };
    });
  const graphNode = girdNodeWrapper(oriNodesData);
  console.log("=====NodesData", graphNode);

  return graphNode;
};

export const getLinkData = (customOptions: CustomOptionsItems) => {
  const { nodesData: _oriData = [] } = customOptions || {};

  let oriLinkData = null;
  try {
    oriLinkData = _oriData["NR_POWER_DRAW"]?.Canvas[0].RelSet[0].LinkLine;
  } catch (e) {
    console.error(e);
  }

  let oriNodesData = {};
  try {
    oriNodesData = _oriData["NR_POWER_DRAW"]?.Canvas[0].StaSet[0].Station;
  } catch (e) {
    console.error(e);
  }

  if (!oriLinkData) {
    return [];
  }

  // link转换为option.edges数据
  const linkNodeWrapper = (oriLinkData: linkOriginKey[]) =>
    oriLinkData.map((_link: any) => {
      let StaFromItem = {},
        StaToItem = {},
        linkText = 0;
      try {
        const linkItem = _link["$"];
        StaFromItem = oriNodesData[Number(linkItem.StaFromID)];
        StaToItem = oriNodesData[Number(linkItem.StaToID)];
        linkText = _link.Base[0]["$"].LabTxt;
      } catch (e) {
        console.info(e);
      }

      return {
        source: getNodeName(StaFromItem),
        target: getNodeName(StaToItem),
        value: linkText,
        // lineStyle: {
        //   width: Math.ceil(lineWidth),
        // },
        label: {
          show: true,
          formatter: "{c}",
        },
      };
    });
  const graphLink = linkNodeWrapper(oriLinkData);
  console.log("=====linkData", graphLink);

  return graphLink;
};
