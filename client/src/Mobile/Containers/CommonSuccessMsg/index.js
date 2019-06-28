import { connect } from "react-redux";
import { clearMsg } from "../../../modules/successMsg";
import SuccessMsg from "../../Components/CommonMessage";

const mapStateToProps = state => {
  const {
    successMsg: { msg }
  } = state;
  return {
    msg
  };
};

const mapDispatchToProps = dispatch => {
  return { close: () => dispatch(clearMsg()) };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SuccessMsg);
