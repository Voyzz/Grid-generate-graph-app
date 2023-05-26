import Heatmap from 'heatmap.js';
import React, { useRef, useEffect } from 'react';

interface Props {
  chartOption?: any;
}

const heatNodeRadius = 25;
// const nodeRadius = 10;

function MyHeatmapComponent(props: Props) {
  const heatmapContainerRef = useRef(null);
  const { chartOption } = props;

  const heatmapConfig = {
    container: heatmapContainerRef.current,
    radius: heatNodeRadius,
    // maxOpacity: .5,
    // minOpacity: 0,
    // blur: .75,
    // gradient: {
    //   // enter n keys between 0 and 1 here
    //   // for gradient color customization
    //   '.3': 'blue',
    //   '.8': 'red',
    //   // '.95': 'white'
    // }
  };

  const destroyCanvas = () => {
    const heatmapCanvasList = document.querySelectorAll('.heatmap-canvas');
    if (heatmapCanvasList?.length > 0) {
      heatmapCanvasList[0]?.remove();
    }
  }

  const genHeatmapData = (_chartOption: any) => {
    // 生成热力图数据
    const chartData = _chartOption.series[0] || {};
    let max = 0;
    const { links = [], data = [] } = chartData;
    const heatmapData = [];

    const getPointsOnLineWithInterval = (x1, y1, x2, y2, value) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      const unitDx = dx / length;
      const unitDy = dy / length;
      for (let i = 0; i <= length; i += (heatNodeRadius / 2)) {
        const x = x1 + unitDx * i;
        const y = y1 + unitDy * i;
        heatmapData.push({ x: x, y: y, value });
      }
    }

    links.forEach(it => {
      const { value } = it;
      const number = Number(/\+/.test(value) ? value.split('+')[0] : value.split('-')[0]);
      if (number > max) {
        max = number;
      }
      const { source, target } = it;
      const node_source = data.find(n => n.name === source) || {};
      const node_target = data.find(n => n.name === target) || {};
      getPointsOnLineWithInterval(node_source?.x, node_source?.y, node_target?.x, node_target?.y, number);
    })
    const _data = {
      max,
      data: heatmapData
    }

    // 在组件挂载后初始化 Heatmap.js
    destroyCanvas();
    const heatmapInstance = Heatmap.create(heatmapConfig);
    heatmapInstance.setData(_data);
  }

  useEffect(() => {
    // 更新图像
    chartOption && genHeatmapData(chartOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartOption]);

  return <div ref={heatmapContainerRef} style={{ width: '100vw', height: '100vh' }} />;
}

export default MyHeatmapComponent;
