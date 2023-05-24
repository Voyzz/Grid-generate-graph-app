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

export const getNodesData = (customOptions: CustomOptionsItems) => {
  const { nodesData: _oriNodesData = [] } = customOptions || {};

  let oriNodesData = null;
  try {
    oriNodesData = _oriNodesData["NR_POWER_DRAW"]?.Canvas[0].StaSet[0].Station;
  } catch (e) {
    console.error(e);
  }

  const { innerHeight, innerWidth } = window;
  const getAxiosZoom = () => {
    const axiosZoom = {
      x: 1,
      y: 1
    };
    try {
      const { BottomRight_x, BottomRight_y, TopLeft_x, TopLeft_y } = _oriNodesData["NR_POWER_DRAW"]?.Canvas[0]?.PaperAttr[0]?.['$'];
      axiosZoom.x = (Number(BottomRight_x) - Number(TopLeft_x)) / innerWidth;
      axiosZoom.y = (Number(BottomRight_y) - Number(TopLeft_y)) / innerHeight;
    } catch (err) {
      console.error('getAxiosZoom error:', err);
    }
    return axiosZoom;
  }

  const axiosZoom = getAxiosZoom();

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
        x: Number((parseInt(item.Pos_x) / axiosZoom.x).toFixed(0)),
        y: Number((parseInt(item.Pos_y) / axiosZoom.y).toFixed(0)),
      };
    });
  const graphNode = girdNodeWrapper(oriNodesData);

  const layoutNodes = [
    {
      "name": "B",
      "symbolSize": 1,
      "x": 0,
      "y": 0,
      fixed: true
    },
    {
      "name": "C",
      "symbolSize": 1,
      "x": innerWidth,
      "y": 0,
      fixed: true
    },
    {
      "name": "D",
      "symbolSize": 1,
      "x": 0,
      "y": innerHeight,
      fixed: true
    },
    {
      "name": "E",
      "symbolSize": 1,
      "x": innerWidth,
      "y": innerHeight,
      fixed: true
    },
  ]
  console.log("=====NodesData", graphNode.concat(layoutNodes));

  return graphNode.concat(layoutNodes);
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
