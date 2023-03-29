import React, { useState, useEffect } from 'react';
import { CustomOptionsItems } from '../FormEditor';
import Buttons from '../Buttons';
import FormEditor from '../FormEditor';
import * as echarts from 'echarts';
import './index.css';
import { getEChartsOption } from './graph-option';

interface ChartProps { }

const Chart = React.memo((props: ChartProps) => {
  const [chartInstance, setChartInstance] = useState<any>(null);
  const [sidesheetVisible, setSidesheetVisible] = useState<boolean>(true);

  useEffect(() => {
    // 基于准备好的dom，初始化echarts实例
    const domNode = document.getElementById('grid-chart');
    const theChart = echarts.init(domNode);
    // 绘制图表
    theChart.setOption(getEChartsOption());
    setChartInstance(theChart);
  }, []);

  const refreshEChartsOption = (customOptions: CustomOptionsItems) => {
    chartInstance.setOption(getEChartsOption(customOptions));
  }

  return (
    <>
      <div id="grid-chart" />
      <Buttons chartInstance={chartInstance} openDrawer={() => { setSidesheetVisible(true) }} />
      <FormEditor
        sidesheetVisible={sidesheetVisible}
        closeDrawer={() => { setSidesheetVisible(false) }}
        getFormValues={refreshEChartsOption}
      />
    </>
  )
});

export default Chart;
