import React, { Component, Fragment } from "react";
import { Upload, Progress } from "antd";
import { injectIntl } from "react-intl";
import messages from "./message";
import uploadIcon from "../../Assets/images/asset-file-upload.svg";

const Dragger = Upload.Dragger;
class UploadDocumnet extends Component {
  constructor(props) {
    super(props);
    this.state = { progress: -1 };
  }

  onStart = file => {
    this.setState({ filename: file.name, progress: 0 });
  };

  onSuccess = (ret, file) => {
    const { files = [] } = this.state;
    this.setState({ progress: -1, files: [...files, file] });
  };

  onError = err => {};

  onProgress = ({ percent }, file) => {
    this.setState({ progress: parseInt(percent) });
  };

  customRequest = ({ file, filename, onError, onProgress, onSuccess }) => {
    const { uploadHandler } = this.props;
    const onUploadProgress = ({ total, loaded }) => {
      onProgress(
        { percent: Math.round((loaded / total) * 100).toFixed(2) },
        file
      );
    };

    let data = new FormData();
    data.append("files", file, file.name);

    uploadHandler({ data, onUploadProgress });
    return {
      abort() {}
    };
  };

  formatMessage = data => this.props.intl.formatMessage(data);

  render() {
    const {
      formatMessage,
      customRequest,
      onProgress,
      onError,
      onSuccess,
      onStart
    } = this;
    const { progress, filename } = this.state;
    const { is_saving } = this.props;

    return (
      <Fragment>
        <Dragger
          onProgress={onProgress}
          onError={onError}
          onStart={onStart}
          onSuccess={onSuccess}
          onabort={onabort}
          customRequest={customRequest}
          multiple={true}
          accept=".pdf,.jpg"
        >
          <img alt="upload" src={uploadIcon} />
        </Dragger>
        {progress >= 0 && is_saving && (
          <div>
            <div className="fontsize16 primary-color mt16 mt32">{filename}</div>
            <Progress
              percent={progress}
              showInfo={false}
              strokeColor="#32b9d1"
            />
            <div className=" fontsize12 cool-grey mt8">{`${formatMessage(
              messages.uploading
            )} ${progress}%`}</div>
          </div>
        )}
      </Fragment>
    );
  }
}

export default injectIntl(UploadDocumnet);
