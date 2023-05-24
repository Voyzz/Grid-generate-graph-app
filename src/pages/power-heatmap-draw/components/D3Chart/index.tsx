import Heatmap from 'heatmap.js';
import React, { useRef, useEffect } from 'react';

interface Props {
  chartOption?: any;
}

function MyHeatmapComponent(props: Props) {
  const heatmapContainerRef = useRef(null);
  const { chartOption } = props;

  const getAxios = (source_axios: number | undefined, target_axios: number | undefined, axiosType: string) => {
    return Number((((source_axios || 0) + (target_axios || 0)) / 2).toFixed(0))
  }

  const genHeatmapData = (_chartOption: any) => {
    // 生成热力图数据
    const chartData = _chartOption.series[0] || {};
    let max = 0;
    const { links = [], data = [] } = chartData;
    const heatmapData = links.map(it => {
      const { value } = it;
      const number = Number(/\+/.test(value) ? value.split('+')[0] : value.split('-')[0]);
      if (number > max) {
        max = number;
      }
      const { source, target } = it;
      const node_source = data.find(n => n.name === source) || {};
      const node_target = data.find(n => n.name === target) || {};
      return {
        value: number,
        x: getAxios(node_source?.x, node_target?.x, 'x'),
        y: getAxios(node_source?.y, node_target?.y, 'y')
      }
    })
    const _data = {
      max,
      data: heatmapData
    }

    // 在组件挂载后初始化 Heatmap.js
    const heatmapInstance = Heatmap.create({
      container: heatmapContainerRef.current,
      radius: 30,
    });
    heatmapInstance.setData(_data);
  }

  useEffect(() => {
    chartOption && genHeatmapData(chartOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartOption]);

  return <div ref={heatmapContainerRef} style={{ width: '100vw', height: '100vh' }} />;
}

export default MyHeatmapComponent;
