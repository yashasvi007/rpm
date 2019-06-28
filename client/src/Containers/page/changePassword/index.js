import ChangePassword from "../../../Components/ChangePassword";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { changePassword } from "../../../modules/page/changePassword";

const mapStateToProps = state => {
  const {
    page: { changePassword }
  } = state;
  return {
    is_password_changing: changePassword.is_password_changing,
    is_password_changed: changePassword.is_password_changed,
    is_changing_password_error: changePassword.is_changing_password_error,
    change_password_error: changePassword.change_password_error
  };
};

const mapDispatchToProps = dispatch => {
  return { changePassword: data => dispatch(changePassword(data)) };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChangePassword)
);
