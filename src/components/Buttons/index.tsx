import React from 'react';
import { SettingOutlined, PictureOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

interface ChartProps {
  chartInstance?: any;
  openDrawer: () => void;
}

const Buttons = React.memo((props: ChartProps) => {
  const downloadPic = () => {
    const { chartInstance } = props;
    const picUrl = chartInstance.getDataURL();
    const oA = document.createElement("a");
    oA.download = 'img_1204.jpg';
    oA.href = picUrl;
    document.body.appendChild(oA);
    oA.click();
    oA.remove();
  }

  const reload = () => {
    window.location.reload();
  }

  const findNode = () => {
    const { chartInstance } = props;
    const axisList =  chartInstance.getModel().getSeriesByIndex(0).preservedPoints;
    const _key = '粤潮州21';
    chartInstance.setOption({
      series: {
        center: axisList[_key],
      }
    })
    console.log('=====axis', axisList)
  }
  
  return (
    <FloatButton.Group shape="circle" style={{ right: 94 }}>
      <FloatButton icon={<SearchOutlined />} onClick={findNode}/>
      <FloatButton icon={<ReloadOutlined />} onClick={reload}/>
      <FloatButton icon={<SettingOutlined />} onClick={props.openDrawer}/>
      <FloatButton icon={<PictureOutlined />} onClick={downloadPic}/>
    </FloatButton.Group>
  )
});

export default Buttons;
