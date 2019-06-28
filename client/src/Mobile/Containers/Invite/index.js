import SignUp from "../../Components/invite";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";

import { validateLink } from "../../../modules/auth";

const mapStateToProps = state => {
  return {
    link: state.auth.invitationLink,
    valid: state.auth.validLink,
    email: state.auth.email,
    category: state.auth.category,
    program: state.auth.invitedInProgram,
    error: state.auth.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    validateLink: data => {
      dispatch(validateLink(data));
    }
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SignUp)
);
