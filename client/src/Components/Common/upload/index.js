import React, { Component } from "react";
import { Button, Upload, message } from "antd";
import { injectIntl } from "react-intl";
import { REQUEST_TYPE } from "../../../constant";
import { Common } from "../../../Helper/urls";
import { doRequest } from "../../../Helper/network";

const IMAGEFORMAT = "image/jpeg";
const PDFFORMAT = "application/pdf";

class CommonUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      docs: []
    };
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  onStart = file => {
    this.setState({ filename: file.name, progress: 0 });
  };

  onSuccess = (ret, file) => {};

  onError = err => {};

  onProgress = ({ percent }, file) => {
    this.setState({ progress: parseInt(percent) });
  };
  onAbort = args => {};

  onUploadComplete = ({ files = [] }) => {
    const { handleComplete } = this.props;
    const { docs } = this.state;
    this.setState({ docs: [...docs, ...files] }, () => {
      const { docs, fileList } = this.state;
      if (docs.length === fileList.length) {
        this.setState({
          fileList: [],
          docs: []
        });
        handleComplete(docs);
      }
    });
  };

  handleChange = info => {
    const fileList = info.fileList;
    this.setState({ fileList: fileList });
  };

  beforeUpload = file => {
    const isJPG = file.type === IMAGEFORMAT;
    const isPdf = file.type === PDFFORMAT;

    if (!isJPG && !isPdf) {
      message.error("You can only upload JPG or PDF file!");
    }
    return isJPG || isPdf;
  };

  customRequest = ({ file, filename, onError, onProgress, onSuccess }) => {
    const { onUploadComplete } = this;
    const onUploadProgress = ({ total, loaded }) => {
      onProgress(
        { percent: Math.round((loaded / total) * 100).toFixed(2) },
        file
      );
    };

    let data = new FormData();
    data.append("files", file, file.name);

    doRequest({
      onUploadProgress: onUploadProgress,
      method: REQUEST_TYPE.POST,
      data: data,
      url: Common.getUploadURL()
    }).then(response => {
      onUploadComplete(response.payload.data);
    });

    return {
      abort() {}
    };
  };

  render() {
    const { uploadProps, label = "UPLOAD" } = this.props;
    const { handleChange, customRequest } = this;
    const { fileList } = this.state;

    return (
      <Upload
        {...uploadProps}
        multiple={true}
        customRequest={customRequest}
        showUploadList={false}
        fileList={fileList}
        onChange={handleChange}
      >
        <Button type="ant-btn iqvia-btn mr16 ant-btn-primary ant-btn-background-ghost">
          {label}
        </Button>
      </Upload>
    );
  }
}

export default injectIntl(CommonUpload);
