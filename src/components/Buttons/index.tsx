import React from 'react';
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
    Modal.info({
      title: '搜索节点名称',
      content:
        <Form
          form={form}
          initialValues={{ searchKey: '' }}
        >
          <Form.Item name="searchKey">
            <Input
              placeholder="Basic usage"
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
      }
    })
  }

  return (
    <>
      <FloatButton.Group shape="circle" style={{ right: 154 }} trigger="hover" icon={<UnorderedListOutlined />}>
        <FloatButton icon={<SearchOutlined />} onClick={findNode} />
        <FloatButton icon={<ReloadOutlined />} onClick={reload} />
        <FloatButton icon={<PictureOutlined />} onClick={downloadPic} />
      </FloatButton.Group>
      <FloatButton.Group shape="circle" style={{ right: 94 }}>
        <FloatButton type="primary" icon={<SettingOutlined />} onClick={props.openDrawer} />
      </FloatButton.Group>
    </>
  )
});

export default Buttons;
