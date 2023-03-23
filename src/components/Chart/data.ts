import * as echarts from 'echarts';
import { uniqBy } from 'lodash';
import oriLinkData from '../../data/link_data.json';
import oriNodesData from '../../data/node_data.json';
import { nodeKeyReflect, nodeOriginKey } from '../../types/node';
import { linkKeyReflect, linkOriginKey } from '../../types/link';

type EChartsOption = echarts.EChartsOption;

const girdNodeFilter = (oriNodes: nodeOriginKey[]) => uniqBy(oriNodes?.filter((_node: nodeOriginKey) => {
  const nodeAmplitude = _node[nodeKeyReflect.amplitude];
  return nodeAmplitude && nodeAmplitude >= 200 && nodeAmplitude < 300;
}), nodeKeyReflect.name);

const girdNodeWrapper = (oriNodes: nodeOriginKey[]) => oriNodes.map((_node: nodeOriginKey) => {
  return {
    id: _node[nodeKeyReflect.name],
    name: `${_node[nodeKeyReflect.name]}(${_node[nodeKeyReflect.amplitude]})`,
    symbolSize: Math.ceil(_node[nodeKeyReflect.amplitude] - 200)
  }
});

const pureNodeList = girdNodeFilter(oriNodesData);
const graphNode = girdNodeWrapper(pureNodeList);

const gridLinkFilter = (oriLinkData: linkOriginKey[]) => uniqBy(oriLinkData?.map((_link: linkOriginKey) => {
  const linkActivePower = _link[linkKeyReflect.activePower];
  if (linkActivePower && Number(linkActivePower) > 0) {
    return {
      ..._link,
      uniqKey: JSON.stringify([
        _link[linkKeyReflect.sourceName],
        _link[linkKeyReflect.targetName],
      ].sort())
    }
  }
  return null
}), 'uniqKey').filter(it => it);

const linkNodeWrapper = (oriLinkData: linkOriginKey[]) => oriLinkData.map((_link: linkOriginKey) => {
  return {
    source: _link[linkKeyReflect.sourceName],
    target: _link[linkKeyReflect.targetName],
    value: Number(_link[linkKeyReflect.activePower]),
    lineStyle: {
      width: 4,
    },
    label: {
      show: true,
      formatter: '{c}'
    }
  }
});

const pureLinkList = gridLinkFilter(oriLinkData);
const graphLink = linkNodeWrapper(pureLinkList);

console.log('=====linkData', graphLink);
console.log('=====NodesData', graphNode);

const data = [
  {
    // fixed: true,
    // x: myChart.getWidth() / 2,
    // y: myChart.getHeight() / 2,
    symbolSize: 20,
    id: '999',
    name: '-1'
  },
  {
    id: '1',
    name: '1',
    symbolSize: 30
  },
  {
    id: '2',
    name: '2',
    symbolSize: 20
  },
  {
    id: '3',
    name: '3',
    symbolSize: 50
  }
];

const edges = [
  {
    source: '999',
    target: 2,
    value: 200,
    lineStyle: {
      width: 4,
      curveness: 0.1
    },
    label: {
      show: true,
      formatter: '{c}'
    }
  },
  {
    source: 1,
    target: 0
  },
  {
    source: 1,
    target: 0
  },
  {
    source: 0,
    target: 3
  },
  {
    source: 2,
    target: 3
  }
];

export const option: EChartsOption = {
  title: {
    text: 'Basic Graph'
  },
  tooltip: {},
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  series: [
    {
      type: 'graph',
      data: graphNode,
      edges: graphLink,
      layout: 'force',
      symbolSize: 50,
      roam: true,
      label: {
        show: true,
        // position: 'right',
        formatter: '{b}'
      },
      animation: false,
      // edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 10],
      edgeLabel: {
        fontSize: 20
      },
      force: {
        // initLayout: 'circular',
        initLayout: 'circular',
        gravity: 0,
        repulsion: 100,
        edgeLength: 200
      },
      lineStyle: {
        opacity: 0.9,
        width: 2,
        curveness: 0
      }
    }
  ]
};