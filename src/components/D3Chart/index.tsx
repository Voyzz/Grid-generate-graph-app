import Heatmap from 'heatmap.js';
import React, { useRef, useEffect } from 'react';

function MyHeatmapComponent() {
  const heatmapContainerRef = useRef(null);

  useEffect(() => {
    // 在组件挂载后初始化 Heatmap.js
    const heatmapInstance = Heatmap.create({
      container: heatmapContainerRef.current
    });

    var points = [];
    var max = 0;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var len = 200;

    while (len--) {
      var val = Math.floor(Math.random() * 100);
      max = Math.max(max, val);
      var point = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        value: val
      };
      points.push(point);
    }
    // heatmap data format
    var data = {
      max: max,
      data: points
    };
    // if you have a set of datapoints always use setData instead of addData
    // for data initialization
    heatmapInstance.setData(data);
  }, []);

  return <div ref={heatmapContainerRef} style={{ width: '100vw', height: '100vh' }} />;
}

export default MyHeatmapComponent;
