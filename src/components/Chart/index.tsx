import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import './index.css';
import { option as chartOption } from './data';;

const Chart = React.memo(() => {
  useEffect(() => {
    // 基于准备好的dom，初始化echarts实例
    const domNode = document.getElementById('grid-chart');
    const theChart = echarts.init(domNode);
    // 绘制图表
    theChart.setOption(chartOption);

  }, [])

  return (
    <div id="grid-chart"/>
  )
});

export default Chart;
