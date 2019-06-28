import React from "react";
import { Modal, Button, Input } from "antd";
import verifiedIcon from "../../../../../Assets/images/ico-verified.svg";
import errorIcon from "../../../../../Assets/images/ico-err.svg";
// import { sendOtp } from "../../../../modules/phone/index";
import { MobileLabel } from "../../../MobileInput";

import { injectIntl } from "react-intl";
import messages from "./message";

const COUNTDOWN_DEFAULT = 60;

class MobileVerification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verifyDisabled: true,
      resendDisabled: true,
      countdown: COUNTDOWN_DEFAULT
    };
    this.otp = "";
  }

  tick = () => {
    const { countdown } = this.state;

    if (countdown === 0) {
      this.setState({ resendDisabled: false });
    } else {
      this.setState({ countdown: countdown - 1 });
    }
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.tick();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  saveOtp(otp) {
    this.otp = otp;
    if (this.otp.length > 3) {
      this.setState({
        verifyDisabled: false
      });
    }
  }

  handleVerify = () => {
    const { verifyOtp, id } = this.props;
    const { otp } = this;
    this.setState({ countdown: 0, verifyDisabled: true });
    verifyOtp(otp, id);
  };

  handleCancel = () => {
    const { handleCancel } = this.props;
    this.setState({
      countdown: COUNTDOWN_DEFAULT,
      resendDisabled: true,
      verify: true
    });
    handleCancel();
  };

  resendOTP = () => {
    const { reSendOtp, contactNo, id } = this.props;

    reSendOtp(contactNo, id);

    this.setState({
      countdown: COUNTDOWN_DEFAULT,
      resendDisabled: true
    });
  };

  render() {
    const {
      intl: { formatMessage }
    } = this.props;

    const {
      visible,
      is_otp_verifying,
      is_otp_send,
      is_otp_error = false,
      otp_error = {},
      contactNo: { countryCode, phoneNumber }
    } = this.props;
    const { countdown, resendDisabled, verifyDisabled } = this.state;

    return (
      <Modal
        visible={visible || is_otp_error}
        title={formatMessage(messages.phoneVerificationTitle)}
        onOk={this.handleVerify}
        okText={formatMessage(messages.phoneVerificationOKText)}
        okButtonProps={{
          disabled:
            is_otp_verifying ||
            verifyDisabled ||
            otp_error.status === "CONTACT_ALREADY_EXISTS",
          className: "iqvia-btn"
        }}
        onCancel={this.handleCancel}
        wrapClassName={"iqvia_modals"}
        cancelButtonProps={{ className: "cancel-button hidden" }}
        destroyOnClose={true}
      >
        <div
          className={
            "w100 h100 flex align-items-start column justify-content-space-between"
          }
        >
          <div className={"w100"}>
            <div className={"w100"}>
              <div className="flex align-items-center justify-content-space-between">
                <div>
                  <div className={"fontsize12 subdued"}>
                    {formatMessage(messages.mobile)}
                  </div>
                  <MobileLabel
                    countryCode={countryCode}
                    phoneNumber={phoneNumber}
                  />
                </div>
                <Button
                  style={{ height: "45px" }}
                  onClick={this.handleCancel}
                  className={"change_number_button iqvia-btn"}
                >
                  {formatMessage(messages.chnageNumberText)}
                </Button>
              </div>
            </div>
            <div className={"w100 pt20"}>
              <Input
                placeholder={formatMessage(messages.OTPPlaceholder)}
                className={"p10"}
                onChange={e => {
                  this.saveOtp(e.target.value);
                }}
              />
            </div>
          </div>

          <div className={"w100"}>
            {
              //check for error type and display appropriate msg and error accordingly
            }
            {otp_error.status !== "CONTACT_ALREADY_EXISTS" && (
              <div
                className={
                  "w100 flex column align-items-center justify-content-center mb60"
                }
              >
                <div className={"fontsize12 subdued"}>
                  {formatMessage(messages.OTPReceivingTimeText)}
                </div>
                <div className={"bold fontsize16 pt10"}> {countdown}s</div>
                <Button
                  style={{ height: "45px" }}
                  disabled={resendDisabled}
                  type="primary"
                  className={
                    resendDisabled
                      ? "tertiary-btn mt10 iqvia-btn"
                      : "mt10 iqvia-btn"
                  }
                  onClick={this.resendOTP}
                >
                  {formatMessage(messages.resendOTP)}
                </Button>
              </div>
            )}

            {is_otp_error && (
              <div
                className={
                  "w100 absolute  absolute flex row align-items-center justify-content-start"
                }
                style={{
                  backgroundColor: "#fff8f5",
                  bottom: "0",
                  height: "40px",
                  marginLeft: "-24px"
                }}
              >
                <div
                  style={{
                    display: "block",
                    width: "13px",
                    marginLeft: "24px"
                  }}
                >
                  <img
                    alt=""
                    src={errorIcon}
                    className={"w100"}
                    style={{ display: "block" }}
                  />
                </div>
                <div className={"pl10 fontsize12 medium warning-color"}>
                  {otp_error.message}
                </div>
              </div>
            )}
            <div
              className={
                "w100 absolute  absolute flex row align-items-center justify-content-start" +
                (is_otp_error ||
                !is_otp_send ||
                COUNTDOWN_DEFAULT - countdown > 5
                  ? " hidden "
                  : "  ")
              }
              style={{
                backgroundColor: "rgba(227, 243, 223, 0.5)",
                bottom: "0",
                height: "40px",
                marginLeft: "-24px"
              }}
            >
              <div
                style={{ display: "block", width: "13px", marginLeft: "24px" }}
              >
                <img
                  alt=""
                  src={verifiedIcon}
                  className={"w100"}
                  style={{ display: "block" }}
                />
              </div>
              <div
                className={"pl10 fontsize12 medium"}
                style={{ color: "#43b02a" }}
              >
                {formatMessage(messages.OTPSent)}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default injectIntl(MobileVerification);
