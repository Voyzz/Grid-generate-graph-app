import React from 'react';
import { isMobile } from '../../utils/common';
import { SettingOutlined, ReloadOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

interface ChartProps {
  chartInstance?: any;
  openDrawer: () => void;
}

const Buttons = React.memo((props: ChartProps) => {

  const reload = () => {
    window.location.reload();
  }

  return (
    <>
      <FloatButton.Group shape="circle" style={{ right: isMobile ? 94 : 154 }}>
        <FloatButton icon={<ReloadOutlined rev="horizontal" />} onClick={reload} />
      </FloatButton.Group>
      <FloatButton.Group shape="circle" style={{ right: isMobile ? 34 : 94 }}>
        <FloatButton type="primary" icon={<SettingOutlined rev="horizontal" />} onClick={props.openDrawer} />
      </FloatButton.Group>
    </>
  )
});

export default Buttons;
