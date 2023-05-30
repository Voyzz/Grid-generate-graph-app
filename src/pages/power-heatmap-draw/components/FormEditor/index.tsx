import React, { useEffect, useState } from 'react';
import { isMobile } from '../../utils/common';
import { Form, Button, Drawer, Space, Input, Card } from 'antd';
import ExcelUploader from '../../utils/ExcelUploader';
import defaultValue from '../../data/form_default';
import { PopoverPicker } from '../ColorPicker';
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
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 20 },
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
  const [nodeColor, setNodeColor] = useState('');
  const [nodeTextColor, setNodeTextColor] = useState('');
  const [lineColor, setLineColor] = useState('');
  const [lineTextColor, setLineTextColor] = useState('');

  useEffect(() => {
    setTimeout(() => {
      const { customConfig } = form.getFieldsValue();
      setNodeColor(customConfig?.node?.nodeColor);
      setNodeTextColor(customConfig?.node?.nodeTextColor);
      setLineColor(customConfig?.link?.lineColor);
      setLineTextColor(customConfig?.link?.lineTextColor);
    }, 100);
  }, [])


  useEffect(() => {
    setSidesheetVisible(props.sidesheetVisible)
  }, [props.sidesheetVisible])

  const onFinish = () => {
    const { getFormValues, closeDrawer } = props;
    const values = form.getFieldsValue();
    console.info('===Form Values:', values);
    getFormValues && getFormValues(values);
    closeDrawer();
  };

  const onReset = () => {
    form.resetFields();
  };

  const renderDrawerFooter = () => (
    <div className='drawerFooterBox'>
      <Space wrap>
        <Button type="primary" onClick={onFinish}>
          确定
        </Button>
        <Button htmlType="button" onClick={onReset}>
          重置
        </Button>
      </Space>
    </div>
  )

  const renderFileConfig = () => (
    <Card title="Excel File" className='formCard'>
      <Form.Item label="接线图文件" name="nodesData" required>
        <ExcelUploader
          btnName="上传"
          handleExcelUpload={(sheet_to_json) => {
            form.setFieldsValue({ nodesData: sheet_to_json });
          }}
        />
      </Form.Item>
    </Card>
  )

  const _placeholder = '支持使用rgba, #ffffff等格式';

  const renderSettings = () => (
    <Card title="Setting" className='formCard'>
      <Form.Item
        label="图片标题"
        name="title"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="节点颜色"
        name={['customConfig', 'node', 'nodeColor']}
      >
        <PopoverPicker color={nodeColor} onChange={(color: string) => {
          setNodeColor(color);
          form.setFieldValue('customConfig', {
            ...customConfig,
            node: {
              ...customConfig?.node,
              nodeColor: color
            }
          })
        }} />
      </Form.Item>
      <Form.Item
        label="节点文字颜色"
        name={['customConfig', 'node', 'nodeTextColor']}
      >
        <PopoverPicker color={nodeTextColor} onChange={(color: string) => {
          setNodeTextColor(color);
          form.setFieldValue('customConfig', {
            ...customConfig,
            node: {
              ...customConfig?.node,
              nodeTextColor: color
            }
          })
        }} />
      </Form.Item>
      <Form.Item
        label="连线颜色"
        name={['customConfig', 'link', 'lineColor']}
      >
        <PopoverPicker color={lineColor} onChange={(color: string) => {
          setLineColor(color);
          form.setFieldValue('customConfig', {
            ...customConfig,
            link: {
              ...customConfig?.link,
              lineColor: color
            }
          })
        }} />
      </Form.Item>
      <Form.Item
        label="连线文字颜色"
        name={['customConfig', 'link', 'lineTextColor']}
      >
        <PopoverPicker color={lineTextColor} onChange={(color: string) => {
          setLineTextColor(color);
          form.setFieldValue('customConfig', {
            ...customConfig,
            link: {
              ...customConfig?.link,
              lineTextColor: color
            }
          })
        }} />
      </Form.Item>
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
        {/* {renderConfig()} */}
        {renderSettings()}
      </Form>
    </Drawer>
  );
});

export default FormEditor;