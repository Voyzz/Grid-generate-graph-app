import React from 'react';
import { SettingTwoTone, PictureTwoTone } from '@ant-design/icons';
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

  return (
    <FloatButton.Group shape="circle" style={{ right: 94 }}>
      <FloatButton icon={<SettingTwoTone />} onClick={props.openDrawer}/>
      <FloatButton icon={<PictureTwoTone />} onClick={downloadPic}/>
    </FloatButton.Group>
  )
});

export default Buttons;
