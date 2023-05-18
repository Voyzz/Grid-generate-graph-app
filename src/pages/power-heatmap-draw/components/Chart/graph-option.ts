/** 
  图片配置信息
  文档：https://echarts.apache.org/zh/option.html#series-graph.type
 **/
import * as echarts from "echarts";
import { CustomOptionsItems } from "../FormEditor";
import { getNodesData, getLinkData } from "./graph-data";

type EChartsOption = echarts.EChartsOption;

export const getEChartsOption = (
  customOptions?: CustomOptionsItems
): EChartsOption => {
  const defalutOption: EChartsOption = {
    title: {
      text: customOptions?.title || "Demon",
    },
    backgroundColor: customOptions?.bgColor || "#ffffff00",
    tooltip: {},
    animationDurationUpdate: 1500,
    animationEasingUpdate: "quinticInOut",
    series: [
      {
        type: "graph",

        /* 数据 */
        data: getNodesData(customOptions),
        links: getLinkData(customOptions),

        /* 布局配置 */
        draggable: false, // 节点是否可拖拽
        roam: false, // 开启缩放或者平移
        // center: ["50%", "50%"],
        // zoom: 4,

        /* 力引导布局 */
        layout: "none",

        /* 节点 */
        label: {
          show: true,
          formatter: "{b}",
          fontSize: 12,
          // color: "#f00",
        },
        itemStyle: {},
        // labelLayout: {
        //   draggable: true,
        // },

        /* 连接线 */
        animation: true,
        autoCurveness: true,
        edgeSymbol: ["circle", "arrow"],
        edgeSymbolSize: [4, 10],
        edgeLabel: {
          fontSize: 14,
          offset: [30, 0],
          // verticalAlign: "bottom",
          // lineHeight: 14,
          // height: 14,
        },
        lineStyle: {
          width: 2,
          // color: "#e66",
          curveness: 0,
        },
      },
    ],
  };

  try {
    const nodeColor = customOptions?.customConfig?.node?.nodeColor;
    if (nodeColor) {
      defalutOption.series[0].itemStyle = {
        color: nodeColor,
      };
    }
    const nodeTextColor = customOptions?.customConfig?.node?.nodeTextColor;
    if (nodeTextColor) {
      defalutOption.series[0].label.color = nodeTextColor;
    }
    const lineColor = customOptions?.customConfig?.link?.lineColor;
    if (lineColor) {
      defalutOption.series[0].lineStyle.color = lineColor;
    }
    const lineTextColor = customOptions?.customConfig?.link?.lineTextColor;
    if (lineTextColor) {
      defalutOption.series[0].edgeLabel.color = lineTextColor;
    }
  } catch (e) {
    console.error(e);
    return defalutOption;
  }

  return defalutOption;
};
