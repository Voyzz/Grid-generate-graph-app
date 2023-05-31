import { CustomOptionsItems } from "../FormEditor";
import { nodeOriginKey } from "../../types/node";
import { linkOriginKey } from "../../types/link";
import { uniqBy } from "lodash";

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
    _text = _text.replace(/\n+$/, '');
  } catch (e) {
    console.error(e);
  }
  return _text;
};

export const getNodesData = (customOptions: CustomOptionsItems) => {
  const { nodesData: _oriNodesData = [], heatmapConfig = {}, customConfig } = customOptions || {};
  const { isPowerHeatmap } = heatmapConfig;

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
      y: 1,
      TopLeft_x: 0,
      TopLeft_y: 0
    };
    try {
      const { BottomRight_x, BottomRight_y, TopLeft_x, TopLeft_y } = _oriNodesData["NR_POWER_DRAW"]?.Canvas[0]?.PaperAttr[0]?.['$'] || {};
      axiosZoom.x = (Number(BottomRight_x) - Number(TopLeft_x)) / innerWidth;
      axiosZoom.y = (Number(BottomRight_y) - Number(TopLeft_y)) / innerHeight;
      axiosZoom.TopLeft_x = Number(TopLeft_x);
      axiosZoom.TopLeft_y = Number(TopLeft_y);
    } catch (err) {
      console.error('getAxiosZoom error:', err);
    }
    return axiosZoom;
  }

  const axiosZoom = getAxiosZoom();

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
        symbolSize: isPowerHeatmap ? customConfig?.nodeSize || 50 : 1,
        x: Number(((parseInt(item.Pos_x) - axiosZoom.TopLeft_x) / axiosZoom.x).toFixed(0)),
        y: Number(((parseInt(item.Pos_y) - axiosZoom.TopLeft_y) / axiosZoom.y).toFixed(0)),
      };
    });

  // 根据电压筛选节点
  const graphNode = girdNodeWrapper(oriNodesData).filter(it => {
    try {
      return Number(it?.name.split('\n')[0]) > customConfig?.minVol || 0
    } catch (e) {
      return true;
    }
  });

  // 边界节点
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

  const _graphNode = graphNode.concat(layoutNodes)

  return uniqBy(_graphNode, 'name');
};

export const getLinkData = (customOptions: CustomOptionsItems) => {
  const { nodesData: _oriData = [], customConfig } = customOptions || {};

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
        lineStyle: {
          width: Number(customConfig?.lineWidth || 1),
        },
        label: {
          show: true,
          formatter: "{c}",
          align: 'right' as any,
          fontSize: Number(customConfig?.lineFontSize || 12),
        },
      };
    });
  const graphLink = linkNodeWrapper(oriLinkData);
  // console.log("=====linkData", graphLink);

  return graphLink;
};
