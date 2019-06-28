import { connect } from "react-redux";
import MobileVerification from "../../Components/page/EditProfile/common/mobileVerification";
import { sendOtp, verifyOtp } from "../../modules/phone";

const mapStateToProps = state => {
  const { phone } = state;
  return {
    is_otp_error: phone.is_otp_error,
    is_otp_send: phone.is_otp_send,
    otp_error: phone.otp_error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    reSendOtp: (data, id) => dispatch(sendOtp(data, id)),
    verifyOtp: (data, id) => dispatch(verifyOtp(data, id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileVerification);
