import React, { useState, useEffect } from 'react';
import { Drawer } from 'antd';
import Buttons from '../Buttons';
import * as echarts from 'echarts';
import './index.css';
import { option as chartOption } from './graph-option';

interface ChartProps {}

const Chart = React.memo((props: ChartProps) => {
  const [chartInstance, setChartInstance] = useState<any>(null);
  const [sidesheetVisible, setSidesheetVisible] = useState<boolean>(false);

  useEffect(() => {
    // 基于准备好的dom，初始化echarts实例
    const domNode = document.getElementById('grid-chart');
    const theChart = echarts.init(domNode);
    // 绘制图表
    theChart.setOption(chartOption);
    setChartInstance(theChart);
  }, []);

  return (
    <>
      <div id="grid-chart"/>
      <Buttons chartInstance={chartInstance} openDrawer={() => {setSidesheetVisible(true)}}/>
      <Drawer title="参数配置" placement="right" onClose={() => {setSidesheetVisible(false)}} open={sidesheetVisible}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  )
});

export default Chart;
