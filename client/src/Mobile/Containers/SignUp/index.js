import SignUp from "../../Components/SignUp";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";

import { signUp } from "../../../modules/auth";

const mapStateToProps = state => {
  return {
    link: state.auth.invitationLink,
    valid: state.auth.validLink,
    email: state.auth.email,
    category: state.auth.category,
    program: state.auth.invitedInProgram,
    error: state.auth.error,
    redirect: state.auth.authRedirection
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signUp: data => {
      dispatch(signUp(data));
    }
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SignUp)
);
