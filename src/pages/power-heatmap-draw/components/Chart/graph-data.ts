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
    subText.forEach((text: any, idx: number) => {
      const Text = text["$"]?.Text;
      if (Text && idx <= 3) {
        _text = _text + `${Text}\n`;
      }
    });
    _text = _text.replace(/\n+$/, '');
  } catch (e) {
    console.error(e);
  }
  return _text;
};

const getID = (it: any) => {
  let _text = "";
  try {
    // const item = it["$"];
    const item = it;
    const bus = item.BusSet[0].Bus;
    bus.forEach((b: any, idx: number) => {
      const Name = b["$"]?.Name;
      if (Name) {
        _text = _text + `${Name}\n`;
      }
    });
    _text = _text.replace(/\n+$/, '');
  } catch (e) {
    console.error(e);
  }
  return _text;
}

export const getNodesData = (customOptions: CustomOptionsItems) => {
  const { nodesData: _oriNodesData = [], heatmapConfig = {}, customConfig, filterData = [] } = customOptions || {};
  const { isPowerHeatmap } = heatmapConfig;

  let oriNodesData = null;
  try {
    oriNodesData = _oriNodesData["NR_POWER_DRAW"]?.Canvas[0].StaSet[0].Station;
  } catch (e) {
    console.error(e);
  }

  // 节点筛选
  try {
    const idList = oriNodesData.map(it => getID(it));
    oriNodesData = oriNodesData.filter((node, idx) => {
      const vol = Number(node.Label[0].SubText[0]['$'].Text);
      // 电压筛选
      if (!(vol >= customConfig?.minVol && vol <= customConfig?.maxVol)) {
        return false;
      }
      // excel筛选
      if (filterData?.length > 0 && !filterData.find(node => new RegExp(node['节点名称']).test(idList[idx]))) {
        return false;
      }
      return true;
    })
  } catch (e) {
    console.error(e);
  }


  const { innerHeight, innerWidth } = window;
  const getAxiosZoom = () => {
    const paddingTop = 3000;
    const axiosZoom = {
      x: 1,
      y: 1,
      TopLeft_x: 0,
      TopLeft_y: 0
    };
    try {
      let maxX = 0, minX = 0, maxY = 0, minY = 0;
      oriNodesData.forEach(node => {
        const _x = Number(node['$'].Pos_x);
        const _y = Number(node['$'].Pos_y);
        maxX = _x > maxX ? _x : maxX;
        minX = _x < minX ? _x : minX;
        maxY = _y > maxY ? _y : maxY;
        minY = _y < minY ? _y : minY;
      })
      // const maxX = maxBy(oriNodesData, property('$.Pos_x')).$.Pos_x;
      // const minX = minBy(oriNodesData, property('$.Pos_x')).$.Pos_x;
      // const maxY = maxBy(oriNodesData, property('$.Pos_y')).$.Pos_y;
      // const minY = minBy(oriNodesData, property('$.Pos_y')).$.Pos_y;

      // const { BottomRight_x, BottomRight_y, TopLeft_x, TopLeft_y } = _oriNodesData["NR_POWER_DRAW"]?.Canvas[0]?.PaperAttr[0]?.['$'] || {};

      // const zoomX = (Number(BottomRight_x) - Number(TopLeft_x)) / (Number(maxX) - Number(minX));
      // const zoomY = (Number(BottomRight_y) - Number(TopLeft_y)) / (Number(maxY) - Number(minY));

      const BottomRight_x = maxX + paddingTop;
      const TopLeft_x = minX - paddingTop;
      const BottomRight_y = maxY + paddingTop;
      const TopLeft_y = minY - paddingTop;
      const _zoom = 1;
      // console.info('======00', zoomX, zoomY);
      // console.info('======001', BottomRight_x, TopLeft_x, BottomRight_y, TopLeft_y)
      // console.info('======002', maxX, minX, maxY, minY)
      // console.info('======00', _zoom);

      axiosZoom.x = ((Number(BottomRight_x) - Number(TopLeft_x)) / _zoom) / innerWidth;
      axiosZoom.y = ((Number(BottomRight_y) - Number(TopLeft_y)) / _zoom) / innerHeight;
      axiosZoom.TopLeft_x = Number(TopLeft_x) / _zoom;
      axiosZoom.TopLeft_y = Number(TopLeft_y) / _zoom;
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
        // id: getID(_node) as any,
        name: getNodeName(_node),
        symbolSize: isPowerHeatmap ? customConfig?.nodeSize || 50 : 1,
        x: Number(((parseInt(item.Pos_x) - axiosZoom.TopLeft_x) / axiosZoom.x).toFixed(0)),
        y: Number(((parseInt(item.Pos_y) - axiosZoom.TopLeft_y) / axiosZoom.y).toFixed(0)),
      };
    });

  const graphNode = girdNodeWrapper(oriNodesData);

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
