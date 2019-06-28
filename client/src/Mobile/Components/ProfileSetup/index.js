import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Button } from "antd";
import ErrorComponent from "../CommonError";
import AppHeader from "../Header";
import UploadDocument from "./uploadDocument";
import CommonMessage from "../CommonMessage";
import messages from "./message";
import { PROFILE_SETUP_STAGE, path, USER_CATEGORY } from "../../../constant";
import SetUpStep from "../../Containers/Page/profileSetup/SetUpStep";
import "./style.less";

class ProfileSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    if (this.props.user_data.basicInfo.category !== USER_CATEGORY.PATIENT) {
      this.props.history.push(path.EDIT_PROFILE);
    }
    if (this.props.profileSetupData.current === PROFILE_SETUP_STAGE.DASHBOARD) {
      this.props.history.push(path.DASHBOARD);
    }
    if (
      this.props.profileSetupData.current === PROFILE_SETUP_STAGE.SETUP_PROFILE
    ) {
      this.props.history.push(path.EDIT_PROFILE);
    }
  }

  onStart = file => {};

  onSuccess = (ret, file) => {};

  onError = err => {};

  onProgress = ({ percent }, file) => {
    this.setState({ progress: percent });
  };

  componentDidUpdate(prevsProps, prevsState) {
    const {
      profileSetupData: {
        current = 0
        // is_saving,
        // is_saved,
        // is_error,
        // error,
        // msg: success_msg
      } = {},
      history
    } = this.props;
    if (current === PROFILE_SETUP_STAGE.SETUP_PROFILE) {
      history.push(path.EDIT_PROFILE);
    }
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  pickFile = e => {
    e.preventDefault();
    window.document.getElementsByClassName("ant-upload-btn")[0].click();
  };

  uploadButton = (
    <Button className="upload-btn" onClick={this.pickFile}>
      {this.formatMessage(messages.uploadButton)}
    </Button>
  );

  render() {
    const { formatMessage, uploadButton } = this;
    const {
      profileSetupData: {
        current = 0,
        is_saving,
        is_saved,
        is_error,
        error,
        msg: success_msg
      } = {},
      uploadIdProof,
      uploadConsentForm
    } = this.props;

    const uploadHandler =
      current === PROFILE_SETUP_STAGE.UPLOAD_CONSENT_FORM
        ? uploadConsentForm
        : current === PROFILE_SETUP_STAGE.UPLOAD_ID_PROOF
        ? uploadIdProof
        : null;
    return (
      <div className="flex align-items-center justify-content-center">
        <AppHeader />
        <div className=" main-iqvia-container iqvia-profile-setup-conatiner">
          <SetUpStep />
          <div className="bold dark fontsize18 mt60 mb8">
            {current === PROFILE_SETUP_STAGE.UPLOAD_CONSENT_FORM
              ? formatMessage(messages.consentForm)
              : formatMessage(messages.idProof)}
          </div>
          <div className="dark fontsize14">
            {current === PROFILE_SETUP_STAGE.UPLOAD_CONSENT_FORM
              ? formatMessage(messages.consentFormTitle)
              : formatMessage(messages.idProofTitle)}
          </div>
          <div className="label-color fontsize12">
            {current === PROFILE_SETUP_STAGE.UPLOAD_CONSENT_FORM
              ? formatMessage(messages.consentFormSubTitle)
              : formatMessage(messages.idProofSubTitle)}
          </div>

          <UploadDocument uploadHandler={uploadHandler} is_saving={is_saving} />
          {is_error && (
            <ErrorComponent
              className=""
              msg={error.message}
              close={this.props.clearError}
            />
          )}
          {is_saved && <CommonMessage className="msg" msg={success_msg} />}
          <div className="setup-profile-footer hide-mobile hide-tablet-7 hide-tablet-9">
            <div className="flex justify-content-center">{uploadButton}</div>
          </div>
          {!is_saving && (
            <div className="tac">
              <span className="cool-grey fontsize12">
                {formatMessage(messages.documentUploadHelp1)}
              </span>
              <span className="cool-grey fontsize12 bold"> .jpg, .pdf </span>
              <span className="cool-grey fontsize12">
                {formatMessage(messages.documentUploadHelp2)}
              </span>
            </div>
          )}

          <div className="setup-profile-footer hide-desktop">
            <div className="">{uploadButton}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(ProfileSetup);
