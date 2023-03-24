/** 
  图片配置信息
  文档：https://echarts.apache.org/zh/option.html#series-graph.type
 **/
import * as echarts from 'echarts';
import { graphLink, graphNode } from './graph-data';

type EChartsOption = echarts.EChartsOption;

export const option: EChartsOption = {
  title: {
    text: '电网节点图'
  },
  tooltip: {},
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  series: [
    {
      type: 'graph',

      /* 数据 */
      nodes: graphNode,
      links: graphLink,

      /* 布局配置 */
      draggable: true, // 节点是否可拖拽
      roam: true, // 开启缩放或者平移
      // center: ['50%', '50%'],

      /* 力引导布局 */
      layout: 'force',
      force: {
        initLayout: 'circular',
        gravity: 0,
        repulsion: 60, // 节点之间的斥力因子
        edgeLength: 120, // 边的两个节点之间的距离
        layoutAnimation: true, // 是否显示布局的迭代动画
        friction: 1, // 节点的移动速度
      },

      /* 节点 */
      label: {
        show: true,
        formatter: '{b}',
        fontSize: 12
      },
      // itemStyle: {},
      // labelLayout: {
      //   draggable: true,
      // },

      /* 连接线 */
      animation: false,
      autoCurveness: true,
      edgeSymbolSize: [4, 10],
      edgeLabel: {
        fontSize: 15
      },
      lineStyle: {
        width: 1,
        color: '#e66',
        curveness: 0
      }
    }
  ]
};