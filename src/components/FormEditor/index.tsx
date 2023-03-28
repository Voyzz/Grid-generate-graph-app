import React, { useEffect, useState } from 'react';
import { Form, Button, Drawer, Space, Card } from 'antd';
import ExcelUploader from '../../utils/ExcelUploader';
import './index.css';

export interface CustomOptionsItems {
  nodesData: any[];
  linkData: any[];
}

const layout = {
  labelCol: { span: 4 },
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
    const { getFormValues } = props;
    const values = form.getFieldsValue();
    getFormValues && getFormValues(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const renderDrawerFooter = () => (
    <Space wrap>
      <Button type="primary" onClick={onFinish}>
        确定
      </Button>
      <Button htmlType="button" onClick={onReset}>
        重置
      </Button>
    </Space>
  )

  return (
    <Drawer
      width={600}
      title="参数配置"
      placement="right"
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
      >
        <Card title="配置文件" className='formCard'>
          <Form.Item label="幅值文件" name="nodesData" required>
            <ExcelUploader
              btnName="上传"
              handleExcelUpload={(sheet_to_json) => {
                form.setFieldsValue({ nodesData: sheet_to_json });
              }}
            />
          </Form.Item>
          <Form.Item label="功率文件" name="linkData" required>
            <ExcelUploader
              btnName="上传"
              handleExcelUpload={(sheet_to_json) => {
                form.setFieldsValue({ linkData: sheet_to_json });
              }}
            />
          </Form.Item>
        </Card>
        <Card title="字段映射" className='formCard'>

        </Card>
      </Form>
    </Drawer>
  );
});

export default FormEditor;