import { uniqBy } from 'lodash';
import oriLinkData from '../../data/link_data.json';
import oriNodesData from '../../data/node_data.json';
import { nodeKeyReflect, nodeOriginKey } from '../../types/node';
import { linkKeyReflect, linkOriginKey } from '../../types/link';

// 根据幅值筛选node
const girdNodeFilter = (oriNodes: nodeOriginKey[]) => uniqBy(oriNodes?.filter((_node: nodeOriginKey) => {
  const nodeAmplitude = _node[nodeKeyReflect.amplitude];
  return nodeAmplitude && nodeAmplitude >= 200 && nodeAmplitude < 300;
}), nodeKeyReflect.name);
const pureNodeList = girdNodeFilter(oriNodesData);

// node转换为option.data数据
const girdNodeWrapper = (oriNodes: nodeOriginKey[]) => oriNodes.map((_node: nodeOriginKey) => {
  return {
    id: _node[nodeKeyReflect.name],
    name: `${_node[nodeKeyReflect.name]}(${_node[nodeKeyReflect.amplitude]})`,
    symbolSize: Math.ceil(_node[nodeKeyReflect.amplitude] - 200)
  }
});
const graphNode = girdNodeWrapper(pureNodeList);

// 根据有功功率筛选link
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
const pureLinkList = gridLinkFilter(oriLinkData);

// link转换为option.edges数据
const linkNodeWrapper = (oriLinkData: linkOriginKey[]) => oriLinkData.map((_link: linkOriginKey) => {
  return {
    source: _link[linkKeyReflect.sourceName],
    target: _link[linkKeyReflect.targetName],
    value: Number(_link[linkKeyReflect.activePower]),
    lineStyle: {
      width: Number(_link[linkKeyReflect.activePower]) / 100,
    },
    label: {
      show: true,
      formatter: '{c}'
    }
  }
});
const graphLink = linkNodeWrapper(pureLinkList);

console.log('=====linkData', graphLink);
console.log('=====NodesData', graphNode);

export {
  graphNode,
  graphLink
}