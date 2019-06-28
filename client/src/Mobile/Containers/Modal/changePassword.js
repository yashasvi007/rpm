import { connect } from "react-redux";
import ChangePassword from "../../Components/Modal/changePassword";
import { GLOBAL_MODALS } from "../../../constant";
import { close } from "../../../modules/modals";
import { changePassword } from "../../../modules/page/changePassword";

const mapStateToProps = state => {
  const {
    modal: { show, modalType },
    page: { changePassword }
  } = state;
  return {
    show: show && modalType === GLOBAL_MODALS.CHANGE_PASSWORD,
    is_password_changing: changePassword.is_password_changing,
    is_password_changed: changePassword.is_password_changed,
    is_changing_password_error: changePassword.is_changing_password_error,
    change_password_error: changePassword.change_password_error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => dispatch(close()),
    changePassword: data => dispatch(changePassword(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePassword);
