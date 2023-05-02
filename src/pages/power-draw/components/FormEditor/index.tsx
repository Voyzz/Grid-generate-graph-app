import React, { useEffect, useState } from 'react';
import { isMobile } from '../../utils/common';
import { Form, Button, Drawer, Space, Input, Collapse, Divider, Card, Slider } from 'antd';
import ExcelUploader from '../../utils/ExcelUploader';
import defaultValue from '../../data/form_default';
import './index.css';

const { Panel } = Collapse;

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
  nodesData: any[];
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
      <Form.Item label="幅值文件" name="nodesData" required>
        <ExcelUploader
          btnName="上传"
          handleExcelUpload={(sheet_to_json) => {
            form.setFieldsValue({ nodesData: sheet_to_json });
          }}
        />
      </Form.Item>
      <Collapse bordered={false} className='formItem'>
        <Panel header="幅值字段映射" key="reflec-node">
          <Form.Item
            label="名称"
            name={['reflectKeys', 'node', 'name']}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="幅值"
            name={['reflectKeys', 'node', 'amplitude']}
          >
            <Input />
          </Form.Item>
        </Panel>
      </Collapse>
      <Divider dashed />
      <Form.Item label="功率文件" name="linkData" required>
        <ExcelUploader
          btnName="上传"
          handleExcelUpload={(sheet_to_json) => {
            form.setFieldsValue({ linkData: sheet_to_json });
          }}
        />
      </Form.Item>
      <Collapse bordered={false} className='formItem'>
        <Panel header="功率字段映射" key="reflect-link">
          <Form.Item
            label="起点"
            name={['reflectKeys', 'link', 'sourceName']}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="终点"
            name={['reflectKeys', 'link', 'targetName']}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="有功功率"
            name={['reflectKeys', 'link', 'activePower']}
          >
            <Input />
          </Form.Item>
        </Panel>
      </Collapse>
    </Card>
  )

  const renderConfig = () => (
    <Card title="Filter" className='formCard'>
      <Collapse bordered={false} className='formCard' defaultActiveKey={['config-node']}>
        <Panel header="Node" key="config-node">
          <Form.Item
            label="幅值比例范围"
            name={['customConfig', 'node', 'amplitudeRange']}
          >
            <Slider range max={600} step={10} />
          </Form.Item>
        </Panel>
      </Collapse>
      <Collapse bordered={false} className='formCard' defaultActiveKey={['config-link']}>
        <Panel header="Node" key="config-link">
          <Form.Item
            label="功率比例范围"
            name={['customConfig', 'link', 'activePowerRange']}
          >
            <Slider range max={500} step={10} />
          </Form.Item>
        </Panel>
      </Collapse>
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
        label="背景颜色"
        name="bgColor"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="节点颜色"
        name={['customConfig', 'node', 'nodeColor']}
      >
        <Input placeholder={_placeholder} />
      </Form.Item>
      <Form.Item
        label="节点文字颜色"
        name={['customConfig', 'node', 'nodeTextColor']}
      >
        <Input placeholder={_placeholder} />
      </Form.Item>
      <Form.Item
        label="连线颜色"
        name={['customConfig', 'link', 'lineColor']}
      >
        <Input placeholder={_placeholder} />
      </Form.Item>
      <Form.Item
        label="连线文字颜色"
        name={['customConfig', 'link', 'lineTextColor']}
      >
        <Input placeholder={_placeholder} />
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
        {renderConfig()}
        {renderSettings()}
      </Form>
    </Drawer>
  );
});

export default FormEditor;