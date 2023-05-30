import React, { useEffect, useState } from 'react';
import { isMobile } from '../../utils/common';
import { Form, Button, Drawer, Space, Input, Card, ColorPicker, Row, Col, InputNumber } from 'antd';
import ExcelUploader from '../../utils/ExcelUploader';
import defaultValue from '../../data/form_default';
import type { Color } from 'antd/es/color-picker';
import './index.css';

export interface ReflectKeys {
  node: { name: string, amplitude: string }
  link: {
    sourceName: string,
    targetName: string,
    activePower: string
  }
}

export interface Configs {
  node: {
    amplitudeRange: number[];
    nodeColor?: string;
    nodeTextColor?: string;
  },
  link: {
    activePowerRange: number[];
    lineColor?: string;
    lineTextColor?: string;
  }
}
export interface CustomOptionsItems {
  title: string;
  bgColor: string;
  nodesData: any;
  linkData: any[];
  reflectKeys: ReflectKeys;
  customConfig: Configs;
  heatmapConfig: any;
}

const layout = {
  // labelCol: { span: 6 },
  // wrapperCol: { span: 20 },
};

interface FormEditorProps {
  sidesheetVisible: boolean;
  closeDrawer: () => void;
  getFormValues: (CustomOptionsItems) => void;
}

const FormEditor = React.memo((props: FormEditorProps) => {
  const [form] = Form.useForm();
  const [sidesheetVisible, setSidesheetVisible] = useState<boolean>(props.sidesheetVisible);
  const { customConfig } = form.getFieldsValue();

  // 非受控表单配置项
  const [nodeColor, setNodeColor] = useState<Color | string>('');
  const [nodeTextColor, setNodeTextColor] = useState<Color | string>('');
  const [lineColor, setLineColor] = useState<Color | string>('');
  const [lineTextColor, setLineTextColor] = useState<Color | string>('');

  useEffect(() => {
    setTimeout(() => {
      const { customConfig } = form.getFieldsValue();
      setNodeColor(customConfig?.node?.nodeColor);
      setNodeTextColor(customConfig?.node?.nodeTextColor);
      setLineColor(customConfig?.link?.lineColor);
      setLineTextColor(customConfig?.link?.lineTextColor);
    }, 100);
  }, [form])


  useEffect(() => {
    setSidesheetVisible(props.sidesheetVisible)
  }, [props.sidesheetVisible])

  const onFinish = () => {
    const { getFormValues, closeDrawer } = props;
    const values = form.getFieldsValue();
    // console.info('===Form Values:', values);
    getFormValues && getFormValues(values);
    closeDrawer();
  };

  const renderDrawerFooter = () => (
    <div className='drawerFooterBox'>
      <Space wrap>
        <Button type="primary" onClick={onFinish}>
          确定
        </Button>
      </Space>
    </div>
  )

  const renderFileConfig = () => (
    <Card title="PG File" className='formCard'>
      <Form.Item label="接线图(.pg)" name="nodesData" required>
        <ExcelUploader
          btnName="上传"
          handleExcelUpload={(sheet_to_json) => {
            form.setFieldsValue({ nodesData: sheet_to_json });
          }}
        />
      </Form.Item>
    </Card>
  )

  const renderChartSettings = () => (
    <Card title="Chart Setting" className='formCard'>
      <Form.Item
        label="图片标题"
        name="title"
      >
        <Input />
      </Form.Item>
      <Row>
        <Col span={10}>
          <Form.Item
            label="节点颜色"
            name={['customConfig', 'node', 'nodeColor']}
          >
            <ColorPicker value={nodeColor} onChange={(value: Color, hex: string) => {
              setNodeColor(hex);
              form.setFieldValue('customConfig', {
                ...customConfig,
                node: {
                  ...customConfig?.node,
                  nodeColor: hex
                }
              })
            }} />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item
            label="节点文字颜色"
            name={['customConfig', 'node', 'nodeTextColor']}
          >
            <ColorPicker value={nodeTextColor} onChange={(value: Color, hex: string) => {
              setNodeTextColor(hex);
              form.setFieldValue('customConfig', {
                ...customConfig,
                node: {
                  ...customConfig?.node,
                  nodeTextColor: hex
                }
              })
            }} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <Form.Item
            label="连线颜色"
            name={['customConfig', 'link', 'lineColor']}
          >
            <ColorPicker value={lineColor} onChange={(value: Color, hex: string) => {
              setLineColor(hex);
              form.setFieldValue('customConfig', {
                ...customConfig,
                link: {
                  ...customConfig?.link,
                  lineColor: hex
                }
              })
            }} />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item
            label="连线文字颜色"
            name={['customConfig', 'link', 'lineTextColor']}
          >
            <ColorPicker value={lineTextColor} onChange={(value: Color, hex: string) => {
              setLineTextColor(hex);
              form.setFieldValue('customConfig', {
                ...customConfig,
                link: {
                  ...customConfig?.link,
                  lineTextColor: hex
                }
              })
            }} />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  )

  const renderHeatMapSettings = () => (
    <Card title="Heatmap Setting" className='heatmapFormCard'>
      <Row>
        <Col span={10}>
          <Form.Item
            label="热力半径"
            name={['heatmapConfig', 'radius']}
          >
            <InputNumber min={1} step={5} />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  )

  return (
    <Drawer
      width={isMobile ? 'calc(100vw - 40px)' : 600}
      title="参数配置"
      placement="left"
      onClose={() => { props.closeDrawer() }}
      open={sidesheetVisible}
      footer={renderDrawerFooter()}
    >
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 800 }}
        initialValues={defaultValue}
        labelWrap
      >
        {renderFileConfig()}
        {renderChartSettings()}
        {renderHeatMapSettings()}
      </Form>
    </Drawer>
  );
});

export default FormEditor;