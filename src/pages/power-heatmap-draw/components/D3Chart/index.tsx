import Heatmap from 'heatmap.js';
import React, { useRef, useEffect } from 'react';

interface Props {
  chartOption?: any;
  heatmapOption?: any;
}

function MyHeatmapComponent(props: Props) {
  const heatmapContainerRef = useRef(null);
  const { chartOption, heatmapOption = {} } = props;

  const heatNodeRadius = heatmapOption?.radius;

  const heatmapConfig = {
    container: heatmapContainerRef.current,
    ...heatmapOption
  };

  const destroyCanvas = () => {
    const heatmapCanvasList = document.querySelectorAll('.heatmap-canvas');
    if (heatmapCanvasList?.length > 0) {
      heatmapCanvasList[0]?.remove();
    }
  }

  const genHeatmapData = (_chartOption: any) => {
    const { isPowerHeatmap } = heatmapOption;

    // 生成热力图数据
    const chartData = _chartOption.series[0] || {};
    let max = 0;
    const { links = [], data = [] } = chartData;

    const heatmapData = [];

    // 生成两点间连线上的点的坐标
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

    if (isPowerHeatmap) {
      // 生成功率热力图
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
    } else {
      // 生成电压热力图
      data.forEach(node => {
        try {
          if (!node?.fixed) {
            const { x, y, name = '' } = node;
            const number = Number(name.split('\n')[0]);
            if (number > max) max = number;
            heatmapData.push({
              x,
              y,
              value: number
            })
          }
        } catch (e) {
          console.error(e)
        }
      });
    }

    const _data = {
      max,
      data: heatmapData
    }

    // 在组件挂载后初始化 Heatmap.js
    destroyCanvas();
    console.info('======== Heatmap config: ', heatmapConfig);
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
