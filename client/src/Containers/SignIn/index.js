import SignIn from "../../Components/SignIn";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { signIn, clearError } from "../../modules/auth";

const mapStateToProps = state => {
  return {
    isProfileCompleted: state.auth.isProfileCompleted,
    isCalendarSynced: state.auth.isCalendarSynced,
    error: state.auth.error,
    redirect: state.auth.authRedirection
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signIn: data => {
      dispatch(signIn(data));
    },
    clearError: () => {
      dispatch(clearError());
    }
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SignIn)
);
