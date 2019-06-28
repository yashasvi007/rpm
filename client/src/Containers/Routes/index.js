import Routes from "../../Routes/index";

import { connect } from "react-redux";
import { onAppStart } from "../../modules/auth";

const mapStateToProps = state => {
  const { auth } = state;
  return {
    authenticated: auth.authenticated,
    authenticatedUser: auth.authenticated_user,
    authRedirection: auth.authRedirection,
    unauthorizedError: auth.unauthorizedError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAppStart: () => {
      dispatch(onAppStart());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Routes);
