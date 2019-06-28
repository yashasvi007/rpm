import React, { Component } from "react";
import { Modal, Button, Form, Upload } from "antd";
import { injectIntl } from "react-intl";
import messages from "./message";
import AdverseEventForm from "./form";
import { hasErrors } from "../../../Helper/validation";
import { REQUEST_TYPE } from "../../../constant";
import { Common } from "../../../Helper/urls";
import { doRequest } from "../../../Helper/network";
import config from "../../../config";
import DocPreview from "../../Common/docPreview";
import CommonError from "../../CommonError";

class AdverseEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabledOk: true,
      docs: [],
      fileList: [],
      errorMsg: ""
    };
    this.FormWrapper = Form.create({ onFieldsChange: this.onFormChanges })(
      AdverseEventForm
    );
  }
  handleCancel = e => {
    if (e) {
      e.preventDefault();
    }
    const { close } = this.props;
    this.setState(
      { disabledOk: true, docs: [], fileList: [], errorMsg: "" },
      close
    );
  };

  handleReport = () => {
    const {
      report,
      reFetchAdverseEvent,
      medications = {},
      authUser
    } = this.props;
    const { formRef = {} } = this;
    const { docs } = this.state;
    const {
      props: {
        form: { validateFields }
      }
    } = formRef;

    let userId;
    if (authUser) {
      const {
        basicInfo: { _id }
      } = authUser;
      userId = _id;
    }
    validateFields((err, values) => {
      if (err) {
        return;
      }
      let { patient } = values;
      if (!patient) {
        values.patient = userId;
        patient = userId;
      }

      const medicationData = medications[patient] || {};
      const { medicine = [] } = medicationData;
      report({ ...values, docs, medications: [medicine] }).then(res => {
        reFetchAdverseEvent(patient);
        this.setState({
          docs: [],
          disabledOk: true,
          fileList: [],
          errorMsg: ""
        });
      });
    });
  };

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
    //
    const { docs } = this.state;
    this.setState({ docs: [...docs, ...files] }, () => {
      // eslint-disable-next-line no-unused-vars
      const { docs, fileList } = this.state;
      // (
      //   "file count",
      //   docs,
      //   fileList,
      //   docs.length === fileList.length //true => i.e all files uploaded
      // );
    });
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

  removeAttachment = pos => {
    const { docs, fileList } = this.state;
    const newDocs = docs.filter((doc, index) => {
      return index !== pos;
    });
    const newFileList = fileList.filter((file, index) => {
      return index !== pos;
    });

    this.setState({ docs: newDocs, fileList: newFileList });
    // const fileList
  };

  handleChange = info => {
    const fileList = info.fileList;
    this.setState({ fileList: fileList });
  };

  beforeUpload = file => {
    const isValid = file.type.startsWith("image") || file.type.endsWith("pdf");
    if (!isValid) {
      this.setState({ errorMsg: "please upload a valid image or pdf file!" });
    }
    return isValid;
  };

  footer = () => {
    const { requesting } = this.props;
    const {
      formatMessage,
      handleChange,
      handleCancel,
      handleReport,
      customRequest,
      beforeUpload
    } = this;
    const { disabledOk, fileList } = this.state;

    return (
      <div className="flex align-items-center justify-content-space-between h72px mr24">
        <Upload
          onChange={handleChange}
          customRequest={customRequest}
          multiple={true}
          fileList={fileList}
          showUploadList={false}
          accept={"image/*,.pdf"}
          beforeUpload={beforeUpload}
        >
          <Button className="iqvia-btn upload ml24">
            {formatMessage(messages.upload)}
          </Button>
        </Upload>

        <div>
          <Button className="iqvia-btn cancel mr8" onClick={handleCancel}>
            {formatMessage(messages.cancel)}
          </Button>
          <Button
            className="iqvia-btn"
            disabled={disabledOk}
            type="primary"
            loading={requesting}
            onClick={handleReport}
          >
            {formatMessage(messages.report)}
          </Button>
        </div>
      </div>
    );
  };

  setFormRef = formRef => {
    this.formRef = formRef;
    this.setState({ formRef: true });
  };

  onFormChanges = (props, allvalues) => {
    const isError = hasErrors(props.form.getFieldsError());
    const { disabledOk } = this.state;
    if (disabledOk !== isError && props.form.isFieldsTouched()) {
      this.setState({ disabledOk: isError });
    }
  };

  docslist = () => {
    const { docs, fileList } = this.state;
    return docs.map((value, index) => {
      const file = fileList[index];
      const { name, type, uid } = file;
      return {
        name,
        description: name,
        mediaType: type,
        index,
        id: value,
        uid: uid,
        url: `${config.BASE_DOC_URL}${value}`
      };
    });
  };

  resetMsg = () => {
    this.setState({ errorMsg: "" });
  };

  render() {
    const {
      show: visible,
      isError,
      intl: { formatMessage },
      userId,
      medications,
      products,
      fetchUserRecentMedication,
      authUser
    } = this.props;
    //

    const {
      handleCancel,
      docslist,
      footer,
      setFormRef,
      FormWrapper,
      removeAttachment,
      resetMsg
    } = this;

    const { errorMsg } = this.state;

    const modalProps = {
      visible: visible || isError,
      title: formatMessage(messages.adverseEvent),
      okButtonProps: {},
      onCancel: handleCancel,
      wrapClassName: "global-modal full-height",
      destroyOnClose: true,
      bodyStyle: { height: "100%", overflowY: "hidden" },
      width: "620px",
      footer: footer()
    };

    //
    return (
      <Modal {...modalProps}>
        {visible && (
          <div className="pl48 pr24 adverse-event-form">
            <FormWrapper
              wrappedComponentRef={setFormRef}
              userId={userId}
              fetchUserRecentMedication={fetchUserRecentMedication}
              medications={medications}
              products={products}
              show={visible}
              auth={authUser}
            />
            <div className={"doc-preview"}>
              <DocPreview media={docslist()} onRemove={removeAttachment} />
            </div>
          </div>
        )}
        {errorMsg.length > 0 && (
          <CommonError
            msg={errorMsg}
            close={resetMsg}
            className="adverse-event-error"
          />
        )}
      </Modal>
    );
  }
}

export default injectIntl(AdverseEvent);
