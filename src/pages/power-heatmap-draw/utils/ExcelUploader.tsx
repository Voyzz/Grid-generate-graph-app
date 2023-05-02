import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';
import xml2js from 'xml2js';

interface ExcelUploaderProps {
  btnName?: string;
  handleExcelUpload?: (any) => void;
}

const ExcelUploader = React.memo((props: ExcelUploaderProps) => {
  const { handleExcelUpload, btnName } = props;

  const onImportPG = (file: any) => {
    // let _json = [];// 存储获取到的数据
    // 通过FileReader对象读取文件
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);  //二进制
    fileReader.onload = event => {
      try {
        const { result: xmlInput } = event.target;
        // 使用xml2js库将XML转换为JSON
        xml2js.parseString(xmlInput, (err, result) => {
          if (err) {
            throw new Error('XML解析错误');
          } else {
            // 将JSON格式化为字符串
            // const jsonStr = JSON.stringify(result, null, 2);
            console.info('======111', result);
            handleExcelUpload && handleExcelUpload(result);
            // setJsonOutput(jsonStr);
          }
        });
      } catch (e) {
        message.error('文件类型不正确');
        return;
      }
    };
  }

  return (
    <div className="FormEditorContainer">
      <Upload
        action=""
        listType="text"
        accept="file"
        beforeUpload={onImportPG}
        showUploadList={true}
        maxCount={1}
      >
        <Button>
          <UploadOutlined />
          {btnName || '点击上传Excel'}
        </Button>
      </Upload>
    </div>
  )
});

export default ExcelUploader;