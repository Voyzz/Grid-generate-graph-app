import React from 'react';
import { isMobile } from '../../utils/common';
import { SettingOutlined, PictureOutlined, ReloadOutlined, SearchOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { FloatButton, Modal, Input, Form } from 'antd';

interface ChartProps {
  chartInstance?: any;
  openDrawer: () => void;
}

const Buttons = React.memo((props: ChartProps) => {
  const [form] = Form.useForm();

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
    Modal.confirm({
      title: '搜索节点',
      content:
        <Form
          form={form}
          initialValues={{ searchKey: '' }}
          labelCol={{ span: 0 }}
        >
          <Form.Item name="searchKey">
            <Input
              style={{ marginTop: '20px', marginBottom: '-10px' }}
              placeholder="搜索的节点名称"
            />
          </Form.Item>
        </Form>,
      onOk: () => {
        const { chartInstance } = props;
        const axisList = chartInstance.getModel().getSeriesByIndex(0).preservedPoints;
        const values = form.getFieldsValue();
        const _key = values.searchKey || '';
        chartInstance.setOption({
          series: {
            center: axisList[_key],
          }
        })
        console.log('=====axis', axisList[_key])
      },
      okText: '搜索',
      cancelText: '取消'
    })
  }

  return (
    <>
      <FloatButton.Group shape="circle" style={{ right: isMobile ? 94 : 154 }} trigger="hover" icon={<UnorderedListOutlined />}>
        <FloatButton icon={<SearchOutlined />} onClick={findNode} />
        <FloatButton icon={<ReloadOutlined />} onClick={reload} />
        <FloatButton icon={<PictureOutlined />} onClick={downloadPic} />
      </FloatButton.Group>
      <FloatButton.Group shape="circle" style={{ right: isMobile ? 34 : 94 }}>
        <FloatButton type="primary" icon={<SettingOutlined />} onClick={props.openDrawer} />
      </FloatButton.Group>
    </>
  )
});

export default Buttons;
