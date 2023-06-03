import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';
import * as XLSX from 'xlsx';
import xml2js from 'xml2js';

interface ExcelUploaderProps {
  btnName?: string;
  handleExcelUpload?: (any) => void;
  fileType?: string;
}

const ExcelUploader = React.memo((props: ExcelUploaderProps) => {
  const { handleExcelUpload, btnName } = props;

  const onImportPG = (file: any) => {
    // let _json = [];// 存储获取到的数据
    // 通过FileReader对象读取文件
    const fileReader = new FileReader();
    fileReader.readAsText(file, 'utf-8');  //二进制
    fileReader.onload = event => {
      try {
        const { result: xmlInput } = event.target;
        // 使用xml2js库将XML转换为JSON
        xml2js.parseString(xmlInput, (err, result) => {
          if (err) {
            throw new Error('XML解析错误');
          } else {
            // 将JSON格式化为字符串
            handleExcelUpload && handleExcelUpload(result);
          }
        });
      } catch (e) {
        message.error('文件类型不正确');
        return;
      }
    };
  }

  const onImportExcel = (file: any) => {
    let _json = [];// 存储获取到的数据
    // 通过FileReader对象读取文件
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);  //二进制
    fileReader.onload = event => {
      try {
        const { result } = event.target;

        // 以二进制流方式读取得到整份excel表格对象
        const workbook = XLSX.read(result, { type: 'binary' });
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            _json = _json.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
          }
        }
        handleExcelUpload && handleExcelUpload(_json);
        return;
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
        beforeUpload={props?.fileType === 'excel' ? onImportExcel : onImportPG}
        showUploadList={true}
        maxCount={1}
      >
        <Button>
          <UploadOutlined rev="horizontal" />
          {btnName || '点击上传Excel'}
        </Button>
      </Upload>
    </div>
  )
});

export default ExcelUploader;