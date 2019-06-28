import React, { Component, Fragment } from "react";
import { Modal, Button, Checkbox, Menu } from "antd";
import { injectIntl } from "react-intl";
import messages from "./message";
import "../style.less";
import IdProofViewer from "../../page/idProof";
import ConsentDocumentView from "../../page/consentDocument";
import CommonUpload from "../../Common/upload";
import verified from "../../../Assets/images/ico-verified.svg";
import notverified from "../../../Assets/images/ico-err.svg";
import { USER_CATEGORY } from "../../../constant";

const IDPROOF = "IdProof";
const CONSENTFORM = "ConsentForm";
class DocumentVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openConsent: true,
      isConsentVerified: false,
      isIdProofVerified: false,
      fileList: [],
      currentField: CONSENTFORM
    };
  }

  componentDidMount() {
    const { patientId, users, purpose } = this.props;
    const currentUser = users[patientId] || {};
    const { documents = {} } = currentUser;
    const consentFormVerified =
      currentUser !== undefined ? documents.consentFormVerified : false;
    const idProofVerified =
      currentUser !== undefined ? documents.idProofVerified : false;
    this.setState({
      isConsentVerified: consentFormVerified
    });
    this.setState({
      isIdProofVerified: idProofVerified
    });
    if (purpose) {
      if (purpose === IDPROOF) {
        this.setState({ currentField: IDPROOF });
      } else {
        this.setState({ currentField: CONSENTFORM });
      }
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.purpose !== prevProps.purpose) {
      const { purpose } = this.props;

      if (purpose) {
        if (purpose === IDPROOF) {
          this.setState({ currentField: IDPROOF });
        } else {
          this.setState({ currentField: CONSENTFORM });
        }
      } else {
        this.setState({ currentField: CONSENTFORM });
      }
    }

    if (this.props.patientId !== prevProps.patientId) {
      const { patientId, users } = this.props;
      const currentUser = users[patientId];
      const {
        documents: { consentFormVerified = false, idProofVerified = false } = {}
      } = currentUser || {};
      this.setState({
        isConsentVerified: consentFormVerified,
        isIdProofVerified: idProofVerified
      });
    }
  }

  handleCancel = e => {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      openConsent: true,
      isConsentVerified: false,
      isIdProofVerified: false
    });
    if (!this.props.purpose) {
      this.setState({ currentField: CONSENTFORM });
    }
    const { close } = this.props;
    close();
  };

  handleVerify = e => {
    e.preventDefault();
    const { patientId, verifyDocuments } = this.props;
    const { isConsentVerified, isIdProofVerified } = this.state;

    if (isConsentVerified && isIdProofVerified) {
      const proofs = { verifyConsentForm: true, verifyIdProof: true };
      verifyDocuments(patientId, proofs);
    } else if (isConsentVerified) {
      const proofs = { verifyConsentForm: true, verifyIdProof: false };
      verifyDocuments(patientId, proofs);
    } else if (isIdProofVerified) {
      const proofs = { verifyConsentForm: false, verifyIdProof: true };
      verifyDocuments(patientId, proofs);
    }
    this.handleCancel();
    //verifyDocuments(patientId);
  };

  formatMessage = data => this.props.intl.formatMessage(data);

  handleMenu = e => {
    if (e.key === "1") {
      this.setState({ currentField: CONSENTFORM });
    } else if (e.key === "2") {
      this.setState({ currentField: IDPROOF });
    }
    this.setState({
      openConsent: !this.state.openConsent
    });
  };

  handleConsentClick = value => {
    this.setState({
      isConsentVerified: value.target.checked
    });
  };

  handleIdClick = value => {
    this.setState({
      isIdProofVerified: value.target.checked
    });
  };

  handleDisable = () => {
    const { patientId, users } = this.props;
    const currentUser = users[patientId];
    const {
      documents: { consentFormVerified = false, idProofVerified = false } = {}
    } = currentUser || {};

    const { isConsentVerified, isIdProofVerified } = this.state;

    if (
      consentFormVerified !== isConsentVerified ||
      idProofVerified !== isIdProofVerified
    ) {
      return false;
    }
    return true;
  };

  handleReupload = fileList => {
    const { openConsent } = this.state;
    const { reUploadConsentDocs, reUploadIdProofs, patientId } = this.props;
    if (openConsent) {
      reUploadConsentDocs(patientId, fileList);
      this.setState({ isConsentVerified: false });
    } else if (!openConsent) {
      reUploadIdProofs(patientId, fileList);
      this.setState({ isIdProofVerified: false });
    }
  };

  footer = () => {
    const {
      requesting,
      patientId,
      users,
      purpose,
      currentUser: { basicInfo: { category } = {} } = {}
    } = this.props;
    if (category === USER_CATEGORY.DOCTOR) return null;
    const { formatMessage, handleVerify, handleDisable, handleReupload } = this;
    const currentUser = users[patientId];

    const {
      documents: {
        consentForm = [],
        consentFormVerified = false,
        idProof = [],
        idProofVerified = false
      } = {}
    } = currentUser || {};

    const { isConsentVerified, isIdProofVerified } = this.state;

    // const consentFormVerified =
    //   currentUser !== undefined
    //     ? currentUser.documents.consentFormVerified
    //     : false;
    // const idProofVerified =
    //   currentUser !== undefined ? currentUser.documents.idProofVerified : false;
    const uploadMessage = formatMessage(messages.reUploadButton);
    const uploadProps = { accept: "image/*,.pdf" };
    return (
      <div className="flex align-items-center justify-content-end h72px mr24">
        {!purpose && (
          <Fragment>
            <Checkbox
              defaultChecked={isConsentVerified}
              checked={isConsentVerified}
              disabled={consentFormVerified || consentForm.length < 1}
              onChange={this.handleConsentClick}
            >
              <span className="fontsize14 dark mr16">
                {formatMessage(messages.consentFormCheckbox)}
              </span>
            </Checkbox>
            <Checkbox
              defaultChecked={isIdProofVerified}
              checked={isIdProofVerified}
              disabled={idProofVerified || idProof.length < 1}
              onChange={this.handleIdClick}
            >
              <span className="fontsize14 dark mr24">
                {formatMessage(messages.idProofCheckbox)}
              </span>
            </Checkbox>
          </Fragment>
        )}
        <CommonUpload
          uploadProps={uploadProps}
          label={uploadMessage}
          handleComplete={handleReupload}
        />
        {!purpose && (
          <Button
            type="primary iqvia-btn"
            onClick={handleVerify}
            loading={requesting}
            disabled={handleDisable()}
          >
            {formatMessage(messages.verifyButton)}
          </Button>
        )}
      </div>
    );
  };

  render() {
    const {
      show: visible,
      intl: { formatMessage },
      users,
      patientId,
      currentUser: LoggedInUser,
      purpose
    } = this.props;

    if (visible === false || !patientId) {
      return null;
    }

    const { currentField } = this.state;
    let currentUser = users[patientId] || {};

    const { documents = {} } = currentUser;

    const { basicInfo: { category } = {} } = LoggedInUser;
    const patientName =
      currentUser !== undefined ? currentUser.basicInfo.name : null;

    const consentFormVerified =
      currentUser !== undefined ? documents.consentFormVerified : false;
    const idProofVerified =
      currentUser !== undefined ? documents.idProofVerified : false;

    const { handleCancel, footer, handleMenu } = this;

    const modalProps = {
      visible: visible,
      title:
        category === USER_CATEGORY.PATIENT
          ? "My Documents"
          : patientName + "'s Details",
      okButtonProps: {},
      onCancel: handleCancel,
      wrapClassName: "global-modal",
      destroyOnClose: true,
      bodyStyle: { height: "auto" },
      width: "1000px",
      footer: footer(),
      className: "document-verification-modal"
    };
    let selectedKey = "1";
    if (purpose === IDPROOF) {
      selectedKey = "2";
    }
    return (
      <Modal {...modalProps}>
        <div className="document-modal">
          <Menu
            className="black"
            mode="horizontal"
            defaultSelectedKeys={[selectedKey]}
          >
            <Menu.Item key="1" onClick={handleMenu}>
              {formatMessage(messages.consentFormCheckbox)}
              <img
                className="ml10 mb4"
                alt=""
                src={consentFormVerified ? verified : notverified}
              />
            </Menu.Item>
            <Menu.Item key="2" onClick={handleMenu}>
              {formatMessage(messages.idProofCheckbox)}
              <img
                className="ml10 mb4"
                alt=""
                src={idProofVerified ? verified : notverified}
              />
            </Menu.Item>
          </Menu>

          {currentField === IDPROOF && visible && (
            <IdProofViewer modal user_data={currentUser} />
          )}
          {currentField === CONSENTFORM && visible && (
            <ConsentDocumentView modal user_data={currentUser} />
          )}
        </div>
      </Modal>
    );
  }
}

export default injectIntl(DocumentVerification);
